/**************************************************************************************************
 
 Logging

 Author: Stefan Nikolaus (www.nikolaus-consulting.de)
 Version: 1.3

 Requirements: npm install winston winston-daily-rotate-file --save

**************************************************************************************************/

const { createLogger, format, transports } = require('winston');
const { combine, splat, timestamp, label, printf } = format;

require('winston-daily-rotate-file');

// Configuration
var config = global.config

const logDir = config.logging.directory;

const logger = createLogger({
  exceptionHandlers: [
    new transports.File({ filename: 'exceptions.log' })
  ]
});

// Call exceptions.handle with a transport to handle exceptions
logger.exceptions.handle(
  new transports.File({ filename: logDir + '/exceptions.log' })
);


const consoleLogFormat = format.printf(log => {
  if (log.label) { log.label = ` [${log.label}]`} else { log.label = "" }
  if (log.device) { log.device = ` [${log.device}]`} else { log.device = "" }
  if (log.body) {
    return `${log.timestamp} [${log.service}] [${log.level}]${log.label}${log.device} ${JSON.stringify(log.message, null, 4)}\n${JSON.stringify(log.body, null, 4)}`;
  }
  return `${log.timestamp} [${log.service}] [${log.level}]${log.label} ${JSON.stringify(log.message, null, 4)}`;
})

const fileLogFormat = format.printf(log => `${JSON.stringify({ts: log.timestamp, level: log.level, message: log.message})}`)

var fileOptions = {

}

var systemLogger = createLogger({
  defaultMeta: { service: 'SYSTEM' },
  transports: [
    new transports.DailyRotateFile({
      filename: `${logDir}/system_%DATE%.log`,
      format: format.combine(format.timestamp({format: 'YYYY-MM-DDTHH:mm:ss.SSS'}), format.json(), fileLogFormat),
	  maxSize: '20m',
	  maxFiles: '7d',
	  handleExceptions: true,
	  timestamp: true
    }),
    new transports.Console({
      format: format.combine(format.timestamp({format: 'YYYY-MM-DDTHH:mm:ss.SSS'}), format.colorize(), consoleLogFormat),
      level: config.logging.system.level
    })
  ]
})

var deviceLogger = createLogger({
  defaultMeta: { service: 'DEVICE' },
  transports: [
    new transports.DailyRotateFile({
      filename: `${logDir}/device_%DATE%.log`,
      format: format.combine(format.timestamp({format: 'YYYY-MM-DDTHH:mm:ss.SSS'}), format.json(), fileLogFormat),
	  maxSize: '20m',
	  maxFiles: '7d',
	  handleExceptions: true,
	  timestamp: true
    }),
    new transports.Console({
      format: format.combine(format.timestamp({format: 'YYYY-MM-DDTHH:mm:ss.SSS'}), format.colorize(), consoleLogFormat),
      level: config.logging.device.level
    })
  ]
})

var accessLogger = createLogger({
  defaultMeta: { service: 'ACCESS' },
  transports: [
    new transports.DailyRotateFile({
      filename: `${logDir}/access_%DATE%.log`,
      format: format.combine(format.timestamp({format: 'YYYY-MM-DDTHH:mm:ss.SSS'}), format.json(), fileLogFormat),
	  maxSize: '20m',
	  maxFiles: '7d',
	  handleExceptions: true,
	  timestamp: true
    }),
    new transports.Console({
      format: format.combine(format.timestamp({format: 'YYYY-MM-DDTHH:mm:ss.SSS'}), format.colorize(), consoleLogFormat),
      level: config.logging.access.level
      })
  ]
})

systemLogger.info("Starting system log")
deviceLogger.info("Starting devivce log")
accessLogger.info("Starting access log")

module.exports = {
  systemLogger: systemLogger,
  deviceLogger: deviceLogger,
  accessLogger: accessLogger
}