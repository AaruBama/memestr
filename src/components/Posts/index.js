import styled from "styled-components";
// import upvotePost from "../Vote"
import { generatePrivateKey, relayInit, getPublicKey, SimplePool, getEventHash, getSignature, nip25 } from 'nostr-tools'
import { useEffect, useState } from "react";



function extractLinksFromText(text) {
    const linkRegex = /(https?:\/\/[^\s]+)/g;
    const jpgRegex = /\.(jpg|jpeg)$/i;
    const mp4Regex = /\.mp4$/i;

    const links = text.match(linkRegex);
    if (!links) return [];

    const filteredLinks = links.filter((link) => jpgRegex.test(link) || mp4Regex.test(link));
    return filteredLinks;
}


const removeHashtagsAndLinks = (text) => {
    // Remove hashtags
    const withoutHashtags = text.replace(/#\w+/g, '');

    // Remove links
    const withoutLinks = withoutHashtags.replace(/(https?:\/\/[^\s]+)/g, '');

    return withoutLinks;
};


const Button = styled.button`
  background-color: white;
  color: black;
  font-size: 20px;
  text-align: center;
  padding: .25em 1em;
  margin-right: 2%;
  margin-bottom: 3px;
  display: inline-block;

  &:disabled {
    color: grey;
    opacity: 0.7;
    cursor: default;
  }
`;


function Posts(props) {

    function upvotePost() {
        let note = props.note
        console.log("Inside the vote component")
        console.log("Value of note is ", note)
        const pool = new SimplePool()
        let relays = ['wss://relay.damus.io', 'wss://relay.primal.net']
        let privateKey = generatePrivateKey() // `sk` is a hex string
        let publicKey = getPublicKey(privateKey) // `pk` is a hex string
        let event = {
            kind: 7,
            pubkey: publicKey,
            created_at: Math.floor(Date.now() / 1000),
            tags: [["e", note.id], ["p", note.pubkey]],
            content: '+'
        }
        event.id = getEventHash(event)
        event.sig = getSignature(event, privateKey)
        let pubs = pool.publish(relays, event)

    }

    const mediaLinks = extractLinksFromText(props.note.content);
    const [votes, setVotes] = useState([])
    const relays = ['wss://relay.damus.io', 'wss://relay.primal.net']
    const getVotes = async () => {
        const relayPool = new SimplePool();
        const filters = {
            kinds: [7],
            "#e": [props.note.id]
        };
        let voteCount = await relayPool.list(relays, [filters])
        setVotes(voteCount);
    }
    useEffect(() => { getVotes(); }, [])
    console.log("votes count is ", votes.length, " for note id ", props.note.id)
    return (
        <div style={{
            display: "flex", flexDirection: 'column', borderBottom: '5px solid grey', paddingBottom: '15px', paddingTop: '10px', marginBottom: '15px', alignContent: 'center', justifyContent
                : 'center'
        }}>
            <b style={{ color: 'white', marginBottom: '5px', marginLeft: '8px' }}>{removeHashtagsAndLinks(props.note.content)}</b>
            <img src={mediaLinks[0]} style={{ maxWidth: '100%', height: 'auto' }} />
            <div>
                <Button onClick={upvotePost}>+</Button>
                <div style={{ color: 'white', display: "inline-block" }}>{votes.length}</div>
            </div>
        </div>
    );
}

export default Posts;
