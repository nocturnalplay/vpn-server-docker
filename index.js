const express = require("express");
const Websocket = require("ws");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const Connect = require("./routers/connect/index");
const Auth = require("./routers/Auth/index");
const { fork } = require("child_process");
const usercredential = require("./models/usercrdentialmodel");

const PORT = process.env.PORT || 9000;
const app = express();

const wss = new Websocket.Server({ noServer: true });

//middleware configuration setup
dotenv.config();
app.use(cors({}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//API routing setup
app.use("/auth", Auth); //for user auth
app.use("/connect", Connect);

const server = app.listen(PORT, () => {
  mongoose.connect(`${process.env.DB}`, (err) => {
    if (err) throw err;
    console.log(`server is listening on port ${PORT}`);
  });
});

//token filter
function tokenfilter(data) {
  const cookies = data.split(";");
  const token = cookies.map((a) => a.split("="));
  const c = [].concat.apply([], token);
  const tk = c.indexOf("token");
  return c[tk + 1];
}

server.on("upgrade", async (request, socket, head) => {
  console.log("getting started");
  const token = tokenfilter(request.headers.cookie);
  const user = await usercredential.findOne({ token });
  if (user) {
    request.USERID = user._id;
    wss.handleUpgrade(request, socket, head, (socket) => {
      console.log("getting started process one");
      wss.emit("connection", socket, request);
    });
  } else {
    socket.destroy();
    return;
  }
});

//WebSocket setup
wss.on("connection", async (ws, req) => {
  console.log("getting started process two");
  ws.send("This is webSocket server");
  const userid = req.USERID;
  
  ws.on("message", (msg) => {
    const message = JSON.parse(msg);

    switch (message.event) {
      case "deploy": {
        const { username, password } = message.data;
        console.log("container working");
        const container = fork("./container/index.js");
        container.send({
          username,
          password
        });
        container.on("message", (msg) => {
          console.log(msg);
          ws.send(msg.toString());
        });
        container.on("close", (c) => console.log("process end", c));
        break;
      }
    }
  });
});
