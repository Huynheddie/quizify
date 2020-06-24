const logger = function (req, res, next)  {
    console.log(`Reached endpoint: ${req.path}`);
    next();
}

module.exports = logger;