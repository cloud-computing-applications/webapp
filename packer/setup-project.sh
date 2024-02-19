#!/bin/bash

sudo unzip /tmp/webapp.zip -d /opt/webapp
sudo npm --prefix /opt/webapp/ install --production
