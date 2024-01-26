# HLF-Network-SDK
A full stack Hyperledger fabric application
<br>
In this project,a full stack Hyperledger fabric application is implemented with Hyperledger Fabric network, Spring Boot-based customized Fabric SDK , front end based on React and H2 database <br>
 The Hyperledger Fabric network consists of 3 organizations, their corresponding certificate authorities, and 3 orderers. <br>
Apart from the UI implementation ,Firefly-Fabconnect implementation is also present.With that also we can interact with the Hyperledger Fabric network <br>
<br>
There are two types of chaincodes in our project: <br>
Public chaincodes: Transactions visible to all participants in the network. <br>
Chaincodes using Private Data collections: Transactions visible only to the participants involved in the transactions. <br>
Most implementations with a blockchain component also have an off-chain component, making it essential to transfer data from on-chain to off-chain parts. This is achieved by emitting events when a transaction occurs. There are three main types of events:<br>
Block events <br>
Chaincode events <br>
Transaction events <br>
In this implementation, chaincode events are used.The event capturing is takes place at the Fabric SDK part.The data from the events are stored in the H2 database.
<br>
The commands and request formats required for the project are detailed in a separate file named commands_and_request
