#!/usr/bin/env node

import commander from "commander";
import chalk from "chalk";
import { CreateDockerFile } from "./features/container.js";
import clr from "./features/color.js";
import { banner, ConBanner } from "./features/banner.js";
import { spawn } from "child_process";
import { FilteredPort } from "./features/portfilter.js";

commander
  .version(chalk.green("youngstorage 1.0"), "-v, --version")
  .usage(
    "[OPTIONS][-h : help],[-v : version],[-u <value> : username],[-p <value> : password]"
  )
  .option("-u, --username <value>", "name of the user")
  .option("-p, --password <value>", "user password")
  .option("-q, --quick", "for skip the banner")
  .parse(process.argv);

const { username, password, quick } = commander.opts();
const ListenPort = FilteredPort();
const portstate = ListenPort.filter((a) => a === port);
let nonError = true;
//clear the console
console.clear();

//show banner
if (!quick) {
  banner();
}

//creating Dockerfile for the ubuntu container
if (username && password) {
  CreateDockerFile(username, password);
  //-------------------------------------------------------------------------------
  DockerBuildHappening(username);
  //-------------------------------------------------------------------------------
} else {
  console.log(clr.Error("[*] required username and port"));
  console.log(clr.Info("[*] for help use -h --help"));
}

//docker build function
function DockerBuildHappening(username) {
  //start loading spinner
  const load = clr.Spinner("aesthetic", "building the Docker container");

  //docker build start
  const build = spawn(`docker`, [
    "build",
    "-t",
    `${username}:latest`,
    `${__dirname}`
  ]);

  //Docker building reliable output
  build.stdout.on("data", (msg) => {
    process.stdout.clearLine();
    console.log(clr.Info(`${msg}`));
  });

  //spawn executing after completion
  build.stdout.on("end", () => {
    process.stdout.clearLine();
    clearInterval(load);
    console.log(clr.Success("[*]DockerFile build successfully"));
    //------------------------------
    //run the builted Docker container
    DockerRunHappening(username);
    //------------------------------
  });
}

//after completting the docker build this running the builted container will happen
function DockerRunHappening(username) {
  console.log(clr.Success("[*]Docker Image Start running"));
  //start loading spinner
  const load = clr.Spinner("aesthetic", "Docker running the builted container");

  //docker run start
  const build = spawn(`docker`, [
    "run",
    "--hostname",
    "youngstorage",
    "--name",
    `${username}`,
    "-d",
    "-v",
    `${username}:/home/${username}`,
    `${username}`
  ]);

  //Docker run reliable output
  build.stdout.on("data", (msg) => {
    process.stdout.clearLine();
    console.log(clr.Info(`${msg}`));
    nonError = true;
  });

  //while Docker running if Error happens
  build.stderr.on("data", (msg) => {
    process.stdout.clearLine();
    console.log(clr.Error(`[*] ${msg}`));
    nonError = false;
    DockerRemoveImage(username);
  });
  //spawn executing after completion
  build.stdout.on("end", () => {
    process.stdout.clearLine();
    clearInterval(load);
    if (nonError) {
      console.log(clr.Success("[*]Docker Image successfully completed"));
      console.log(clr.Success("[*]now ready to use"));
      //finally created banner and ssh connection info
      ConBanner(username, password);
    }
  });
}

//Docker image exist error for removing that
function DockerRemoveImage(username) {
  //start loading spinner
  const load = clr.Spinner("aesthetic", "Removing existing Docker Image");

  //docker build start
  const build = spawn(`docker`, ["rm", "-f", `${username}`]);

  //Docker building reliable output
  build.stdout.on("data", (msg) => {
    process.stdout.clearLine();
    console.log(clr.Info(`[*]${msg}`));
  });

  //spawn executing after completion
  build.stdout.on("end", () => {
    process.stdout.clearLine();
    clearInterval(load);
    console.log(clr.Success("[*]Docker Image Removed Successfully"));
    //------------------------------
    //run the builted Docker container
    DockerRunHappening(username);
    //------------------------------
  });
}
