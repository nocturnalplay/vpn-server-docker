const { execSync } = require("child_process");
const clr = require("./color.js");

//banner for youngstorage
const banner = () => {
  const banner = "figlet -t -c youngstorage | lolcat";
  return clr.Banner(execSync(banner).toString());
};

//congrates banner
const ConBanner = (username, password) => {
  const banner = "figlet -t -c Account created | lolcat";
  return `${clr.Banner(execSync(banner).toString())}
    ${clr.Success("[*]connect your machine through")} ${clr.Info("[SSH]")}
    ---------------------
      ${clr.Error("username")}:${username}
      ${clr.Error("password")}:${password}
    ---------------------
    <--->
    ${clr.Info("[*]easy connect sudo apt install sshpass")}
    ${clr.Magenta("[*]sshpass -p <password> ssh <username>@<host>")}
    <--->
  `;
};

module.exports = { ConBanner, banner };
