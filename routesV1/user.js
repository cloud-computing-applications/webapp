const express = require('express');
const UserService = require('../services/user');
const { ValidationError } = require('../errorHandler');
const auth = require('../middlewares/auth');
const router = express.Router();

router.post('/', async (req, res) => {
    const { username, password, first_name, last_name } = req.body;

    try {
        const user = await UserService.createUser(username, password, first_name, last_name);
        res.send(user);
    } catch (err) {
        if(err instanceof ValidationError) {
            res.status(err.httpStatusCode).send();
        }
    }
})

router.all('/', async (req, res) => {
    return res.status(405).send();
})

router.use(auth);

router.get('/self', async (req, res) => {
    const user = await UserService.getUser(req.user_id);
    res.send(user);
})

module.exports = router;