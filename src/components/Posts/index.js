import {getEventHash, getPublicKey, getSignature, nip19, SimplePool} from 'nostr-tools'
import {fetchInvoice, getProfileMetadata, getZapEndpoint,} from "../ZapHelper";
import {Link} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import "./index.css"

import Button from 'react-bootstrap/Button';
import {ReactComponent as ShakaLogo} from "../../Icons/shaka.svg"


function extractLinksFromText(text) {
    const linkRegex = /(https?:\/\/[^\s]+)/g;
    const jpgRegex = /\.(jpg|jpeg)$/i;
    const mp4Regex = /\.mp4$/i;

    const links = text.match(linkRegex);
    if (!links) return [];

    return links.filter((link) => jpgRegex.test(link) || mp4Regex.test(link));
}


const removeHashtagsAndLinks = (text) => {
    // Remove hashtags
    const withoutHashtags = text.replace(/#\w+/g, '');

    // Remove links
    return withoutHashtags.replace(/(https?:\/\/[^\s]+)/g, '');
};

export async function upvotePost(noteId, OpPubKey) {
    const storedData = localStorage.getItem('memestr')
    if (!storedData) {
        alert("Login required to upvote.")
        return
    }
    const pool = new SimplePool()
    let relays = ['wss://relay.damus.io', 'wss://relay.primal.net']
    let privateKey = "nsec1mf54zukt27mr9ry5pv853qa470280scua4sqvfs3ftnxuayks8dqr3q9z2"
    let sk = nip19.decode(privateKey)
    let publicKey = getPublicKey(sk.data) // `pk` is a hex string
    let upvoteEvent = {
        kind: 7,
        pubkey: publicKey,
        created_at: Math.floor(Date.now() / 1000),
        tags: [["e", noteId], ["p", OpPubKey]],
        content: '+'
    }
    upvoteEvent.id = getEventHash(upvoteEvent)
    upvoteEvent.sig = getSignature(upvoteEvent, sk.data)
    pool.publish(relays, upvoteEvent)
    if (pool) {
        pool.close(relays);
        return true
    }
    return false
}

export const sendNewZaps = async  (postId, opPubKey) => {
    const pubKey = opPubKey
    let relays = ['wss://relay.damus.io', 'wss://relay.primal.net', "wss://nos.lol", "wss://nostr.bitcoiner.social"]
    const encodedNoteId = nip19.noteEncode(postId)
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

export const saveComment = (postId, comment) => {
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
    let commentEvent = {
        kind: 1,
        pubkey: uesrPublicKey,
        created_at: Math.floor(Date.now() / 1000),
        tags: [["e", postId], ["p", uesrPublicKey], ["alt", "reply"]],
        content: comment,
    }

    commentEvent.id = getEventHash(commentEvent)
    commentEvent.sig = getSignature(commentEvent, sk.data)
    pool.publish(relays, commentEvent)
    pool.close(relays);
}

function Posts(props) {

    const mediaLinks = extractLinksFromText(props.note.content);
    const [votes, setVotes] = useState([])
    const [votesCount, setVotesCount] = useState(0)

    useEffect(() => {
        const getVotes = async (event) => {
            const relayPool = new SimplePool();
            const relays = ['wss://relay.damus.io', "wss://nos.lol"]
            const filters = {
                kinds: [7],
                "#e": [props.note.id]
            };
            let voteCount = await relayPool.list(relays, [filters])
            if (voteCount.length > votesCount) {
                setVotesCount(voteCount.length);
                setVotes(voteCount)//quick hack to store vote count
            }
            relayPool.close(relays);
        };
        getVotes();
    }, [props.note.id, votes, votesCount]);

    let title = removeHashtagsAndLinks(props.note.content).trimLeft().trimRight()
    if (title.length === 0) {
        title = "Title"
    }
    const imageLink = mediaLinks[0]
    let voteCount = votes.length
    // var shaka = require("../../Icons/shaka.svg")

    function voteIncrement() {
        const storedData = localStorage.getItem('memestr')

        if (storedData) {
            console.log("increment vote count from ", votesCount)
            setVotesCount(voteCount+1);
        }
    }

    function isTodisabled() {
        let pubKeySet = new Set(votes.map(function (vote) { return vote.pubkey; }));
        const storedData = localStorage.getItem('memestr')
        if (!storedData) {
            return false;
        }
        let userPublicKey = JSON.parse(storedData).pubKey
        if (pubKeySet.has(userPublicKey)) {
            return true
        }
        return false
    }

    return (
        <div className={"post-container"}>
            <div className={"title-post"}> {title} </div>
                <div className="grid-container" >
                    <div className={"post"}>
                        <Link to={`/post/${props.note.id}?title=${title}&imageLink=${imageLink}&voteCount=${voteCount}&OpPubKey=${props.note.pubkey}`} className="post">
                            <img alt={""} className={"post-content"} src={imageLink}/>
                        </Link>
                    </div>
                </div>
            <div>
                {/*<Button variant="light" size={"lg"} onClick={() => {upvotePost(props.note.id,props.note.pubkey); voteIncrement();}} disabled={isTodisabled()}>*/}
                {/*    + {votes.length}*/}
                {/*</Button>{' '}*/}
                <button className={"upvote-button"} onClick={() => {upvotePost(props.note.id,props.note.pubkey); voteIncrement();}} disabled={isTodisabled()}>
                    <ShakaLogo /> {votes.length}
                </button>
                    {/*<Button variant="light" size={"lg"} onClick={() => sendNewZaps(props.note.id,props.note.pubkey)}>*/}
                {/*    Zap*/}
                {/*</Button>{' '}*/}
                <button className={"zap-button"} onClick={() => sendNewZaps(props.note.id,props.note.pubkey)}>
                    Zap
                </button>
                <Link to={`/post/${props.note.id}?title=${title}&imageLink=${imageLink}&voteCount=${votes.length}&OpPubKey=${props.note.pubkey}`} className="post">
                    <Button variant="light" size={"lg"}>Comments</Button>
                </Link>
            </div>
        </div>
        // </Link>
    );
}

export default Posts;
