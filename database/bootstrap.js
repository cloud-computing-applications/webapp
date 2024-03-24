const { Sequelize } = require('sequelize');
const DB = require('./db');
const mockDB = require('./mock-db');

module.exports = async (testDB = false, mock = false) => {
    if(mock) {
        mockDB(DB);
    } else {
        DB.sequelize = new Sequelize(testDB ? process.env.DB_TEST_DATABASE : process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
            host: process.env.DB_HOST,
            dialect: 'mysql',
            logging: false
        });
        
        const models = [
            require('../models/user')(DB.sequelize),
            require('../models/email')(DB.sequelize)
        ];
        
        DB.models = {};
        for(const model of models) {
            DB.models[model.name] = model;
        }
    }

    await DB.sequelize.sync({ alter: true });
    await DB.sequelize.authenticate();
}