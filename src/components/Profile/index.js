import { getPublicKey, SimplePool } from 'nostr-tools';
import { nip19 } from 'nostr-tools';

export async function getProfileFromPublicKey(pubKey) {
    let relays = [
        'wss://relay.damus.io',
        'wss://relay.primal.net',
        'wss://relay.snort.social',
        'wss://relay.hllo.live',
    ];
    const relayPool = new SimplePool();
    const filters = {
        kinds: [0],
        authors: [pubKey],
    };
    let profile = await relayPool.list(relays, [filters]);
    relayPool.close(relays);

    return profile[0];
}

async function getUserDetailsFromPrivateKey(skk) {
    let sk = nip19.decode(skk).data;
    const pubKey = getPublicKey(sk);

    let profile = await getProfileFromPublicKey(pubKey);

    let content = profile.content;
    content = JSON.parse(content);
    return content;
}

export const getUserDetailsFromPublicKey = async pubKey => {
    let relays = [
        'wss://relay.nostr.band',
        'wss://purplepag.es',
        'wss://relay.damus.io',
    ];
    const relayPool = new SimplePool();
    const filters = {
        kinds: [0],
        authors: [pubKey],
    };

    let profile = await relayPool.list(relays, [filters]);
    if (profile.length > 0) {
        let content = profile[0].content;
        content = JSON.parse(content);
        return content;
    }
    relayPool.close(relays);
};

export default getUserDetailsFromPrivateKey;
