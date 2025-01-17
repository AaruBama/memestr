// RelayService.js
import { SimplePool } from 'nostr-tools';

const RELAYS = [
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
