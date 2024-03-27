import { finishEvent, nip04, nip19, relayInit, SimplePool } from 'nostr-tools';

export async function getUserFromName(term) {
    console.log('inside user Search');
    const pool = new SimplePool();

    // const relay = relayInit('wss://relay.nostr.band/');
    let relays = ['wss://relay.nostr.band/', 'wss://saltivka.org'];

    // await relay.connect();
    const filters = {
        kinds: [0],
        search: term,
        limit: 5,
    };
    let users = await pool.list(relays, [filters]);
    if (pool) {
        pool.close(relays);
    }
    return users;
}

export async function sendDM(pubKeys, text) {
    console.log('Inside the send DM method');
    const storedData = localStorage.getItem('memestr');
    if (!storedData) {
        alert('Login required to upvote.');
        return;
    }
    const userData = JSON.parse(storedData);
    let userPublicKey = JSON.parse(storedData).pubKey;
    let userPrivateKey = JSON.parse(storedData).privateKey;

    for (const key of pubKeys) {
        const relay = relayInit('wss://relay.damus.io');
        await relay.connect();
        let theirPublicKey = key;
        let content;
        let sk;
        if (userData.privateKey) {
            sk = nip19.decode(userPrivateKey);
            content = await nip04.encrypt(sk.data, theirPublicKey, text);
        } else if (window.nostr) {
            content = await window.nostr.nip04.encrypt(theirPublicKey, text);
        }
        let event = {
            pubkey: userPublicKey,
            created_at: Math.floor(Date.now() / 1000),
            kind: 4,
            tags: [['p', theirPublicKey]],
            content: content,
        };
        let signedEvent;

        if (userData.privateKey) {
            sk = nip19.decode(userPrivateKey);
            signedEvent = finishEvent(event, sk.data);
        } else if (window.nostr) {
            signedEvent = await window.nostr.signEvent(event);
        }
        console.log('Publishing event. should check DMS');
        let x = await relay.publish(signedEvent);
        console.log('x is ', x);
    }
}
