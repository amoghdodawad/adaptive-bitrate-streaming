const amqp = require('amqplib');
const { processVideo } = require('./ffmpeg');
const dotenv = require('dotenv');
const Video = require('./models/Video');
dotenv.config();
require('mongoose').connect(process.env.MONGO_URI);

const HOST = process.env.HOST || 'amqp://localhost';

(async () => {
    try {
        const connection = await amqp.connect(HOST);
        const channel = await connection.createChannel();
        const queue = 'transcode';
        await channel.assertQueue(queue, { durable: false });
        console.log(`[*] Waiting for messages in ${queue}. To exit press CTRL+C`);
        channel.consume(queue, async (message) => {
            try {
                const { file, location, uploadId } = JSON.parse(message.content.toString());
                console.log(`Received ${file}`);
                if(file === undefined || location === undefined){
                    throw new Error({
                        message: "Invalid message format",
                        requeueThisMessage: false
                    })
                }
                if(file.split(' ').length > 1){
                    console.log('Rejecting due to improper file name');
                    channel.reject(message,false);
                    return;
                }
                await processVideo(file,location);
                await Video.findOneAndUpdate({ videoId: uploadId }, { isHls: true });
                channel.ack(message);
                console.log(`Transcoded ${file}`);
            } catch (err){
                if(!err.requeueThisMessage) return channel.reject(message, false);
                channel.reject(message, true);
            }
        }, { noAck: false })
    } catch (err){
        console.log(err);
    }
})();