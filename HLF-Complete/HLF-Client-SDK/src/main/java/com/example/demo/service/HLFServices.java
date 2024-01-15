package com.example.demo.service;

import com.example.demo.config.HLFConnection;
import com.example.demo.exception.DemoAppException;
import com.example.demo.model.EventSubscriberRequest;
import com.example.demo.model.HLFPostRequest;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonParser;
import lombok.extern.slf4j.Slf4j;
import lombok.var;
import org.hyperledger.fabric.client.Contract;
import org.hyperledger.fabric.client.Network;
import org.hyperledger.fabric.client.Proposal;
import org.hyperledger.fabric.protos.common.BlockchainInfo;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
@Slf4j
public class HLFServices {
    
    @Autowired
    HLFConnection hLFConnection;

    @Autowired
    DBServices dBServices;

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private Contract contract;

    private Map<String, EventSubscriberRequest> subscriptionRequestMap = new ConcurrentHashMap<>();

    private final ExecutorService singleTreadExecutor = Executors.newSingleThreadExecutor();
    private Map<String, String> subscribeObjectMap = new ConcurrentHashMap<>();
    private final Gson gson = new GsonBuilder().setPrettyPrinting().create();
    private final ExecutorService executor = Executors.newCachedThreadPool();


    public String submitTransactions(HLFPostRequest hLFPostRequest) {
        try {
            log.debug("submitTransactions:start");
            byte[] ccResponse = null;

            log.debug("hLFPostRequest-" + hLFPostRequest);

            log.debug("channel name:" + hLFPostRequest.getChannelName());
            Network netObj = hLFConnection.connectionCreation(hLFPostRequest.getChannelName());
            contract = netObj.getContract(hLFPostRequest.getChaincodeName());
            Date startTime = new Date();
            //for private transactions
            if (hLFPostRequest.isTransient()) {
                byte[] payloadData = hLFPostRequest.getTransientValue().getBytes(StandardCharsets.UTF_8);
                Map<String, byte[]> payloadTransient = new HashMap<>();
                payloadTransient.put(hLFPostRequest.getTransientKey(), payloadData);
                this.logger.debug("calling submit transaction");
                // Submit transactions that store state to the ledger.

                Proposal proposal = contract.newProposal(hLFPostRequest.getMethodName())
                        .putTransient(hLFPostRequest.getTransientKey(), payloadData)
                        .addArguments(hLFPostRequest.getInputParameters())
                        .build();
                ccResponse = proposal.endorse().submit();
            } else {
                this.logger.debug("calling submit transaction");
                // Submit transactions that store state to the ledger.
                ccResponse = contract.submitTransaction(hLFPostRequest.getMethodName(),
                        hLFPostRequest.getInputParameters());
            }
            Date endTime = new Date();
            long diffInTime = endTime.getTime() - startTime.getTime();
            log.debug("POST:Time difference (ms):" + diffInTime);
            log.debug("response:" + new String(ccResponse, StandardCharsets.UTF_8));
            JSONObject result = new JSONObject();
            result.put("Chaincode-response", new String(ccResponse, StandardCharsets.UTF_8));
            return result.toString();
            //return new String(ccResponse, StandardCharsets.UTF_8);
        } catch (Exception e) {
            log.debug("HLF submitTransactions exception:" + e);
            throw new DemoAppException("HLF submitTransactions exception:" + e);
        }
    }

    public String getTransactions(String channelName, String chaincodeName, String methodName, String... value) {
        try {
            log.debug("getTransactions:start");
            log.debug("channelName:" + channelName);
            log.debug("chaincodeName:" + chaincodeName);
            log.debug("methodName:" + methodName);
            log.debug("input parameters:" + Arrays.toString(value));
            Date startTime = new Date();

            byte[] queryMsg = null;
            Network netObj = hLFConnection.connectionCreation(channelName);
            contract = netObj.getContract(chaincodeName);
            queryMsg = contract.evaluateTransaction(methodName, value);
            log.debug("query response:" + new String(queryMsg, StandardCharsets.UTF_8));
            JSONObject result = new JSONObject(new String(queryMsg, StandardCharsets.UTF_8));
            Date endTime = new Date();
            long diffInTime = endTime.getTime() - startTime.getTime();
            log.debug("GET:Time difference (ms):" + diffInTime);
            log.debug("getTransactions:end");
            return result.toString();
        } catch (Exception e) {
            log.debug("HLF getTransactions exception:" + e);
            throw new DemoAppException("HLF getTransactions exception:" + e);
        }
    }

