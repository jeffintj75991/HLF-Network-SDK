'use strict';

const {
    Contract
} = require('fabric-contract-api');

class TestPublicCC extends Contract {

    async saveDetails(ctx, id, details) {
        console.log('function:start: saveDetails');

        const detailsJSON = JSON.parse(details);
        detailsJSON.id = id;

        const saveDetails = {
            id: id,
        };


        await ctx.stub.putState(id, Buffer.from(JSON.stringify(detailsJSON)));

        if (!detailsJSON.category || detailsJSON.category.trim().length === 0) {
            throw new Error("Missing or empty 'category' field in details.");
        }
        const compositeKey = ctx.stub.createCompositeKey('category~id', [detailsJSON.category, id]);
        await ctx.stub.putState(compositeKey, Buffer.from('\u0000')); // Dummy value

        var timestamp = new Date().toISOString();
        ctx.stub.setEvent('savePublicDetails', Buffer.from(JSON.stringify(saveDetails)));

        console.log('Details added successfully with id:' + id + ' at ' + timestamp);

        return 'Details added successfully';
    }

    async getDetails(ctx, id) {
        console.log('function:start:getDetails');

        console.log('id: ' + id);


        const propertiesBuffer = await ctx.stub.getState(id);
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

    async updateDetails(ctx, id, payloadHash) {
        console.log('function:start:updateDetails');
        console.log('id: ' + id);


        const propertiesBuffer = await ctx.stub.getState(id);

        if (!propertiesBuffer || propertiesBuffer.length === 0) {
            throw new Error(`Details for id:- ${id} do not exist`);
        }


        const messageStruct = JSON.parse(propertiesBuffer.toString());

        const transientMap = ctx.stub.getTransient();

        messageStruct.payloadHash = payloadHash;

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(messageStruct)));
        var timestamp = new Date().toISOString();

        console.log('details updated successfully with id:' + id + ' at ' + timestamp);
        console.log('function:end:updateDetails');
        return 'Details are updated successfully!';
    }

    async getHistory(ctx, id) {
        console.log('function:start:getHistory');
        const iterator = await ctx.stub.getHistoryForKey(id);
        const results = [];

        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                const tx = {
                    txId: res.value.txId,
                    timestamp: res.value.timestamp,
                    isDelete: res.value.isDelete,
                    value: JSON.parse(res.value.value.toString('utf8'))
                };
                results.push(tx);
            }
            if (res.done) {
                await iterator.close();
                break;
            }
        }

        console.log('function:end:getHistory');
        return results;
    }

    async queryByCategory(ctx, category) {
        const iterator = await ctx.stub.getStateByPartialCompositeKey('category~id', [category]);
        const results = [];

        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.key) {
                const keyParts = await ctx.stub.splitCompositeKey(res.value.key);
                const id = keyParts.attributes[1];
                const value = await ctx.stub.getState(id);
                results.push(JSON.parse(value.toString()));
            }
            if (res.done) {
                await iterator.close();
                break;
            }
        }

        return results;
    }


    async queryByPayloadHash(ctx, payloadHash) {
        const query = {
            selector: {
                payloadHash: payloadHash
            }
        };
        const iterator = await ctx.stub.getQueryResult(JSON.stringify(query));
        const results = [];

        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                results.push(JSON.parse(res.value.value.toString()));
            }
            if (res.done) {
                await iterator.close();
                break;
            }
        }

        return results;
    }



}

module.exports = TestPublicCC;
