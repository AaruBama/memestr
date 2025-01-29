import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../HashtagTool/SideBar';
import TrendingSidebar from '../HashtagTool/TrendingSideBar';
import { ReactComponent as ProfileIcon } from '../../Icons/Profile.svg';
import { getProfileFromPublicKey } from './index';
import { LoadingScreen } from '../LoginDropDownComponent/UserDetailsForAccountCreationModal';
import {
    fetchNotesWithProfiles,
    getNdk,
    getVotes,
} from '../../services/RelayService';
import Feed from '../Feed';
import { NDKEvent, NDKSubscription } from '@nostr-dev-kit/ndk';
// import Spinner from '../Spinner';

function UserProfilePage() {
    const { pubKey } = useParams();
    const [notes, setNotes] = useState({});
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [activeTab, setActiveTab] = useState('posts');
    // const navigate = useNavigate();

    function handleLoadMore() {
        return;
    }

    const handleTabClick = tab => {
        setActiveTab(tab);
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const profile = await getProfileFromPublicKey(pubKey);
                setUserDetails(profile);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        const fetchUserNotes = async () => {
            try {
                const ndk = getNdk();
                const filters = { kinds: [1], authors: [pubKey] };
                const subscription = new NDKSubscription(ndk, filters);
                const receivedEvents = [];

                subscription.on('event', event => {
                    receivedEvents.push(event);
                });

                await ndk.cacheAdapter.query(subscription);

                let filteredNotes = [];
                if (receivedEvents.length > 10) {
                    filteredNotes = receivedEvents;
                } else {
                    const notes = await fetchNotesWithProfiles(filters);
                    filteredNotes = notes.filter(note =>
                        /(https?:\/\/[^\s]+(\.jpg|\.mp4|\.gif))/gi.test(
                            note.content,
                        ),
                    );
                }

                /*
                TODO: uncouple the vote fetch logic.
                 */
                const postIds = filteredNotes.map(note => note.id);
                const votes = await getVotes(postIds);

                for (const note of filteredNotes) {
                    note.voteCount = votes[note.id] || 0;
                    const ndkEvent = new NDKEvent(ndk, note);
                    await ndk.cacheAdapter.setEvent(ndkEvent, [filters]);
                    note.profile = userDetails;
                }

                setNotes(filteredNotes);
                setLoadingPosts(false);
            } catch (error) {
                console.error('Error fetching user notes:', error);
            }
        };

        fetchUserDetails();
        fetchUserNotes();
    }, [pubKey, userDetails]);

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            <Sidebar />
            <main className="md:w-7/12 p-2 pt-4">
                {loading ? (
                    <LoadingScreen />
                ) : (
                    <>
                        <div className="flex items-center justify-center mb-4">
                            {/* Banner */}
                            <div
                                className="w-screen h-48 bg-gray-200 flex items-center justify-center cursor-pointer overflow-hidden"
                                style={{
                                    backgroundImage: `url(${userDetails.banner})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}></div>
                        </div>
                        <div className="flex items-center justify-between mb-4 w-full -mt-20 px-4">
                            {/* Profile Picture */}
                            <div
                                className="flex items-center justify-center bg-gray-50 rounded-full border-gray-100 w-28 h-28 cursor-pointer overflow-hidden"
                                style={{
                                    backgroundImage: `url(${userDetails.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}>
                                {!userDetails.image && (
                                    <ProfileIcon className="w-24 h-24" />
                                )}
                            </div>

                            {/* Buttons Section */}
                            {/* TODO: Add onClick */}
                            <div className="flex space-x-4 self-end">
                                <button className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                                    Follow
                                </button>
                                <button className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600">
                                    Message
                                </button>
                            </div>
                        </div>

                        {/* Profile section */}
                        <div className="flex flex-col justify-between mb-4 w-full px-4">
                            <div className="font-semibold text-xl">
                                {userDetails.display_name ||
                                    userDetails.displayName ||
                                    userDetails.name}
                            </div>

                            <div className="mb-2 text-sm text-gray-500">
                                {userDetails.nip05}
                            </div>

                            <div className="text-sm mb-2">
                                {userDetails.about &&
                                    userDetails.about
                                        .split('\n')
                                        .map((line, index) => (
                                            <p key={index} className="mb-0.5">
                                                {line}
                                            </p>
                                        ))}
                            </div>

                            <div className="mb-2 text-sm text-gray-500">
                                {userDetails.website && (
                                    <a
                                        href={userDetails.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline">
                                        {userDetails.website}
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Divider and Tabs */}
                        <div className="tabs-section border-b border-gray-300">
                            <ul className="flex justify-around">
                                <li
                                    className={`cursor-pointer py-2 px-4 ${
                                        activeTab === 'posts'
                                            ? 'border-b-2 border-blue-500 font-bold text-blue-500'
                                            : 'text-gray-500'
                                    }`}
                                    onClick={() => handleTabClick('posts')}>
                                    Posts
                                </li>
                                <li
                                    className={`cursor-pointer py-2 px-4 ${
                                        activeTab === 'liked'
                                            ? 'border-b-2 border-blue-500 font-bold text-blue-500'
                                            : 'text-gray-500'
                                    }`}
                                    onClick={() => handleTabClick('liked')}>
                                    Liked
                                </li>
                                <li
                                    className={`cursor-pointer py-2 px-4 ${
                                        activeTab === 'commented'
                                            ? 'border-b-2 border-blue-500 font-bold text-blue-500'
                                            : 'text-gray-500'
                                    }`}
                                    onClick={() => handleTabClick('commented')}>
                                    Commented
                                </li>
                            </ul>
                        </div>

                        {/* Feed Section */}
                        <div className="feed-section">
                            {activeTab === 'posts' &&
                                (loadingPosts ? (
                                    <div className="flex justify-center items-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                    </div>
                                ) : (
                                    <Feed
                                        isHomePage={false}
                                        notes={notes}
                                        onLoadMore={handleLoadMore}
                                    />
                                ))}
                            {activeTab === 'liked' && (
                                <div className="text-center text-gray-500">
                                    No liked posts available.
                                </div>
                            )}
                            {activeTab === 'commented' && (
                                <div className="text-center text-gray-500">
                                    No commented posts available.
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>

            <TrendingSidebar />
        </div>
    );
}

export default UserProfilePage;

/*
"{"about":"Husband of E 📖1689🗡\nThe fruit of the righteous is a tree of life,\nAnd he who is wise wins souls. Proverbs 11:30\nzv1689@npub.cash",
"banner":"https://us-southeast-1.linodeobjects.com/dufflepud/uploads/301118b1-f4cd-41be-9f6e-a8796e09a2c8.jpg",
"display_name":"zv1689","lud16":"zv1689@minibits.cash",
"name":"zv1689",
"nip05":"zv1689@nostrplebs.com",
"picture":"https://us-southeast-1.linodeobjects.com/dufflepud/uploads/3922f21b-dd6f-492a-9372-dcb03d3725fc.jpg",
"website":"https://nostree.me/npub1dk5pn7gad897tywq3vcl24wx6z4ejpge0663tptwxwgynsqccxhsn65sgk"
"pubkey":"6da819f91d69cbe591c08b31f555c6d0ab9905197eb515856e339049c018c1af",
"displayName":"zv1689"}"
 */
