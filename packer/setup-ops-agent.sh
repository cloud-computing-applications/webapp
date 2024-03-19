#!/bin/bash

curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh
sudo bash add-google-cloud-ops-agent-repo.sh --also-install
sudo systemctl enable google-cloud-ops-agent

sudo mkdir /var/log/webapp
sudo chown -R csye6225:csye6225 /var/log/webapp
sudo chmod -R 744 /var/log/webapp

sudo yq e ".logging.receivers.\"webapp-receiver\".include_paths[0] = \"${LOG_FILE_PATH}\"" -i /tmp/config.yaml
sudo mv /tmp/config.yaml /etc/google-cloud-ops-agent/config.yaml
sudo systemctl restart google-cloud-ops-agent
