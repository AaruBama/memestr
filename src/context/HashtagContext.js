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
            console.log('Fetching notes with profiles');
            const allNotes = await fetchNotesWithProfiles(filters);
            console.log('All notes', allNotes);
            let filteredNotes = allNotes
                .map(note => ({ ...note })) // Create new plain objects
                .filter(note =>
                    /(https?:\/\/[^\s]+(\.jpg|\.mp4|\.gif))/gi.test(
                        note.content,
                    ),
                );

            filteredNotes = filteredNotes.sort(
                (a, b) => b.created_at - a.created_at,
            );

            console.log('All Filtered notes', filteredNotes);
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
        if (!lastCreatedAt) {
            console.log('!!!!!!!!!!NO LAST CREATED!!!!!!!!');
            return;
        }
        if (inProgressRequests.has(lastCreatedAt)) {
            return;
        }

        inProgressRequests.add(lastCreatedAt);
        const filters = {
            limit: 50,
            '#t': filterTags,
            until: lastCreatedAt - 5 * 60, // Fetch notes before this time
        };

        const notes = await fetchNotesWithProfiles(filters);

        // Filter for valid media content
        let filteredNotes = notes.filter(note =>
            /(https?:\/\/[^\s]+(\.jpg|\.mp4|\.gif))/gi.test(note.content),
        );
        filteredNotes = filteredNotes.sort(
            (a, b) => b.created_at - a.created_at,
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
