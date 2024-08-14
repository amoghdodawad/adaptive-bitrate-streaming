const amqp = require('amqplib');

class RabbitMQProducer {
    constructor(){
        this.connection = null;
        this.channel = null;
        this.channel2 = null;
        this.primaryQueue = 'transcode';
        this.primaryExchange = 'trie-exchange';
    }

    async init() {}
    async produceMessageToQueue(queue, message) {}
    async produceMessageToExchange(exchange, message) {}
}

RabbitMQProducer.prototype.init = async function (){
    return new Promise(async ( resolve, reject ) => {
        try {
            const connection = await amqp.connect();
            this.connection = connection;
            const channel = await this.connection.createChannel();
            const channel2 = await this.connection.createChannel();
            this.channel = channel;
            this.channel2 = channel2;
            await channel.assertQueue(this.primaryQueue, { durable: false });
            await channel2.assertExchange(this.primaryExchange, 'fanout', { durable: false });
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

RabbitMQProducer.prototype.produceMessageToExchange = async function(exchange, message, routingKey = ''){
    return new Promise(async (resolve, reject) => {
        try {
            if(typeof message !== "string"){
                reject({ message: 'The message should be a string', success: false });
            }
            if(exchange !== this.primaryExchange) {
                await this.channel2.assertExchange(exchange, 'fanout', { durable: false });
            }
            this.channel2.publish(exchange, routingKey, Buffer.from(message));
            console.log('Produced');
            resolve();
        } catch (err){
            reject(err);
        }
    })
}

module.exports = RabbitMQProducer;