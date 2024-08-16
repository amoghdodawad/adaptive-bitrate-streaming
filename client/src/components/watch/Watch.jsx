import React, { useEffect, useState } from 'react';
import Player from '../player/Player';
import { useSearchParams } from 'react-router-dom';
import './Watch.css'; 

function Watch() {
    const videoId = useSearchParams()[0].get('videoId');
    const [ videoTitle, setVideoTitle ] = useState('');
    const [ videoDescription, setVideoDescription ] = useState('');

    const url = `/hls/${videoId}/master.m3u8`;
    async function onLoad(){
        const response = await fetch(`/search/video/${videoId}`);
        const json = await response.json();
        const { videoTitle, videoDescription } = json.video;
        setVideoTitle(videoTitle);
        setVideoDescription(videoDescription);
    }

    useEffect(() => {
        if(videoId) onLoad();
    },[]);

    if(!videoId){
        return (
            <div>Invalid video id</div>
        );
    }

    return (
        <div className='video-component-container'>
            <div className='video-player-container'>
                <Player src={url}/>
            </div>
            <div className='video-info-container'>
                <h1 className='video-title'>{videoTitle}</h1>
                <div>{videoDescription}</div>
            </div>
        </div>
    );
}

export default Watch;