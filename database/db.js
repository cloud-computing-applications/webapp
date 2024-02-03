const { Sequelize } = require('sequelize');
require('dotenv').config();

const DB = {};

DB.sequelize = new Sequelize('TESTDB', process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
});

const models = [
    require('../models/user')(DB.sequelize)
];

DB.models = {};
for(const model of models) {
    DB.models[model.name] = model;
}

module.exports = DB;