const amqp = require('amqplib');

class RabbitMQProducer {
    constructor(){
        this.connection = null;
        this.channel = null;
        this.primaryQueue = 'transcode';
    }

    async init() {}
    async produceMessageToQueue(queue, message) {}
}

RabbitMQProducer.prototype.init = async function (){
    return new Promise(async ( resolve, reject ) => {
        try {
            const connection = await amqp.connect();
            this.connection = connection;
            const channel = await this.connection.createChannel();
            this.channel = channel;
            await channel.assertQueue(this.primaryQueue, { durable: false });
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

RabbitMQProducer.prototype.produceMessageToQueue = async function (queue, message){
    return new Promise(async (resolve, reject) => {
        try {
            if(typeof message !== "string"){
                reject({ message: 'The message should be a string', success: false });
            }
            if(queue !== this.primaryQueue) {
                await this.channel.assertQueue(queue, { durable: false });
            }
            this.channel.sendToQueue(queue, Buffer.from(message));
            resolve();
        } catch (err){
            reject(err);
        }
    });
};

module.exports = RabbitMQProducer;