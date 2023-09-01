import React, { useEffect, useState, useContext } from "react";
import { SimplePool } from "nostr-tools";
import Feed from "../Feed";

// Create a context to manage shared state
const HashTagContext = React.createContext();

// Create a provider component to wrap your application
export function HashTagToolProvider({ children }) {
    const [notes, setNotes] = useState([]);
    const [scrollPosition, setScrollPosition] = useState(0);

    const containsJpgOrMp4Link = (text) => {
        const linkRegex = /(https?:\/\/[^\s]+(\.jpg|\.mp4|\.gif))/gi;
        return linkRegex.test(text);
    };

    useEffect(() => {
        const LoadMedia = async () => {
            // Fetch notes and update the context state
            // ...
            const relayPool = new SimplePool();
            const filters = {
                limit: 5,
            };

            const relays = ["wss://relay.damus.io/", "wss://offchain.pub/", "wss://nos.lol/", "wss://relay.nostr.wirednet.jp/", "wss://nostr.wine/",];
            filters["#t"] = ['memes', 'meme', 'funny', 'memestr'];


            let notes = await relayPool.list(relays, [filters]);
            notes = notes.filter((note) => {
                return containsJpgOrMp4Link(note.content)
            })
            setNotes(notes);
            relayPool.close(relays)
        };

        LoadMedia();
    }, []);

        const LoadMoreMedia = async (since) => {
            // Fetch more notes with offset and update the context state
            // ...

            const relayPool = new SimplePool();
            const filters = {
                limit: 20,
            };

            const relays = ["wss://relay.damus.io/", "wss://offchain.pub/", "wss://nos.lol/", "wss://relay.nostr.wirednet.jp/", "wss://nostr.wine/",];
            filters["#t"] = ['memes', 'meme', 'funny', 'memestr'];
            let lastPostSince = (notes[notes.length - 1].created_at)
            filters["until"] = lastPostSince - 1000


            let newNotes = await relayPool.list(relays, [filters]);
            newNotes = newNotes.filter((note) => {
                return containsJpgOrMp4Link(note.content)
            })
            setNotes(notes => [...notes, ...newNotes]);
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
                className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            >
                Load More.
            </button>
        </>
    );
}

export default HashtagTool
