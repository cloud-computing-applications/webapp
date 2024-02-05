const express = require('express');
const UserService = require('../services/user');
const auth = require('../middlewares/auth');
const router = express.Router();

router.post('/', async (req, res, next) => {
    if(Object.keys(req.query).length !=0) {
        return res.status(400).send();
    }

    const { username, password, first_name, last_name } = req.body;

    try {
        const user = await UserService.createUser(username, password, first_name, last_name);
        res.send(user);
    } catch (err) {
        return next(err);
    }
})

router.all('/', async (req, res) => {
    return res.status(405).send();
})

router.use(auth);

router.get('/self', async (req, res, next) => {
    if(Object.keys(req.query).length !=0 || (req.headers['content-length'] != undefined && req.headers['content-length'] != 0)) {
        return res.status(400).send();
    }

    try {
        const user = await UserService.getUser(req.user_id);
        res.send(user);
    } catch (err) {
        return next(err);
    }
})

router.put('/self', async (req, res, next) => {
    if(Object.keys(req.query).length !=0) {
        return res.status(400).send();
    }

    const permittedKeys = ["first_name", "last_name", "password"];
    for(const key of Object.keys(req.body)) {
        if(!permittedKeys.includes(key)) {
            return res.status(400).send();
        }
    }

    const { first_name, last_name, password } = req.body;

    try {
        await UserService.updateUser(req.user_id, first_name, last_name, password);
        res.status(204).send();
    } catch (err) {
        return next(err);
    } 
})

router.all('/self', async (req, res) => {
    return res.status(405).send();
})

module.exports = router;