    public String subscribeEvents(EventSubscriberRequest eventSubscribeRequest) {
        log.debug("EventSubscribeRequest: {}", eventSubscribeRequest);
        try {
            String subscriptionId = this.subscriptionIdGenerator();
            log.debug("EventType:CONTRACT");
            CompletableFuture.runAsync(() -> {
                subscribeContractEvents(eventSubscribeRequest);
            });
            JSONObject result = new JSONObject();
            result.put("subscriptionId", subscriptionId);
            String timeStamp = new SimpleDateFormat("yyyy.MM.dd.HH.mm.ss").format(new java.util.Date());

            subscribeObjectMap.put("ChaincodeSubscriptions-" +
                    "startBlock-:" + eventSubscribeRequest.getStartBlockNumber() +
                    ",EndBlock-:" + eventSubscribeRequest.getEndBlockNumber() + ",Time:" + timeStamp, subscriptionId);
            return result.toString();
        } catch (Exception e) {
            log.debug("subscribeEvents exception:" + e);
            throw new DemoAppException("subscribeEvents exception:" + e);
        }

    }

    private void subscribeContractEvents(EventSubscriberRequest eventSubscribeRequest) {
        try {
            Network netObj = hLFConnection.connectionCreation(eventSubscribeRequest.getChannelName());
            replayChaincodeEvents(netObj, eventSubscribeRequest.getChaincode(),
                    eventSubscribeRequest.getStartBlockNumber(), eventSubscribeRequest.getEndBlockNumber());
        } catch (Exception e) {
            log.debug("subscribeContractEvents exception:" + e);
            throw new DemoAppException("subscribeContractEvents exception:" + e);
        }

    }

    private void replayChaincodeEvents(Network netObj, String chaincodeName, final long startBlock, final long endBlock) {
        log.debug("\n*** Start chaincode event replay");
        try {
            var request = netObj.newChaincodeEventsRequest(chaincodeName)
                    .startBlock(startBlock)
                    .build();

            try (var eventIter = request.getEvents()) {
                while (eventIter.hasNext()) {
                    var event = eventIter.next();
                    var payload = prettyJson(event.getPayload());
                    log.debug("\n<-- Chaincode event replayed: " +"Block number:"+event.getBlockNumber()+"-"+ event.getEventName() + " - " + payload);
                    if (event.getBlockNumber() == endBlock) {
                        // Reached the end block-Listener stops
                        break;
                    }
                    // Insert data into the event_details table eventTable
                    dBServices.insertEventData( chaincodeName, "CONTRACT", event.getEventName(), payload, new Date());

                }
            }
        } catch (Exception e) {
            log.debug("replayChaincodeEvents exception:" + e);
            throw new DemoAppException("replayChaincodeEvents exception:" + e);
        }
    }


    private String prettyJson(final byte[] json) {
        return prettyJson(new String(json, StandardCharsets.UTF_8));
    }

    private String prettyJson(final String json) {
        var parsedJson = JsonParser.parseString(json);
        return gson.toJson(parsedJson);
    }

    public String getEventSubscribeList() {
        log.debug("FabricEventListener:subscribeObjectMap :" + subscribeObjectMap.toString());
        JSONObject result = new JSONObject();
        result.put("SubscriptionList", subscribeObjectMap.keySet().toString());
        return result.toString();
        //return subscribeObjectMap.keySet().toString();

    }

    private String subscriptionIdGenerator() {
        String timeStamp = new SimpleDateFormat("yyyy.MM.dd.HH.mm.ss").format(new java.util.Date());
        int randomNumber = new SecureRandom().nextInt(1000);
        return timeStamp + randomNumber;
    }

    public String getBlockHeight(String channelName) {
        try {
            log.debug("getTransactions:start");
            log.debug("channelName:" + channelName);
            Network netObj = hLFConnection.connectionCreation(channelName);
            contract = netObj.getContract("qscc");
            byte[] resultTran = contract.evaluateTransaction("GetChainInfo", channelName);
            BlockchainInfo info = BlockchainInfo.parseFrom(resultTran);
            long blockHeight = info.getHeight();
            log.debug("blockHeight :" + blockHeight);
            JSONObject result = new JSONObject();
            result.put("blockHeight", blockHeight);
            return result.toString();
        } catch (Exception e) {
            log.debug("HLF getBlockHeight exception:" + e);
            throw new DemoAppException("HLF getBlockHeight exception:" + e);
        }
    }

}

