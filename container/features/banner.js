import { execSync } from "child_process";
import clr from "./color.js";

//banner for youngstorage
export const banner = () => {
  const banner = "figlet -t -c youngstorage | lolcat";
  console.log(clr.Banner(execSync(banner).toString()));
};

//congrates banner
export const ConBanner = (username, password) => {
  const banner = "figlet -t -c Account created | lolcat";
  console.log(clr.Banner(execSync(banner).toString()));
  console.log(`
    ${clr.Success("[*]connect your machine through")} ${clr.Info("[SSH]")}
    ---------------------
      ${clr.Error("username")}:${username}
      ${clr.Error("password")}:${password}
    ---------------------
    <--->
    ${clr.Info("[*]easy connect sudo apt install sshpass")}
    ${clr.Magenta("[*]sshpass -p <password> ssh <username>@<host>")}
    <--->
  `)
};