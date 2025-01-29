import React from 'react';
import pic from '../LoginDropDownComponent/default_profile.jpg';

import FollowButton from './FollowButton';
import MoreOptionsMenu from '../Post/MoreOptionsMenu';
import { useNavigate } from 'react-router-dom';
import { usePageContext } from '../../context/PageContext';

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
    const isHomePage = usePageContext();

    const moreOptionsItems = [
        { label: 'View Profile', value: 'profile' },
        { label: 'Report User', value: 'block' },
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
    const profilePicture = profile?.image || pic;
    const profileName = profile?.name || profile?.displayName || 'Anonymous';

    return (
        <div className="flex items-center border-b rounded-lg bg-white p-1 ">
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
                      justify-center
                      ${className}
                    `}
                    onClick={() => navigate(`/userprofile/${profile.pubkey}`)}>
                    <img
                        src={profilePicture}
                        alt={profileName || 'User Profile'}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div
                    className="flex flex-col ml-1.5 cursor-pointer justify-center"
                    onClick={() => navigate(`/userprofile/${profile.pubkey}`)}>
                    <h3 className="font-semibold text-gray-800">
                        {profileName}
                    </h3>
                    {profile?.nip05 && (
                        <p className="text-xs text-gray-500">{profile.nip05}</p>
                    )}
                </div>
            </div>
            {isHomePage && (
                <div className="flex justify-center ml-auto">
                    <FollowButton
                        initialFollowState={false}
                        onFollowToggle={handleFollowToggle}
                    />
                    <MoreOptionsMenu
                        options={moreOptionsItems}
                        onOptionSelect={handleMoreOptionsSelect}
                    />
                </div>
            )}
        </div>
    );
};
