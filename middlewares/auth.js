const { DatabaseError, DATABASE_ERROR_TYPES, AuthenticationError, AUTHENTICATION_ERROR_TYPES } = require("../errorHandler");
const UserRepository = require("../repositories/user");
const bcrypt = require('bcrypt');

async function auth(req, res, next) {
    const authorization = req.headers.authorization;
    if(!authorization) {
        return next(new AuthenticationError(AUTHENTICATION_ERROR_TYPES.AUTHENTICATION_UNAUTHORIZED));
    }

    const splitAuth = authorization.split(" ");
    if(splitAuth.length != 2 || splitAuth[0] != "Basic") {
        return next(new AuthenticationError(AUTHENTICATION_ERROR_TYPES.AUTHENTICATION_UNAUTHORIZED));
    }

    const credentials = Buffer.from(splitAuth[1], 'base64').toString('utf8');
    const credentialSplit = credentials.split(":");

    if(credentialSplit.length != 2) {
        return next(new AuthenticationError(AUTHENTICATION_ERROR_TYPES.AUTHENTICATION_UNAUTHORIZED));
    }

    const userName = credentialSplit[0];
    const password = credentialSplit[1];

    try {
        const userRecord = await UserRepository.findUserByUsername(userName);

        if(!userRecord) {
            return next(new AuthenticationError(AUTHENTICATION_ERROR_TYPES.AUTHENTICATION_UNAUTHORIZED));
        }

        const userData = userRecord.dataValues;

        const isPasswordValid = await bcrypt.compare(password, userData.password);

        if(!isPasswordValid) {
            return next(new AuthenticationError(AUTHENTICATION_ERROR_TYPES.AUTHENTICATION_UNAUTHORIZED));
        }

        req.user_id = userRecord.id;

        return next();
    } catch (err) {
        if(err.name == "SequelizeConnectionRefusedError") {
            return next(new DatabaseError(DATABASE_ERROR_TYPES.DATABASE_CONNECTION_REFUSED));
        }
    }
}

module.exports = auth;