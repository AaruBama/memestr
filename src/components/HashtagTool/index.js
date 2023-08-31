import React, { useEffect, useState } from "react";


import { SimplePool } from "nostr-tools";
import Feed from "../Feed";

const HashTagTool = (props) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const LoadMedia = async () => {
      const relayPool = new SimplePool();
      const filters = {
        limit: 50,
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
      relayPool.close(relays)
    };
    LoadMedia();
    }, []);

  return <Feed notes={notes} />
};



export default HashTagTool;
