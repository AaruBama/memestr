import { getPublicKey } from 'nostr-tools';
import { nip19 } from 'nostr-tools';
import { getNdk, getRelayPool, RELAYS } from '../../services/RelayService';
import { NDKEvent, profileFromEvent } from '@nostr-dev-kit/ndk';

const ndk = getNdk();

export async function getProfileFromPublicKey(pubKey) {
    const fetchedProfile = await ndk.cacheAdapter.fetchProfile(pubKey);
    if (fetchedProfile) {
        console.log('returning profile from cache. Good Job!!!');
        return fetchedProfile;
    }
    console.log(
        'Fetching profile from relays. We should be saving it now in cache',
    );
    const relayPool = getRelayPool();
    const filters = {
        kinds: [0],
        authors: [pubKey],
    };
    let profile = await relayPool.list(RELAYS, [filters]);
    console.log('userprofile is ', profile[0]);
    const ndkEvent = new NDKEvent(ndk, profile[0]);
    const ndkProfile = await profileFromEvent(ndkEvent);
    await ndk.cacheAdapter.saveProfile(pubKey, ndkProfile);
    console.log('profile saved to cache is ->', ndkProfile);
    return ndkProfile;
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
