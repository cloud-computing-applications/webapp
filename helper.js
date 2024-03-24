const publishMessage = require("./google-pub-sub/publisher");

class HelperFunctions {

    static async checkAndSendVerification(user) {
        if(user.is_verified === false) {
            const data = {
                user_id: user.id,
                username: user.username,
                first_name: user.first_name,
                expiry_buffer: process.env.EXPIRY_BUFFER
            }
            await publishMessage(process.env.TOPIC_NAME, data, user.id);
        }
    }
}

module.exports = HelperFunctions;