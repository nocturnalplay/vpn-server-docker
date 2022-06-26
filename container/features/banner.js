const { execSync } = require("child_process");
const clr = require("./color.js");

//banner for youngstorage
const banner = () => {
  const banner = "figlet -t -c youngstorage";
  return execSync(banner).toString();
};

//congrates banner
const ConBanner = (username, password) => {
  const banner = "figlet -t -c Account created | lolcat";
  return `${"[*]connect your machine through"} ${"[SSH]"}
---------------------
${"username"}:${username}
${"password"}:${password}
---------------------
<--->
${"[*]easy connect sudo apt install sshpass"}
${"[*]sshpass -p password ssh username@host"}
<--->`;
};

module.exports = { ConBanner, banner };
