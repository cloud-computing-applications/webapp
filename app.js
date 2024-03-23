const express = require('express');
const dbBootstrap = require('./database/bootstrap');
const DB = require('./database/db');
require('dotenv').config();
const app = express();
const routesV1 = require('./routesV1');
const health = require('./health');
const noCacheMiddleWare = require('./middlewares/noCache');
const { ValidationError, DatabaseError, AuthenticationError, PubSubError } = require('./errorHandler');
const Logger = require('./logger/logger');

const errorClasses = [ValidationError, DatabaseError, AuthenticationError, PubSubError];

let server;

async function start(testDB = false, mock = false) {
    try {
        await dbBootstrap(testDB, mock);
        Logger.info({ message: "DB connection established" });
    } catch (err) {
        Logger.error({ message: "DB connection lost" });
    }

    app.use(express.json());

    app.use('/healthz', noCacheMiddleWare, health);
    app.use('/v1', routesV1);

    app.use((err, req, res, next) => {
        for(const errorClass of errorClasses) {
            if(err instanceof errorClass) {
                res.status(err.httpStatusCode).send();
                if(err.httpStatusCode == 503) {
                    Logger.error({ 
                        message: err.message,
                        ...(req.user_id && { user_id: req.user_id })
                    })
                } else {
                    Logger.info({ 
                        message: err.message,
                        ...(req.user_id && { user_id: req.user_id })
                    })
                }
                return;
            }
        }

        stop();
    })

    app.all('*', async (req, res) => {
        return res.status(404).send();
    })

    const appListenPromise = new Promise((res, rej) => {
        server = app.listen(process.env.PORT, () => {
            Logger.info({ message: `Listening to port ${process.env.PORT}` });
            res();
        });
    })
    
    await appListenPromise;
}

async function stop() {
    if(server) {
        let shutDownComplete;
        
        const shutDownPromise = new Promise((res, rej) => {
            shutDownComplete = res;
        })
        
        server.close(async () => {
            console.log("Server closed");
            await DB.sequelize.close();
            console.log("DB connection closed");
            shutDownComplete();
        });

        await shutDownPromise;
    }
}

module.exports = {start, stop};