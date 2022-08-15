#! /bin/sh
nohup /usr/sbin/sshd -D &
cd /home/$1
mkdir .config
mkdir .config/code-server
cd .config/code-server
whoami >> id
ip="$(ifconfig | grep 169.254 | awk '{print $2}')"
echo "bind-addr: $ip:1111
auth: password
password: $2
cert: false" > config.yaml
echo "hello" > hello.txt
su $1 <<EFO
nohup code-server
EFO