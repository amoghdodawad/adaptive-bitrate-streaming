import React, { useEffect, useRef, useState } from 'react';
import Channels from '../channels/Channels';
import Videos from '../videos/Videos';
import './Search.css'

function Search() {
    const timer = useRef(null);
    const [ channels, setChannels ] = useState([]);
    const [ videos, setVideos ] = useState([]);

    function onInputDebounce(event){
        if(event.target.value === '') return;
        clearTimeout(timer.current);
        timer.current = setTimeout(async () => {
            try {
                timer.current = null;
                const response = await fetch('/search', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        searchQuery: event.target.value,
                        page: 1
                    })
                });
                const { channels, videos } = await response.json();
                if(channels.length) setChannels([...channels]);
                if(videos.length) setVideos([...videos]);
            } catch (err){
                console.log(err);
            }
        },700);
    }

    useEffect(() => {
        return () => {
            clearTimeout(timer.current);
        }
    },[]);

    return (
        <div className='search-page-container'>
            <div className='search-input-container'>
                <input type='text' placeholder='Search...' onInput={onInputDebounce}/>
            </div>
            <div className='search-response-container'>
                <div className='channels-super-container'>
                    <div> Channels </div>
                    <Channels channels={channels}/>
                </div>
                <div className='videos-super-container'>
                    <div> Videos </div>
                    <Videos videos={videos}/>
                </div>
            </div>
        </div>
    )
}

export default Search