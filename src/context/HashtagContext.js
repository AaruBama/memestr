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

    async function processAndSortNotes(rawNotes) {
        return rawNotes
            .map(note => ({ ...note }))
            .filter(note =>
                /(https?:\/\/[^\s]+(\.jpg|\.mp4|\.gif))/gi.test(note.content),
            )
            .sort((a, b) => b.created_at - a.created_at);
    }

    async function updateNotesWithVotes(notesToUpdate) {
        const postIds = notesToUpdate.map(note => note.id);
        const votes = await getVotes(postIds);
        return notesToUpdate.map(note => ({
            ...note,
            voteCount: votes[note.id] || 0,
        }));
    }

    useEffect(() => {
        const loadNotes = async () => {
            setNotes([]);
            setIsLoading(true);

            if (notesCache[memoizedFilterTags]) {
                // Show cached notes immediately
                setNotes(notesCache[memoizedFilterTags]);
                setIsLoading(false);
                // Update votes in background
                const updatedNotes = await updateNotesWithVotes(
                    notesCache[memoizedFilterTags],
                );
                setNotes(updatedNotes);
                return;
            }

            const filters = { limit: 10, '#t': memoizedFilterTags };
            const rawNotes = await fetchNotesWithProfiles(filters);
            const filteredNotes = await processAndSortNotes(rawNotes);

            // Show notes first
            setNotes(filteredNotes);
            setLastCreatedAt(
                filteredNotes[filteredNotes.length - 1]?.created_at || null,
            );
            setIsLoading(false);

            // Then update with votes
            const notesWithVotes = await updateNotesWithVotes(filteredNotes);
            notesCache[memoizedFilterTags] = notesWithVotes;
            setNotes(notesWithVotes);
        };

        loadNotes();
    }, [memoizedFilterTags]);

    const inProgressRequests = new Set();
    const LoadMoreMedia = async () => {
        if (!lastCreatedAt || inProgressRequests.has(lastCreatedAt)) {
            return;
        }

        inProgressRequests.add(lastCreatedAt);
        // setIsLoading(true);

        try {
            const filters = {
                limit: 50,
                '#t': filterTags,
                until: lastCreatedAt - 5 * 60,
            };

            const rawNotes = await fetchNotesWithProfiles(filters);
            const newNotes = await processAndSortNotes(rawNotes);

            // Add new notes immediately
            setNotes(prev => {
                const existingIds = new Set(prev.map(n => n.id));
                const deduped = newNotes.filter(n => !existingIds.has(n.id));
                return [...prev, ...deduped];
            });

            // Update with votes in background
            const votedNotes = await updateNotesWithVotes(newNotes);
            setNotes(prev => {
                const prevMap = new Map(prev.map(n => [n.id, n]));
                votedNotes.forEach(n => prevMap.set(n.id, n));
                return Array.from(prevMap.values()).sort(
                    (a, b) => b.created_at - a.created_at,
                );
            });

            // Update pagination cursor
            const oldestNote = votedNotes.reduce(
                (oldest, current) =>
                    current.created_at < oldest.created_at ? current : oldest,
                { created_at: Infinity },
            );
            setLastCreatedAt(oldestNote.created_at || lastCreatedAt - 10000);
        } finally {
            inProgressRequests.delete(lastCreatedAt);
            setIsLoading(false);
        }
    };

    return (
        <HashTagContext.Provider
            value={{
                notes,
                scrollPosition,
                setScrollPosition,
                isLoading,
                LoadMoreMedia,
                filterTags,
            }}>
            {children}
        </HashTagContext.Provider>
    );
};

const HashTagContext = createContext();

export const useHashTagContext = () => useContext(HashTagContext);
