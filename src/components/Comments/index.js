import './index.css';
import { getUserDetailsFromPublicKey } from '../Profile';
import React, { useEffect, useState } from 'react';
import pic from '../Comments/profile.jpeg';
import { useNavigate } from 'react-router-dom';

function Comments(props) {
    const navigate = useNavigate();
    const [picture, setPicture] = useState(pic);
    const [username, setUsername] = useState(null);
    const [name, setName] = useState('Anonymous');
    let comment = props.reply;
    const commentatorPubKey = comment.pubkey;

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
        let a = getUserDetailsFromPublicKey(commentatorPubKey);
        a.then(value => {
            if (value && value.picture) {
                setPicture(value.picture);
                setUsername(value.display_name);
                setName(value.name);
            } else {
                setPicture(pic);
                setUsername('Unknown');
                setName('Anonymous');
            }
        }).catch(error => {
            console.error('Error fetching user details:', error);
            setPicture(pic);
            setUsername('Unknown');
            setName('Anonymous');
        });
    }, [commentatorPubKey]);

    return (
        <div className={'comment-container'}>
            <img className="profile1" src={picture} alt="Profile" />
            <div>
                <div className={'flex flex-row w-full'}>
                    <span
                        className={'username-comment cursor-pointer'}
                        onClick={() =>
                            navigate(`/userprofile/${commentatorPubKey}`)
                        }>
                        {username}
                    </span>
                    <span className={'name-comment text-gray-400'}>
                        @{name}
                    </span>
                </div>
                <p className={'comment'}>{processContent(comment.content)}</p>
            </div>
        </div>
    );
}

export default Comments;
