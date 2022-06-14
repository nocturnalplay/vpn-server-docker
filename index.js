const express = require("express");
const Websocket = require("ws");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const Connect = require("./routers/connect/index");
const Auth = require("./routers/Auth/index");
const { fork } = require("child_process");

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
    console.log(`server is listenimg on port ${PORT}`);
  });
});

server.on("upgrade", (request, socket, head) => {
  console.log("getting started");
  wss.handleUpgrade(request, socket, head, (socket) => {
    console.log("getting started process one");
    wss.emit("connection", socket, request);
  });
});

//WebSocket setup
wss.on("connection", (ws) => {
  console.log("getting started process two");
  ws.send("This is webSocket server");
  ws.on("message", (msg) => {
    const message = JSON.parse(msg);

    switch (message.event) {
      case "deploy": {
        console.log("container working");
        const container = fork("./container/prepareContainer.js");
        container.send({ username: "bhadri", password: "bhadri123" });
        container.on("close", (c) => console.log("process end", c));
        break;
      }
    }
  });
});
