import React, { useState, useEffect, useRef } from 'react';
import { ReactComponent as VolumeUp } from '../Icons/volumeup.svg';
import { ReactComponent as VolumeDown } from '../Icons/VolumeDown.svg';

export function VideoPlayer({ imageLink }) {
    const [muted, setMuted] = useState(true);
    const videoRef = useRef(null);

    const handleMuteToggle = () => {
        setMuted(prevMuted => !prevMuted);
    };

    const togglePlayPause = () => {
        if (videoRef.current.paused || videoRef.current.ended) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                const entry = entries[0];
                if (entry.isIntersecting) {
                    videoRef.current.play();
                } else {
                    videoRef.current.pause();
                }
            },
            {
                threshold: 0.5, // 50% of the video must be in the viewport to play
            },
        );

        observer.observe(videoRef.current);

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div className="relative w-full max-w-screen-md mx-auto">
            <video
                ref={videoRef}
                className="w-full h-auto rounded-lg overflow-hidden shadow-lg bg-black"
                autoPlay
                muted={muted}
                playsInline
                loop
                onClick={togglePlayPause} // Added onClick event handler
            >
                <source src={imageLink} type="video/mp4" />
            </video>
            <button
                onClick={handleMuteToggle}
                className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg focus:outline-none">
                {muted ? (
                    <VolumeDown className="h-3 w-3" />
                ) : (
                    <VolumeUp className="h-3 w-3" />
                )}
            </button>
        </div>
    );
}
