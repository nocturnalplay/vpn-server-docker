FROM ubuntu:latest
  RUN apt update
  RUN apt install openssh-server nano htop sudo figlet lolcat -y
  RUN service ssh start
  RUN echo 'root:admin' | chpasswd
  RUN echo "clear" >> /etc/bash.bashrc
  RUN echo "figlet -t -c youngstorage | lolcat" >> /etc/bash.bashrc
  RUN echo "echo ''" >> /etc/bash.bashrc
  RUN sudo adduser hatz --gecos "" --disabled-password
  RUN echo "hatz:hatz@321" | sudo chpasswd
  RUN usermod -aG sudo hatz
  RUN cd /home/hatz && echo "PS1='💻️ (\[\033[1;36m\]\u@\h\[\033[0m\]) \[\033[1;34m\]\w\[\033[0;35m\] \[\033[1;36m\]# \[\033[0m\]'" >> .bashrc
  CMD ["/usr/sbin/sshd","-D"]
  