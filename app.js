const express = require('express');
const dbBootstrap = require('./database/bootstrap');
const DB = require('./database/db');
const app = express();
const routesV1 = require('./routesV1');
const health = require('./health');
const noCacheMiddleWare = require('./middlewares/noCache');

let server;

async function start() {
    try {
        await dbBootstrap();
        console.log("DB connection established");
    } catch (err) {
        console.log("DB connection lost");
    }

    app.use(express.json());

    app.use('/healthz', noCacheMiddleWare, health);
    app.use('/v1', routesV1);

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
            await DB.sequelize.close();
            console.log("DB connection closed");
        });
    }
}

module.exports = {start, stop};