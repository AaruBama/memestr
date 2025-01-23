// RelayService.js
import { SimplePool } from 'nostr-tools';

export const RELAYS = [
    'wss://relay.primal.net',
    'wss://relay.damus.io',
    'wss://relay.nostr.band',
    'wss://relay.nostr.bg',
    'wss://nos.lol',
    'wss://nostr.mom',
];

let relayPool = null;

export const getRelayPool = () => {
    if (!relayPool) {
        console.log('Relay pool not found, starting relay Pool.');
        relayPool = new SimplePool();
    }
    return relayPool;
};

export const closeRelayPool = () => {
    if (relayPool) {
        relayPool.close(RELAYS);
        relayPool = null;
    }
};

export const getVotes = async postIds => {
    const voteFilters = {
        kinds: [7],
        '#e': postIds,
    };
    const relayPool = getRelayPool();
    const votes = await relayPool.list(RELAYS, [voteFilters]);
    const groupedVotes = {};

    votes.forEach(vote => {
        const postId = vote.tags.find(tag => tag[0] === 'e')?.[1];
        if (postId) {
            groupedVotes[postId] = (groupedVotes[postId] || 0) + 1;
        }
    });

    return groupedVotes;
};

export const fetchNotes = async filters => {
    const relayPool = getRelayPool();
    const notes = await relayPool.list(RELAYS, [filters]);
    return notes;
};

export const fetchNotesWithProfiles = async filters => {
    const relayPool = getRelayPool();

    // Fetch notes first
    const notes = await relayPool.list(RELAYS, [filters]);

    // Extract unique public keys from notes
    const pubKeys = [...new Set(notes.map(note => note.pubkey))];

    // Construct profile filters
    const profileFilters = {
        kinds: [0], // Kind 0 is user profile in Nostr
        authors: pubKeys,
    };

    // Fetch profiles in a single query
    const profiles = await relayPool.list(RELAYS, [profileFilters]);

    // Create a map of pubkey to profile for efficient lookup
    const profileMap = profiles.reduce((acc, profile) => {
        try {
            const parsedContent = JSON.parse(profile.content);
            acc[profile.pubkey] = {
                ...parsedContent,
                pubkey: profile.pubkey,
            };
        } catch (error) {
            console.error('Profile parsing error', error);
        }
        return acc;
    }, {});

    const notesWithProfiles = notes.map(note => ({
        ...note,
        profile: profileMap[note.pubkey] || null,
    }));

    return notesWithProfiles;
};
