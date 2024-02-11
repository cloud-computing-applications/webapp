const {start, stop} = require('../app');

before(async () => {
    await start();
})

after(async() => {
    await stop();
})