const amqp = require('amqplib');
require('dotenv').config();
const { insertText } = require('../trie/trie');

const AMQP_HOST = process.env.AMQP_HOST || 'amqp://localhost';

(async () => {
    const connection = await amqp.connect(AMQP_HOST);
    const channel = await connection.createChannel();
    const exchange = 'trie-exchange';
    await channel.assertExchange(exchange, 'fanout', { durable: false });
    console.log(`[*] Waiting for messages in ${exchange} exchange. To exit press CTRL+C`);
    const { queue } = await channel.assertQueue('', { exclusive: true });
    await channel.bindQueue(queue, exchange, '');
    channel.consume(queue, async (msg) => {
        console.log('Message arrived');
        
        if (msg !== null) {
            const text = msg.content.toString();
            insertText(text);
        }
    }, { noAck: true });
})();