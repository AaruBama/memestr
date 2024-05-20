import './index.css';
import { getUserDetailsFromPublicKey } from '../Profile';
import React, { useEffect, useState } from 'react';
import pic from '../Comments/profile.jpeg';

function Comments({ reply }) {
    const [picture, setPicture] = useState(pic);
    const [username, setUsername] = useState('Unknown');
    const [name, setName] = useState('Anonymous');

    const commentatorPubKey = reply.pubkey;

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const userDetails =
                    await getUserDetailsFromPublicKey(commentatorPubKey);
                if (userDetails) {
                    setPicture(userDetails.picture || pic);
                    setUsername(userDetails.display_name || 'Unknown');
                    setName(userDetails.name || 'Anonymous');
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, [commentatorPubKey]);

    return (
        <div className="comment-container">
            <img className="profile1" src={picture} alt="Profile" />
            <div>
                <div className="flex flex-row w-full">
                    <span className="username-comment">{username}</span>
                    <span className="name-comment text-gray-400">@{name}</span>
                </div>
                <p className="comment">{reply.content}</p>
                {reply.children && reply.children.length > 0 && (
                    <div className="nested-comments">
                        {reply.children.map((childReply, index) => (
                            <Comments key={index} reply={childReply} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Comments;
