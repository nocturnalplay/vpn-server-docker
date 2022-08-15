sudo apt update
sudo npm ci
sudo npm link --force
docker network create docker-vpn  --subnet 169.254.0.0/16
sudo iptables -A FORWARD  -p tcp -i wg0 --dst 169.254.0.0/16
export NODE_TLS_REJECT_UNAUTHORIZED=0  