import React, { useEffect, useState } from "react";


import { SimplePool } from "nostr-tools";
import Feed from "../Feed";

const HashTagTool = (props) => {
  const [notes, setNotes] = useState([]);

  const containsJpgOrMp4Link = (text) => {
    const linkRegex = /(https?:\/\/[^\s]+(\.jpg|\.mp4|\.gif))/gi;
    const clearLink =  linkRegex.test(text);
    return clearLink
  };


  useEffect(() => {
    const LoadMedia = async () => {
      const relayPool = new SimplePool();
      const filters = {
        limit: 30,
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
      notes = notes.filter((note) => { return containsJpgOrMp4Link(note.content) })
      setNotes(notes);
      relayPool.close(relays)
    };
    LoadMedia();
    }, []);



  const LoadMoreMedia = async (since) => {
    //logic to load more posts with offset
    const relayPool = new SimplePool();
    const filters = {
      limit: 20,
    };

    const relays = [
      "wss://relay.damus.io/",
      "wss://offchain.pub/",
      "wss://nos.lol/",
      "wss://relay.nostr.wirednet.jp/",
      "wss://nostr.wine/",
    ];
    filters["#t"] = ['memes', 'meme', 'funny', 'memestr'];
    let lastPostSince = (notes[notes.length - 1].created_at)
    filters["until"] =  lastPostSince - 1000


    let newNotes = await relayPool.list(relays, [filters]);
    newNotes = newNotes.filter((note) => { return containsJpgOrMp4Link(note.content) })
    setNotes(notes => [...notes, ...newNotes]);
    relayPool.close(relays)
  }

  return (
      <>
        {/*{testMethod()}*/}
      <Feed notes={notes} />
        <button onClick={() => {LoadMoreMedia();}}
                class={"bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"}>
                Load More.
        </button>
      </>)
};



export default HashTagTool;
