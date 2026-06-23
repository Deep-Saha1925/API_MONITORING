import amqp from 'amqplib';
import config from './index.js';
import logger from './logger.js';

class RabbitMQConnection {
    constructor() {
        this.connection = null;
        this.channel = null;
        this.isConnected = false;
    }

    async connect() {
        if (this.channel) {
            return this.channel;
        }

        if(this.isConnected) {
            await new Promise((resolve) => {
                const checkInterval = setInterval(() => {
                    if(!this.isConnected){
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 100);
            })
        }

        try {
            this.isConnected = true;

            this.connection = await amqp.connect(config.rabbitmq.url);
            this.channel = await this.connecttion.createChannel();

            // Keys for RabbitMQ
            const dlqName = `${config.rabbitmq.queue}_dlq`;

            // DL queue
            await this.channel.assertQueue(dlqName, {
                durable: true,
            })

            // Normal queue with DLQ
            await this.channel.assertQueue(config.rabbitmq.queue, {
                durable: true,
                arguments: {
                    'x-dead-letter-exchange': '',
                    'x-dead-letter-routing-key': dlqName,
                }
            })

            logger.info(`RabbitMQ connected successfully`);

            this.connection.on("close", () => {
                logger.warn('RabbitMQ connection closed');
                this.connection = null;
                this.channel = null;
            })

            this.connection.on("error", () => {
                logger.error('RabbitMQ connection error');
                this.connection = null;
                this.channel = null;
            })

            this.isConnected = false;
            return this.channel;
        } catch (error) {
            logger.error('Error connecting to RabbitMQ:', error);

            this.isConnected = false;
        }

    }

    async getChannel() {
        if(this.channel) {
            return this.channel;
        }
    }

    async getStatus(){
        if(!this.channel || !this.connection) {
            return 'disconnected';
        }

        if(this.connect.closing) return 'closing';

        return 'connected';
    }

    async close() {
        try {
            if (this.channel) {
                await this.channel.close();
                this.channel = null;
            }

            if (this.connection) {
                await this.connection.close();
                this.connect = null;
            }
            logger.info('RabbitMQ connection closed');
        } catch (error) {
            logger.error('Error closing RabbitMQ channel:', error);
            return error;
        }
    }
}

export default new RabbitMQConnection();