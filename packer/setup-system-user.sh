#!/bin/bash

sudo groupadd --system csye6225
sudo adduser csye6225 --system --shell /usr/sbin/nologin -g csye6225
sudo chown -R csye6225:csye6225 /opt/webapp
sudo chmod -R 755 /opt/webapp
