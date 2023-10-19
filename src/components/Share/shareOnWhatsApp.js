import React from 'react';
import { WhatsappIcon } from 'react-share';

const ShareOnWhatsApp = ({ shareUrl }) => {
    // Define the text and URL you want to share
    const shareText = 'Check out this meme:';
    let url = encodeURIComponent(shareUrl);
    console.log('url is ', url);

    // Create the WhatsApp share link
    const whatsappLink = `whatsapp://send?text=${shareText} ${url}`;
    console.log('share url is ', whatsappLink);

    return (
        <div>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <WhatsappIcon round={true} size={48} />
                <span className="text-sm text-gray-500"> Whatsapp </span>
            </a>
        </div>
    );
};

export default ShareOnWhatsApp;
