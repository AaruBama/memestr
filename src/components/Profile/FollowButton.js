import React, { useState } from 'react';

const FollowButton = ({ initialFollowState = false, onFollowToggle }) => {
    const [isFollowed, setIsFollowed] = useState(initialFollowState);

    const handleFollowToggle = () => {
        const newFollowState = !isFollowed;
        setIsFollowed(newFollowState);

        // Optional callback for parent component
        if (onFollowToggle) {
            onFollowToggle(newFollowState);
        }
    };

    return (
        <button
            onClick={handleFollowToggle}
            className={`
        px-2.5 py-0.5
        text-xs
        rounded-full
        text-white
        font-semibold
        ${isFollowed ? 'bg-gray-500' : 'bg-black hover:bg-gray-800'}
        transition-colors
        duration-200
      `}>
            {isFollowed ? 'Following' : 'Follow'}
        </button>
    );
};

export default FollowButton;
