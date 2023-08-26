import React, { useEffect, useState } from "react";


import { SimplePool } from "nostr-tools";
import Feed from "../Feed";




const HashTagTool = (props) => {
  console.log("hey")
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const LoadMedia = async () => {
      const relayPool = new SimplePool();
      const filters = {
        limit: 10,
      };

      const relays = [
        "wss://relay.damus.io/",
        "wss://offchain.pub/",
        "wss://nos.lol/",
        "wss://relay.nostr.wirednet.jp/",
        "wss://nostr.wine/",
      ];
      filters["#t"] = ['memes','meme','funny','memestr'];


      let notes = await relayPool.list(relays, [filters]);
      setNotes(notes);
    };
    LoadMedia();
    }, []);

  return <Feed notes={notes} />
};



export default HashTagTool;
