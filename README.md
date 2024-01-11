# HLF-Network-SDK
Hyperledger fabric network and fabric java sdk setup
<br>
In this project, a Hyperledger Fabric network and a Spring Boot-based customized Fabric SDK are implemented. The Hyperledger Fabric network consists of 3 organizations, their corresponding certificate authorities, and 3 orderers.
<br>
There are two types of chaincodes: <br>
Public chaincodes: Transactions visible to all participants in the network. <br>
Private chaincodes: Transactions visible only to the participants involved in the transactions. <br>
Both public and private chaincodes are implemented in the project.<br>
 Most implementations with a blockchain component also have an off-chain component, making it essential to transfer data from on-chain to off-chain parts. This is achieved by emitting events when a transaction occurs. There are three main types of events:<br>
Block events <br>
Chaincode events <br>
Transaction events <br>
In this implementation, chaincode events are used, and event capturing takes place at the Fabric SDK level
<br>
The commands and request formats required for the project are detailed in a separate file named commands_and_request
