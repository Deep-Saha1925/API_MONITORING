import pg from 'pg';
import config from './index.js';
import logger from './logger.js';

const { Pool } = pg;

class PostgresConnection {
    constructor() {
        this.pool = null;
    }

    getPool() {
        try {
            if(this.pool) {
                logger.info('PostgreSQL connection pool already established');
                return this.pool;
            }
            this.pool = new Pool({
                host: config.postgres.host,
                port: config.postgres.port,
                database: config.postgres.database,
                user: config.postgres.user,
                password: config.postgres.password,
                max: 20, // maximum number of clients in the pool
                idleTimeoutMillis: 30000, // close idle clients after 30 seconds
                connectionTimeoutMillis: 2000, // return an error after 2 seconds if connection could not be established
            });

            this.pool.on('error', (err) => {
                logger.error('Unexpected error on PostgreSQL idle client:', err);
            })

            

            // Test the connection
            // await this.pool.query('SELECT NOW()');

            logger.info(`Connected to PostgreSQL at ${config.postgres.host}:${config.postgres.port}/${config.postgres.database}`);
            return this.pool;
            
        } catch (error) {
            logger.error('Error connecting to PostgreSQL:', error);
            throw error;
        }
    }

    async testConnection(){
        try {
            const pool = this.getPool();
            const client = await pool.connect();
            const res = await client.query('SELECT NOW()');
            logger.info('PostgreSQL connection test successful:', res.rows[0].now);
            client.release();
        } catch (error) {
            logger.error('PostgreSQL connection test failed:', error);
            throw error;
        }
    }

    async query(text, params) {
        const pool = this.getPool();
        const start = Date.now();

        try {
            const res = await pool.query(text, params);
            const duration = Date.now() - start;
            logger.debug('Executed query', { text, duration, rows: res.rowCount });
            return res;
        } catch (error) {
            logger.error('Error executing query', { text, error });
            throw error;
        }
    }

    async close() {
        if (this.pool) {
            await this.pool.end();
            logger.info('PostgreSQL connection pool closed');
            this.pool = null;
        }
    }
}

export default new PostgresConnection();