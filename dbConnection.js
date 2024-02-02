const { Sequelize } = require('sequelize');

class DBCONNECTION {
    static _sequelize;

    static async init() {
        DBCONNECTION._sequelize = new Sequelize('TESTDB', process.env.DB_USERNAME, process.env.DB_PASSWORD, {
            host: process.env.DB_HOST,
            dialect: 'mysql'
        });

        await DBCONNECTION.checkConnection();
    }

    static async checkConnection() {
        await DBCONNECTION._sequelize.authenticate();
    }

    static async closeConnection() {
        await DBCONNECTION._sequelize.close();
    }
}

module.exports = DBCONNECTION;