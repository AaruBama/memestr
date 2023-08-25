import React, { useEffect, useState } from 'react';
import { getPublicKey, SimplePool } from 'nostr-tools'
import { nip19 } from "nostr-tools";



async function getUserDetailsFromPrivateKey(skk) {
  let relays = [
    'wss://relay.damus.io',
    'wss://relay.primal.net',
    "wss://nos.lol",
    "wss://nostr.bitcoiner.social",
    "wss://nostr.pleb.network",
    "wss://relay.f7z.io",
    "wss://relay.nostr.bg",
    "wss://relay.nostriches.org",
    "wss://relay.snort.social"
  ]
  const relayPool = new SimplePool();
  let sk = nip19.decode(skk)
  const pubKey = getPublicKey(sk.data)
  const filters = {
    kinds: [0],
    "authors": [pubKey]
  };
  let profile = await relayPool.list(relays, [filters])
  if (profile.length > 0) {
    let content = profile[0].content

    content = JSON.parse(content)
    return content
  }
}


  export async function getUserDetailsFromPublicKey(pubKey) {
    let relays = [
      "wss://relay.nostr.band",
      "wss://purplepag.es",
      "wss://relay.damus.io",
      "wss://nostr.wine",
    ]
    const relayPool = new SimplePool();
    const filters = {
      kinds: [0],
      "authors": [pubKey]
    };
    try {
      let profile = await relayPool.list(relays, [filters])
      if (profile.length > 0) {
        let content = profile[0].content

        content = JSON.parse(content)
        return content
      }
    }  catch (error) {
      throw new Error("failed to fetch user profile :(");
    } finally {
      relayPool.close(relays);
    }
  }


  export default getUserDetailsFromPrivateKey;