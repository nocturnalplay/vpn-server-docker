#!/usr/bin/python
import yaml
import sys

with open("docker-compose.yaml") as f:
    try:
        y = yaml.safe_load(f)
        peer = ""
        if len(sys.argv) > 1:
            if(sys.argv[1]):
                peer = f'PEERS={sys.argv[1]}'
            else:
                peer = 'PEERS=0'
            y['services']['wireguard']['environment'][5] = peer
            with open("docker-compose.yaml", "w") as p:
                yaml.dump(y, p, default_flow_style=False, sort_keys=False)
                sys.stdout.write("Success:peer connection increased")
        else:
            sys.stderr.write('args missing')
    except Exception as e:
        sys.stderr.write(e)
