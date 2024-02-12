const express = require('express');
const dbBootstrap = require('./database/bootstrap');
const DB = require('./database/db');
const app = express();
const routesV1 = require('./routesV1');
const health = require('./health');
const noCacheMiddleWare = require('./middlewares/noCache');
const { ValidationError, DatabaseError, AuthenticationError } = require('./errorHandler');

const errorClasses = [ValidationError, DatabaseError, AuthenticationError];

let server;

async function start(mock = false) {
    try {
        await dbBootstrap(mock);
        console.log("DB connection established");
    } catch (err) {
        console.log("DB connection lost");
    }

    app.use(express.json());

    app.use('/healthz', noCacheMiddleWare, health);
    app.use('/v1', routesV1);

    app.use((err, req, res, next) => {
        for(const errorClass of errorClasses) {
            if(err instanceof errorClass) {
                console.log(`error message: ${err.message}\nhttp status code: ${err.httpStatusCode}`);
                return res.status(err.httpStatusCode).send();
            }
        }

        stop();
    })

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