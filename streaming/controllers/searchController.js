const Video = require('../models/Video');
const { parseQuery } = require('../trie/trie');

async function search(req, res){
    try {
        const { searchQuery, page } = req.body;
        if(!searchQuery || parseInt(page) < 1) throw new Error('err'); 
        const videos = await Video
                                .find(
                                    { $text: { $search: parseQuery(searchQuery) }},
                                    { _id: 0, videoTitle: 1, videoDescription: 1, videoId: 1, uploadedBy: 1},
                                    { score: { $meta: 'textScore' }})
                                .sort({ score: { $meta: 'textScore' }})
                                .skip((parseInt(page) - 1) * 10)
                                .limit(10)
                                .populate('channel', { _id: 0, name: 1, email: 1 });
        const users = {}
        let channels = [];
        videos.forEach(video => {
            if(!users[video.channel.email]){
                users[video.channel.email] = true;
                channels.push({...video.channel['_doc']});
            }
        });
        res.status(200).json({ channels, videos });
    } catch (err){
        console.log(err);
        res.status(500).json({ message: 'Some error', success: false });
    }
}

async function searchByChannel(req, res){
    try {
        const { channelName, page } = req.body;
        if(!channelName || parseInt(page) < 1) throw new Error('err'); 
        const videos = await Video
                                .find({ uploadedBy: channelName }, { _id: 0, id: 0 })
                                .skip((parseInt(page) - 1) * 10)
                                .limit(10);
        res.status(200).json(videos);
    } catch (err){
        res.status(500).json({ message: 'Not Ok', success: false });
    }
}

async function searchByVideoId(req, res){
    try {
        const { videoId } = req.params;
        if(!videoId) throw new Error('err');
        const video = await Video.findOne({ videoId }, { _id:0 });
        res.status(200).json({ video });
    } catch (err) {
        res.status(500).json({ message: 'Not Ok', success: false })
    }
}

module.exports = {
    search,
    searchByChannel,
    searchByVideoId
}