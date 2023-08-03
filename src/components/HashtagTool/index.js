import React, { useEffect, useState } from "react";


import { SimplePool } from "nostr-tools";

function extractLinksFromText(text) {
  const linkRegex = /(https?:\/\/[^\s]+)/g;
  const jpgRegex = /\.(jpg|jpeg)$/i;
  const mp4Regex = /\.mp4$/i;

  const links = text.match(linkRegex);
  if (!links) return [];

  const filteredLinks = links.filter((link) => jpgRegex.test(link) || mp4Regex.test(link));
  return filteredLinks;
}

const containsJpgOrMp4Link = (text) => {
  const linkRegex = /(https?:\/\/[^\s]+(\.jpg|\.mp4|\.gif))/gi;
  return linkRegex.test(text);
};

const removeHashtagsAndLinks = (text) => {
  // Remove hashtags
  const withoutHashtags = text.replace(/#\w+/g, '');

  // Remove links
  const withoutLinks = withoutHashtags.replace(/(https?:\/\/[^\s]+)/g, '');

  return withoutLinks;
};


const HashTagTool = (props) => {
  const [hashtag, setHashtag] = useState(null);
  const [notes, setNotes] = useState([]);
  // const [kind0List, setKind0List] = useState([]);

  const relays = [
    "wss://relay.damus.io/",
    "wss://offchain.pub/",
    "wss://nos.lol/",
    "wss://relay.nostr.wirednet.jp/",
    "wss://nostr.wine/",
  ];

  const handleChange = (event, setter) => {
    setter(event.target.value);
  };

  const LoadMoreMedia = () => {
    //logic to load more posts with offset
  }

  // const inputs = [
  //   {
  //     label: "HashTag",
  //     handler: (event) => {
  //       handleChange(event, setHashtag);
  //     },
  //     variable: hashtag,
  //   },
  // ];

  const LoadMedia = async () => {
    const relayPool = new SimplePool();
    const filters = {
      limit: 100,
    };
    filters["#t"] = ['meme', 'memes', 'funny', 'memestr'];
    

    console.log("filters", filters);
    let notes = await relayPool.list(relays, [filters]);
    console.log("muted", notes);
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

  useEffect(() => {LoadMedia();}, [])

  return (
    <div className="matrix-input-container">
      <div className="results">
        {notes.filter((note) => {return containsJpgOrMp4Link(note.content)}).map((note) => {
          //console.log("note", note);,
          const mediaLinks = extractLinksFromText(note.content);

          return (
            <div style={{display: "flex", flexDirection:'column', borderBottom : '5px solid grey', paddingBottom : '15px', paddingTop : '10px', marginBottom: '15px', alignContent: 'center', justifyContent
            : 'center'}}>
              {console.log("--" , note.content)}
              <b style={{color:'white', marginBottom:'5px', marginLeft: '8px'}}>{removeHashtagsAndLinks(note.content)}</b>
            <img src={mediaLinks[0]} style={{maxWidth: '100%', height: 'auto'}}/>  </div>
          );
        })}
        <button onClick={LoadMoreMedia()}> See More</button>
      </div>

    </div>
  );
};



export default HashTagTool;
