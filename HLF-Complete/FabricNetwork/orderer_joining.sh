export ORDERER_CA=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem


export ORDERER_ADMIN_TLS_SIGN_CERT=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.crt 

export ORDERER_ADMIN_TLS_PRIVATE_KEY=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.key 

osnadmin channel join --channelID mychannel --config-block ./artifacts/channel/mychannel.block -o localhost:7053 --ca-file "$ORDERER_CA" --client-cert "$ORDERER_ADMIN_TLS_SIGN_CERT" --client-key "$ORDERER_ADMIN_TLS_PRIVATE_KEY" 

export ORDERER_CA=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/example.com/orderers/orderer2.example.com/msp/tlscacerts/tlsca.example.com-cert.pem


export ORDERER_ADMIN_TLS_SIGN_CERT=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/example.com/orderers/orderer2.example.com/tls/server.crt 

export ORDERER_ADMIN_TLS_PRIVATE_KEY=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/example.com/orderers/orderer2.example.com/tls/server.key 

osnadmin channel join --channelID mychannel --config-block ./artifacts/channel/mychannel.block -o localhost:7055 --ca-file "$ORDERER_CA" --client-cert "$ORDERER_ADMIN_TLS_SIGN_CERT" --client-key "$ORDERER_ADMIN_TLS_PRIVATE_KEY"

########################

export ORDERER_CA=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/example.com/orderers/orderer3.example.com/msp/tlscacerts/tlsca.example.com-cert.pem


export ORDERER_ADMIN_TLS_SIGN_CERT=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/example.com/orderers/orderer3.example.com/tls/server.crt 

export ORDERER_ADMIN_TLS_PRIVATE_KEY=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/example.com/orderers/orderer3.example.com/tls/server.key 

osnadmin channel join --channelID mychannel --config-block ./artifacts/channel/mychannel.block -o localhost:7057 --ca-file "$ORDERER_CA" --client-cert "$ORDERER_ADMIN_TLS_SIGN_CERT" --client-key "$ORDERER_ADMIN_TLS_PRIVATE_KEY"


##########

export ORDERER_CA=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem


export ORDERER_ADMIN_TLS_SIGN_CERT=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.crt 

export ORDERER_ADMIN_TLS_PRIVATE_KEY=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.key 

osnadmin channel list \
  -o localhost:7053 \
  --ca-file "$ORDERER_CA" \
  --client-cert "$ORDERER_ADMIN_TLS_SIGN_CERT" \
  --client-key "$ORDERER_ADMIN_TLS_PRIVATE_KEY"
