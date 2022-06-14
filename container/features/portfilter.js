// import portlist from "../portlist.txt";
import fs from "fs";
import { execSync } from "child_process";

export const FilteredPort = () => {
  const portfiltercmd =
    "sudo netstat -peanut | grep LISTEN | awk '{print $4}' > portlist.txt";

  execSync(portfiltercmd);

  const getport = fs.readFileSync("portlist.txt");
  return portfilter(getport);
};

const removedub = (txt) => {
  return [...new Set(txt)];
};

const portfilter = (data) => {
  const newdata = `${data}`;
  const spdata = newdata.split("\n");
  const ipport = spdata.map((a) => a.split(":"));
  const port = ipport.map((a) => a[a.length - 1]);
  return removedub(port);
};
