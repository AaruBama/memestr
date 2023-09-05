import React, { useEffect, useState, useContext } from "react";
import { SimplePool } from "nostr-tools";
import Feed from "../Feed";

// Create a context to manage shared state
const HashTagContext = React.createContext();

const relays = ["wss://relay.damus.io/",
    "wss://offchain.pub/",
    "wss://nos.lol/",
    "wss://relay.nostr.wirednet.jp/",
    "wss://nostr.wine/",
];

// Create a provider component to wrap your application
export function HashTagToolProvider({ children }) {
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
                // Fetch notes and update the context state
                // ...
                const relayPool = new SimplePool();
                const filters = {
                    limit: 10,
                };

                // For Memes
                filters["#t"] = ['memes', 'meme', 'funny', 'memestr'];

                // For both
                // filters["#t"] = ["boobstr", "memestr"]

                // For Studies
                // filters["#t"] = ["titstr", "nsfw" , "pornstr", "boobstr", "NSFW", "ass", "sex", "nude"]
                let notes = await relayPool.list(relays, [filters]);
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
        []);

        const LoadMoreMedia = async (since) => {
            // Fetch more notes with offset and update the context state
            // ...

            const relayPool = new SimplePool();
            const filters = {
                limit: 10,
            };

            const relays = ["wss://relay.damus.io/", "wss://offchain.pub/", "wss://nos.lol/", "wss://relay.nostr.wirednet.jp/", "wss://nostr.wine/",];

            // For Memes
            filters["#t"] = ['memes', 'meme', 'funny', 'memestr'];

            // For both
            // filters["#t"] = ["boobstr", "memestr"]

            // For Studies
            // filters["#t"] = ["titstr", "nsfw" , "pornstr", "boobstr", "NSFW", "ass", "sex", "nude"]
            // filters["#t"] = ["titstr", "memestr", "pornstr", "boobstr" ]
            // let lastPostSince = (notes[notes.length - 1].created_at)
            filters["until"] = lastCreatedAt - (5*60)
            // filters["since"] = lastPostSince + (60*60)


            let newNotes = await relayPool.list(relays, [filters]);
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
            createdAt.sort(function(a, b){return a-b});
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
    const { notes, LoadMoreMedia } = useHashTagContext();

    return (
        <>
            <Feed notes={notes} />
            <button
                onClick={() => {
                    LoadMoreMedia();
                }}
                className="ml-[32%] px-10 bg-white hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 border border-blue-500 hover:border-transparent rounded "
            >
                Load More
            </button>
        </>
    );
}

export default HashtagTool
