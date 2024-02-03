const DB = require('./db');

module.exports = async () => {
    await DB.sequelize.sync({ alter: true });
    await DB.sequelize.authenticate();
}