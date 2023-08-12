import React, { useEffect, useState } from 'react';
import { getPublicKey, SimplePool} from 'nostr-tools'
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
  // const name = "GHOST@nostrplebs.com"
  // let xx=await nip05.queryProfile(name)
  let profile = await relayPool.list(relays, [filters])
  let content = profile[0].content
  console.log("user profile is ", content)
  
  content = JSON.parse(content)
  console.log("jsonify content is", content)
  let display_name = content.display_name 
  let picture = content.picture
  console.log("display name and pic is ", display_name, picture)
  return content
  
}

export default getUserDetailsFromPrivateKey;