package com.example.demo.config;

import com.example.demo.exception.DemoAppException;
import io.grpc.Grpc;
import io.grpc.ManagedChannel;
import io.grpc.TlsChannelCredentials;
import org.hyperledger.fabric.client.Gateway;
import org.hyperledger.fabric.client.Network;
import org.hyperledger.fabric.client.identity.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.concurrent.TimeUnit;

@Service
public class HLFConnection {

    @Value("${hlf.crypto.path}")
    private String cryptoPath;

    @Value("${hlf.crypto.path.user}")
    private String userCert;

    @Value("${hlf.crypto.path.tls}")
    private String tlsCert;

    @Value("${hlf.crypto.path.user.private.key}")
    private String privateKey;

    @Value("${hlf.msp}")
    private String mspId;

    @Value("${hlf.peer.endpoint}")
    private String peerEndpoint;

    @Value("${hlf.override.auth}")
    private String overrideAuth;

    private ManagedChannel managedChannel;

    public Network connectionCreation(String channelName) {
        var channel = newGrpcConnection();
        try {
            var builder = Gateway.newInstance().identity(newIdentity()).signer(newSigner()).connection(channel)
                    // Default timeouts for different gRPC calls
                    .evaluateOptions(options -> options.withDeadlineAfter(5, TimeUnit.SECONDS))
                    .endorseOptions(options -> options.withDeadlineAfter(15, TimeUnit.SECONDS))
                    .submitOptions(options -> options.withDeadlineAfter(5, TimeUnit.SECONDS))
                    .commitStatusOptions(options -> options.withDeadlineAfter(1, TimeUnit.MINUTES));

            var gateway = builder.connect();
            var network = gateway.getNetwork(channelName);
            return network;
        } catch (Exception e) {
            throw new DemoAppException("connectionCreation exception:" + e);
        }


    }


    private ManagedChannel newGrpcConnection(){
        try {
            Path CRYPTO_PATH = Paths.get(cryptoPath);
            Path TLS_CERT_PATH = CRYPTO_PATH.resolve(Paths.get(tlsCert));
            var credentials = TlsChannelCredentials.newBuilder()
                    .trustManager(TLS_CERT_PATH.toFile())
                    .build();
            managedChannel= Grpc.newChannelBuilder(peerEndpoint, credentials)
                    .overrideAuthority(overrideAuth)
                    .build();
            return managedChannel;
        } catch (Exception e) {
            throw new DemoAppException("newGrpcConnection exception:" + e);
        }
    }

    private Identity newIdentity() {
        try {
            Path CRYPTO_PATH = Paths.get(cryptoPath);
            Path CERT_PATH = CRYPTO_PATH.resolve(Paths.get(userCert));

            var certReader = Files.newBufferedReader(CERT_PATH);
            var certificate = Identities.readX509Certificate(certReader);

            return new X509Identity(mspId, certificate);
        } catch (Exception e) {
            throw new DemoAppException("newIdentity exception:" + e);
        }
    }

    private Signer newSigner()  {
        try {
            File cryptoPathDir = new File(cryptoPath);
            File privateKeyPath = new File(cryptoPathDir, privateKey);
            var keyReader = Files.newBufferedReader(privateKeyPath.toPath());
            var privateKey = Identities.readPrivateKey(keyReader);

            return Signers.newPrivateKeySigner(privateKey);
        } catch (Exception e) {
            throw new DemoAppException("newSigner exception:" + e);
        }
    }

    public void destroy() throws InterruptedException {
        if (managedChannel != null) {
            managedChannel.shutdown().awaitTermination(5, TimeUnit.SECONDS);
        }
    }

}
