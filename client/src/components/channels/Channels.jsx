import React from 'react';
import './Channels.css'

function Channels({ channels }) {
    return (
        <div className='channels-container'>
            {channels.map((channel, index) => 
                <div className='channel' key={channel}>
                    {channel.name}
                </div>
            )}
        </div>
    );
}

export default Channels