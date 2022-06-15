#!/usr/bin/env node

const commander = require("commander");
const chalk = require("chalk");
const fs = require("fs");
const clr = require("./features/color.js");
const { banner, ConBanner } = require("./features/banner.js");
const { fork, spawn } = require("child_process");
let nonError = true;

//Global variable
let username = "",
  password = "";

process.on("message", (data) => {
  console.log("data check:", data);
  //assign username and password to the global veriable
  username = data.username;
  password = data.password;
  //verify username and password if exist
  if (username && password) {
    try {
      //docker ysage image write process starts
      process.send(banner());
      //Dockerfile creation process then Manager will do all the stuff
      CreateDockerFile(username, password);
    } catch (error) {
      console.log(error);
    }
  }
});

function CreateDockerFile(username, password) {
  const Dockerimage = `FROM ubuntu:latest
  RUN apt update
  RUN apt install openssh-server nano htop sudo figlet lolcat -y
  RUN service ssh start
  RUN echo 'root:admin' | chpasswd
  RUN echo "clear" >> /etc/bash.bashrc
  RUN echo "figlet -t -c youngstorage | lolcat" >> /etc/bash.bashrc
  RUN echo "echo ''" >> /etc/bash.bashrc
  RUN sudo adduser ${username} --gecos "" --disabled-password
  RUN echo "${username}:${password}" | sudo chpasswd
  RUN usermod -aG sudo ${username}
  RUN cd /home/${username} && echo "PS1='💻️ (\\[\\033[1;36m\\]\\u@\\h\\[\\033[0m\\]) \\[\\033[1;34m\\]\\w\\[\\033[0;35m\\] \\[\\033[1;36m\\]# \\[\\033[0m\\]'" >> .bashrc
  CMD ["/usr/sbin/sshd","-D"]
  `;

  try {
    fs.writeFileSync("./container/Dockerfile", Dockerimage);
    process.send(clr.Success("[*]Dockerfile have been created successfully"));
    //After created DockerFile Manager will do all stuff
    DockerManager(username);
  } catch (error) {
    throw clr.Error(error.message);
  }
}

//docker build function
function DockerManager(username) {
  process.send(clr.Start("[*]Docker build started..."));
  //docker build start
  const build = spawn(`docker`, [
    "build",
    "-t",
    `${username}:latest`,
    `./container/.`
  ]);

  //Docker building reliable output
  build.stdout.on("data", (msg) => {
    console.log(clr.Info(`${msg}`));
  });
  build.stderr.on("data", (msg) => process.exit(msg));
  //spawn executing after completion
  build.stdout.on("end", () => {
    process.send(clr.Success("[*]DockerFile build successfully"));
    //------------------------------
    //run the builted Docker container
    DockerRun(username);
    //------------------------------
  });
}

//after completting the docker build this running the builted container will happen
function DockerRun(username) {
  process.send(clr.Info("[*]Docker Image Start running"));

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
    "--network",
    "docker-vpn",
    `${username}`
  ]);

  //Docker run reliable output
  build.stdout.on("data", (msg) => {
    process.send(clr.Info(`[*]Container Created\n${msg}`));
    nonError = true;
  });

  //while Docker running if Error happens
  build.stderr.on("data", (msg) => {
    process.send(clr.Error(`[*] ${msg}`));
    nonError = false;
    DockerRemoveImage(username);
  });
  //spawn executing after completion
  build.stdout.on("end", () => {
    if (nonError) {
      //finally created banner and ssh connection info
      process.send(ConBanner(username, password));
      process.exit();
    }
  });
}

//Docker image exist error for removing that
function DockerRemoveImage(username) {
  //docker build start
  const build = spawn(`docker`, ["rm", "-f", `${username}`]);

  //Docker building reliable output
  build.stdout.on("data", (msg) => {
    process.send(clr.Info(`[*]${msg} \r\r[*]Container Removed`));
  });

  //spawn executing after completion
  build.stdout.on("end", () => {
    //run the builted Docker container
    DockerRun(username);
    //------------------------------
  });
}

process.on("exit", (msg) => {
  process.send("[Process End]:", msg);
});
