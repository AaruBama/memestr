import React, { useContext, useEffect, useState } from 'react';
import { relayInit, SimplePool } from 'nostr-tools';
import Feed from '../Feed';
import PostUpload from '../Post/newPost';
import Spinner from '../Spinner';
import { Link } from 'react-router-dom';

const HashTagContext = React.createContext();

const relays = [
    'wss://relay.primal.net',
    'wss://relay.damus.io',
    'wss://relay.nostr.band',
    'wss://relay.nostr.bg',
    'wss://relay.nostrati.com',
    'wss://relay.noswhere.com',
    'wss://notsr.wine',
    'wss://nos.lol',
    'wss://nostr.mom',
];

export async function getCommentCount(id) {
    try {
        if (sessionStorage.getItem('cc_' + id)) {
            return parseInt(sessionStorage.getItem('cc_' + id), 10);
        }

        console.log('No records found in local storage. Fetching from relays.');

        const relay = relayInit('wss://saltivka.org');
        await relay.connect();

        let event = await relay.count([
            {
                kinds: [1],
                '#e': [id],
            },
        ]);

        if (event) {
            const count = event['count'];
            sessionStorage.setItem('cc_' + id, count);
            return count;
        }

        return 0;
    } catch (error) {
        console.error('Error fetching comments count:', error);
        return 0;
    }
}

// Create a provider component to wrap your application
export function HashTagToolProvider({ children, filterTags }) {
    const [notes, setNotes] = useState([]);
    const [lastCreatedAt, setLastCreatedAt] = useState();
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const containsJpgOrMp4Link = text => {
        const linkRegex = /(https?:\/\/[^\s]+(\.jpg|\.mp4|\.gif))/gi;
        return linkRegex.test(text);
    };

    async function getVotes(postIds) {
        const voteFilters = {
            kinds: [7],
            '#e': postIds,
        };
        const relayPool = new SimplePool();
        let votes = await relayPool.list(relays, [voteFilters]);
        const groupedByPostId = {};

        for (const vote of votes) {
            const voteTags = vote.tags;
            for (const tag of voteTags) {
                if (tag[0] === 'e') {
                    if (groupedByPostId[tag[1]]) {
                        groupedByPostId[tag[1]] += 1;
                    } else {
                        groupedByPostId[tag[1]] = 1;
                    }
                }
            }
        }
        return groupedByPostId;
    }

    useEffect(() => {
        const LoadMedia = async () => {
            // Fetch notes and update the context state
            // ...
            setIsLoading(true);
            const relayPool = new SimplePool();
            const filters = {
                limit: 30,
            };

            // For Memes
            if (filterTags) {
                filters['#t'] = filterTags;
            } else {
                filters['#t'] = ['memes', 'meme', 'funny', 'memestr'];
            }

            const relay = relayInit('wss://relay.damus.io');
            await relay.connect();
            let notes = await relay.list([filters]);
            // let notes = await relayPool.list(relays, [filters]);
            notes = notes.filter(note => {
                return containsJpgOrMp4Link(note.content);
            });
            // GET VOTES COMBINED
            let createdAt = [];
            let postIds = [];
            notes.forEach(function (note) {
                var id = note.id;
                createdAt.push(note.created_at);
                postIds.push(id);
            });
            createdAt.sort(function (a, b) {
                return a - b;
            });

            let groupedByPostId = await getVotes(postIds);

            // for (const id of postIds) {
            //     getCommentCount(id);
            // }

            for (const note of notes) {
                note['voteCount'] = groupedByPostId[note.id] || 0;
            }
            setNotes(notes);
            setIsLoading(false);
            setLastCreatedAt(createdAt[0]);
            relayPool.close(relays);
        };

        LoadMedia();
    }, [filterTags]);

    const LoadMoreMedia = async () => {
        // Fetch more notes with offset and update the context state
        // ...
        // setIsLoading(true);
        const relayPool = new SimplePool();
        const filters = {
            limit: 25,
        };

        const relays = [
            'wss://relay.damus.io/',
            'wss://offchain.pub/',
            'wss://nos.lol/',
            'wss://relay.nostr.wirednet.jp/',
            'wss://nostr.wine/',
        ];

        // For Memes
        filters['#t'] = ['memes', 'meme', 'funny', 'memestr'];

        filters['until'] = lastCreatedAt - 5 * 60;

        let newNotes = await relayPool.list(relays, [filters]);
        newNotes = newNotes.filter(note => {
            return containsJpgOrMp4Link(note.content);
        });

        let createdAt = [];
        let postIds = [];
        newNotes.forEach(function (note) {
            var id = note.id;
            createdAt.push(note.created_at);
            postIds.push(id);
        });
        createdAt.sort(function (a, b) {
            return a - b;
        });
        let groupedByPostId = await getVotes(postIds);
        for (const note of newNotes) {
            note['voteCount'] = groupedByPostId[note.id] || 0;
        }
        setNotes(notes => [...notes, ...newNotes]);
        setLastCreatedAt(createdAt[0]);
        // setIsLoading(false);
        relayPool.close(relays);
    };

    const contextValue = {
        notes,
        scrollPosition,
        setScrollPosition,
        LoadMoreMedia,
        isLoading,
    };

    return (
        <HashTagContext.Provider value={contextValue}>
            {isLoading ? <Spinner /> : children}
        </HashTagContext.Provider>
    );
}

