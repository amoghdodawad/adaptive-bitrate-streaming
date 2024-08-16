import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import './Player.css';

function Player({ src }) {
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const resolutionSwitchTime = useRef(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const [showControls, setShowControls] = useState(false);
    const [HLS, setHLS] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState(-1);
    const [levels, setLevels] = useState([]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (Hls.isSupported()) {
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                audioPreload: true,
                autoStartLoad: true,
            });
            setHLS(hls);
            hls.attachMedia(video);
            hls.loadSource(src);

            hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
                const qualities = data.levels.map((level, index) => {
                    return {
                        id: index,
                        height: `${level.height}p`,

                    }
                });
                setLevels([...qualities]);
                setTotalTime(video.duration);
            });

            hls.on(Hls.Events.LEVEL_SWITCHED,() => {
                if(resolutionSwitchTime.current === 0) return;
                video.currentTime = resolutionSwitchTime.current;
                video.play();

            });

            video.addEventListener('timeupdate', () => {
                setCurrentTime(video.currentTime);
                setTotalTime(video.duration);
            });

            return () => {
                video.removeEventListener('timeupdate', () => {
                    setCurrentTime(video.currentTime);
                    setTotalTime(video.duration);
                });
                hls.destroy();
            };
        } else {
            console.log('HLS is not supported');
        }
    }, [src]);

    const togglePlayPause = () => {
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleForward = () => {
        videoRef.current.currentTime += 10;
    };

    const handleRewind = () => {
        videoRef.current.currentTime -= 10;
    };

    const handleResolutionChange = (levelIndex) => {
        resolutionSwitchTime.current = videoRef.current.currentTime;
        videoRef.current.pause();
        if (HLS) {
            HLS.currentLevel = parseInt(levelIndex);
        }
        setSelectedLevel(levelIndex);
    };

    const formatTime = (time) => {
        const hours = Math.floor(time / 3600) || 0;
        const minutes = Math.floor((time % 3600) / 60) || 0;
        const seconds = Math.floor(time % 60) || 0;
        return `${hours > 0 ? `${hours}:` : ''}${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleSliderChange = (e) => {
        const newTime = (parseFloat(e.target.value) / 100) * totalTime;
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    return (
        <div
            className='player-container'
            ref={playerRef}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            <div className="video-container">
                <video className='video-player' ref={videoRef}/>
                {showControls && (
                    <div className="control-container">
                        <div className="controls">
                            <button onClick={togglePlayPause}>
                                {isPlaying ? '❚❚' : '►'}
                            </button>
                            <button onClick={handleRewind}>⏪ 10s</button>
                            <button onClick={handleForward}>⏩ 10s</button>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={(currentTime / totalTime) * 100 || 0}
                                onChange={handleSliderChange}
                                className="time-slider"
                            />
                            <div className="time-display">
                                <span>{formatTime(currentTime)}</span> / <span>{formatTime(totalTime)}</span>
                            </div>
                            <select onChange={(e) => handleResolutionChange(e.target.value)} value={selectedLevel}>
                                <option value="-1">Auto</option>
                                {levels.map((level, index) => (
                                    <option key={index} value={level.id}>
                                        {level.height}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Player;