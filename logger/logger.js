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
  ),
  transports: [
    new winston.transports.File({ filename: '/var/log/webapp/webapp.log' }),
  ]
});

module.exports = Logger;