#! /bin/sh
nohup /usr/sbin/sshd -D &
rm -rf /var/www/html/*
mkdir /home/$1/htdocs
echo "<h1>it's workig</h1>" > /home/$1/htdocs/index.html
ln -s /home/$1/htdocs/* /var/www/html
cd /home
chmod 750 $1
adduser www-data $1
echo "Options +FollowSymLinks +SymLinksIfOwnerMatch" > /home/$1/htdocs/.htaccess
cd /home/$1/htdocs
chmod o+x *
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
