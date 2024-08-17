const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const fs = require('fs');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegPath);

const formats = [
    { resolution: '1920x1080', bitrate: '5000k' },
    { resolution: '1280x720', bitrate: '3000k' },
    { resolution: '320x240', bitrate: '100k'}
];

function createHLSStream(format, inputFile, outputDir) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputFile)
        .outputOptions([
            '-c:v libx264',
            '-c:a aac',
            '-b:v ' + format.bitrate,
            '-b:a 128k',
            '-vf scale=' + format.resolution,
            '-f hls',
            '-hls_time 10',
            '-hls_list_size 0',
            '-hls_segment_filename ' + path.join(outputDir, `${format.resolution}_%05d.ts`)
        ])
        .output(path.join(outputDir, `${format.resolution}.m3u8`))
        .on('end', () => {
            resolve();
        })
        .on('error', (err) => {
            console.error(`Error processing ${format.resolution}:`, err);
            reject(err);
        })
        .run();
    });
}

function createMasterPlaylist(outputDir) {
    let masterContent = '#EXTM3U\n';
    masterContent += '#EXT-X-VERSION:3\n';

    formats.forEach((format) => {
        masterContent += `#EXT-X-STREAM-INF:BANDWIDTH=${parseInt(format.bitrate) * 1000},RESOLUTION=${format.resolution}\n`;
        masterContent += `${format.resolution}.m3u8\n`;
    });

    fs.writeFileSync(path.join(outputDir, 'master.m3u8'), masterContent);
}

async function processVideo(inputFile, outputDir) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }
            
            for (const format of formats) {
                await createHLSStream(format, inputFile, outputDir);
            }
            
            createMasterPlaylist(outputDir);
            resolve();
        } catch (err) {
            reject();
            console.error('Error processing video:', err);
        }
    });
}

module.exports = {
    processVideo
}
