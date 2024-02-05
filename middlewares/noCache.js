async function noCacheMiddleWare(req, res, next) {
    res.set('Cache-Control', "no-cache, no-store, must-revalidate");
    return next();
} 

module.exports = noCacheMiddleWare;