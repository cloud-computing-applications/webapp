const DB = require('./db');
const mockDB = require('./mock-db');

module.exports = async (mock = false) => {
    if(mock) {
        mockDB(DB);
    }
       
    await DB.sequelize.sync({ alter: true });
    await DB.sequelize.authenticate();
}