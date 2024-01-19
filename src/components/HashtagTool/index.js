import React, { useContext, useEffect, useState } from 'react';
import { relayInit, SimplePool } from 'nostr-tools';
import Feed from '../Feed';
import PostUpload from '../Post/newPost';
import Spinner from '../Spinner';
import Sidebar from './SideBar';
import { ReactComponent as UploadSvg } from '../../Icons/UploadSvg.svg';

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
                <Sidebar />
                <main className="flex-1 overflow-y-auto">
                    <Feed
                        notes={notes}
                        onLoadMore={handleLoadMore}
                        isLoading={isLoading || loadingMorePosts}
                    />

                    {loadingMorePosts && (
                        <div className="fixed bottom-0 left-0 w-full flex items-center justify-center bg-opacity-50 p-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
                        </div>
                    )}

                    <button
                        onClick={showNewPostModal}
                        title="Upload"
                        className="fixed z-10 bottom-4 right-3 md:right-8 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-pink-500 hover:to-yellow-500 w-14 h-14 rounded-full flex items-center justify-center text-white drop-shadow-lg hover:drop-shadow-2xl">
                        <UploadSvg />
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
