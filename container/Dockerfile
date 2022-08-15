FROM ubuntu:latest
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
  RUN adduser bhadri --gecos "" --disabled-password
  RUN echo "bhadri:bhadri@321" | chpasswd
  RUN usermod -aG sudo bhadri
  RUN chown -R bhadri:bhadri /var/www/html
  RUN cd /home/bhadri && echo "PS1='💻️ (\[\033[1;36m\]\u@\h\[\033[0m\]) \[\033[1;34m\]\w\[\033[0;35m\] \[\033[1;36m\]# \[\033[0m\]'" >> .bashrc
  COPY code_server.sh /
  COPY sshd_config /etc/ssh/
  CMD ["./code_server.sh","bhadri","bhadri@321"]
  