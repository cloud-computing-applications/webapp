const publishMessage = require("./google-pub-sub/publisher");

class HelperFunctions {

    static async checkAndSendVerification(user) {
        if(user.is_verified === false) {
            const data = {
                link: HelperFunctions.generateVerificationLink(user),
                user_id: user.id,
                username: user.username
            }
            await publishMessage(process.env.TOPIC_NAME, data, user.id);
        }
    }

    static generateVerificationLink(user) {
        const link = process.env.DOMAIN_PROTOCOL + "://" + process.env.DOMAIN_NAME + "/verify-email/" + user.id;
        return link;
    }

}

module.exports = HelperFunctions;