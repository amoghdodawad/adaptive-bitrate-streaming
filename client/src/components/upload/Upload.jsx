import React, { useEffect, useRef, useState } from 'react';
import './Upload.css';
import axios from 'axios';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

function Upload() {
    const [ file, setFile ] = useState(null);
    const [ title, setTitle ] = useState(null);
    const [ description, setDescription ] = useState('');
    const [ status, setStatus ] = useState('Upload');
    const [ percentUploaded, setPercentUploaded ] = useState(0);
    const uploadRef = useRef(null);
    const { token } = useSelector(store => store.user);

    const handleFileChange = (e) => {
        try {
            let file;
            if(e.dataTransfer){
                file = e.dataTransfer.files[0];
            } else {
                file = e.target.files[0]
            }
            if(file.name.split('.').at(-1) !== 'mp4'){
                throw new Error('Only mp4 files are supported')
            }
            setFile(file);
        } catch (err){
            toast.error(err.message, { duration: 5000 });
        }
        
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(!file){
                toast.error('Please select a file before clicking upload', { duration: 5000 });
                return;
            }
            if(!title){
                toast.error('Please enter a title for your video', { duration: 5000 });
                return;
            }
            setStatus('Uploading');
            setPercentUploaded(0);
            uploadRef.current.style.color = 'rgb(229, 49, 85)';
            const chunkSize = 5 * 1024 * 1024; // 5 MB chunks
            const totalChunks = Math.ceil(file.size / chunkSize);
            const initResp = await fetch('/upload/init', {
                method: 'POST',
                body: JSON.stringify({
                    fileName: file.name,
                    totalChunks: totalChunks,
                    videoTitle: title,
                    videoDescription: description
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const { uploadId } = await initResp.json();
            let start = 0;
            for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {

                const chunk = file.slice(start, start + chunkSize);
                start += chunkSize;
                const chunkFormData = new FormData();
                chunkFormData.append('uploadId', uploadId);
                chunkFormData.append(`chunk`, chunk);
                chunkFormData.append('totalChunks', totalChunks);
                chunkFormData.append('chunkIndex', chunkIndex);
        
                await axios.post('/upload/upload', chunkFormData, {
                    headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                    }
                });
                setPercentUploaded(chunkIndex/totalChunks * 100);
            }

            await fetch('/upload/complete',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    uploadId: uploadId,
                })
            });
            setStatus('Uploaded');
            setPercentUploaded(100);
            toast.success('Video uploaded successfully. You\'ll be notified when it will be available to watch', { duration: 10000 });
        } catch (err){

        }
    };

    useEffect(() => {
        if(status !== 'Upload')
            uploadRef.current.style.background = `linear-gradient(to right, green ${percentUploaded}%, transparent ${percentUploaded}%)`;
    },[percentUploaded]);

    return (
        <div className="video-upload-container"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
                e.preventDefault();// e.target.files = [...e.dataTransfer.files]
                // setFile(e.dataTransfer.files[0]);
                e.fromDrag = e.dataTransfer.files[0];
                handleFileChange(e);
            }}
        >
            <h2>Drag the video or</h2>
            <form onSubmit={handleSubmit}>
                <div className="file-input-container">
                    <label htmlFor="video-file">Choose Video File</label>
                    <input 
                        type="file" 
                        id="video-file" 
                        accept="video/*" 
                        onChange={handleFileChange}
                    />
                    {file && <span className="file-name">{file.name}</span>}
                </div>
                <div className="input-container">
                    <label htmlFor="video-title">Video Title</label>
                    <input
                        type="text"
                        id="video-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter video title"
                    />
                </div>
                <div className="input-container">
                    <label htmlFor="video-description">Video Description</label>
                    <textarea
                        id="video-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter video description"
                    />
                </div>
                <button type="submit" ref={uploadRef}>{status}</button>
            </form>
        </div>
    );
}

export default Upload;