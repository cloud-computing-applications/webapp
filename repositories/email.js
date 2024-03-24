const DB = require('../database/db');

class EmailRepository {
    static async findEmailByToken(token) {
        const email = await DB.models.emails.findOne(
            { where: { token: token } }
        );

        return email;
    }
}

module.exports = EmailRepository;