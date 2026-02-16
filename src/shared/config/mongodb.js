import mongoose from "mongoose";
import config from "./index";
import logger from "./logger";

/**
 * Connects to MongoDB using Mongoose.
 * Logs connection status and errors.
 * */

class MongoConnection {
    constructor() {
        this.connection = null;
    }

    /** 
        *  Connect to MongoDB and handle connection events (error, disconnected).
        *  @returns {Promise<mongoose.Connection>} The MongoDB connection instance.
    */
    async connect() {
        try {
            if(this.connection) {
                logger.info('MongoDB connection already established');
                return this.connection;
            }

            await mongoose.connect(config.mongo.uri, {
                dbName: config.mongo.dbName,
            })
            logger.info(`Connected to MongoDB at ${config.mongo.uri}`);

            this.connection.on('error', (err) => {
                logger.error('MongoDB connection error:', err);
            })

            this.connection.on('disconnected', () => {
                logger.warn('MongoDB disconnected');
            })

            return this.connection;
        } catch (error) {
            logger.error('Error connecting to MongoDB:', error);
            throw error;
        }
    }

    /**
     * Disconnects from MongoDB if a connection exists.
     */
    async disconnect() {
        try {
            if(this.connection) {
                await mongoose.disconnect();
                this.connection = null;
                logger.info('Disconnected from MongoDB');
            } else {
                logger.warn('No MongoDB connection to disconnect');
            }
        } catch (error) {
            logger.error('Error disconnecting from MongoDB:', error);
            throw error;
        }
    }

    /**
     * Get the current MongoDB connection instance.
     * @returns {mongoose.Connection}
     */
    getConnection() {
        return this.connection;
    }
}

export default MongoConnection();