const multipartUploader = require('multipart-uploader-backend');
const RabbitMQProducer = require('../RabbitMQProducer/producer');
const Video = require('../models/Video');
const User = require('../models/User');
require('dotenv').config();
const rabbitMQProducer = new RabbitMQProducer();

(async () => {
    try {
        await rabbitMQProducer.init();
    } catch (err){
        console.log(`Couldn't connect to RabbitMQProducer`);
        process.exit(1);
    }
})();

multipartUploader.configure({
    chunksDirectory: process.env.CHUNKS_DIR,
    contentsDirectory: process.env.CONTENT_DIR
});

async function init(req, res){
    try {
        const { fileName, totalChunks, videoTitle, videoDescription } = req.body;
        const { uploadedby: uploadedBy } = req.headers;
        const { uploadId } = await multipartUploader.initialiseUpload(fileName, totalChunks);
        const { name } = await User.findOne({ email: uploadedBy }, { _id: 0, name: 1 });
        let improvisedDescription = videoDescription + ` . Video by ${name}`;
        const video = new Video({ videoId: uploadId, videoTitle, videoDescription: improvisedDescription, uploadedBy, url: 'url' });
        await video.save();
        res.json({ uploadId });
    } catch (error) {
        res.status(500).json({ message: 'Some error' });
    }
};

async function upload(req, res){
    try {
        const result = await multipartUploader.chunkUpload(req);
        res.json(result);
    } catch (err){
        res.status(500).json({ message: 'Some error' });
    }
}

async function complete(req, res){
    try {
        const { uploadId } = req.body;
        const result = await multipartUploader.completeUpload(uploadId);
        const options = JSON.stringify({
            file: result.contentFile,
            location: `${process.env.HLS_DIR}/${uploadId}`,
            uploadId
        });
        await rabbitMQProducer.produceMessageToQueue('transcode', options);
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: 'Some error' });
    }
}

module.exports = {
    init,
    upload,
    complete
}