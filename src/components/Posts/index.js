import { getEventHash, getSignature, nip19, SimplePool } from 'nostr-tools';
import { fetchInvoice, getProfileMetadata, getZapEndpoint } from '../ZapHelper';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import ZapModal from '../ZapHelper/ZapModal';
import { ShareModal } from '../Share/modal';
import { ReactComponent as ShareButtonSvg } from '../../Icons/ShareButtonSvg.svg';
import { getCommentCount } from '../HashtagTool';

export function extractLinksFromText(text) {
    const linkRegex = /(https?:\/\/[^\s]+)/g;
    const jpgRegex = /\.(jpg|jpeg)$/i;
    const mp4Regex = /\.mp4$/i;
    const gifRegex = /\.gif$/i;

    const links = text.match(linkRegex);
    if (!links) {
        return [];
    }

    return links
        .map(link => {
            try {
                const url = new URL(link);
                // Remove the fragment identifier
                url.hash = '';
                return url.toString();
            } catch (error) {
                // Handle invalid URLs
                console.error(`Error parsing URL: ${link}`);
                return null;
            }
        })
        .filter(link => link !== null)
        .filter(
            link =>
                jpgRegex.test(link) ||
                mp4Regex.test(link) ||
                gifRegex.test(link),
        );
    // return links.filter(
    //     link =>
    //         jpgRegex.test(link) || mp4Regex.test(link) || gifRegex.test(link) || link.includes("#"),
    // );
}

export const removeHashtagsAndLinks = text => {
    // Remove hashtags
    // const withoutHashtags = text.replace(/#\w+/g, '');

    // Remove links
    return text.replace(/(https?:\/\/[^\s]+)/g, '');
};

export async function upvotePost(noteId) {
    const storedData = localStorage.getItem('memestr');
    if (!storedData) {
        alert('Login required to upvote.');
        return;
    }
    let uesrPublicKey = JSON.parse(storedData).pubKey;
    let userPrivateKey = JSON.parse(storedData).privateKey;
    let sk = nip19.decode(userPrivateKey);

    const pool = new SimplePool();
    let relays = ['wss://relay.damus.io', 'wss://relay.primal.net'];

    let upvoteEvent = {
        kind: 7,
        pubkey: uesrPublicKey,
        created_at: Math.floor(Date.now() / 1000),
        tags: [
            ['e', noteId],
            ['p', uesrPublicKey],
        ],
        content: '+',
    };
    upvoteEvent.id = getEventHash(upvoteEvent);
    upvoteEvent.sig = getSignature(upvoteEvent, sk.data);
    let c = pool.publish(relays, upvoteEvent);
    console.log('c is ', c);
    if (pool) {
        pool.close(relays);
        return true;
    }
    return false;
}

export const sendNewZaps = async (postId, opPubKey, sats = 11) => {
    console.log('Sending zaps');
    const pubKey = opPubKey;
    let relays = [
        'wss://relay.damus.io',
        'wss://relay.primal.net',
        'wss://nos.lol',
        'wss://nostr.bitcoiner.social',
    ];
    const encodedNoteId = nip19.noteEncode(postId);
    let userDetails = await getProfileMetadata(pubKey);
    let zapEndpoint = await getZapEndpoint(userDetails);
    let invoice = await fetchInvoice({
        zapEndpoint: zapEndpoint,
        amount: sats * 1000,
        comment: 'You got zapped!',
        authorId: pubKey,
        noteId: encodedNoteId,
        normalizedRelays: relays,
    });
    let zapUrl = 'lightning:' + invoice;
    window.location.assign(zapUrl);
};

export const saveComment = (postId, comment) => {
    let relays = [
        'wss://relay.damus.io',
        'wss://relay.primal.net',
        'wss://nos.lol',
        'wss://nostr.bitcoiner.social',
    ];
    const pool = new SimplePool();
    const storedData = localStorage.getItem('memestr');
    if (!storedData) {
        alert('Login required to upvote.');
        return;
    }
    let uesrPublicKey = JSON.parse(storedData).pubKey;
    let userPrivateKey = JSON.parse(storedData).privateKey;
    let sk = nip19.decode(userPrivateKey);
    let commentEvent = {
        kind: 1,
        pubkey: uesrPublicKey,
        created_at: Math.floor(Date.now() / 1000),
        tags: [
            ['e', postId],
            ['p', uesrPublicKey],
            ['alt', 'reply'],
        ],
        content: comment,
    };

    commentEvent.id = getEventHash(commentEvent);
    commentEvent.sig = getSignature(commentEvent, sk.data);
    pool.publish(relays, commentEvent);
    pool.close(relays);
};

