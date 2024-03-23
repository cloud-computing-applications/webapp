const DB = require('../database/db');

class UserRepository {
    static async createUser(username, password, first_name, last_name) {
        let userObj = {};

        if(process.env.ENVIRONMENT != "PRODUCTION") {
            userObj = {
                username: username,
                password: password,
                first_name: first_name,
                last_name: last_name
            }
        } else {
            userObj = {
                username: username,
                password: password,
                first_name: first_name,
                last_name: last_name,
                is_verified: false
            }
        }

        const user = await DB.models.users.create(userObj);
        return user;
    }

    static async updateUser(userId, updateObject) {
        const result = await DB.models.users.update(
            {...updateObject},
            { where: { id: userId } }
        );

        return result;
    }

    static async findUserByUsername(userName) {
        const user = await DB.models.users.findOne(
            { where: { username: userName } }
        );

        return user;
    }

    static async findUserById(user_id) {
        const user = await DB.models.users.findOne(
            { where: { id: user_id } }
        );

        return user;
    }
}

module.exports = UserRepository;