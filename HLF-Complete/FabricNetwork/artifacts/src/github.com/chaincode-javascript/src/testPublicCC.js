'use strict';

const {
    Contract
} = require('fabric-contract-api');

class TestPublicCC extends Contract {

    async saveDetails(ctx, id,details) {
        console.log('function:start: saveDetails');

        const detailsJSON = JSON.parse(details);
        detailsJSON.id=id;
        
        const saveDetails = {
            id: id,
        };

        
        await ctx.stub.putState( id, Buffer.from(JSON.stringify(detailsJSON)));
        var timestamp = new Date().toISOString();
        ctx.stub.setEvent('savePublicDetails', Buffer.from(JSON.stringify(saveDetails)));

        console.log('Details added successfully with id:' + id + ' at ' + timestamp);

        return 'Details added successfully';
    } 

    async getDetails(ctx,  id) {
        console.log('function:start:getDetails');

        console.log('id: ' + id);


        const propertiesBuffer = await ctx.stub.getState( id);
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

    async updateDetails(ctx, id,payloadHash) {
        console.log('function:start:updateDetails');
        console.log('id: ' + id);


        const propertiesBuffer = await ctx.stub.getState( id);

        if (propertiesBuffer == '') {
            throw new Error(`details for id:- ${id} does not exist`);
        }

        const messageStruct = JSON.parse(propertiesBuffer.toString());

        const transientMap = ctx.stub.getTransient();
        
        messageStruct.payloadHash = payloadHash;

        await ctx.stub.putState( id, Buffer.from(JSON.stringify(messageStruct)));
        var timestamp = new Date().toISOString();

        console.log('details updated successfully with id:' + id + ' at ' + timestamp);
        console.log('function:end:updateDetails');
        return 'details updated successfully';
    }

}

module.exports = TestPublicCC;