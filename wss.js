const https = require("https")
const fs = require("fs");
const Websocket = require("ws");

const options = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
};

const server = https.createServer(options)

const wss = new Websocket.WebSocketServer({ server })

wss.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
        console.log('received: %s', data);
    });

    ws.send('something');
});

server.listen(8000, () => console.log('server on 8000'))