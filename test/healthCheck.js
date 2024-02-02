const assert = require('assert');
const {start, stop} = require('../app');
const DBCONNECTION = require('../dbConnection');

describe('Health Check', async () => {
    before(async () => {
        await start();
    })

    describe('Valid endpoint and method', async() => {
        it('without payload and with DB connection should get 200 response code', async () => {
            const res = await fetch(`http://localhost:${process.env.PORT}/healthz`);
            assert.equal(res.status, 200);
        });

        it('without payload and DB connection should get 503 response code', async () => {
            await DBCONNECTION.closeConnection();
            const res = await fetch(`http://localhost:${process.env.PORT}/healthz`);
            assert.equal(res.status, 503);
        });

        it('with query payload should get 400 response code', async () => {
            const res = await fetch(`http://localhost:${process.env.PORT}/healthz?test=123`);
            assert.equal(res.status, 400);
        });
    })

    describe('Valid endpoint but invalid method', async() => {
        it('should get 405 response code', async () => {
            const res = await fetch(`http://localhost:${process.env.PORT}/healthz`, {
                method: "POST"
            });
            assert.equal(res.status, 405);
        });
    })

    describe('Invalid endpoint', async() => {
        it('should get 404 response code', async () => {
            const res = await fetch(`http://localhost:${process.env.PORT}/healthz/test`);
            assert.equal(res.status, 404);
        });
    })

    after(async() => {
        await stop();
    })
});