// Custom hook to access the context
export function useHashTagContext() {
    const context = useContext(HashTagContext);
    if (!context) {
        throw new Error(
            'useHashTagContext must be used within a HashTagToolProvider',
        );
    }
    return context;
}

// export function HashtagTool() {
//     const { notes, LoadMoreMedia, isLoading } = useHashTagContext();
//     const [newPostModal, setNewPostModal] = useState(false);

//     function showNewPostModal() {
//         setNewPostModal(true);
//     }

//     function closePostModal() {
//         setNewPostModal(false);
//     }

//     return (
//         <>
//             {/*<NewPostButton />*/}
//             <Feed
//                 notes={notes}
//                 onLoadMore={LoadMoreMedia}
//                 isLoading={isLoading}
//             />
//             <button
//                 onClick={() => {
//                     showNewPostModal();
//                 }}
//                 title="Upload"
//                 className="fixed z-10 bottom-4 right-8 bg-gray-400 w-14 h-14 rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl hover:bg-gray-800 hover:drop-shadow-2xl hover:animate-bounce duration-300">
//                 ➕
//             </button>
//             {newPostModal && (
//                 <PostUpload isOpen={newPostModal} onClose={closePostModal} />
//             )}
//         </>
//     );
// }

export function HashtagTool() {
    const { notes, LoadMoreMedia, isLoading } = useHashTagContext();
    const [newPostModal, setNewPostModal] = useState(false);
    const [loadingMorePosts, setLoadingMorePosts] = useState(false);

    function showNewPostModal() {
        setNewPostModal(true);
    }

    function closePostModal() {
        setNewPostModal(false);
    }

    function handleLoadMore() {
        // Set the loading state before fetching more posts
        setLoadingMorePosts(true);

        // Call the LoadMoreMedia function to fetch more posts
        LoadMoreMedia().then(() => {
            // Reset the loading state after posts are fetched
            setLoadingMorePosts(false);
        });
    }

    return (
        <>
            <div className="flex flex-col md:flex-row min-h-screen">
                <aside className="hidden md:block md:w-64 bg-white p-5 sticky top-0 h-screen overflow-y-auto border-r">
                    <h1 className="font-bungee px-4 py-2 text-xl">Category</h1>
                    <nav className="mt-8">
                        <Link
                            to="/"
                            className="flex items-center px-4 py-2 mt-5 text-gray-700 hover:bg-gray-100 rounded-md ">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="16"
                                width="18"
                                viewBox="0 0 576 512">
                                <path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
                            </svg>
                            <span className="ml-3">Home</span>
                        </Link>
                        <Link
                            to="/pets"
                            className="flex items-center px-4 py-2 mt-5 text-gray-700 hover:bg-gray-100 rounded-md">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="16"
                                width="16"
                                viewBox="0 0 512 512">
                                <path d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5s.3-86.2 32.6-96.8s70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3s29.1 51.7 10.2 84.1s-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5s46.9 53.9 32.6 96.8s-52.1 69.1-84.4 58.5z" />
                            </svg>
                            <span className="ml-3">Pets</span>
                        </Link>
                        <Link
                            to="/nature"
                            className="flex items-center px-4 py-2 mt-5 text-gray-700 hover:bg-gray-100 rounded-md">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="16"
                                width="16"
                                viewBox="0 0 512 512">
                                <path d="M272 96c-78.6 0-145.1 51.5-167.7 122.5c33.6-17 71.5-26.5 111.7-26.5h88c8.8 0 16 7.2 16 16s-7.2 16-16 16H288 216s0 0 0 0c-16.6 0-32.7 1.9-48.3 5.4c-25.9 5.9-49.9 16.4-71.4 30.7c0 0 0 0 0 0C38.3 298.8 0 364.9 0 440v16c0 13.3 10.7 24 24 24s24-10.7 24-24V440c0-48.7 20.7-92.5 53.8-123.2C121.6 392.3 190.3 448 272 448l1 0c132.1-.7 239-130.9 239-291.4c0-42.6-7.5-83.1-21.1-119.6c-2.6-6.9-12.7-6.6-16.2-.1C455.9 72.1 418.7 96 376 96L272 96z" />
                            </svg>
                            <span className="ml-3">Nature</span>
                        </Link>
                        <Link
                            to="/food"
                            className="flex items-center px-4 py-2 mt-5 text-gray-700 hover:bg-gray-100 rounded-md">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="16"
                                width="16"
                                viewBox="0 0 512 512">
                                <path d="M0 192c0-35.3 28.7-64 64-64c.5 0 1.1 0 1.6 0C73 91.5 105.3 64 144 64c15 0 29 4.1 40.9 11.2C198.2 49.6 225.1 32 256 32s57.8 17.6 71.1 43.2C339 68.1 353 64 368 64c38.7 0 71 27.5 78.4 64c.5 0 1.1 0 1.6 0c35.3 0 64 28.7 64 64c0 11.7-3.1 22.6-8.6 32H8.6C3.1 214.6 0 203.7 0 192zm0 91.4C0 268.3 12.3 256 27.4 256H484.6c15.1 0 27.4 12.3 27.4 27.4c0 70.5-44.4 130.7-106.7 154.1L403.5 452c-2 16-15.6 28-31.8 28H140.2c-16.1 0-29.8-12-31.8-28l-1.8-14.4C44.4 414.1 0 353.9 0 283.4z" />
                            </svg>
                            <span className="ml-3">Food</span>
                        </Link>
                        <Link
                            to="/photography"
                            className="flex items-center px-4 py-2 mt-5 text-gray-700 hover:bg-gray-100 rounded-md">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="16"
                                width="16"
                                viewBox="0 0 512 512">
                                <path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" />
                            </svg>
                            <span className="ml-3">Photography</span>
                        </Link>
                    </nav>
                    <div className="absolute bottom-0 left-0 w-full px-6 pb-6">
                        <button
                            type="button"
                            className="w-full py-3 text-white bg-gradient-to-r from-blue-500 to-teal-500 hover:from-pink-500 hover:to-yellow-500 focus:outline-none focus:ring-4 font-medium rounded-full text-md px-5 py-2.5 me-2 mb-2 flex items-center justify-center">
                            Get Started
                        </button>
                    </div>
                </aside>
                <main className="flex-1 overflow-y-auto">
                    <Feed
                        notes={notes}
                        onLoadMore={handleLoadMore}
                        isLoading={isLoading || loadingMorePosts}
                    />

                    {loadingMorePosts && (
                        <div className="fixed bottom-0 left-0 w-full flex items-center justify-center bg-gray-700 bg-opacity-50 p-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
                        </div>
                    )}

                    <button
                        onClick={showNewPostModal}
                        title="Upload"
                        className="fixed z-10 bottom-4 right-3 md:right-8 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-pink-500 hover:to-yellow-500 w-14 h-14 rounded-full flex items-center justify-center text-white drop-shadow-lg hover:drop-shadow-2xl hover:animate-bounce duration-300">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-6 h-6">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="m15 11.25-3-3m0 0-3 3m3-3v7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                        </svg>
                    </button>

                    {newPostModal && (
                        <PostUpload
                            isOpen={newPostModal}
                            onClose={closePostModal}
                        />
                    )}
                </main>
            </div>
        </>
    );
}

export default HashtagTool;
