import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Custom log format with timestamp and error stack trace support
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.printf(({ timestamp, level, message, stack }) => {
    if (stack) {
      return `${timestamp} [${level.toUpperCase()}]: ${message}\n${stack}`;
    }
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

// Winston logger with console and file transports
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      ),
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'test-execution.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'errors.log'),
      level: 'error',
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

// Logger wrapper with context support for better traceability
export class Logger {
  private context: string;

  constructor(context: string = 'DEFAULT') {
    this.context = context;
  }

  info(message: string, ...meta: any[]): void {
    logger.info(`[${this.context}] ${message}`, ...meta);
  }

  error(message: string, ...meta: any[]): void {
    logger.error(`[${this.context}] ${message}`, ...meta);
  }

  warn(message: string, ...meta: any[]): void {
    logger.warn(`[${this.context}] ${message}`, ...meta);
  }

  debug(message: string, ...meta: any[]): void {
    logger.debug(`[${this.context}] ${message}`, ...meta);
  }

  step(stepName: string): void {
    this.info(`Executing step: ${stepName}`);
  }

  action(action: string, element?: string): void {
    if (element) {
      this.info(`Action: ${action} on element: ${element}`);
    } else {
      this.info(`Action: ${action}`);
    }
  }

  assertion(assertion: string, result: boolean): void {
    if (result) {
      this.info(`✓ Assertion passed: ${assertion}`);
    } else {
      this.error(`✗ Assertion failed: ${assertion}`);
    }
  }
}

export default logger;
