import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../HashtagTool/SideBar';
import TrendingSidebar from '../HashtagTool/TrendingSideBar';
import { ReactComponent as ProfileIcon } from '../../Icons/Profile.svg';
import { getProfileFromPublicKey } from '../Profile';
import { LoadingScreen } from './UserDetailsForAccountCreationModal';

function UserProfilePage() {
    const { pubKey } = useParams();
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const profile = await getProfileFromPublicKey(pubKey);
                const content = profile.content;
                const details = JSON.parse(content);
                setUserDetails(details);
                console.log(details);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, [pubKey]);

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            <Sidebar />
            <main className="md:w-7/12 p-4 pt-8">
                <div className="mt-8 mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Profile</h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-full">
                        Back
                    </button>
                </div>

                {loading ? (
                    <LoadingScreen />
                ) : (
                    <>
                        <div className="flex items-center justify-center mb-4">
                            <div
                                className="w-screen h-48 bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden"
                                style={{
                                    backgroundImage: `url(${userDetails.banner})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}></div>
                        </div>
                        <div className="flex items-center mb-4 w-full">
                            <div
                                className="flex items-center justify-center mr-auto -mt-20 bg-gray-50 rounded-full border-gray-100 w-32 h-32 cursor-pointer overflow-hidden"
                                style={{
                                    backgroundImage: `url(${userDetails.picture})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}>
                                {!userDetails.picture && (
                                    <ProfileIcon className="w-24 h-24" />
                                )}
                            </div>
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
                                value={userDetails.name}
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
                                value={userDetails.about}
                                readOnly></textarea>
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
                                value={
                                    userDetails.lightningAddress ||
                                    userDetails.lud16 ||
                                    userDetails.lud6
                                }
                                readOnly
                            />
                        </div>
                        <div className="mb-16 md:mb-4 ">
                            <label
                                htmlFor="public-key"
                                className="text-lg font-semibold mb-2 block">
                                Public Key
                            </label>
                            <input
                                type="text"
                                id="public-key"
                                className="w-full px-4 py-2 border rounded"
                                value={pubKey}
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

export default UserProfilePage;
