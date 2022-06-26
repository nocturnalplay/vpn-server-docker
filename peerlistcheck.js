const { spawnSync, execSync } = require("child_process");
const vpnuser = require("./models/uservpnmodel");
const SEND = require("./components/socketsend");

process.on("message", async ({ count, userid }) => {
  let pr = spawnSync("python3", ["alterpeer.py", count + 1]);
  process.send(SEND("running", `[*]${pr.stdout.toString()}`));
  Rebuild(count);
  process.send(SEND("running", "[*]update done !!"));
  process.exit();
});

function Rebuild(e) {
  process.send(SEND("running", "[*]VPN server updating userlist..."));
  let restartvpn = spawnSync("docker-compose", [
    "up",
    "-d",
    "--force-recreate"
  ]);
  process.send(SEND("running", `[*][SUCCESS]${restartvpn.stdout.toString()}`));
  process.send(SEND("running", `[*][OUTPUT]${restartvpn.stderr.toString()}`));
}
