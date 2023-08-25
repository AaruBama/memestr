import styled from "styled-components";
import { getPublicKey, SimplePool, getEventHash, getSignature} from 'nostr-tools'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useEffect, useState } from "react";
import { nip19 } from "nostr-tools";
import {
    fetchInvoice,
    getProfileMetadata,
    getZapEndpoint,
} from "../ZapHelper";

import "./index.css"


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
    const utf8 = require('utf8');

    const [comment, setComment] = useState('');
    const [zapRequestData, setZapData] = useState(null)
    const captureComment = (event) => {
        setComment(event.target.value);
    };


    const saveComment = (event) => {
        event.preventDefault();
        let relays = ['wss://relay.damus.io', 'wss://relay.primal.net', "wss://nos.lol", "wss://nostr.bitcoiner.social"]
        const pool = new SimplePool();
        const storedData = localStorage.getItem('memestr')
        if (!storedData) {
            alert("Login required to upvote.")
            return
        }
        let uesrPublicKey = JSON.parse(storedData).pubKey
        let userPrivateKey = JSON.parse(storedData).privateKey
        let sk = nip19.decode(userPrivateKey)
        const postId = props.note.id;
        let commentEvent = {
            kind: 1,
            pubkey: uesrPublicKey,
            created_at: Math.floor(Date.now() / 1000),
            tags: [["e", postId], ["p", uesrPublicKey], ["alt", "reply"]],
            content: comment,
        }

        commentEvent.id = getEventHash(commentEvent)
        commentEvent.sig = getSignature(commentEvent, sk.data)
        let pubs = pool.publish(relays, commentEvent)
    }

    // const sendZaps = async (event) => {
    //     console.log("props is ", props)
    //     const pubKey = props.note.pubkey
    //     let userDetails = await getUserDetailsFromPublicKey(pubKey)
    //     console.log("userDetails is", userDetails)
    //     handleZapClick(props.note.id, pubKey, userDetails)
    // }

    const sendNewZaps = async  (event) => {
        const pubKey = props.note.pubkey
        let relays = ['wss://relay.damus.io', 'wss://relay.primal.net', "wss://nos.lol", "wss://nostr.bitcoiner.social"]
        const encodedNoteId = nip19.noteEncode(props.note.id)
        let userDetails = await getProfileMetadata(pubKey)
        let zapEndpoint = await getZapEndpoint(userDetails)
        let invoice = await fetchInvoice({
            "zapEndpoint": zapEndpoint,
            "amount": 10000,
            "comment": "You got zapped!",
            "authorId": pubKey,
            "noteId": encodedNoteId,
            "normalizedRelays": relays
        })
        let zapUrl = 'lightning:' + invoice
        window.location.assign(zapUrl)
    }

    const upvotePost = (event) => {
        const storedData = localStorage.getItem('memestr')
        if (!storedData) {
            alert("Login required to upvote.")
            return
        }
        let note = props.note
        const pool = new SimplePool()
        let relays = ['wss://relay.damus.io', 'wss://relay.primal.net']
        let privateKey = "nsec1mf54zukt27mr9ry5pv853qa470280scua4sqvfs3ftnxuayks8dqr3q9z2"
        let sk = nip19.decode(privateKey)
        let publicKey = getPublicKey(sk.data) // `pk` is a hex string
        let upvoteEvent = {
            kind: 7,
            pubkey: publicKey,
            created_at: Math.floor(Date.now() / 1000),
            tags: [["e", note.id], ["p", note.pubkey]],
            content: '+'
        }
        upvoteEvent.id = getEventHash(upvoteEvent)
        upvoteEvent.sig = getSignature(upvoteEvent, sk.data)
        let pubs = pool.publish(relays, upvoteEvent)
        event.currentTarget.disabled = true;
        return true
    }

    const mediaLinks = extractLinksFromText(props.note.content);
    const [votes, setVotes] = useState([])
    const postId = props.note.id
    const postOwnerPubKey = props.note.pubKey
    const relays = ['wss://relay.damus.io', 'wss://relay.primal.net']
    const getVotes = async () => {
        return 7;
        const relayPool = new SimplePool();
        const filters = {
            kinds: [7],
            "#e": [props.note.id]
        };
        let voteCount = await relayPool.list(relays, [filters])
        setVotes(voteCount); //Broken, calculates fine then updates to zero.
    }
    useEffect(() => { getVotes(); }, [])
    let title = removeHashtagsAndLinks(props.note.content)
    if (title.length === 0) {
        title = "No title"
    }
    return (
        <div>
            <div className={"title-post"}> {title} </div>
            <div className="grid-container" >
                <div className={"post"}>
                    <img className={"post-content"} src={mediaLinks[0]}/>
                </div>
            </div>
            <div>
                <Button onClick={upvotePost}>+</Button>
                <div className={"vote-count"}>{votes.length}</div>
                <div className="commentBox dib pd20">
                    <form onSubmit={saveComment}>
                        <input type="text" placeholder="Comment"
                            value={comment}
                            onChange={captureComment}
                            required />

                        <button type="submit">Comment</button>
                    </form>
                </div>
                <Button onClick={sendNewZaps}>Zap</Button>
            </div>
        </div>
    );
}

export default Posts;