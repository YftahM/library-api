/*
 * Application logger built on winston.
 *
 * Exposes a default logger and a createLogger(context) helper so each module
 * can tag its messages (e.g. "BOOK-SERVICE"). Logs are colorized on the
 * console and persisted to the logs/ directory (ignored by git).
 */
import winston from "winston"

// Custom log levels ordered by severity (lower number = more severe).
const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4,
    },
    colors: {
        error: "red",
        warn: "yellow",
        info: "green",
        http: "magenta",
        debug: "blue",
    },
}

winston.addColors(customLevels.colors)

const baseLogger = winston.createLogger({
    levels: customLevels.levels,
    format: winston.format.combine(
        winston.format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
        winston.format.colorize({ all: true }),
        winston.format.printf((info) => `${info.timestamp} [${info.level}]: ${info.message}`)
    ),
    transports: [
        new winston.transports.Console({ level: "debug" }),
        new winston.transports.File({ filename: "logs/error.log", level: "error" }),
        new winston.transports.File({ filename: "logs/combined.log" }),
    ],
})

// Build a logger whose messages are prefixed with a context label.
export const createLogger = (context) => ({
    error: (message) => baseLogger.error(`${context}: ${message}`),
    warn: (message) => baseLogger.warn(`${context}: ${message}`),
    info: (message) => baseLogger.info(`${context}: ${message}`),
    http: (message) => baseLogger.http(`${context}: ${message}`),
    debug: (message) => baseLogger.debug(`${context}: ${message}`),
})

// Default logger with no context prefix.
const logger = {
    error: (message) => baseLogger.error(message),
    warn: (message) => baseLogger.warn(message),
    info: (message) => baseLogger.info(message),
    http: (message) => baseLogger.http(message),
    debug: (message) => baseLogger.debug(message),
}

export default logger
