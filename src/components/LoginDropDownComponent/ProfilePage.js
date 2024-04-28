import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../HashtagTool/SideBar';
import TrendingSidebar from '../HashtagTool/TrendingSideBar';
import { ReactComponent as ProfileIcon } from '../../Icons/Profile.svg';
import { useAuth } from '../../AuthContext';
import { getUserDetailsFromPublicKey } from '../Profile';
import { LoadingScreen } from './UserDetailsForAccountCreationModal';

function ProfilePage() {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profileImage, setProfileImage] = useState(null);
    const [bannerImage, setBannerImage] = useState(null);
    const [publicKey, setPublicKey] = useState(null);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/');
        } else {
            getUserDetails();
        }
    }, [isLoggedIn, navigate]);

    const getUserDetails = async () => {
        const storedData = localStorage.getItem('memestr');
        if (storedData) {
            const publicKey = JSON.parse(storedData).pubKey;
            setPublicKey(publicKey);
            try {
                const details = await getUserDetailsFromPublicKey(publicKey);
                console.log(details);

                const profileImage = localStorage.getItem(
                    `profileImage_${publicKey}`,
                );
                console.log(profileImage);
                const bannerImage = localStorage.getItem(
                    `bannerImage_${publicKey}`,
                );

                setUserDetails({
                    ...details,
                    profileImage,
                    bannerImage,
                });

                setLoading(false);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        }
    };

    const handleProfileUpload = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfileImage(reader.result);
            const storedData = localStorage.getItem('memestr');
            if (storedData) {
                const publicKey = JSON.parse(storedData).pubKey;
                localStorage.setItem(
                    `profileImage_${publicKey}`,
                    reader.result,
                );
            }
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleBannerUpload = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setBannerImage(reader.result);
            const storedData = localStorage.getItem('memestr');
            if (storedData) {
                const publicKey = JSON.parse(storedData).pubKey;
                localStorage.setItem(`bannerImage_${publicKey}`, reader.result);
            }
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen ">
            <Sidebar />
            <main className="md:w-7/12 p-4 pt-8 pb-16 md:pb-0">
                <div className="mt-8 mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Edit Profile</h1>
                    <div>
                        <button className="text-white bg-gradient-to-r from-blue-500 to-teal-500 hover:from-pink-500 hover:to-yellow-500 focus:outline-none focus:ring-4 font-medium rounded-full text-md px-5 py-2.5 me-2 mb-2 ">
                            Save
                        </button>
                        <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full">
                            Cancel
                        </button>
                    </div>
                </div>

                {loading ? (
                    <LoadingScreen />
                ) : (
                    <>
                        <div className="flex items-center justify-center mb-4">
                            <label htmlFor="banner-upload">
                                <input
                                    type="file"
                                    id="banner-upload"
                                    accept="image/*"
                                    onChange={handleBannerUpload}
                                    className="hidden"
                                />
                                <div
                                    className="w-screen h-48 bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden"
                                    style={{
                                        backgroundImage: `url(${
                                            bannerImage ||
                                            userDetails.banner ||
                                            localStorage.getItem(
                                                `bannerImage_${publicKey}`,
                                            )
                                        })`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}></div>
                            </label>
                        </div>
                        <div className="flex items-center mb-4 w-full">
                            <label htmlFor="profile-upload">
                                <input
                                    type="file"
                                    id="profile-upload"
                                    accept="image/*"
                                    onChange={handleProfileUpload}
                                    className="hidden"
                                />
                                <div
                                    className="flex items-center justify-center mr-auto -mt-20 bg-gray-50 rounded-full border-gray-100 w-32 h-32 cursor-pointer overflow-hidden"
                                    style={{
                                        backgroundImage: `url(${
                                            profileImage ||
                                            userDetails.profile ||
                                            localStorage.getItem(
                                                `profileImage_${publicKey}`,
                                            )
                                        })`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}>
                                    {!profileImage &&
                                        !userDetails.profile &&
                                        !localStorage.getItem(
                                            `profileImage_${publicKey}`,
                                        ) && (
                                            <ProfileIcon className="w-24 h-24" />
                                        )}
                                </div>
                            </label>
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="username"
                                className="text-lg font-semibold mb-2 block">
                                User Name
                            </label>
                            <input
                                type="text"
                                id="username"
                                className="w-full px-4 py-2 border rounded"
                                value={userDetails && userDetails.name}
                                readOnly
                            />
                        </div>
                        <div className="mb-4">
                            <label
                                htmlFor="bio"
                                className="text-lg font-semibold mb-2 block">
                                Bio
                            </label>
                            <textarea
                                id="bio"
                                className="w-full px-4 py-2 border rounded"
                                rows="4"
                                placeholder="Write your bio here..."
                                value={userDetails && userDetails.about}
                                readOnly={false}></textarea>
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="lightning-address"
                                className="text-lg font-semibold mb-2 block">
                                Bitcoin Lightning Address
                            </label>
                            <input
                                type="text"
                                id="lightning-address"
                                className="w-full px-4 py-2 border rounded"
                                placeholder="Enter your Bitcoin Lightning address"
                                value={
                                    userDetails && userDetails.lightningAddress
                                        ? userDetails.lightningAddress
                                        : 'Not mentioned'
                                }
                                readOnly
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="public-key"
                                className="text-lg font-semibold mb-2 block">
                                Public Key
                            </label>
                            <input
                                type="text"
                                id="public-key"
                                className="w-full px-4 py-2 border rounded"
                                value={publicKey ? publicKey : 'Not available'}
                                readOnly
                            />
                        </div>
                    </>
                )}
            </main>
            <TrendingSidebar />
        </div>
    );
}

export default ProfilePage;
