import { useParams, useSearchParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import './post.css';
import { ReactComponent as SubmitIcon } from '../../Icons/SubmitIcon.svg';
import Spinner from '../Spinner';
import { parseReferences } from 'nostr-tools/references';

import {
    extractLinksFromText,
    removeHashtagsAndLinks,
    sendNewZaps,
    upvotePost,
    getLocalLikeCountForPost,
    manageLikedPosts,
    convertHashtagsToLinks,
    renderContent,
} from '../Posts';
import {
    getEventHash,
    getSignature,
    nip19,
    SimplePool,
    nip10,
} from 'nostr-tools';
// import { parse } from './nip10Parser';
import Comments from '../Comments';
import ZapModal from '../ZapHelper/ZapModal';
import { ReactComponent as ShareButtonSvg } from '../../Icons/ShareButtonSvg.svg';
import { ReactComponent as LikeSvg } from '../../Icons/LikeSvg.svg';
import { ReactComponent as ZapSvg } from '../../Icons/Zap.svg';
import { ShareModal } from '../Share/modal';
import CommentSpinner from '../Spinner/CommentSpinner';
import Sidebar from '../HashtagTool/SideBar';
import { useAuth } from '../../AuthContext';
import { getProfileFromPublicKey } from '../Profile';

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
    const [profileLoading, setProfileLoading] = useState(false);
    const [userPublicKey, setUserPublicKey] = useState(null);

    useEffect(() => {
        const storedData = localStorage.getItem('memestr');
        const userData = storedData ? JSON.parse(storedData) : null;
        setUserPublicKey(userData?.pubKey);

        if (!isLoggedIn) {
            setFillLike(false);
        } else {
            let usersLikes =
                JSON.parse(localStorage.getItem('usersLikes')) || {};
            setFillLike(!!usersLikes[userPublicKey]?.[postId]);
        }
    }, [isLoggedIn, postId, userPublicKey]);

    let postUrl = `/post/${postId}?voteCount=${voteCount}`;

    async function getPostFromId(postId, retries = 3) {
        setProfileLoading(true);
        const pool = new SimplePool();
        let relays = [
            'wss://relay.damus.io',
            'wss://relay.primal.net',
            'wss://relay.snort.social',
        ];

        let post = null;
        for (let i = 0; i < retries; i++) {
            post = await pool.get(relays, {
                ids: [postId],
            });
            if (post && post.content) {
                break;
            }
        }

        if (pool) {
            pool.close(relays);
        }

        if (post && post.content) {
            let data = {
                title: convertHashtagsToLinks(
                    removeHashtagsAndLinks(post.content),
                ),
                imageLink: extractLinksFromText(post.content),
                opPubKey: post.pubKey,
            };

            setPostData(data);
            setProfileLoading(false);
        } else {
            console.error(
                `Post with ID ${postId} not found after ${retries} retries`,
            );
        }
    }

    const captureComment = event => {
        setComment(event.target.value);
    };

    const [repliesLoading, setRepliesLoading] = useState(true);

    const buildReplyTree = replies => {
        const rootReplies = [];
        const repliesById = {};

        replies.forEach(reply => {
            repliesById[reply.id] = { ...reply, children: [] };
        });

        replies.forEach(reply => {
            const parentId = reply.parsed.reply?.id;
            if (parentId && repliesById[parentId]) {
                repliesById[parentId].children.push(repliesById[reply.id]);
            } else {
                rootReplies.push(repliesById[reply.id]);
            }
        });

        return rootReplies;
    };

    const renderComments = comments => {
        return comments.map(comment => (
            <Comments key={comment.id} reply={comment} />
        ));
    };

    useEffect(() => {
        setIsLoading(true);
        setRepliesLoading(true); // Start loading replies

        const fetchData = async () => {
            // Fetch comments
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

            console.log('replies is ', replies1);
            for (let i = 0; i < replies1.length; i++) {
                let event = replies1[i];
                let references = parseReferences(event);
                let simpleAugmentedContent = event.content;
                for (let j = 0; j < references.length; j++) {
                    let { text, profile } = references[j];
                    if (profile) {
                        let p = await getProfileFromPublicKey(profile.pubkey);
                        let content = JSON.parse(p.content);
                        let displayName = content.display_name;
                        console.log('name is ', content);
                        let augmentedReference = profile
                            ? `@@${displayName}@@`
                            : ``;
                        simpleAugmentedContent =
                            simpleAugmentedContent.replaceAll(
                                text,
                                augmentedReference,
                            );
                    }
                }

                replies1[i].content = simpleAugmentedContent;
            }
            relayPool.close(relays);
            const parsedReplies = replies1.map(reply => ({
                ...reply,
                parsed: nip10.parse(reply),
            }));
            const replyTree = buildReplyTree(parsedReplies);
            console.log(replyTree);
            setReplies(replyTree);
            setRepliesLoading(false);
        };

        Promise.all([getPostFromId(postId), fetchData()]).finally(() => {
            setIsLoading(false);
        });
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
        const userData = JSON.parse(storedData);

        let uesrPublicKey = JSON.parse(storedData).pubKey;
        let userPrivateKey = JSON.parse(storedData).privateKey;

        let commentEvent = {
            kind: 1,
            pubkey: uesrPublicKey,
            created_at: Math.floor(Date.now() / 1000),
            tags: [
                ['e', postId, ' ', 'root'],
                ['p', uesrPublicKey],
                ['alt', 'reply'],
            ],
            content: comment,
        };

        if (userData.privateKey) {
            let sk = nip19.decode(userPrivateKey);
            commentEvent.id = getEventHash(commentEvent);
            commentEvent.sig = getSignature(commentEvent, sk.data);
        } else if (window.nostr) {
            commentEvent = await window.nostr.signEvent(commentEvent);
        } else {
            throw new Error('No authentication method available');
        }

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

    function isTodisabled() {
        let usersLikes = JSON.parse(localStorage.getItem('usersLikes')) || {};
        return !!usersLikes[userPublicKey]?.[postId];
    }

    function handleLikeButtonClick() {
        if (!isLoggedIn) {
            alert('Login required to upvote.');
            return;
        }
        upvotePost(postId, userPublicKey).then(wasLiked => {
            if (wasLiked) {
                manageLikedPosts(postId, userPublicKey, true);
                const localLikeCount = getLocalLikeCountForPost(postId);
                setVotesCount(localLikeCount + parseInt(voteCount, 10));
                setFillLike(true);
            }
        });
    }

    return (
        <>
            <div className="flex flex-col md:flex-row min-h-screen">
                <Sidebar />
                {isLoading || profileLoading || repliesLoading ? (
                    <div className="flex-1  md:mr-40">
                        <Spinner />
                    </div>
                ) : (
                    <main className="flex-1 overflow-y-auto">
                        <div className="mt-16 flex flex-col items-center lg:mr-60">
                            <div className="bg-white rounded-sm shadow-sm w-full max-w-md my-1 border border-gray-400 ">
                                <div className="px-4 py-2 ">
                                    <h3 className="text-sm font-nunito font-bold text-gray-900 break-words whitespace-normal">
                                        {postData['title']}
                                    </h3>
                                </div>

                                <div className="w-full border-t-2 border-gray-300">
                                    {postData['imageLink'] &&
                                        renderContent(postData['imageLink'][0])}
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
                                        <ShareButtonSvg className="h-6 w-6 text-black" />
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
                                <div className="pb-16 md:text-gray-500 text-center my-4 lg:mr-60">
                                    No comments yet.
                                </div>
                            ) : (
                                <div className="flex justify-center lg:mr-60">
                                    <div className=" pb-16 md:bg-white rounded-b-sm shadow overflow-hidden w-full max-w-md mx-auto">
                                        {renderComments(replies)}
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
                )}
            </div>
        </>
    );
}

export default Post;
