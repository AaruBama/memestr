import React, { useEffect, useState } from "react";


import { SimplePool } from "nostr-tools";
import Feed from "../Feed";




const HashTagTool = (props) => {
  const [notes, setNotes] = useState([]);

  const relays = [
    "wss://relay.damus.io/",
    "wss://offchain.pub/",
    "wss://nos.lol/",
    "wss://relay.nostr.wirednet.jp/",
    "wss://nostr.wine/",
  ];

  const LoadMedia = async () => {
    const relayPool = new SimplePool();
    const filters = {
      limit: 50,
    };
    filters["#t"] = ['memes','meme','funny','memestr'];


    console.log("filters", filters);
    let notes = await relayPool.list(relays, [filters]);
    console.log("notes are = ", notes);
    setNotes(notes);
    const kind0Filters = {
      kinds: [0],
      authors: notes.map((note) => {
        return note.pubkey;
      }),
    };
    console.log("kind0Filters", kind0Filters);
    const kind0Result = await relayPool.list(relays, [kind0Filters]);
    // setKind0List(kind0Result);
    //setMuteList(muted);
    // console.log("muteList", muteList);
  };

  useEffect(() => { LoadMedia(); }, [])

  return <Feed notes={notes} />
};



export default HashTagTool;
