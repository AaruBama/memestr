import React, {useContext, useEffect, useState} from "react";
import {SimplePool} from "nostr-tools";
import Feed from "../Feed";
import PostUpload from "../Post/newPost";
// import NewPostButton from "../Post/newPost";

// Create a context to manage shared state
const HashTagContext = React.createContext();

const relays = ["wss://relay.damus.io/",
    "wss://offchain.pub/",
    "wss://nos.lol/",
    "wss://relay.nostr.wirednet.jp/",
    "wss://nostr.wine/",
];

// Create a provider component to wrap your application
export function HashTagToolProvider({children, feedType}) {
    const [notes, setNotes] = useState([]);
    const [lastCreatedAt, setLastCreatedAt] = useState();
    const [scrollPosition, setScrollPosition] = useState(0);


    const containsJpgOrMp4Link = (text) => {
        const linkRegex = /(https?:\/\/[^\s]+(\.jpg|\.mp4|\.gif))/gi;
        return linkRegex.test(text);
    };

    async function getVotes(postIds) {
        const voteFilters = {
            kinds: [7],
            "#e": postIds
        };
        const relayPool = new SimplePool();
        let votes = await relayPool.list(relays, [voteFilters]);
        const groupedByPostId = {};

        for (const vote of votes) {
            const voteTags = vote.tags
            for (const tag of voteTags) {
                if (tag[0] === "e") {
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
                const relayPool = new SimplePool();
                const filters = {
                    limit: 20,
                };
                let notes = []
                if (feedType === 'trending') {
                    filters["#t"] = ['nsfw', 'titstr', 'boobstr', 'ass'];
                    notes = await relayPool.list(relays, [filters]);
                } else {
                    filters["#t"] = ['memes', 'meme', 'funny', 'memestr'];
                    notes = await relayPool.list(relays, [filters]);
                }

                notes = notes.filter((note) => {
                    return containsJpgOrMp4Link(note.content)
                })
                // console.log("notes are ", notes)
                // GET VOTES COMBINED
                let createdAt = []
                let postIds = []
                notes.forEach(function (note) {
                    var id = note.id;
                    createdAt.push(note.created_at)
                    postIds.push(id)
                });
                createdAt.sort(function (a, b) {
                    return a - b
                });

                let groupedByPostId = await getVotes(postIds)
                for (const note of notes) {
                    note["voteCount"] = groupedByPostId[note.id] || 0;
                }
                setNotes(notes);
                setLastCreatedAt(createdAt[0])
                relayPool.close(relays)
            };

            LoadMedia();
        },
        [feedType]);

    const LoadMoreMedia = async (feedType) => {
        // Fetch more notes with offset and update the context state
        // ...

        const relayPool = new SimplePool();
        const filters = {
            limit: 10,
        };
        filters["until"] = lastCreatedAt - (5 * 60)

        const relays = ["wss://relay.damus.io/", "wss://offchain.pub/", "wss://nos.lol/", "wss://relay.nostr.wirednet.jp/", "wss://nostr.wine/",];

        let newNotes = []
        if (feedType === 'trending') {
            filters["#t"] = ['ass', 'boobs', 'boobstr', 'nsfw'];
            newNotes = await relayPool.list(relays, [filters]);

        } else {
            filters["#t"] = ['memes', 'meme', 'funny', 'memestr'];
            newNotes = await relayPool.list(relays, [filters]);
        }
        newNotes = newNotes.filter((note) => {
            return containsJpgOrMp4Link(note.content)
        })

        let createdAt = []
        let postIds = []
        newNotes.forEach(function (note) {
            var id = note.id;
            createdAt.push(note.created_at)
            postIds.push(id)
        });
        createdAt.sort(function (a, b) {
            return a - b
        });
        let groupedByPostId = await getVotes(postIds)
        for (const note of newNotes) {
            note["voteCount"] = groupedByPostId[note.id] || 0;
        }
        setNotes(notes => [...notes, ...newNotes]);
        setLastCreatedAt(createdAt[0])
        relayPool.close(relays)
        // setNotes((prevNotes) => [...prevNotes, ...newNotes]);
    };
    // setNotes((prevNotes) => [...prevNotes, ...newNotes]);


    // Store the context value
    const contextValue = {
        notes,
        scrollPosition,
        setScrollPosition,
        LoadMoreMedia,
        feedType
    };

    return (
        <HashTagContext.Provider value={contextValue}>
            {children}
        </HashTagContext.Provider>
    );
}

// Custom hook to access the context
export function useHashTagContext() {
    const context = useContext(HashTagContext);
    if (!context) {
        throw new Error("useHashTagContext must be used within a HashTagToolProvider");
    }
    return context;
}

// The HashtagTool component
export function HashtagTool() {
    const {notes, LoadMoreMedia, feedType} = useHashTagContext();
    const [newPostModal, setNewPostModal] = useState(false)

    function showNewPostModal() {
        setNewPostModal(true)
    }

    function closePostModal() {
        setNewPostModal(false)
    }

    return (
        <>
            {/*<NewPostButton />*/}
            <Feed notes={notes}/>
            <button
                onClick={() => {
                    LoadMoreMedia(feedType);
                }}
                className="ml-[32%] px-10 bg-white hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 border border-blue-500 hover:border-transparent rounded "
            >
                Load More
            </button>
            <button onClick={() => {
                showNewPostModal();
            }}
                    title="Upload"
                    className="fixed z-10 bottom-4 right-3 right-8 bg-gray-400 w-14 h-14 rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl hover:bg-gray-800 hover:drop-shadow-2xl hover:animate-bounce duration-300">➕
            </button>
            {newPostModal && <PostUpload isOpen={newPostModal} onClose={closePostModal}/>}
        </>
    );
}

export default HashtagTool
