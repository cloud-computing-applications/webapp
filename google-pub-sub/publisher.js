const {PubSub} = require('@google-cloud/pubsub');
const { PubSubError, PUB_SUB_ERROR_TYPES } = require('../errorHandler');
const Logger = require('../logger/logger');

const pubSubClient = new PubSub();

async function publishMessage(topic, data, user_id) {
    const dataBuffer = Buffer.from(JSON.stringify(data));
    try {
        const messageId = await pubSubClient.topic(topic).publishMessage({data: dataBuffer});
        Logger.info({ message: "Message Published", user_id: user_id, message_id: messageId });
    } catch (error) {
        Logger.error({ message: error.message });
        throw new PubSubError(PUB_SUB_ERROR_TYPES.PUBLISHING_FAILURE);
    }
}

module.exports = publishMessage;