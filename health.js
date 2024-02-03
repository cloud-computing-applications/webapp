const express = require('express');
const DB = require('./database/db');
const router = express.Router();

router.get('/', async (req, res) => {
    if(Object.keys(req.query).length !=0 || (req.headers['content-length'] != undefined && req.headers['content-length'] != 0)) {
        return res.status(400).send();
    }

    try {
        await DB.sequelize.authenticate();
        return res.send();
    } catch (err) {
        return res.status(503).send();
    }
})

router.all('/', async (req, res) => {
    return res.status(405).send();
})

module.exports = router;