import React, { useEffect, useState } from 'react';
import { getPublicKey, SimplePool } from 'nostr-tools'
import { nip19 } from "nostr-tools";



async function getUserDetailsFromPrivateKey(skk) {
  let relays = ['wss://relay.damus.io', 'wss://relay.primal.net']
  const relayPool = new SimplePool();
  let sk = nip19.decode(skk)
  const pubKey = getPublicKey(sk.data)
  const filters = {
    kinds: [0],
    "authors": [pubKey]
  };
  let profile = await relayPool.list(relays, [filters])
  console.log("profile object is ", profile)
  let content = profile[0].content

  content = JSON.parse(content)
  return content


}

export default getUserDetailsFromPrivateKey;