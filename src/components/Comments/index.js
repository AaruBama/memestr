import './index.css';
import { getUserDetailsFromPublicKey } from '../Profile';
import React, { useEffect, useState } from 'react';
import pic from '../Comments/profile.jpeg';

function Comments({ reply, autoExpand = false }) {
    const [picture, setPicture] = useState(pic);
    const [username, setUsername] = useState('Unknown');
    const [name, setName] = useState('Anonymous');
    const [showReplies, setShowReplies] = useState(autoExpand);

    const commentatorPubKey = reply.pubkey;

    function processContent(content) {
        const parts = content.split(/(@@[^@]+@@)/);
        return parts.map((part, index) => {
            if (part.startsWith('@@') && part.endsWith('@@')) {
                const displayName = part.slice(2, -2);
                return (
                    <strong
                        key={index}
                        className="profile-mention text-purple-500">
                        @{displayName}
                    </strong>
                );
            }
            return part;
        });
    }

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const userDetails =
                    await getUserDetailsFromPublicKey(commentatorPubKey);
                if (userDetails) {
                    setPicture(userDetails.picture || pic);
                    setUsername(
                        userDetails.display_name ||
                            userDetails.name ||
                            'Unknown',
                    );
                    setName(userDetails.name || 'Anonymous');
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, [commentatorPubKey]);

    const handleViewRepliesClick = () => {
        setShowReplies(!showReplies);
    };

    return (
        <div>
            <div className="comment-container">
                <img className="profile1" src={picture} alt="Profile" />
                <div className="comment-content">
                    <div className="flex flex-row w-full">
                        <span className="username-comment">{username}</span>
                        <span className="name-comment text-gray-400">
                            @{name}
                        </span>
                    </div>
                    <p className="comment">{processContent(reply.content)}</p>
                </div>
            </div>
            {reply.children && reply.children.length > 0 && (
                <>
                    <button
                        className="view-replies-button"
                        onClick={handleViewRepliesClick}>
                        {showReplies ? 'Hide Replies' : 'View Replies'}
                    </button>
                    {showReplies && (
                        <div className="nested-comments">
                            {reply.children.map((childReply, index) => (
                                <Comments
                                    key={index}
                                    reply={childReply}
                                    autoExpand={showReplies}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Comments;
