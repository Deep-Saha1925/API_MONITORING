import winston from "winston";
import config from "./index.js";

/**
 * Logger configuration using Winston.
 * Logs are written to files and console (in non-production environments).
 * Error logs are stored in 'logs/error.log' and all logs in 'logs/combined.log'.
 */
const logger = winston.createLogger({
    level: config.node_env === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),

    defaultMeta: { service: 'api-monitor' },
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ]
})

if(config.node_env !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }))
}

export default logger;