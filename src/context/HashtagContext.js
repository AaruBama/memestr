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
            console.log('load notes');
            if (notesCache[memoizedFilterTags]) {
                // Use cached notes
                setNotes(notesCache[memoizedFilterTags]);
                setIsLoading(false);
                return;
            }
            console.log('load notes with filter tags', memoizedFilterTags);
            const filters = { limit: 12, '#t': memoizedFilterTags };
            // const notes = await fetchNotes(filters);
            const notes = await fetchNotesWithProfiles(filters);
            console.log('notes with profiles are ', notes);

            const filteredNotes = notes.filter(note =>
                /(https?:\/\/[^\s]+(\.jpg|\.mp4|\.gif))/gi.test(note.content),
            );

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

    const LoadMoreMedia = async () => {
        console.log('Fetching more notes');
        if (!lastCreatedAt) {
            return;
        }

        const filters = {
            limit: 5,
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

        // Remove duplicates
        const filteredNotesWithoutDuplicates = filteredNotes.filter(
            note =>
                !notesCache[filterTags]?.some(
                    cachedNote => cachedNote.id === note.id,
                ),
        );

        if (filteredNotesWithoutDuplicates.length > 0) {
            console.log('Adding unique notes to notesCache.');

            // Append only unique notes to the cache
            notesCache[filterTags] = [
                ...(notesCache[filterTags] || []),
                ...filteredNotesWithoutDuplicates,
            ];

            // Update state with the cached notes
            setNotes([...notesCache[filterTags]]);

            // Update lastCreatedAt for pagination
            const lastNote =
                filteredNotesWithoutDuplicates[
                    filteredNotesWithoutDuplicates.length - 1
                ];
            console.log(lastNote.created_at);
            setLastCreatedAt(lastNote?.created_at || null);
        } else {
            console.log('No new unique notes found.');
        }
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
