const {start, stop} = require('../app');
const TestHelper = require('./test-helper');

before(async () => {
    await start(true);
})

after(async() => {
    await stop();
})