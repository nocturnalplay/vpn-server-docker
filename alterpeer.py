#!/usr/bin/python
import yaml

with open("docker-compose.yaml") as f:
    y = yaml.safe_load(f)
    y['services']['wireguard']['environment'][5] = 'PEERS=3'
with open("docker-compose.yaml", "w") as p:
    yaml.dump(y, p, default_flow_style=False, sort_keys=False)
