const DB = require('../database/db');

class TestHelper {
    static ogAuthenticate;

    static mockAuthenticate() {
        TestHelper.ogAuthenticate = DB.sequelize.authenticate;
        DB.sequelize.authenticate = () => {
            const error = new Error("Mock ECONNREFUSED");
            error.name = "SequelizeConnectionRefusedError"
            throw error;
        }
    }

    static restoreMockDB() {
        DB.sequelize.authenticate = TestHelper.ogAuthenticate;
    }
}

module.exports = TestHelper;