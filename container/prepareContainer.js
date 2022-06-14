const { exec } = require("child_process");
const { stdout, stderr } = require("process");
const fs = require("fs");

const Dockerimage = (username, password) =>
  `FROM ubuntu:latest
RUN apt update
RUN apt install openssh-server nano htop sudo figlet lolcat -y
RUN service ssh start
RUN echo 'root:admin' | chpasswd
RUN echo "clear" >> /etc/bash.bashrc
RUN echo "figlet -t -c youngstorage | lolcat" >> /etc/bash.bashrc
RUN sudo adduser ${username} --gecos "" --disabled-password
RUN echo "${username}:${password}" | sudo chpasswd
RUN usermod -aG sudo ${username}
RUN cd /home/${username} && echo "PS1='💻️ (\\[\\033[1;36m\\]\\u@\\h\\[\\033[0m\\]) \\[\\033[1;34m\\]\\w\\[\\033[0;35m\\] \\[\\033[1;36m\\]# \\[\\033[0m\\]'" >> .bashrc
CMD ["/usr/sbin/sshd","-D"]
`;

process.on("message", (data) => {
  const { username, password } = data;
  if (username && password) {
    fs.writeFileSync(
      `${__dirname}/Dockerfile`,
      Dockerimage(username, password)
    );
    exec(`docker build ${__dirname} .`, (err, stdout, stderr) => {
      if (err || stderr) {
        consle.log(err ? `[Error]:${err}` : stderr ? `[Error]:${stderr}` : "");
        process.exit(1);
      }
      console.log(stdout);
      process.exit();
    });
  } else {
    process.exit("username and password required");
  }
});

setTimeout(function () {
  console.log("Hello from child.js");
}, 2000);

process.on("exit", (msg) => {
  console.log("child process completed", msg);
});
