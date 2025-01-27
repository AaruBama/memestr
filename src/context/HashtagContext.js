// HashTagContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchNotesWithProfiles, getVotes } from '../services/RelayService';

const notesCache = {};

export const HashTagToolProvider = ({
    children,
    filterTags = ['memes', 'meme', 'funny', 'memestr'],
}) => {
    const [notes, setNotes] = useState([]);
    const [lastCreatedAt, setLastCreatedAt] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const memoizedFilterTags = React.useMemo(() => filterTags, [filterTags]);
    useEffect(() => {
        const loadNotes = async () => {
            setNotes([]);
            setIsLoading(true);
            if (notesCache[memoizedFilterTags]) {
                // Use cached notes
                setNotes(notesCache[memoizedFilterTags]);
                setIsLoading(false);
                return;
            }
            const filters = { limit: 10, '#t': memoizedFilterTags };
            // const notes = await fetchNotes(filters);
            const allNotes = await fetchNotesWithProfiles(filters);

            console.log('notes on homepage are ', allNotes);

            const filteredNotes = allNotes.filter(note =>
                /(https?:\/\/[^\s]+(\.jpg|\.mp4|\.gif))/gi.test(note.content),
            );
            console.log('filtered notes on homepage are ', filteredNotes);

            const postIds = filteredNotes.map(note => note.id);
            const votes = await getVotes(postIds);

            filteredNotes.forEach(note => {
                note.voteCount = votes[note.id] || 0;
            });
            notesCache[memoizedFilterTags] = filteredNotes;
            setNotes(filteredNotes);

            setLastCreatedAt(
                filteredNotes[filteredNotes.length - 1]?.created_at || null,
            );
            setIsLoading(false);
        };

        loadNotes();
    }, [memoizedFilterTags]);

    const inProgressRequests = new Set();
    const LoadMoreMedia = async () => {
        const randi = Math.floor(Math.random() * 20) + 1;
        // return;
        if (!lastCreatedAt) {
            console.log('!!!!!!!!!!NO LAST CREATED!!!!!!!!');
            return;
        }
        if (inProgressRequests.has(lastCreatedAt)) {
            console.log('!!!!!!!!!!ALREADY IN PROGRESS!!!!!!!!');
            return;
        }

        console.log('Fetching more notes', randi);
        inProgressRequests.add(lastCreatedAt);
        const filters = {
            limit: 20,
            '#t': filterTags,
            until: lastCreatedAt - 5 * 60, // Fetch notes before this time
        };

        const notes = await fetchNotesWithProfiles(filters);

        // Filter for valid media content
        const filteredNotes = notes.filter(note =>
            /(https?:\/\/[^\s]+(\.jpg|\.mp4|\.gif))/gi.test(note.content),
        );

        // Fetch vote counts
        const postIds = filteredNotes.map(note => note.id);
        const votes = await getVotes(postIds);

        filteredNotes.forEach(note => {
            note.voteCount = votes[note.id] || 0;
        });

        setNotes(prevNotes => {
            const existingIds = prevNotes.map(note => note.id);
            const deduplicatedNotes = filteredNotes.filter(
                note => !existingIds.includes(note.id),
            );
            return [...prevNotes, ...deduplicatedNotes];
        });

        const createdAt = filteredNotes
            .map(note => note.created_at)
            .sort((a, b) => a - b);

        if (createdAt.length > 0) {
            setLastCreatedAt(createdAt[0]);
        } else {
            setLastCreatedAt(lastCreatedAt - 10000); // Fallback to avoid repeated fetch
        }
        inProgressRequests.delete(lastCreatedAt); // Allow new requests for this trigger point
        setIsLoading(false);
        console.log('Finishing LoadMore with ', randi);
    };

    return (
        <HashTagContext.Provider
            value={{
                notes,
                scrollPosition,
                setScrollPosition,
                isLoading,
                LoadMoreMedia: LoadMoreMedia,
                filterTags,
            }}>
            {children}
        </HashTagContext.Provider>
    );
};

const HashTagContext = createContext();

export const useHashTagContext = () => {
    const context = useContext(HashTagContext);
    if (!context) {
        throw new Error(
            'useHashTagContext must be used within a HashTagToolProvider',
        );
    }
    return context;
};
