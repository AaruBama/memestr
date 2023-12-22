import React, { useContext, useEffect, useState } from 'react';
import { SimplePool } from 'nostr-tools';
import Feed from '../Feed';
import PostUpload from '../Post/newPost';

const relays = [
    'wss://relay.damus.io/',
    // 'wss://offchain.pub/',
    // 'wss://nos.lol/',
    // 'wss://relay.nostr.wirednet.jp/',
    // 'wss://nostr.wine/',
];

const CategorizedContext = React.createContext();

export function PetsFeedProvider({ children, filterTags }) {
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
                limit: 20,
            };

            // For Memes
            if (filterTags) {
                filters['#t'] = filterTags;
            } else {
                filters['#t'] = ['memes', 'meme', 'funny', 'memestr'];
            }
            // For both
            // filters["#t"] = ["boobstr", "memestr"]

            // For Studies
            // filters["#t"] = ["titstr", "nsfw" , "pornstr", "boobstr", "NSFW", "ass", "sex", "nude"]
            let notes = await relayPool.list(relays, [filters]);
            notes = notes.filter(note => {
                return containsJpgOrMp4Link(note.content);
            });
            // console.log("notes are ", notes)
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
            for (const note of notes) {
                note['voteCount'] = groupedByPostId[note.id] || 0;
            }
            setNotes(notes);
            setLastCreatedAt(createdAt[0]);
            setIsLoading(false);
            relayPool.close(relays);
        };
        LoadMedia();
    }, [filterTags]);

    const LoadMoreMedia = async () => {
        // Fetch more notes with offset and update the context state
        // ...

        const relayPool = new SimplePool();
        const filters = {
            limit: 20,
        };

        const relays = [
            'wss://relay.damus.io/',
            'wss://offchain.pub/',
            'wss://nos.lol/',
            'wss://relay.nostr.wirednet.jp/',
            'wss://nostr.wine/',
        ];

        // For Memes
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
        relayPool.close(relays);
    };

    // Store the context value
    const contextValue = {
        notes,
        scrollPosition,
        setScrollPosition,
        LoadMoreMedia,
        isLoading,
    };

    return (
        <CategorizedContext.Provider value={contextValue}>
            {children}
        </CategorizedContext.Provider>
    );
}

export function useHashTagContext() {
    const context = useContext(CategorizedContext);
    if (!context) {
        throw new Error(
            'useHashTagContext must be used within a HashTagToolProvider',
        );
    }
    return context;
}

function PetFeed() {
    const { notes, LoadMoreMedia, isLoading } = useHashTagContext();
    const [newPostModal, setNewPostModal] = useState(false);

    function showNewPostModal() {
        setNewPostModal(true);
    }

    function closePostModal() {
        setNewPostModal(false);
    }

    return (
        <>
            <Feed
                notes={notes}
                onLoadMore={LoadMoreMedia}
                isLoading={isLoading}
            />

            <button
                onClick={() => {
                    showNewPostModal();
                }}
                title="Upload"
                className="fixed z-10 bottom-4 right-3 md:right-8 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-pink-500 hover:to-yellow-500 w-14 h-14 rounded-full drop-shadow-lg flex justify-center items-center text-white hover:drop-shadow-2xl hover:animate-bounce duration-300">
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
                <PostUpload isOpen={newPostModal} onClose={closePostModal} />
            )}
        </>
    );
}

export default PetFeed;
