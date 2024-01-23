import React, { useState, useRef, useEffect } from 'react';
import { ReactComponent as VolumeUp } from '../Icons/volumeup.svg';
import { ReactComponent as VolumeDown } from '../Icons/VolumeDown.svg';
import { ReactComponent as Play } from '../Icons/playButton.svg';

export function VideoPlayer({ imageLink }) {
    const [muted, setMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);
    const handleMuteToggle = () => {
        setMuted(prevMuted => !prevMuted);
    };
    const togglePlayPause = () => {
        if (videoRef.current.paused || videoRef.current.ended) {
            videoRef.current.play();
            setIsPlaying(true);
        } else {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                const entry = entries[0];
                if (entry.isIntersecting) {
                    videoRef.current.play();
                    setIsPlaying(true);
                } else {
                    videoRef.current.pause();
                    setIsPlaying(false);
                }
            },
            {
                threshold: 0.5,
            },
        );

        observer.observe(videoRef.current);

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div className=" relative w-full max-w-screen-md mx-auto">
            <video
                ref={videoRef}
                className="w-full h-auto rounded-lg overflow-hidden shadow-lg bg-black"
                autoPlay
                muted={muted}
                playsInline
                loop
                onClick={togglePlayPause}>
                <source src={imageLink} type="video/mp4" />
            </video>

            {!isPlaying && (
                <div
                    className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-10"
                    onClick={togglePlayPause}>
                    <Play className="h-12 w-12" />
                </div>
            )}
            <button
                onClick={handleMuteToggle}
                className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg focus:outline-none z-10">
                {muted ? (
                    <VolumeDown className="h-3 w-3" />
                ) : (
                    <VolumeUp className="h-3 w-3" />
                )}
            </button>
        </div>
    );
}
