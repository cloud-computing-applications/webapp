const { ValidationError, ERROR_TYPES } = require("../errorHandler");
const UserRepository = require('../repositories/user');
const bcrypt = require('bcrypt');

class UserService {
    static saltRounds = 10;

    static async createUser(username, password, first_name, last_name) {
        if(!username || !password || !first_name || !last_name) {
            throw new ValidationError(ERROR_TYPES.USER_CREATION_MISSING_DATA);
        }

        if(username.length == 0 || password.length == 0 || first_name.length == 0 || last_name.length == 0) {
            throw new ValidationError(ERROR_TYPES.USER_CREATION_INVALID_DATA);
        }

        if(username.includes(":") || password.includes(":")) {
            throw new ValidationError(ERROR_TYPES.USER_CREATION_INVALID_DATA);
        }

        const emailRegex = new RegExp("^.+@.+\\..+$");
        if(!emailRegex.test(username)) {
            throw new ValidationError(ERROR_TYPES.USER_CREATION_INVALID_USERNAME);
        }

        const hashedPassword = await bcrypt.hash(password, UserService.saltRounds);

        try {
            const userRecord = await UserRepository.createUser(username, hashedPassword, first_name, last_name);
            const userData = userRecord.dataValues;
            delete userData.password;
            return userData;
        } catch (err) {
            if(err.parent.code == "ER_DUP_ENTRY") {
                throw new ValidationError(ERROR_TYPES.USER_CREATION_DUPLICATE_ENTRY);
            }

            throw err;
        }
    }

    static async getUser(user_id) {
        const userRecord = await UserRepository.findUserById(user_id);
        const userData = userRecord.dataValues;
        delete userData.password;
        return userData;
    }
}

module.exports = UserService;