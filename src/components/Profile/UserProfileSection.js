import React from 'react';
import { ReactComponent as NoUserImage } from '../../Icons/noImageUser.svg';
import FollowButton from './FollowButton';
import MoreOptionsMenu from '../Post/MoreOptionsMenu';
import { useNavigate } from 'react-router-dom';

export const UserProfileSection = ({
    profile,
    size = 'md',
    className = '',
}) => {
    // Define size configurations
    const sizeMap = {
        xs: 'w-8 h-8',
        sm: 'w-10 h-10',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
        xl: 'w-20 h-20',
    };
    const navigate = useNavigate();

    const moreOptionsItems = [
        { label: 'View Profile', value: 'profile' },
        { label: 'Block User', value: 'block' },
        { label: 'Report', value: 'report' },
    ];

    const handleFollowToggle = followState => {
        // Implement follow logic
        console.log('Follow state:', followState);
    };

    const handleMoreOptionsSelect = option => {
        // Handle menu item selection
        console.log('Selected option:', option);
    };

    // Extract picture from profile or use default
    const profilePicture = profile?.picture || NoUserImage;

    return (
        <div className="flex items-start space-2 mt-2">
            <div className="flex grow">
                <div
                    className={`
          ${sizeMap[size]}
          rounded-full
          overflow-hidden
          border-2
          border-gray-200
          flex-shrink-0
          cursor-pointer
          ${className}
        `}
                    onClick={() => navigate(`/userprofile/${profile.pubkey}`)}>
                    <img
                        src={profilePicture}
                        alt={profile?.name || 'User Profile'}
                        className="w-full h-full object-cover"
                    />
                </div>

                {profile?.name && (
                    <div
                        className="flex flex-col ml-1 cursor-pointer"
                        onClick={() =>
                            navigate(`/userprofile/${profile.pubkey}`)
                        }>
                        <h3 className="font-semibold text-gray-800">
                            {profile.name}
                        </h3>
                        {profile.nip05 && (
                            <p className="text-xs text-gray-500">
                                {profile.nip05}
                            </p>
                        )}
                    </div>
                )}
            </div>
            <div className="flex items-center space-x-2 justify-end ml-auto">
                <FollowButton
                    initialFollowState={false}
                    onFollowToggle={handleFollowToggle}
                />
                <MoreOptionsMenu
                    options={moreOptionsItems}
                    onOptionSelect={handleMoreOptionsSelect}
                />
            </div>
        </div>
    );
};
