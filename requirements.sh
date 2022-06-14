sudo apt update
docker network create docker-vpn  --subnet 10.0.3.0/24
sudo iptables -A FORWARD  -p tcp -i wg0 --dst 10.0.3.0/24