// RelayService.js
import { SimplePool } from 'nostr-tools';
import NDK, { NDKEvent, profileFromEvent } from '@nostr-dev-kit/ndk';
import NDKCacheAdapterDexie from '@nostr-dev-kit/ndk-cache-dexie';
import { getProfilesFromPubkeys } from '../helpers/Profile/profileHelper';

export const RELAYS = [
    'wss://relay.primal.net',
    'wss://relay.damus.io',
    'wss://relay.nostr.band',
    'wss://relay.nostr.bg',
    'wss://nos.lol',
    'wss://nostr.mom',
];

let relayPool = null;
export let ndk = null;
export const getNdk = () => {
    if (!ndk) {
        const dexieAdapter = new NDKCacheAdapterDexie({
            dbName: 'memestr-local',
        });
        ndk = new NDK({
            cacheAdapter: dexieAdapter,
            explicitRelayUrls: RELAYS,
        });
    }
    return ndk;
};

export const getRelayPool = () => {
    if (!relayPool) {
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
    const profiles = await getProfilesFromPubkeys(pubKeys);
    const profileMap = {};
    for (const profile of profiles) {
        try {
            const ndkEvent = new NDKEvent(ndk, profile);
            const ndkProfile = await profileFromEvent(ndkEvent);
            profileMap[profile.pubkey] = {
                ...ndkProfile,
                pubkey: profile.pubkey,
            };
        } catch (error) {
            console.error('Profile parsing error', error);
        }
    }
    const notesWithProfiles = notes.map(note => ({
        ...note,
        profile: profileMap[note.pubkey] || null,
    }));

    return notesWithProfiles;
};
