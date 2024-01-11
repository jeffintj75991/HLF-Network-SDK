 
'use strict';

const {
    Contract
} = require('fabric-contract-api');

class TestPrivateCC extends Contract {

    async saveDetails(ctx, collectionKey,id,details) {
        console.log('function:start: saveDetails');
       
        const detailsJSON = JSON.parse(details);
        detailsJSON.id=id;
        const transientMap = ctx.stub.getTransient();
        if (transientMap) {
            console.log('in transientMap ');
            const transientPayload = transientMap.get('payload');
            let convert = new TextDecoder().decode(transientPayload);

            console.log('transientPayload: ' + transientPayload);
            if (transientPayload) {
                detailsJSON.payload = convert;
            } else {
                throw new Error('No payload is present');
            }
        }

        const saveDetails = {
            id: id,
        };

        
        await ctx.stub.putPrivateData(collectionKey, id, Buffer.from(JSON.stringify(detailsJSON)));
        var timestamp = new Date().toISOString();
        ctx.stub.setEvent('savePrivateDetails', Buffer.from(JSON.stringify(saveDetails)));

        console.log('Details added successfully with id:' + id + ' at ' + timestamp);

        return 'Details added successfully';
    } 


    async getDetails(ctx, collectionKey, id) {
        console.log('function:start:getDetails');

        console.log('collectionKey: ' + collectionKey);
        console.log('id: ' + id);

        const collection = collectionKey;

        const propertiesBuffer = await ctx.stub.getPrivateData(collection, id);
        var timestamp = new Date().toISOString();
        if (propertiesBuffer == '') {
            throw new Error(`Details for id:- ${id} does not exist`);
        }

        const properties = JSON.parse(propertiesBuffer.toString());

        console.log('properties: ' + JSON.stringify(properties));

        console.log('details queried successfully with id:' + id + ' at ' + timestamp);

        console.log('function:end:getDetails');
        return properties;
    }

    async updateDetails(ctx, collectionKey,id,payloadHash) {
        console.log('function:start:updateDetails');
        console.log('collectionKey: ' + collectionKey);
        console.log('id: ' + id);

        const collection = collectionKey;

        const propertiesBuffer = await ctx.stub.getPrivateData(collection, id);

        if (propertiesBuffer == '') {
            throw new Error(`details for id:- ${id} does not exist`);
        }

        const messageStruct = JSON.parse(propertiesBuffer.toString());

        const transientMap = ctx.stub.getTransient();
        if (transientMap) {
            console.log('in transientMap ');
            const properties = transientMap.get('payload');
            let convert = new TextDecoder().decode(properties);

            console.log('transientMap value: ' + properties);
            if (properties) {
                messageStruct.payload = convert;
            } else {
                throw new Error('No payload present for id');
            }
        }
        messageStruct.payloadHash = payloadHash;

        await ctx.stub.putPrivateData(collectionKey, id, Buffer.from(JSON.stringify(messageStruct)));
        var timestamp = new Date().toISOString();

        console.log('details updated successfully with id:' + id + ' at ' + timestamp);
        console.log('function:end:updateDetails');
        return 'details updated successfully';
    }

}

module.exports = TestPrivateCC;
