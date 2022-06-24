sudo apt update
sudo apt install figlet lolcat
sudo npm link --force
docker network create docker-vpn  --subnet 169.254.0.0/16
sudo iptables -A FORWARD  -p tcp -i wg0 --dst 169.254.0.0/16