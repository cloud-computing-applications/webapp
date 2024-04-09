#!/bin/bash

set -e

DEPLOY_DB_HOST=$(gcloud secrets versions access latest --secret="DB_HOST")
DEPLOY_DB_PASSWORD=$(gcloud secrets versions access latest --secret="DB_PASSWORD")
DEPLOY_VM_KMS_KEY=$(gcloud secrets versions access latest --secret="VM_KMS_KEY")

cat > startup_script.sh <<EOF
#!/bin/bash

env_file="/opt/webapp/.env"

if [[ ! -f "\$env_file" ]]; then

cat <<ENV_EOF > "\$env_file"
PORT="${DEPLOY_PORT}"
DB_USERNAME="${DEPLOY_DB_USERNAME}"
DB_PASSWORD="${DEPLOY_DB_PASSWORD}"
DB_DATABASE="${DEPLOY_DB_DATABASE}"
DB_HOST="${DEPLOY_DB_HOST}"
ENVIRONMENT="${DEPLOY_ENVIRONMENT}"
LOG_FILE_PATH="${DEPLOY_LOG_FILE_PATH}"
TOPIC_NAME="${DEPLOY_TOPIC_NAME}"
EXPIRY_BUFFER="${DEPLOY_EXPIRY_BUFFER}"
ENV_EOF

fi
EOF

DEPLOY_INSTANCE_TEMPLATE_NETWORK="https://www.googleapis.com/compute/v1/projects/$DEPLOY_PROJECT_ID/global/networks/$DEPLOY_INSTANCE_TEMPLATE_NETWORK_NAME"
DEPLOY_INSTANCE_TEMPLATE_SUB_NETWORK="https://www.googleapis.com/compute/v1/projects/$DEPLOY_PROJECT_ID/regions/us-east1/subnetworks/$DEPLOY_INSTANCE_TEMPLATE_SUB_NETWORK_NAME"
DEPLOY_INSTANCE_TEMPLATE_SA="$DEPLOY_INSTANCE_TEMPLATE_SA_NAME@$DEPLOY_PROJECT_ID.iam.gserviceaccount.com"
DEPLOY_INSTANCE_TEMPLATE_STARTUP_SCRIPT_PATH="startup_script.sh"
DEPLOY_INSTANCE_TEMPLATE_NAME="$DEPLOY_INSTANCE_TEMPLATE_NAME_PREFIX-$(date +"%s")"
DEPLOY_INSTANCE_TEMPLATE_IMAGE_NAME=$1

gcloud compute instance-templates create "$DEPLOY_INSTANCE_TEMPLATE_NAME" \
--region="$DEPLOY_REGION" \
--machine-type="$DEPLOY_INSTANCE_TEMPLATE_MACHINE_TYPE" \
$(if [ "$DEPLOY_INSTANCE_TEMPLATE_CAN_IP_FORWARD" = "true" ]; then echo "--can-ip-forward"; fi) \
--image="$DEPLOY_INSTANCE_TEMPLATE_IMAGE_NAME" \
--tags="$DEPLOY_INSTANCE_TEMPLATE_TAGS" \
--provisioning-model="$DEPLOY_INSTANCE_TEMPLATE_PROVISIONING_MODEL" \
"$(if [ "$DEPLOY_INSTANCE_TEMPLATE_RESTART_ON_FAILURE" = "true" ]; then echo "--restart-on-failure"; else echo "--no-restart-on-failure"; fi)" \
--maintenance-policy="$DEPLOY_INSTANCE_TEMPLATE_ON_HOST_MAINTAINANCE" \
--image-project="$DEPLOY_PROJECT_ID" \
--boot-disk-size="${DEPLOY_INSTANCE_TEMPLATE_DISK_SIZE}GB" \
--boot-disk-type="$DEPLOY_INSTANCE_TEMPLATE_DISK_TYPE" \
"$(if [ "$DEPLOY_INSTANCE_TEMPLATE_BOOT_DISK_AUTODELETE" = "true" ]; then echo "--boot-disk-auto-delete"; else echo "--no-boot-disk-auto-delete"; fi)" \
--network-interface=network="$DEPLOY_INSTANCE_TEMPLATE_NETWORK",subnet="$DEPLOY_INSTANCE_TEMPLATE_SUB_NETWORK" \
--instance-template-region="$DEPLOY_REGION" \
--address="" \
--metadata-from-file=startup-script="$DEPLOY_INSTANCE_TEMPLATE_STARTUP_SCRIPT_PATH" \
--service-account="$DEPLOY_INSTANCE_TEMPLATE_SA" \
--scopes="$DEPLOY_INSTANCE_TEMPLATE_SCOPES" \
--boot-disk-kms-key="$DEPLOY_VM_KMS_KEY" \
--project="$DEPLOY_PROJECT_ID"

DEPLOY_INSTANCE_TEMPLATE_SELF_LINK=$(gcloud compute instance-templates describe "$DEPLOY_INSTANCE_TEMPLATE_NAME" \
--region="$DEPLOY_REGION" \
--format="value(self_link)")

gcloud compute instance-groups managed rolling-action start-update "$DEPLOY_INSTANCE_GROUP_MANAGER_NAME" \
--version=template="$DEPLOY_INSTANCE_TEMPLATE_SELF_LINK" \
--region="$DEPLOY_REGION" \
--type="$DEPLOY_ROLLING_ACTION_TYPE" \
--max-unavailable="$DEPLOY_ROLLING_ACTION_MAX_UNAVAILABLE" \
--minimal-action="$DEPLOY_ROLLING_ACTION_MINIMAL_ACTION" \
--replacement-method="$DEPLOY_ROLLING_ACTION_REPLACEMENT_METHOD"

gcloud compute instance-groups managed wait-until "$DEPLOY_INSTANCE_GROUP_MANAGER_NAME" \
--version-target-reached \
--region="$DEPLOY_REGION" \
--timeout="$DEPLOY_WAIT_UNTIL_TIMEOUT"
