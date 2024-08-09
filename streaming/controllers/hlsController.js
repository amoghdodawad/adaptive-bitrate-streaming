const fs = require('fs');

function streamHls(req, res){
    try {
        const { file, videoId } = req.params;
        const readStream = fs.createReadStream(`${process.env.HLS_DIR}/${videoId}/${file}`);
        res.writeHead(200, 'Ok', {
            'Content-Type': file === 'master.m3u8' ? 'application/x-mpegURL' : 'video/MP2T',
        });
        readStream.on('end', () => { 
            res.end();
            readStream.close();
        });
        readStream.pipe(res);
    } catch (err){
        res.status(500).json({ message: 'Some error' });
    }
};

module.exports = {
    streamHls
}