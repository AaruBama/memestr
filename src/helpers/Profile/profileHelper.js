import { getRelayPool, RELAYS } from '../../services/RelayService';

export async function getProfilesFromPubkeys(pubKeys) {
    const relayPool = getRelayPool();
    const profileFilters = {
        kinds: [0], // Kind 0 is user profile in Nostr
        authors: pubKeys,
    };

    return await relayPool.list(RELAYS, [profileFilters]);
}
