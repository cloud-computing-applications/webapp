const express = require('express');
const noCacheMiddleWare = require('./middlewares/noCache');
const router = express.Router();

router.use('/healthz', noCacheMiddleWare, require("./routes/health"));

module.exports = router;