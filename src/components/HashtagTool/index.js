import React, { useContext, useEffect, useState } from 'react';
import { relayInit, SimplePool } from 'nostr-tools';
import Feed from '../Feed';
import PostUpload from '../Post/newPost';
import Spinner from '../Spinner';
import TrendingSidebar from './TrendingSideBar';
import Sidebar from './SideBar';
import MemeEditor from './MemeEditor';
import { ReactComponent as UploadSvg } from '../../Icons/UploadSvg.svg';
import { ReactComponent as CloseIcon } from '../../Icons/CloseIcon.svg';

const HashTagContext = React.createContext();

const relays = [
    'wss://relay.primal.net',
    'wss://relay.damus.io',
    'wss://relay.nostr.band',
    'wss://relay.nostr.bg',
    'wss://relay.nostrati.com',
    'wss://nos.lol',
    'wss://nostr.mom',
];

export async function getCommentCount(id) {
    try {
        if (sessionStorage.getItem('cc_' + id)) {
            return parseInt(sessionStorage.getItem('cc_' + id), 10);
        }

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
        ];

        if (filterTags) {
            filters['#t'] = filterTags;
        } else {
            filters['#t'] = ['memes', 'meme', 'funny', 'memestr'];
        }

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
        filterTags,
    };

    return (
        <HashTagContext.Provider value={contextValue}>
            {children}
        </HashTagContext.Provider>
    );
}
export function useResetScrollOnFilterChange(filterTags) {
    useEffect(() => {
        window.scrollTo(0, 0);
        // Or, if you're scrolling within a specific element:
        // document.getElementById('your-scrollable-element-id').scrollTop = 0;
    }, [filterTags]);
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

export function HashtagTool() {
    const { notes, LoadMoreMedia, isLoading, filterTags } = useHashTagContext();
    const [newPostModal, setNewPostModal] = useState(false);
    const [loadingMorePosts, setLoadingMorePosts] = useState(false);
    const [showMemeEditor, setShowMemeEditor] = useState(false);
    const [showSuccessNotification, setShowSuccessNotification] =
        useState(false);

    function handlePostUploadSuccess() {
        setShowSuccessNotification(true);
        setTimeout(() => setShowSuccessNotification(false), 3000); // Auto-hide after 3 seconds
    }

    useResetScrollOnFilterChange(filterTags);

    function showNewPostModal() {
        setNewPostModal(true);
    }

    function closePostModal() {
        setNewPostModal(false);
    }

    function handleLoadMore() {
        setLoadingMorePosts(true);
        LoadMoreMedia().then(() => {
            setLoadingMorePosts(false);
        });
    }

    return (
        <>
            <div className="flex flex-col md:flex-row min-h-screen">
                <Sidebar
                    showMemeEditor={showMemeEditor}
                    setShowMemeEditor={setShowMemeEditor}
                />
                <main className="flex-1 overflow-y-auto">
                    {isLoading && <Spinner />}
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
                        style={{ zIndex: 999 }}
                        className="hidden md:block fixed bottom-4 right-8  bg-gradient-to-r from-blue-500 to-teal-500 hover:from-pink-500 hover:to-yellow-500 w-14 h-14 rounded-full flex items-center justify-center text-white drop-shadow-lg hover:drop-shadow-2xl">
                        <UploadSvg className="m-auto h-6 w-6" />
                    </button>

                    {newPostModal && (
                        <PostUpload
                            isOpen={newPostModal}
                            onClose={closePostModal}
                            onUploadSuccess={handlePostUploadSuccess}
                        />
                    )}

                    {showSuccessNotification && (
                        <div className="fixed top-0 inset-x-0 flex justify-center items-start notification z-50">
                            <div className="mt-12 p-4 bg-black text-white rounded-lg shadow-lg transition-transform transform-gpu animate-slideInSlideOut flex items-center">
                                <p className="text-bold text-white px-2">
                                    Post Uploaded Successfully
                                </p>
                                <CloseIcon
                                    className="h-6 w-6 mr-2 text-white"
                                    onClick={() =>
                                        setShowSuccessNotification(false)
                                    }
                                />
                            </div>
                        </div>
                    )}
                </main>
                <TrendingSidebar showMemeEditor={showMemeEditor} />
                {showMemeEditor && (
                    <div className="fixed editor-container inset-0 flex items-center justify-center bg-black bg-opacity-40 transition-opacity overflow-auto">
                        <div className="bg-white p-6 rounded-md shadow-md relative max-h-full lg:w-2/3 overflow-auto">
                            <MemeEditor />
                            <button
                                type="button"
                                className="absolute top-4 right-4 mt-2 mr-2 text-gray-600 hover:text-gray-800"
                                onClick={() => setShowMemeEditor(false)}>
                                <CloseIcon />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default HashtagTool;
