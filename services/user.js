const { ValidationError, VALIDATION_ERROR_TYPES, DatabaseError, DATABASE_ERROR_TYPES } = require("../errorHandler");
const UserRepository = require('../repositories/user');
const bcrypt = require('bcrypt');

class UserService {
    static saltRounds = 10;
    static emailRegex = new RegExp("^.+@.+\\..+$");

    static async createUser(username, password, first_name, last_name) {
        if(!username || !password || !first_name || !last_name) {
            throw new ValidationError(VALIDATION_ERROR_TYPES.USER_CREATION_MISSING_DATA);
        }

        if(username.length == 0 || password.length == 0 || first_name.length == 0 || last_name.length == 0) {
            throw new ValidationError(VALIDATION_ERROR_TYPES.USER_CREATION_INVALID_DATA);
        }

        if(username.includes(":") || password.includes(":")) {
            throw new ValidationError(VALIDATION_ERROR_TYPES.USER_CREATION_INVALID_DATA);
        }

        if(!UserService.emailRegex.test(username)) {
            throw new ValidationError(VALIDATION_ERROR_TYPES.USER_CREATION_INVALID_USERNAME);
        }

        const hashedPassword = await bcrypt.hash(password, UserService.saltRounds);

        try {
            const userRecord = await UserRepository.createUser(username, hashedPassword, first_name, last_name);
            const userData = userRecord.dataValues;
            delete userData.password;
            return userData;
        } catch (err) {
            if(err.parent.code == "ER_DUP_ENTRY") {
                throw new DatabaseError(DATABASE_ERROR_TYPES.USER_CREATION_DUPLICATE_ENTRY);
            } else if (err.parent.code == "ECONNREFUSED") {
                throw new DatabaseError(DATABASE_ERROR_TYPES.DATABASE_CONNECTION_REFUSED);
            }

            throw err;
        }
    }

    static async getUser(user_id) {
        try {
            const userRecord = await UserRepository.findUserById(user_id);
            const userData = userRecord.dataValues;
            delete userData.password;
            return userData;
        } catch (err) {
            if(err.parent.code == "ECONNREFUSED") {
                throw new DatabaseError(DATABASE_ERROR_TYPES.DATABASE_CONNECTION_REFUSED);
            }
        }
    }

    static async updateUser(user_id, first_name, last_name, password) {
        if(!first_name && !last_name && !password) {
            throw new ValidationError(VALIDATION_ERROR_TYPES.USER_UPDATE_MISSING_DATA);
        }

        const updateObject = {};

        if(first_name) {
            if(first_name.length == 0) {
                throw new ValidationError(VALIDATION_ERROR_TYPES.USER_UPDATE_INVALID_DATA);
            } else {
                updateObject.first_name = first_name;
            }
        }

        if(last_name) {
            if(last_name.length == 0) {
                throw new ValidationError(VALIDATION_ERROR_TYPES.USER_UPDATE_INVALID_DATA);
            } else {
                updateObject.last_name = last_name;
            }
        }

        if(password) {
            if(password.length == 0 || password.includes(":")) {
                throw new ValidationError(VALIDATION_ERROR_TYPES.USER_UPDATE_INVALID_DATA);
            } else {
                const hashedPassword = await bcrypt.hash(password, UserService.saltRounds);
                updateObject.password = hashedPassword;
            }
        }

        try {
            await UserRepository.updateUser(user_id, updateObject);
        } catch (err) {
            if(err.parent.code == "ECONNREFUSED") {
                throw new DatabaseError(DATABASE_ERROR_TYPES.DATABASE_CONNECTION_REFUSED);
            }
        }
    }
}

module.exports = UserService;