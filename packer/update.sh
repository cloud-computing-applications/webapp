#!/bin/bash

sudo dnf update -y
sudo yum install zip unzip -y
sudo curl -L https://github.com/mikefarah/yq/releases/download/v4.42.1/yq_linux_amd64 -o /usr/bin/yq
sudo chmod +x /usr/bin/yq