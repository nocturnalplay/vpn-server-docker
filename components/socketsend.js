//json send data through websocket
function SEND(event, msg) {
  return JSON.stringify({ event, msg });
}

module.exports = SEND;
