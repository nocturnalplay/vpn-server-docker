#!/usr/bin/env node

const commander = require("commander");
const chalk = require("chalk");
const fs = require("fs");
const clr = require("./features/color.js");
const { banner, ConBanner } = require("./features/banner");
const { fork, spawn } = require("child_process");
const SEND = require("../components/socketsend");
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
      process.send(SEND("running", "[*]Welcome to youngstorage cloud service"));
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
  RUN apt install -y openssh-server nano htop
  COPY sshd_config /etc/ssh/
  RUN apt install -y sudo figlet lolcat
  ENV DEBIAN_FRONTEND noninteractive
  RUN apt install -y ufw net-tools netcat curl apache2
  RUN apt install -y inetutils-ping php libapache2-mod-php
  RUN apt install -y iproute2 default-jre bc
  RUN apt install -y build-essential git
  RUN service ssh start
  RUN echo 'root:admin' | chpasswd
  RUN echo "clear" >> /etc/bash.bashrc
  RUN echo "figlet -t -c youngstorage | lolcat" >> /etc/bash.bashrc
  RUN echo "ServerName localhost " >> /etc/apache2/apache2.conf
  RUN echo "echo ''" >> /etc/bash.bashrc
  RUN curl -fsSL https://code-server.dev/install.sh | sh
  RUN adduser ${username} --gecos "" --disabled-password
  RUN echo "${username}:${password}" | chpasswd
  RUN usermod -aG sudo ${username}
  RUN chown -R ${username}:${username} /var/www/html
  RUN cd /home/${username} && echo "PS1='💻️ (\\[\\033[1;36m\\]\\u@\\h\\[\\033[0m\\]) \\[\\033[1;34m\\]\\w\\[\\033[0;35m\\] \\[\\033[1;36m\\]# \\[\\033[0m\\]'" >> .bashrc
  COPY code_server.sh /
  COPY sshd_config /etc/ssh/
  CMD ["./code_server.sh","${username}","${password}"]
  `;

  try {
    fs.writeFileSync("./container/Dockerfile", Dockerimage);
    process.send(
      SEND("running", "[*]Dockerfile have been created successfully")
    );
    //After created DockerFile Manager will do all stuff
    DockerManager(username);
  } catch (error) {
    throw clr.Error(error.message);
  }
}

//docker build function
function DockerManager(username) {
  process.send(SEND("running", "[*]Docker build started..."));
  //docker build start
  const build = spawn(`docker`, [
    "build",
    //"--no-cache",
    "-t",
    `${username}:latest`,
    `./container/.`
  ]);

  //Docker building reliable output
  build.stdout.on("data", (msg) => {
    console.log(`${msg}`);
  });
  build.stderr.on("data", (msg) => process.exit(msg));
  //spawn executing after completion
  build.stdout.on("end", () => {
    process.send(SEND("running", "[*]DockerFile build successfully"));
    //------------------------------
    //run the builted Docker container
    DockerRun(username);
    //------------------------------
  });
}

//after completting the docker build this running the builted container will happen
function DockerRun(username) {
  process.send(SEND("running", "[*]Docker Image Start running"));

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
    process.send(SEND("running", `[*]Container Created ${msg}`));
    nonError = true;
  });

  //while Docker running if Error happens
  build.stderr.on("data", (msg) => {
    process.send(SEND("running", `[*] ${msg}`));
    nonError = false;
    DockerRemoveImage(username);
  });
  //spawn executing after completion
  build.stdout.on("end", () => {
    if (nonError) {
      //finally created banner and ssh connection info
      process.send(SEND("running", ConBanner(username, password)));
      process.send(SEND("end", "[*] process completed"));
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
    process.send(SEND("running", `[*]${msg} \r\r[*]Container Removed`));
  });

  //spawn executing after completion
  build.stdout.on("end", () => {
    //run the builted Docker container
    DockerRun(username);
    //------------------------------
  });
}
