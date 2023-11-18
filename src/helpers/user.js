import { finishEvent, nip04, nip19, relayInit } from 'nostr-tools';

export async function getUserFromName(term) {
    console.log('inside user Search');
    const relay = relayInit('wss://relay.nostr.band/');
    await relay.connect();
    const filters = {
        kinds: [0],
        search: term,
        limit: 6,
    };
    let users = await relay.list([filters]);
    console.log('event is', users);
    relay.close();
    return users;
}

export async function sendDM() {
    const relay = relayInit('wss://relay.damus.io');
    await relay.connect();
    console.log('Inside the send DM method');
    const storedData = localStorage.getItem('memestr');
    if (!storedData) {
        alert('Login required to upvote.');
        return;
    }
    let userPublicKey = JSON.parse(storedData).pubKey;
    let userPrivateKey = JSON.parse(storedData).privateKey;
    let sk = nip19.decode(userPrivateKey);
    let theirPublicKey =
        '17362e36ebe2a943a50c26272fe3c1017f5dc627622e8c245d4a56228115a0f9';
    let text = 'Hello dear';
    let content = await nip04.encrypt(sk.data, theirPublicKey, text);

    console.log('Content is ', content);
    let event = {
        pubkey: userPublicKey,
        created_at: Math.floor(Date.now() / 1000),
        kind: 4,
        tags: [['p', theirPublicKey]],
        content: content,
    };
    const signedEvent = finishEvent(event, sk.data);
    console.log('signed event is  ', signedEvent);
    console.log('Publishing event. should check DMS');
    let x = await relay.publish(signedEvent);
    console.log('event published. x is ', x);
}
