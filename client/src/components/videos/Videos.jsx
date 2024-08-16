import React from 'react';
import './Videos.css';
import { Link } from 'react-router-dom';

function Videos({ videos }) {
    return (
        <div className='videos-component-container'>
            {videos.map((video, index) => {
                return (
                    <Link to={`/watch?videoId=${video.videoId}`}>
                        <div className='videos-card' key={video.videoId}>
                            <div className='videos-title'>
                                {video.videoTitle}
                            </div>
                            <div className='videos-channel-name'>
                                {video.channel.name}
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}

export default Videos