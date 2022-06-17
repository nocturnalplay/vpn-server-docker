const { spawnSync, execSync } = require("child_process");
const vpnuser = require("./models/uservpnmodel");

process.on("message", async ({ count, userid }) => {
  let pr = spawnSync("python3", ["alterpeer.py", count + 2]);
  process.send(`[*]${pr.stdout.toString()}`);
  Rebuild(count);
  process.send("[*]update done !!");
  process.exit();
});

function Rebuild(e) {
  process.send("[*]VPN server updating userlist...");
  let restartvpn = spawnSync("docker-compose", [
    "up",
    "-d",
    "--force-recreate"
  ]);
  process.send(`[*][SUCCESS]${restartvpn.stdout.toString()}`);
  process.send(`[*][OUTPUT]${restartvpn.stderr.toString()}`);
}
