const winston = require('winston');
const chalk = require('chalk');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ),
  transports: [
    // Save errors to error.log
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // Save everything to combined.log
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// If we're not in production, also log to the console with colors
const consoleFormat = winston.format.printf(({ level, message, timestamp }) => {
  let msg = `${chalk.gray(`[${timestamp}]`)} ${message}`;
  
  if (level === 'error') return chalk.red(`[ERROR]`) + ` ${msg}`;
  if (level === 'warn') return chalk.yellow(`[WARN] `) + ` ${msg}`;
  return chalk.green(`[INFO] `) + ` ${msg}`;
});

logger.add(new winston.transports.Console({
  format: consoleFormat
}));

module.exports = logger;