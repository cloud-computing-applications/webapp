const express = require('express');
const DB = require('./db');
const app = express();
const routes = require('./routes');
require('dotenv').config();

let server;

async function start() {
    try {
        await DB.init();
        console.log("DB connection established");
    } catch (err) {
        console.log("DB connection lost");
    }

    app.use(express.json());

    app.use('/', routes);

    app.all('*', async (req, res) => {
        return res.status(404).send();
    })

    const appListenPromise = new Promise((res, rej) => {
        server = app.listen(process.env.PORT, () => {
            console.log(`Listening to port ${process.env.PORT}`);
            res();
        });
    })
    
    await appListenPromise;
}

async function stop() {
    if(server) {
        server.close(async () => {
            console.log("Server closed");
            await DB.closeConnection();
            console.log("DB connection closed");
        });
    }
}

module.exports = {start, stop};