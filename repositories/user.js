const DB = require('../database/db');
const { users } = DB.models;

class UserRepository {
    static async createUser(username, password, first_name, last_name) {
        const user = await users.create({
            username: username,
            password: password,
            first_name: first_name,
            last_name: last_name
        });

        return user;
    }

    static async updateUser(userId, updateObject) {
        const result = await users.update(
            {...updateObject},
            { where: { id: userId } }
        );

        return result;
    }

    static async findUserByUsername(userName) {
        const user = await users.findOne(
            { where: { username: userName } }
        );

        return user;
    }

    static async findUserById(user_id) {
        const user = await users.findOne(
            { where: { id: user_id } }
        );

        return user;
    }
}

module.exports = UserRepository;