# Wireguard vpn server in docker container

## set up of vpn server

> create docker network for your project

```text
    docker network create docker-vpn  --subnet 192.168.3.0/24 // you can alter your ip and subnet
    sudo iptables -A FORWARD  -p tcp -i wg0 --dst 192.168.3.0/24  --dport 80 -j ACCEPT // alter your ip table for derirecting all the private ip traffic to the docker vap-server
```

> Then start the docker-compose file to create VPN server and Mongodb for your app

```text
    npm run up
```

> Add persistentalive for the vpn

```text
    cd config/templates
    echo -e "\nPersistentKeepalive = \${PERSISTENT_KEEPALIVE}" >> peer.conf
    npm run new
```

> Using alterpeer.py python file we can increase the peer connection

```text
    python3 alterpeer.py <number to increase peer connection>
```

> For more referance refer this artical

```text
    https://www.edc4it.com/blog/access-docker-over-wireguard-vpn-part2-tutorial#article
```

```text
https://www.cyberciti.biz/faq/ubuntu-20-04-set-up-wireguard-vpn-server/
https://www.the-digital-life.com/wireguard-docker/
https://www.the-digital-life.com/wireguard-installation-and-configuration/
https://upcloud.com/resources/tutorials/get-started-wireguard-vpn
```

> configure apache over nodejs

```text
    https://blog.logrocket.com/configuring-apache-for-node-js/
```
