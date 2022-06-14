const fs = require("fs");
const { exec, execSync } = require("child_process");

const peer = fs.readFileSync("peer.txt");
const peercount = peer
  .toString()
  .split("\n")
  .filter((a) => a).length;

const { spawn } = require("node:child_process");
const ls = spawn("python3", ["alterpeer.py", peercount + 1]);

ls.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on("data", (data) => {
  console.error(`stderr: ${data}`);
});

ls.on("close", (code) => {
  console.log(`child process exited with code ${code}`);
});
