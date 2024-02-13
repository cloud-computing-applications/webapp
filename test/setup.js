const {start, stop} = require('../app');
const DB = require('../database/db');

before(async () => {
    await start(true, false);
})

after(async() => {
    const dropTablesPromise = [];
    for(const model in DB.models) {
        dropTablesPromise.push(DB.models[model].drop());
    }

    await Promise.all(dropTablesPromise);
    await stop();
})