#!/bin/bash

curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh
sudo bash add-google-cloud-ops-agent-repo.sh --also-install
sudo systemctl enable google-cloud-ops-agent

sudo mkdir /var/log/webapp
sudo chown -R csye6225:csye6225 /var/log/webapp
sudo chmod -R 744 /var/log/webapp

sudo /bin/bash -c "cat <<EOF > \"/etc/google-cloud-ops-agent/config.yaml\"
logging:
  receivers:
    webapp-receiver:
      type: files
      include_paths:
        - \"${LOG_FILE_PATH}\"
      record_log_file_path: true
  processors:
    webapp-processor:
      type: parse_json
      time_key: timestamp
      time_format: \"%Y-%m-%dT%H:%M:%S.%LZ\"
    move_severity:
      type: modify_fields
      fields:
        severity:
          move_from: jsonPayload.level
  service:
    pipelines:
      default_pipeline:
        receivers: [webapp-receiver]
        processors: [webapp-processor, move_severity]
EOF"

sudo systemctl restart google-cloud-ops-agent
