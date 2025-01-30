import './index.css';
import { getUserDetailsFromPublicKey } from '../Profile';
import React, { useEffect, useState } from 'react';
import pic from '../Comments/profile.jpeg';
import { useNavigate } from 'react-router-dom';

const Comments = React.memo(({ reply }) => {
    const navigate = useNavigate();
    const [picture, setPicture] = useState(pic);
    const [username, setUsername] = useState('Unknown');
    const [name, setName] = useState('Anonymous');

    const commentatorPubKey = reply.pubkey;

    function processContent(content) {
        const parts = content.split(/(@@[^@]+@@)/);
        return parts.map((part, index) => {
            if (part.startsWith('@@') && part.endsWith('@@')) {
                const displayName = part.slice(2, -2);
                return (
                    <strong
                        key={index}
                        className="profile-mention text-purple-500 cursor-pointer"
                        onClick={() =>
                            navigate(`/userprofile/${commentatorPubKey}`)
                        }>
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
    return (
        <>
            <div className="comment-container">
                <img className="profile1" src={picture} alt="Profile" />
                <div className="comment-content">
                    <div>
                        <span
                            className="username-comment cursor-pointer"
                            onClick={() =>
                                navigate(`/userprofile/${commentatorPubKey}`)
                            }>
                            {username}
                        </span>
                        <span className="name-comment text-gray-400">
                            @{name}
                        </span>
                        <div className="flex flex-col">
                            <p className="comment">
                                {processContent(reply.content)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
});

export default Comments;
