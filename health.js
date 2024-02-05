const express = require('express');
const DB = require('./database/db');
const { DatabaseError, DATABASE_ERROR_TYPES } = require('./errorHandler');
const router = express.Router();

router.get('/', async (req, res, next) => {
    if(Object.keys(req.query).length !=0 || (req.headers['content-length'] != undefined && req.headers['content-length'] != 0)) {
        return res.status(400).send();
    }

    try {
        await DB.sequelize.authenticate();
        return res.send();
    } catch (err) {
        if(err.name == "SequelizeConnectionRefusedError") {
            return next(new DatabaseError(DATABASE_ERROR_TYPES.DATABASE_CONNECTION_REFUSED));
        }
    }
})

router.all('/', async (req, res) => {
    return res.status(405).send();
})

module.exports = router;