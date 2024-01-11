# HLF-Network-SDK
Hyperledger fabric network and fabric java sdk setup
In this project, a Hyperledger Fabric network and a Spring Boot-based customized Fabric SDK are implemented. The Hyperledger Fabric network consists of 3 organizations, their corresponding certificate authorities, and 3 orderers. There are two types of chaincodes:
Public chaincodes: Transactions visible to all participants in the network.
Private chaincodes: Transactions visible only to the participants involved in the transactions.
Both public and private chaincodes are implemented in the project.
 Most implementations with a blockchain component also have an off-chain component, making it essential to transfer data from on-chain to off-chain parts. This is achieved by emitting events when a transaction occurs. There are three main types of events:
Block events
Chaincode events
Transaction events
In this implementation, chaincode events are used, and event capturing takes place at the Fabric SDK level
