import React, { useState } from 'react';
import styles from './videoPlayer.css'; // Import the CSS file
import { ReactComponent as MuteIcon } from '../Icons/muteVideo.svg';
import { ReactComponent as UnmuteIcon } from '../Icons/unMuteVideo.svg';

function VideoPlayer({ imageLink }) {
    const [muted, setMuted] = useState(true);

    const handleMuteToggle = () => {
        setMuted(prevMuted => !prevMuted);
    };

    return (
        <div className={styles.videoContainer}>
            <video autoPlay muted={muted} controls playsInline>
                <source src={imageLink} type="video/mp4" />
            </video>

            <button onClick={handleMuteToggle}>
                {muted ? (
                    <MuteIcon className="h-8 w-8" />
                ) : (
                    <UnmuteIcon className="h-8 w-8" />
                )}
            </button>
        </div>
    );
}

export default VideoPlayer;
