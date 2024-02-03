const UserRepository = require("../repositories/user");
const bcrypt = require('bcrypt');

async function auth(req, res, next) {
    const authorization = req.headers.authorization;
    if(!authorization) {
        return res.status(401).send();
    }

    const splitAuth = authorization.split(" ");
    if(splitAuth.length != 2 || splitAuth[0] != "Basic") {
        return res.status(401).send();
    }

    const credentials = Buffer.from(splitAuth[1], 'base64').toString('utf8');
    const credentialSplit = credentials.split(":");

    if(credentialSplit.length != 2) {
        return res.status(401).send();
    }

    const userName = credentialSplit[0];
    const password = credentialSplit[1];

    const userRecord = await UserRepository.findUserByUsername(userName);
    const userData = userRecord.dataValues;

    const isPasswordValid = await bcrypt.compare(password, userData.password);

    if(!isPasswordValid) {
        return res.status(401).send();
    }

    req.user_id = userRecord.id;

    next();
}

module.exports = auth;