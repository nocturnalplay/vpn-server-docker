const express = require("express");
const Websocket = require("ws");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const Connect = require("./routers/user/index");
const Auth = require("./routers/Auth/index");
const { fork, execSync } = require("child_process");
const usercredential = require("./models/usercrdentialmodel");
const VPNModel = require("./models/uservpnmodel");
const UserModel = require("./models/usermodel");
const tokenfilter = require("./components/tokenfilter");
const SEND = require("./components/socketsend");
// const https = require("https")
// const fs = require("fs");

// const options = {
//   key: fs.readFileSync('key.pem'),
//   cert: fs.readFileSync('cert.pem')
// };

const PORT = process.env.PORT || 9000;
const app = express();

//middleware configuration setup
dotenv.config();
app.use(
  cors({
    credentials:true,
    origin:["http://youngstorage.in"],
   })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//API routing setup
app.get("/", (req, res) => {
  res.end("hello youngstorage");
});
app.use("/auth", Auth); //for user auth
app.use("/user", Connect);

const server =app.listen(PORT, () => {
  try {
    mongoose.connect(`${process.env.DB}`, (err) => {
      if (err) throw err;
      console.log(`server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error.message)
  }
});

const wss = new Websocket.Server({noServer:true});

//websocket upgrade for user Authorization
server.on("upgrade", async (request, socket, head) => {
  try {
    console.log("getting started");
    const token = tokenfilter(request.headers.cookie);
    const user = await usercredential.findOne({ token });
    if (user) {
      request.USERID = user.userid;
      wss.handleUpgrade(request, socket, head, (socket) => {
        console.log("getting started process one");
        wss.emit("connection", socket, request);
      });
    } else {
      socket.destroy();
      return;
    }
  }
  catch (error) {
    console.log(error.message)
  }
});

//websocket make connection after Authorizied
wss.on("connection", (ws, req) => {
  console.log("getting started process two");
  ws.send(SEND("connected", "[*]Connection Alive"));

  //When client send somthing to server on messgae will happen
  try {
    ws.on("message", async (msg) => {
      const message = JSON.parse(msg);
      //find user data from the VPN data model
      const userid = req.USERID;
      const vpnuser = await VPNModel.findOne({ userid });
      const GetUser = await UserModel.findById({ _id: userid });
      //using the case filter we can able to redirete what to do
      switch (message.event) {
        case "deploy": {
          //if user alrady have a vpn set it just redeploy the container
          if (vpnuser) {
            console.log("container working");
            //Container deploy have been happen
            const container = fork("./container/index.js");
            container.send({
              username: GetUser.username,
              password: `${GetUser.username}@321`
            });
            container.on("message", (msg) => {
              console.log(msg);
              ws.send(msg.toString());
            });
            //On Thread close User docker set has been update to current use
            container.on("close", async (c) => {
              try {
                const docker_ip = execSync(
                  `docker inspect ${GetUser.username} | grep IPAddress | grep ${process.env.IP} | awk '{print $2}'`
                )
                  .toString()
                  .split('"')
                  .filter((a) => a);
                const vpn_user_update = await VPNModel.findOneAndUpdate(
                  { userid },
                  {
                    $set: {
                      docker_ip: docker_ip[0],
                      sshusername: GetUser.username,
                      sshpassword: `${GetUser.username}@321`
                    }
                  }
                );
                console.log("process end", c);
              } catch (error) {
                console.log(error.message);
              }
            });
          } // or else user doesn't have VPN set this stuff will happen
          else {
            console.log("new vpn user");
            //Increase the peer connection and then restart the vpn server to update affect on the public
            const vpn_user_count = await VPNModel.find().count();
            const create_vpn_user = fork("./peerlistcheck.js");

            create_vpn_user.send({ count: vpn_user_count, userid });
            create_vpn_user.on("message", (msg) => ws.send(msg.toString()));
            //After completing the process Container will deploy for the user
            create_vpn_user.on("close", async () => {
              console.log("container working");
              //After creating the VPN Network Create a Docker Container for the user
              const container = fork("./container/index.js");
              container.send({
                username: GetUser.username,
                password: `${GetUser.username}@321`
              });
              container.on("message", (msg) => {
                console.log(msg);
                ws.send(msg.toString());
              });
              container.on("close", async () => {
                const userip = execSync(
                  `cat config/peer${vpn_user_count + 1}/peer${vpn_user_count + 1
                  }.conf | grep Address | awk '{print $3}'`
                );
                const user_ip = userip.toString();
                const vpn_qr = `config/peer${vpn_user_count + 1}/peer${vpn_user_count + 1
                  }.png`;
                const vpn_wg = `config/peer${vpn_user_count + 1}/peer${vpn_user_count + 1
                  }.conf`;
                const docker_ip = execSync(
                  `docker inspect ${GetUser.username} | grep IPAddress | grep 169.254 | awk '{print $2}'`
                )
                  .toString()
                  .split('"')
                  .filter((a) => a);
                try {
                  await VPNModel.create({
                    userid,
                    createdtime: new Date().getTime(),
                    user_ip,
                    vpn_qr,
                    vpn_wg,
                    docker_ip: docker_ip[0],
                    sshusername: GetUser.username,
                    sshpassword: `${GetUser.username}@321`
                  });
                } catch (error) {
                  console.log(error.message)
                }
                console.log("process closed");
              });
            });
          }
          break;
        }
      }
    });
  } catch (error) {
    console.log(error.message)
  }
});
