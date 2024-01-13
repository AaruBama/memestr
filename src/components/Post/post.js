import { useParams, useSearchParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import './post.css';
import { ReactComponent as SubmitIcon } from '../../Icons/SubmitIcon.svg';

import {
    extractLinksFromText,
    removeHashtagsAndLinks,
    sendNewZaps,
    upvotePost,
} from '../Posts';
import { getEventHash, getSignature, nip19, SimplePool } from 'nostr-tools';
import Comments from '../Comments';
import ZapModal from '../ZapHelper/ZapModal';
import { ReactComponent as ShareButtonSvg } from '../../Icons/ShareButtonSvg.svg';
import { ReactComponent as LikeSvg } from '../../Icons/LikeSvg.svg';
import { ReactComponent as ZapSvg } from '../../Icons/Zap.svg';
import { ShareModal } from '../Share/modal';
import CommentSpinner from '../Spinner/CommentSpinner';
import Sidebar from '../HashtagTool/SideBar';
import { useAuth } from '../../AuthContext';

// import { useHashTagContext } from "./HashtagTool"; // Import the custom hook
// import {useHashTagContext} from "../HashtagTool";

function Post() {
    // const { notes, setNotes } = useHashTagContext(); // Access notes and setNotes from the context
    let params = useParams();
    const [searchParams] = useSearchParams();
    // const title = searchParams.get('title');
    const postId = params.postId;
    // const imageLink = searchParams.get('imageLink');
    const voteCount = searchParams.get('voteCount');
    // const opPubKey = searchParams.get('OpPubKey');
    const [replies, setReplies] = useState([]);
    const [comment, setComment] = useState('');
    const [postData, setPostData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const { isLoggedIn } = useAuth();
    const [userPublicKey, setUserPublicKey] = useState(null);

    useEffect(() => {
        const storedData = localStorage.getItem('memestr');
        const userData = storedData ? JSON.parse(storedData) : null;
        setUserPublicKey(userData?.pubKey);

        if (!isLoggedIn) {
            setFillLike(false);
        } else {
            let likedPosts =
                JSON.parse(localStorage.getItem('likedPosts')) || {};
            setFillLike(
                !!(likedPosts[postId] && likedPosts[postId][userPublicKey]),
            );
        }
    }, [isLoggedIn, postId, userPublicKey]);

    let postUrl = `/post/${postId}?voteCount=${voteCount}`;

    async function getPostFromId(postId) {
        const pool = new SimplePool();

        // const relay = relayInit('wss://relay.nostr.band/');
        let relays = [
            'wss://relay.damus.io',
            'wss://relay.primal.net',
            'wss://relay.snort.social',
        ];

        let post = await pool.get(relays, {
            ids: [postId],
        });
        if (pool) {
            pool.close(relays);
        }

        let data = {
            title: removeHashtagsAndLinks(post.content),
            imageLink: extractLinksFromText(post.content),
            opPubKey: post.pubKey,
        };
        setPostData(data);
    }

    const captureComment = event => {
        setComment(event.target.value);
    };

    useEffect(() => {
        setIsLoading(true);
        const getComments = async () => {
            const relayPool = new SimplePool();
            const relays = [
                'wss://relay.damus.io',
                'wss://relay.primal.net',
                'wss://nos.lol',
                'wss://nostr.bitcoiner.social',
            ];
            const filters = {
                kinds: [1],
                '#e': [postId],
            };
            let replies1 = await relayPool.list(relays, [filters]);
            setReplies(replies1);
            setIsLoading(false);
            relayPool.close(relays);
        };
        getComments();
        getPostFromId(postId);
    }, [postId]);

    const captureNewComment = async comment => {
        let relays = [
            'wss://relay.damus.io',
            'wss://relay.primal.net',
            'wss://nos.lol',
        ];
        const pool = new SimplePool();
        const storedData = localStorage.getItem('memestr');
        if (!storedData) {
            alert('Login required to comment.');
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
        try {
            let x = await pool.publish(relays, commentEvent);
            Promise.resolve(x);
        } catch (error) {
            console.error('Error while publishing comment:', error);
        }
        const commentObject = [
            {
                content: comment,
                pubkey: uesrPublicKey,
            },
        ];
        setReplies(replies => [...commentObject, ...replies]);
        console.log('replies after updation is', replies);
        setComment('');
        // c.map((cc) => {console.log(cc)})
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fillZap, setFillZap] = useState(false);
    const [processedValue, setProcessedValue] = useState(null);
    const [votesCount, setVotesCount] = useState(parseInt(voteCount, 10));
    const [fillLike, setFillLike] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    function openModal() {
        setIsModalOpen(true);
    }

    const closeShareModal = () => {
        setIsShareModalOpen(false);
    };

    const openShareModal = () => {
        setIsShareModalOpen(true);
    };

    function handleZapButton() {
        const storedData = localStorage.getItem('memestr');
        if (!storedData) {
            alert('Login to send zaps.');
            return false;
        }
        openModal();
        setFillZap(true);
    }

    const handleConfirm = value => {
        // Process the value internally here or update state as needed
        console.log('value is ', value);
        sendNewZaps(postId, postData['opPubKey'], value);
        setProcessedValue(value);
    };

    function voteIncrement(postId) {
        setVotesCount(prevCount => prevCount + 1);
        fillColor(postId);
        manageLikedPosts(postId, true);
    }

    function fillColor(postId) {
        let likedPosts = JSON.parse(localStorage.getItem('likedPosts')) || {};
        if (likedPosts[postId]) {
            setFillLike(true);
        } else {
            setFillLike(false);
        }
    }

    const MAX_POSTS = 200;
    const manageLikedPosts = (postId, userPublicKey, isLiked) => {
        let likedPosts = JSON.parse(localStorage.getItem('likedPosts')) || {};

        if (!likedPosts[postId]) {
            likedPosts[postId] = {};
        }
        likedPosts[postId][userPublicKey] = isLiked;

        let postIds = Object.keys(likedPosts);
        if (postIds.length > MAX_POSTS) {
            delete likedPosts[postIds[0]];
        }

        localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
    };

    function isTodisabled() {
        const userPublicKey = JSON.parse(
            localStorage.getItem('memestr'),
        )?.pubKey;
        let likedPosts = JSON.parse(localStorage.getItem('likedPosts')) || {};
        return !!(likedPosts[postId] && likedPosts[postId][userPublicKey]);
    }

    const handleLikeButtonClick = () => {
        if (!isLoggedIn) {
            alert('Login required to upvote.');
            return;
        }
        upvotePost(postId, userPublicKey).then(wasLiked => {
            if (wasLiked) {
                voteIncrement(postId);
            }
        });
    };

    return (
        <>
            <div className="flex flex-col md:flex-row min-h-screen">
                <Sidebar />
                <main className="flex-1 overflow-y-auto">
                    <div className="mt-16 flex flex-col items-center lg:mr-60">
                        <div className="bg-white rounded-sm shadow-sm w-full max-w-md my-1 border border-gray-400 ">
                            <div className="p-4 ">
                                <h3 className="text-sm font-nunito font-bold text-gray-900 break-words whitespace-normal">
                                    {postData['title']}
                                </h3>
                            </div>

                            <div className="w-full">
                                <img
                                    alt={''}
                                    src={postData['imageLink']}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex justify-between items-center p-4 bg-gray-50">
                                {/* Zap Button */}
                                <button
                                    onClick={handleZapButton}
                                    className="flex items-center">
                                    <ZapSvg
                                        className={`${
                                            fillZap
                                                ? 'text-yellow-300'
                                                : 'text-black'
                                        } h-4 w-4`}
                                    />
                                    {processedValue && (
                                        <span className="ml-1">
                                            {processedValue}
                                        </span>
                                    )}
                                    <ZapModal
                                        isOpenm={isModalOpen}
                                        onConfirm={handleConfirm}
                                    />
                                </button>

                                {/* Like Button */}
                                <button
                                    onClick={handleLikeButtonClick}
                                    disabled={isTodisabled()}
                                    className={`flex items-center ${
                                        fillLike
                                            ? 'text-red-600'
                                            : 'text-black-600'
                                    }`}>
                                    <LikeSvg
                                        fill={fillLike ? 'red' : 'none'}
                                        className="h-4 w-4"
                                    />
                                    <span className="text-xs ml-1 text-black-600">
                                        {votesCount}
                                    </span>
                                </button>

                                {/* Share Button */}
                                <button
                                    onClick={openShareModal}
                                    className="flex items-center">
                                    <ShareButtonSvg className="h-4 w-4 text-black" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center lg:mr-60">
                        <div className="bg-gray-50 p-4 w-full max-w-md border border-gray-400">
                            <form
                                className="flex items-center justify-between"
                                onSubmit={async event => {
                                    event.preventDefault();
                                    await captureNewComment(comment);
                                    // Additional actions after comment is saved can be added here
                                }}>
                                <input
                                    type="text"
                                    placeholder="Add a reply..."
                                    className="flex-grow p-2 text-sm border border-gray-400 rounded-l-md"
                                    value={comment}
                                    onChange={captureComment}
                                    required
                                />
                                <button
                                    type="submit"
                                    className="ml-2 bg-black text-white p-2 rounded-r-md">
                                    <SubmitIcon />
                                </button>
                            </form>
                        </div>
                    </div>

                    <div>
                        {isLoading ? (
                            <CommentSpinner />
                        ) : replies.length === 0 ? (
                            <div className="text-gray-500 text-center my-4 lg:mr-60">
                                No comments yet.
                            </div>
                        ) : (
                            <div className="flex justify-center lg:mr-60">
                                <div className="bg-white rounded-b-sm shadow overflow-hidden w-full max-w-md mx-auto">
                                    {replies.map((object, index) => (
                                        <Comments key={index} reply={object} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <ShareModal
                        isOpen={isShareModalOpen}
                        onClose={closeShareModal}
                        postUrl={postUrl}
                    />
                </main>
            </div>
        </>
    );
}

export default Post;