export function calculateTimeDifference(postCreatedAt) {
    const currentTime = Math.floor(Date.now() / 1000); // Convert milliseconds to seconds
    const secondsDifference = currentTime - postCreatedAt;
    let unit = '';
    let duration = 0;
    if (secondsDifference < 60) {
        unit = 'seconds';
        duration = secondsDifference;
    } else if (secondsDifference < 3600) {
        unit = 'm';
        duration = Math.floor(secondsDifference / 60);
    } else if (secondsDifference < 86400) {
        unit = 'h';
        duration = Math.floor(secondsDifference / 3600);
    } else {
        unit = 'd';
        duration = Math.floor(secondsDifference / 86400);
    }
    return { unit, duration };
}

function Posts(props) {
    const mediaLinks = extractLinksFromText(props.note.content);
    // const [votes, setVotes] = useState([])
    const [votesCount, setVotesCount] = useState(0);
    const [commentCount, setCommentCount] = useState(
        sessionStorage.getItem('cc_' + props.note.id),
    );
    const [fillLike, setFillLike] = useState(false);
    const [fillZap, setFillZap] = useState(false);
    const [timeDifference, setTimeDifference] = useState({
        unit: '',
        duration: 0,
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [processedValue, setProcessedValue] = useState(null);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    let postCreatedAt = props.note.created_at;

    const openModal = () => {
        setIsModalOpen(true);
    };

    const openShareModal = () => {
        setIsShareModalOpen(true);
    };

    const closeShareModal = () => {
        setIsShareModalOpen(false);
    };

    const handleConfirm = value => {
        // Process the value internally here or update state as needed
        const postId = props.note.id;
        let opPubKey = props.note.pubkey;
        console.log(`Processing value: ${value}`);

        sendNewZaps(postId, opPubKey, value);
        setProcessedValue(value);
    };

    useEffect(() => {
        let { unit, duration } = calculateTimeDifference(postCreatedAt);
        if (duration !== 0) {
            setTimeDifference({ unit: unit, duration: duration });
        }
    }, [postCreatedAt]);

    useEffect(() => {
        setVotesCount(props.note.voteCount);

        (async () => {
            try {
                var cc = await getCommentCount(props.note.id);
                setCommentCount(cc);
            } catch (error) {
                console.error('Error fetching comments count:', error);
                // Handle the error as needed
            }
        })();
    }, [props.note.voteCount, props.note.id]);

    let title = removeHashtagsAndLinks(props.note.content)
        .trimLeft()
        .trimRight();
    if (title.length === 0) {
        title = ' ';
    }
    const imageLink = mediaLinks[0];

    function voteIncrement() {
        const storedData = localStorage.getItem('memestr');
        if (storedData) {
            setVotesCount(votesCount + 1);
        }
    }

    function fillColor() {
        const storedData = localStorage.getItem('memestr');
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
            alert('Login to send zaps.');
            return false;
        }
        openModal();
        setFillZap(true);
    }

    function truncateTitle(title, maxLength) {
        if (title.length > maxLength) {
            return title.substring(0, maxLength) + '...';
        } else {
            return title;
        }
    }

    function renderContent(imageLink) {
        try {
            const extension = imageLink.split('.').pop();
            if (extension === 'undefined') {
                return;
            }
            if (['jpg', 'jpeg', 'gif', 'png'].includes(extension)) {
                return <img alt={''} src={imageLink} />;
            } else {
                console.log('Rendering Video with link ', imageLink);
                // return <VideoPlayer imageLink={imageLink}/>;
                return (
                    <video
                        autoPlay
                        muted
                        controls
                        playsInline
                        src={imageLink}
                    />
                );
            }
        } catch (e) {
            console.log('Image link is ', imageLink);
            console.log('Something happened here' + e);
        }
    }

    let postUrl = `/post/${props.note.id}?voteCount=${votesCount}`;
    return (
        <>
            <div className="flex flex-col items-center">
                <div className="bg-white mt-2 mb-2 overflow-hidden rounded-lg w-full max-w-md">
                    {/* Post Header: Title and Time */}
                    <div className="p-4 border-b">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-semibold truncate">
                                {truncateTitle(title, 20)}
                            </h3>
                            <span className="text-xs text-gray-500">
                                {timeDifference.duration}
                                {timeDifference.unit}
                            </span>
                        </div>
                    </div>
                    {/* Post Media Content
                    <div className="flex justify-center items-center">
                        <div className="bg-white mt-2 mb-6 overflow-hidden rounded-lg shadow-lg max-w-md w-full">
                            {renderContent(imageLink)}
                        </div>
                    </div> */}

                    {/* Post Media Content */}
                    <div className="w-full">{renderContent(imageLink)}</div>

                    <div className="flex flex-col p-3">
                        <div className="flex justify-between items-centre">
                            <Link to={postUrl} className="flex items-center ">
                                <svg
                                    className="h-4 w-4 text-black-600"
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="16"
                                    width="16"
                                    viewBox="0 0 512 512">
                                    <path d="M123.6 391.3c12.9-9.4 29.6-11.8 44.6-6.4c26.5 9.6 56.2 15.1 87.8 15.1c124.7 0 208-80.5 208-160s-83.3-160-208-160S48 160.5 48 240c0 32 12.4 62.8 35.7 89.2c8.6 9.7 12.8 22.5 11.8 35.5c-1.4 18.1-5.7 34.7-11.3 49.4c17-7.9 31.1-16.7 39.4-22.7zM21.2 431.9c1.8-2.7 3.5-5.4 5.1-8.1c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208s-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6c-15.1 6.6-32.3 12.6-50.1 16.1c-.8 .2-1.6 .3-2.4 .5c-4.4 .8-8.7 1.5-13.2 1.9c-.2 0-.5 .1-.7 .1c-5.1 .5-10.2 .8-15.3 .8c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4c4.1-4.2 7.8-8.7 11.3-13.5c1.7-2.3 3.3-4.6 4.8-6.9c.1-.2 .2-.3 .3-.5z" />
                                </svg>
                                <span className="text-xs text-gray-600 ml-1">
                                    {commentCount > 0 ? commentCount : ''}
                                </span>
                            </Link>

                            <button
                                onClick={handleZapButton}
                                className={`flex items-center ${
                                    fillZap
                                        ? 'text-yellow-300'
                                        : 'text-black-600'
                                }`}>
                                <svg
                                    className="h-4 w-4 text-black-600"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24">
                                    <path d="M13 2L3 14 12 14 11 22 21 10 12 10 13 2z"></path>
                                </svg>
                                {processedValue && (
                                    <span className="text-xs ml-1">
                                        {processedValue}
                                    </span>
                                )}
                                <ZapModal
                                    isOpenm={isModalOpen}
                                    onConfirm={handleConfirm}
                                />
                            </button>

                            <button
                                onClick={() => {
                                    upvotePost(
                                        props.note.id,
                                        props.note.pubkey,
                                    );
                                    voteIncrement();
                                    fillColor();
                                }}
                                disabled={isTodisabled()}
                                className={`flex items-center ${
                                    fillLike ? 'text-red-600' : 'text-black-600'
                                }`}>
                                <svg
                                    className="h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24">
                                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                                </svg>
                                <span className="text-xs ml-1 text-black-600">
                                    {votesCount}
                                </span>
                            </button>

                            <button onClick={openShareModal} className="p-1">
                                <ShareButtonSvg className="h-4 w-4 text-gray-600" />
                            </button>
                        </div>
                    </div>
                    {/* Border line directly after the interaction buttons */}
                    <div className="border-t border-grey-700"></div>
                </div>
            </div>

            <ShareModal
                isOpen={isShareModalOpen}
                onClose={closeShareModal}
                postUrl={postUrl}
            />
        </>
    );
}

export default Posts;
