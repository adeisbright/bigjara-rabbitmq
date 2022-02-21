const amqplib = require("amqplib");

class NodeRabbit {
    static ErrorMessage = "Unsupported exchange type";
    /**
     *
     * @param {String} url rabbitmq connection string
     * @param {Object} options configuration options
     * @example
     * new NodeRabbit("amqp://localhost:9200" , {timeout : 5000 , isDurable : true})
     */
    constructor(url, options = { isDurable: false, timeout: 100 }) {
        this.mqUrl = url;
        this.options = options;
    }

    /**
     * @description
     * sends a message to a rabbitmq exchange
     * @param {Any} message message to send to the exchange
     * @param {String} key key for routing the message
     * @param {String} exchange name of the exchange
     * @param {String} type type of exchange
     * @param {Boolean} isDurable the durability of the exchange
     * @returns true if the message was sent or false if the message fails
     */

    async messageExchange(message, exchange, type = "direct", key = "default") {
        let connect = await amqplib.connect(this.mqUrl);
        try {
            const messageTypes = ["number", "string", "boolean"];
            const exchangeTypes = ["direct", "topic", "fanout", "headers"];

            if (!exchangeTypes.includes(type)) {
                throw new Error(NodeRabbit.ErrorMessage);
            }

            const channel = await connect.createChannel();
            channel.assertExchange(exchange, type, {
                durable: this.options.isDurable,
            });

            let msg = messageTypes.includes(typeof message)
                ? message
                : JSON.stringify(message);

            channel.publish(exchange, key, Buffer.from(msg));
            return true;
        } catch (err) {
            console.error(err);
            return false;
        } finally {
            const timeout = this.options.timeout ? this.options.timeout : 500;
            setTimeout(async () => {
                await connect.close();
            }, timeout);
        }
    }

    /**
     * @description
     * read messages from an exchange in MQ
     * @param {String} exchange exchange name
     * @param {String} type type of exchange
     * @param {Boolean} isDurable durability of the queue
     * @param {Function} cb callback to run when message is read
     * @returns Boolean
     * @example
     * const logMessage = async (message) => {
     *   return JSON.parse(await message.content.toString())
     * }
     * readFromExchange(example , default , key , logMessage)
     */

    async readFromExchange(exchange, type, key, cb) {
        let connect = await amqplib.connect(this.mqUrl);
        try {
            const channel = await connect.createChannel();
            channel.assertExchange(exchange, type, {
                durable: this.options.isDurable,
            });
            const queue = await channel.assertQueue("", {
                durable: this.options.isDurable,
            });
            await channel.bindQueue(queue.queue, exchange, key);

            await channel.consume(queue.queue, (e) => cb(e), { noAck: true });
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    /**
     * @description
     * sends a message to a named queue
     * @param {String} queue queue name
     * @param {Any} message data to send to queue
     * @returns Boolean
     */
    async messageQueue(queue, message) {
        let connect = await amqplib.connect(this.mqUrl);
        try {
            const msgTypes = ["number", "string", "boolean"];
            const channel = await connect.createChannel();
            await channel.assertQueue(queue, {
                durable: this.options.isDurable,
            });
            const msg = msgTypes.includes(message)
                ? message
                : JSON.stringify(message);
            channel.sendToQueue(queue, Buffer.from(msg));
            return true;
        } catch (error) {
            console.log(error);
            return false;
        } finally {
            const timeout = this.options.timeout ? this.options.timeout : 500;
            setTimeout(async () => {
                await connect.close();
            }, timeout);
        }
    }

    /**
     * @description
     * @param {String} queue name of queue
     * @param {Function} cb function to run when message is successfully
     * read from queue
     * @returns Boolean
     */
    async readFromQueue(queue, cb) {
        let connect = await amqplib.connect(this.mqUrl);
        try {
            const channel = await connect.createChannel();
            await channel.assertQueue(queue, {
                durable: this.options.isDurable,
            });

            await channel.consume(queue, cb, {
                noAck: true,
            });
            return true;
        } catch (error) {
            return false;
        }
    }
}

module.exports = NodeRabbit;
