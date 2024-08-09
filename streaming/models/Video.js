const { Schema, model } = require('mongoose');
const User = require('./User');

const videoSchema = Schema({
    videoTitle:{
        type:String,
        required:true
    },
    videoId: {
        type: String,
        required: true,
        unique: true
    },
    videoDescription: {
        type: String
    },
    uploadedBy: {
        type: String,  
        ref: 'User',
        required: true
    },
    isHls:{
        type: Boolean,
        default: false
    },
    url: {
        type: String
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

videoSchema.virtual('channel', {
    ref: 'User',
    localField: 'uploadedBy',
    foreignField: 'email',
    justOne: true
});

module.exports = model('Video', videoSchema);