source ../../net-config.env

createArtifacts() {
# Store paths in variables
ARTIFACTS_DIR="../../channel-artifacts"
CONFIG_PATH="."

# channel name defaults to "mychannel"
CHANNEL_NAME="mychannel"

# Use a loop for organizations passed as arguments
for ORG in "$@"; do
    echo "#######    Generating anchor peer update for $ORG  ##########"
    configtxgen -profile ChannelUsingRaft -configPath "$CONFIG_PATH" -outputAnchorPeersUpdate ./"$ORG"anchors.tx -channelID "$CHANNEL_NAME" -asOrg "$ORG"

done

# Generate channel configuration block

configtxgen -profile ChannelUsingRaft -configPath "$CONFIG_PATH" -channelID mychannel -outputBlock ./mychannel.block

echo "Script executed successfully."
}

# Call the function with the desired organizations
#createArtifacts "Org1MSP" "Org2MSP" "Org3MSP"
createArtifacts "${ORGS_MSPS[@]}"
