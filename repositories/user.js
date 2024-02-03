const DB = require('../database/db');
const { users } = DB.models;

class UserRepository {
    static async createUser(userObject) {
        const user = await users.create({
            username: userObject.username,
            password: userObject.password,
            first_name: userObject.first_name,
            last_name: userObject.last_name
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

    static async findUser(userId) {
        const user = await users.findOne(
            { where: { id: userId } }
        );

        return user;
    }
}

module.exports = UserRepository;