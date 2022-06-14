import fs from "fs";
import clr from "./color.js";

//create Dockerfile
export const CreateDockerFile = (username, password) => {
  
  const dockercmd = `FROM ubuntu:latest
RUN apt update
RUN apt install openssh-server nano htop sudo -y
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
  try {
    console.log(clr.Start("[*]creating Dockerfile....."));
    fs.writeFileSync("/tmp/docker_operation/Dockerfile", dockercmd);
    console.log(clr.Success("[*]Dockerfile have been created successfully"));
  } catch (error) {
    console.log("Error:", clr.Error(error));
    process.exit(1);
  }
};
