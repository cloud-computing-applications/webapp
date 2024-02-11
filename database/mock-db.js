const { Sequelize } = require('sequelize');

function mockDB(DB) {
    DB.sequelize = new Sequelize('TESTDB', process.env.DB_USERNAME, process.env.DB_PASSWORD, {
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false
    })
    
    const models = [
        require('../models/user')(DB.sequelize)
    ];

    DB.models = {};
    for(const model of models) {
        DB.models[model.name] = model;
    }
}

module.exports = mockDB;