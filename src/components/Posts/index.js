import {getEventHash, getPublicKey, getSignature, nip19, SimplePool} from 'nostr-tools'
import {fetchInvoice, getProfileMetadata, getZapEndpoint,} from "../ZapHelper";
import {Link} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import "./index.css"
import ZapModal from "../ZapHelper/ZapModal";

function extractLinksFromText(text) {
    const linkRegex = /(https?:\/\/[^\s]+)/g;
    const jpgRegex = /\.(jpg|jpeg)$/i;
    const mp4Regex = /\.mp4$/i;
    const gifRegex = /\.gif$/i;

    const links = text.match(linkRegex);
    if (!links) return [];

    return links.filter((link) => jpgRegex.test(link) || mp4Regex.test(link) || gifRegex.test(link));
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

export const sendNewZaps = async  (postId, opPubKey, sats = 11) => {
    console.log("Sending zaps")
    const pubKey = opPubKey
    let relays = ['wss://relay.damus.io', 'wss://relay.primal.net', "wss://nos.lol", "wss://nostr.bitcoiner.social"]
    const encodedNoteId = nip19.noteEncode(postId)
    let userDetails = await getProfileMetadata(pubKey)
    let zapEndpoint = await getZapEndpoint(userDetails)
    let invoice = await fetchInvoice({
        "zapEndpoint": zapEndpoint,
        "amount": sats * 1000,
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
    // const [votes, setVotes] = useState([])
    const [votesCount, setVotesCount] = useState(0)
    const [fillLike, setFillLike] = useState(false)
    const [fillZap, setFillZap] = useState(false)

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [processedValue, setProcessedValue] = useState(null);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const handleConfirm = (value) => {
        // Process the value internally here or update state as needed
        const postId = props.note.id;
        let opPubKey = props.note.pubkey
        console.log(`Processing value: ${value}`);

        sendNewZaps(postId, opPubKey, value)
        setProcessedValue(value);
    };

    useEffect(() => {
        setVotesCount(props.note.voteCount)
    }, [props.note.voteCount])

    let title = removeHashtagsAndLinks(props.note.content).trimLeft().trimRight()
    if (title.length === 0) {
        title = "Title"
    }
    const imageLink = mediaLinks[0]

    function voteIncrement() {
        const storedData = localStorage.getItem('memestr')
        if (storedData) {
            setVotesCount(votesCount+1);
        }
    }

    function fillColor() {
        const storedData = localStorage.getItem('memestr')
        if (storedData) {
            setFillLike(true);
        }
    }

    function isTodisabled() {
        // let pubKeySet = new Set(votes.map(function (vote) { return vote.pubkey; }));
        // const storedData = localStorage.getItem('memestr')
        // if (!storedData) {
        //     return false;
        // }
        // let userPublicKey = JSON.parse(storedData).pubKey
        // if (pubKeySet.has(userPublicKey)) {
        //     return true
        // }
        // return false
    }

    function handleZapButton() {
        const storedData = localStorage.getItem('memestr');
        if (!storedData) {
            alert('Login to send zaps.')
            return false
        }
        openModal();
        setFillZap(true);
    }

    return (
            <div class="flex flex-col bg-black divide-y mt-2 overflow-scroll">

                <div class="bg-gray-200 rounded-lg my-2 shadow-sm shadow-gray-400">
                    <div className="px-2 pt-2 text-black font-medium">
                        {title}
                    </div>
                    <div class="p-2 max-w-fit">
                        <Link to={`/post/${props.note.id}?title=${title}&imageLink=${imageLink}&voteCount=${votesCount}&OpPubKey=${props.note.pubkey}`}>
                            <img alt={""} src={imageLink}/>
                        </Link>
                    </div>


                    <div class="flex align-items-center gap-x-3 bg-gray-200 border-b-4 border-white pl-2 mt-2 pb-2 ">

                        {/*Comments button*/}

                        <Link to={`/post/${props.note.id}?title=${title}&imageLink=${imageLink}&voteCount=${votesCount}&OpPubKey=${props.note.pubkey}`}>
                            <button variant="light" size={"lg"}>
                                <svg class="h-8 w-8"
                                     xmlns="http://www.w3.org/2000/svg"
                                     x="0"
                                     y="0"
                                     fill="none"
                                     stroke="currentColor"
                                     strokeLinecap="round"
                                     strokeLinejoin="round"
                                     strokeWidth="2"
                                     viewBox="0 0 24 30"
                                >
                                    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                                </svg>
                            </button>
                        </Link>


                        <button className="flex align-items-center"
                                onClick={() => {
                                    handleZapButton();
                                }
                                }>
                            <svg class={`${fillZap && "fill-current text-yellow-300 stroke-black" } h-8 w-8`}
                                xmlns="http://www.w3.org/2000/svg"
                                x="0"
                                y="0"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 30"
                            >
                                <path d="M13 2L3 14 12 14 11 22 21 10 12 10 13 2z"></path></svg>
                            {processedValue && <p>{processedValue}</p>}

                            <ZapModal
                                isOpenm={isModalOpen}
                                onConfirm={handleConfirm}
                            />
                        </button>

                        <button className="flex"
                                onClick={() => {
                                    upvotePost(props.note.id,props.note.pubkey);
                                    voteIncrement();
                                    fillColor();
                                }} disabled={isTodisabled()}>
                            <svg className={`${
                                fillLike && "fill-current text-red-600"
                            } h-8 w-8`}
                                 xmlns="http://www.w3.org/2000/svg"
                                 x="0"
                                 y="0"
                                 fill="none"
                                 stroke="currentColor"
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 strokeWidth="2"
                                 viewBox="0 0 24 30"
                            >
                                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                            </svg>{votesCount}
                        </button>


                        {/*Share Button*/}
                        {/*<button>*/}
                        {/*    <svg*/}
                        {/*        xmlns="http://www.w3.org/2000/svg"*/}
                        {/*        x="0"*/}
                        {/*        y="0"*/}
                        {/*        fill="none"*/}
                        {/*        stroke="currentColor"*/}
                        {/*        strokeLinecap="round"*/}
                        {/*        strokeLinejoin="round"*/}
                        {/*        strokeWidth="2"*/}
                        {/*        className="feather feather-log-out h-8 w-8 -rotate-90"*/}
                        {/*        viewBox="0 0 24 30"*/}
                        {/*    >*/}
                        {/*        <path d="M10 22H5a2 2 0 01-2-2V4a2 2 0 012-2h5"></path>*/}
                        {/*        <path d="M17 16L21 12 17 8"></path>*/}
                        {/*        <path d="M21 12L9 12"></path>*/}
                        {/*    </svg>*/}
                        {/*</button>*/}

                    </div>
                </div>
            </div>
    );
}

export default Posts;
