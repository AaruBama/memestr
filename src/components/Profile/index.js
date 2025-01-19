import { getPublicKey } from 'nostr-tools';
import { nip19 } from 'nostr-tools';
import { getRelayPool, RELAYS } from '../../services/RelayService';

export async function getProfileFromPublicKey(pubKey) {
    const relayPool = getRelayPool();
    const filters = {
        kinds: [0],
        authors: [pubKey],
    };
    let profile = await relayPool.list(RELAYS, [filters]);

    console.log('profile is ', profile);
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
    const relayPool = getRelayPool();
    const filters = {
        kinds: [0],
        authors: [pubKey],
    };

    let profile = await relayPool.list(RELAYS, [filters]);
    if (profile.length > 0) {
        console.log('profile is ', profile);
        let content = profile[0].content;
        content = JSON.parse(content);
        return content;
    }
};

export default getUserDetailsFromPrivateKey;
