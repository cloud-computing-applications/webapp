const moment = require("moment");
const { ValidationError, VALIDATION_ERROR_TYPES, DatabaseError, DATABASE_ERROR_TYPES } = require("../errorHandler");
const HelperFunctions = require("../helper");
const UserRepository = require('../repositories/user');
const bcrypt = require('bcrypt');

class UserService {
    static saltRounds = 10;

    static async activateUser(user_id) {
        try {
            const userRecord = await UserRepository.findUserById(user_id);

            if(!userRecord) {
                throw new ValidationError(VALIDATION_ERROR_TYPES.USER_ACTIVATE_INVALID_LINK);
            }

            const userData = userRecord.dataValues;

            if(userData.is_verified) {
                throw new ValidationError(VALIDATION_ERROR_TYPES.USER_ACTIVATE_ALREADY_ACTIVATED);
            }

            if(moment().isAfter(moment(userData.account_created).add(process.env.VERIFICATION_EXPIRY, 'seconds'))) {
                throw new ValidationError(VALIDATION_ERROR_TYPES.USER_ACTIVATE_LINK_EXPIRED);
            }

            await UserRepository.updateUser(user_id, { is_verified: true });
        } catch (err) {
            if(err.name == "SequelizeConnectionRefusedError") {
                throw new DatabaseError(DATABASE_ERROR_TYPES.DATABASE_CONNECTION_REFUSED);
            }

            throw err;
        }
    }

    static async createUser(username, password, first_name, last_name) {
        if(!username || !password || !first_name || !last_name) {
            throw new ValidationError(VALIDATION_ERROR_TYPES.USER_CREATION_MISSING_DATA);
        }

        username = username.trim();
        first_name = first_name.trim();
        last_name = last_name.trim();

        if(username.includes(":") || password.includes(":")) {
            throw new ValidationError(VALIDATION_ERROR_TYPES.USER_CREATION_INVALID_DATA);
        }

        const hashedPassword = await bcrypt.hash(password, UserService.saltRounds);

        try {
            const userRecord = await UserRepository.createUser(username, hashedPassword, first_name, last_name);
            const userData = userRecord.dataValues;
            await HelperFunctions.checkAndSendVerification(userData);
            delete userData.password;
            delete userData.is_verified;
            return userData;
        } catch (err) {
            if(err.name == "SequelizeUniqueConstraintError") {
                throw new DatabaseError(DATABASE_ERROR_TYPES.USER_CREATION_DUPLICATE_ENTRY);
            } else if (err.name == "SequelizeConnectionRefusedError") {
                throw new DatabaseError(DATABASE_ERROR_TYPES.DATABASE_CONNECTION_REFUSED);
            } else if (err.name == "SequelizeValidationError") {
                throw new ValidationError(VALIDATION_ERROR_TYPES.USER_CREATION_INVALID_USERNAME);
            }

            throw err;
        }
    }

    static async getUser(user_id) {
        try {
            const userRecord = await UserRepository.findUserById(user_id);
            const userData = userRecord.dataValues;
            delete userData.password;
            delete userData.is_verified;
            return userData;
        } catch (err) {
            if(err.name == "SequelizeConnectionRefusedError") {
                throw new DatabaseError(DATABASE_ERROR_TYPES.DATABASE_CONNECTION_REFUSED);
            }
        }
    }

    static async updateUser(user_id, first_name, last_name, password) {
        if(first_name == undefined && last_name == undefined && password == undefined) {
            throw new ValidationError(VALIDATION_ERROR_TYPES.USER_UPDATE_MISSING_DATA);
        }

        const updateObject = {};

        if(first_name != undefined) {
            if(first_name.length == 0) {
                throw new ValidationError(VALIDATION_ERROR_TYPES.USER_UPDATE_INVALID_DATA);
            } else {
                updateObject.first_name = first_name.trim();
            }
        }

        if(last_name != undefined) {
            if(last_name.length == 0) {
                throw new ValidationError(VALIDATION_ERROR_TYPES.USER_UPDATE_INVALID_DATA);
            } else {
                updateObject.last_name = last_name.trim();
            }
        }

        if(password != undefined) {
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
            if(err.name == "SequelizeConnectionRefusedError") {
                throw new DatabaseError(DATABASE_ERROR_TYPES.DATABASE_CONNECTION_REFUSED);
            }
        }
    }
}

module.exports = UserService;