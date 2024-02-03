const { Sequelize } = require('sequelize');

class DB {
    static _sequelize;
    static _models = {};

    static async init() {
        DB._sequelize = new Sequelize('TESTDB', process.env.DB_USERNAME, process.env.DB_PASSWORD, {
            host: process.env.DB_HOST,
            dialect: 'mysql'
        });

        await DB.setupTables();
        await DB.checkConnection();
    }

    static async checkConnection() {
        await DB._sequelize.authenticate();
    }

    static async closeConnection() {
        await DB._sequelize.close();
    }

    static async setupTables() {
        const models = [
            require('./models/user')(DB._sequelize)
        ];

        for(const model of models) {
            DB._models[model.name] = model;
        }

        await DB._sequelize.sync({ alter: true });
    }
}

module.exports = DB;