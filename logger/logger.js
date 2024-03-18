const winston = require('winston');

const timezone = () => {
    return new Date().toISOString();
}

const capitalizeLevels = winston.format(info => {
    info.level = info.level.toUpperCase();
    return info;
})

const Logger = winston.createLogger({
  format: winston.format.combine (
    winston.format.timestamp({ format: timezone }),
    capitalizeLevels(),
    winston.format.json()
  )
});

if(process.env.ENVIRONMENT == "TEST") {
    Logger.add(new winston.transports.Console({
        format: winston.format.json()
    }));
} else {
    Logger.add(new winston.transports.File({ filename: process.env.LOG_FILE_PATH }));
}

module.exports = Logger;