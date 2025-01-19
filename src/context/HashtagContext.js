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

    useEffect(() => {
        const loadNotes = async () => {
            setNotes([]);
            setIsLoading(true);
            console.log('load notes');
            if (notesCache[filterTags]) {
                // Use cached notes
                setNotes(notesCache[filterTags]);
                setIsLoading(false);
                return;
            }
            console.log('load notes with filter tags', filterTags);
            const filters = { limit: 3, '#t': filterTags };
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
            notesCache[filterTags] = filteredNotes;
            setNotes(filteredNotes);
            setLastCreatedAt(
                filteredNotes[filteredNotes.length - 1]?.created_at || null,
            );
            setIsLoading(false);
        };

        loadNotes();
    }, [filterTags]);

    const LoadMoreMedia = async () => {
        if (!lastCreatedAt) {
            return;
        }

        const filters = {
            limit: 25,
            '#t': filterTags,
            until: lastCreatedAt - 5 * 60,
        };
        const notes = await fetchNotesWithProfiles(filters);

        const filteredNotes = notes.filter(note =>
            /(https?:\/\/[^\s]+(\.jpg|\.mp4|\.gif))/gi.test(note.content),
        );

        const postIds = filteredNotes.map(note => note.id);
        const votes = await getVotes(postIds);

        filteredNotes.forEach(note => {
            note.voteCount = votes[note.id] || 0;
        });
        if (notesCache[filterTags]) {
            console.log('adding more notes to notesCache.');
            notesCache[filterTags] = [
                ...notesCache[filterTags],
                ...filteredNotes,
            ];
        } else {
            notesCache[filterTags] = filteredNotes;
        }
        setNotes(notesCache[filterTags]);
        // setNotes((prevNotes) => [...prevNotes, ...filteredNotes]);
        setLastCreatedAt(
            filteredNotes[filteredNotes.length - 1]?.created_at || null,
        );
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
