import { getEventHash, getSignature, nip19 } from 'nostr-tools';
import { fetchInvoice, getProfileMetadata, getZapEndpoint } from '../ZapHelper';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import ZapModal from '../ZapHelper/ZapModal';
import { ShareModal } from '../Share/modal';
import { ReactComponent as ShareButtonSvg } from '../../Icons/ShareButtonSvg.svg';
import { ReactComponent as LikeSvg } from '../../Icons/LikeSvg.svg';
import { ReactComponent as ZapSvg } from '../../Icons/Zap.svg';
import { ReactComponent as CommentSvg } from '../../Icons/CommentSvg.svg';
// import { getCommentCount } from '../HashtagTool';
import { useAuth } from '../../AuthContext';
import { VideoPlayer } from '../../helpers/videoPlayer';
import { ReactComponent as CloseIcon } from '../../Icons/CloseIcon.svg';
import { getRelayPool } from '../../services/RelayService';
import { UserProfileSection } from '../Profile/UserProfileSection';
const MAX_POSTS = 200;

export const manageLikedPosts = (postId, userPublicKey, isLiked) => {
    let usersLikes = JSON.parse(localStorage.getItem('usersLikes')) || {};
    if (!usersLikes[userPublicKey]) {
        usersLikes[userPublicKey] = {};
    }
    usersLikes[userPublicKey][postId] = isLiked;
    const postIds = Object.keys(usersLikes[userPublicKey]);
    if (postIds.length > MAX_POSTS) {
        delete usersLikes[userPublicKey][postIds[0]];
    }
    localStorage.setItem('usersLikes', JSON.stringify(usersLikes));
};

export function convertHashtagsToLinks(text) {
    const hashtagRegex = /#(\w+)/g;
    const tokens = [];
    let match;
    let lastIndex = 0;
    while ((match = hashtagRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            tokens.push(text.slice(lastIndex, match.index));
        }
        tokens.push(
            <Link
                to={`/search/${match[1]}`}
                key={match[1]}
                className="text-customBlue hover:text-customBlue-700 hover:decoration-customBlue-700 transition duration-300 ease-in-out hover:scale-112">
                {match[0]}
            </Link>,
        );
        lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
        tokens.push(text.slice(lastIndex));
    }
    return tokens;
}

export function renderContent(imageLink) {
    try {
        const extension = imageLink.split('.').pop();
        if (extension === 'undefined') {
            return;
        }
        if (['jpg', 'jpeg', 'gif', 'png'].includes(extension)) {
            return (
                <img
                    alt={''}
                    src={imageLink}
                    style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        objectFit: 'cover',
                    }}
                />
            );
        } else {
            return <VideoPlayer imageLink={imageLink} />;
        }
    } catch (e) {
        console.log('Something happened here' + e);
    }
}

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

export const removeHashtags = text => {
    const withoutHastags = text.replace(/#\w+/g, '');
    return withoutHastags.replace(/(https?:\/\/[^\s]+)/g, '');
};

export function extractHashtags(text) {
    return text.match(/#\w+/g) || [];
}

export async function upvotePost(noteId, userPublicKey) {
    const storedData = localStorage.getItem('memestr');

    if (!storedData) {
        alert('Login required to upvote.');
        return false;
    }

    const userData = JSON.parse(storedData);
    userPublicKey = userData.pubKey;

    let upvoteEvent = {
        kind: 7,
        pubkey: userPublicKey,
        created_at: Math.floor(Date.now() / 1000),
        tags: [
            ['e', noteId],
            ['p', userData.pubKey],
        ],
        content: '+',
    };

    try {
        if (userData.privateKey) {
            let sk = nip19.decode(userData.privateKey);
            upvoteEvent.id = getEventHash(upvoteEvent);
            upvoteEvent.sig = getSignature(upvoteEvent, sk.data);
        } else if (window.nostr) {
            upvoteEvent = await window.nostr.signEvent(upvoteEvent);
        } else {
            throw new Error('No authentication method available');
        }
        const pool = getRelayPool();
        let relays = ['wss://relay.damus.io', 'wss://relay.primal.net'];
        await pool.publish(relays, upvoteEvent);
        manageLikedPosts(noteId, userPublicKey, true);
        pool.close(relays);
        return true;
    } catch (error) {
        console.error('Error publishing upvote event:', error);
        return false;
    }
}

export const sendNewZaps = async (postId, opPubKey, sats = 11) => {
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
    const pool = getRelayPool();
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

export function getLocalLikeCountForPost(postId) {
    let usersLikes = JSON.parse(localStorage.getItem('usersLikes')) || {};
    let likeCount = 0;
    for (let user in usersLikes) {
        if (Object.prototype.hasOwnProperty.call(usersLikes, user)) {
            if (usersLikes[user][postId]) {
                likeCount++;
            }
        }
    }
    return likeCount;
}

function Posts(props) {
    const mediaLinks = extractLinksFromText(props.note.content);
    const [votesCount, setVotesCount] = useState(0);
    const commentCount = useState(
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
    const { isLoggedIn } = useAuth();
    const userPublicKey = useState(null);

    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

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
        const postId = props.note.id;
        let opPubKey = props.note.pubkey;

        sendNewZaps(postId, opPubKey, value);
        setProcessedValue(value);
    };

    // useEffect(() => {
    //     console.log("UseEffect 1");
    //     const storedData = localStorage.getItem('memestr');
    //     const userData = storedData ? JSON.parse(storedData) : null;
    //     setUserPublicKey(userData?.pubKey);
    //
    //     if (!isLoggedIn) {
    //         setFillLike(false);
    //     } else {
    //         let usersLikes =
    //             JSON.parse(localStorage.getItem('usersLikes')) || {};
    //         setFillLike(!!usersLikes[userPublicKey]?.[props.note.id]);
    //     }
    // }, [isLoggedIn, props.note.id, userPublicKey]);

    useEffect(() => {
        setVotesCount(props.note.voteCount);
        let { unit, duration } = calculateTimeDifference(postCreatedAt);
        if (duration !== 0) {
            setTimeDifference({ unit: unit, duration: duration });
        }
    }, [postCreatedAt, props.note.voteCount, props.note.id]);

    // useEffect(() => {
    //     console.log("UseEffect 3");
    //     setVotesCount(props.note.voteCount);
    //     (async () => {
    //         try {
    //             var cc = await getCommentCount(props.note.id);
    //             setCommentCount(cc);
    //         } catch (error) {
    //             console.error('Error fetching comments count:', error);
    //         }
    //     })();
    // }, [props.note.voteCount, props.note.id]);
    //
    // useEffect(() => {
    //     console.log("UseEffect 4");
    //     const storedData = localStorage.getItem('memestr');
    //     const userPublicKey = storedData ? JSON.parse(storedData).pubKey : null;
    //
    //     if (userPublicKey) {
    //         const usersLikes =
    //             JSON.parse(localStorage.getItem('usersLikes')) || {};
    //         setFillLike(!!usersLikes[userPublicKey]?.[props.note.id]);
    //     } else {
    //         setFillLike(false);
    //     }
    // }, [props.note.id]);

    let title = removeHashtagsAndLinks(props.note.content);

    if (title.length === 0) {
        title = ' ';
    }
    const imageLink = mediaLinks[0];

    function isTodisabled() {
        let usersLikes = JSON.parse(localStorage.getItem('usersLikes')) || {};
        return !!usersLikes[userPublicKey]?.[props.note.id];
    }

    function handleZapButton() {
        const storedData = localStorage.getItem('memestr');
        if (!storedData) {
            setNotificationMessage('Login to send Zaps');
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
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

    let truncatedTitle = truncateTitle(title, 300);
    let hashtags = extractHashtags(title);
    let titleWithoutTagsOrLinks = removeHashtags(truncatedTitle);

    function handleLikeButtonClick() {
        if (!isLoggedIn) {
            setNotificationMessage('Login required to upvote');
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
            return;
        }
        upvotePost(props.note.id, userPublicKey).then(wasLiked => {
            if (wasLiked) {
                manageLikedPosts(props.note.id, userPublicKey, true);
                setVotesCount(props.note.voteCount + 1);
                setFillLike(true);
            }
        });
    }
    const navigate = useNavigate();
    const handleTagClick = suggestions => {
        navigate(`/search/${suggestions}`);
    };

    let postUrl = `/post/${props.note.id}?voteCount=${votesCount}`;
    return (
        <>
            <div className="flex flex-col items-center mt-4">
                <div className="flex flex-col w-full border-t-2 border-x-2 rounded-t-md border-gray-100 overflow-hidden max-w-md">
                    {/* Add user picture before or alongside other content */}
                    <UserProfileSection
                        profile={props.note.profile}
                        size="md" // Configurable size
                        className="mb-2 ml-1" // Optional additional styling
                    />
                </div>
                <div className="bg-white overflow-hidden rounded-sm w-full max-w-md">
                    {/* Post Media Content */}

                    {titleWithoutTagsOrLinks.trim() !== '' && (
                        <div className="border-x border-grey-100 p-2">
                            <h3 className="font-nunito font-semibold text-gray-700">
                                {titleWithoutTagsOrLinks}
                            </h3>
                        </div>
                    )}

                    <div className="h-max lg: bg-gray-200 border-y border-gray-300">
                        {renderContent(imageLink)}
                    </div>

                    <div className="border-x border-grey-100 flex justify-between items-center px-2">
                        <div className="flex gap-2 py-2">
                            {hashtags.slice(0, 3).map((tag, index) => (
                                <button
                                    key={index}
                                    onClick={() =>
                                        handleTagClick(tag.substring(1))
                                    }
                                    className="bg-gray-100 text-blue-800 font-semibold font-medium rounded-full px-4 py-1 text-sm focus:outline-none">
                                    #{tag.substring(1)}
                                </button>
                            ))}
                        </div>

                        <span className="text-xs text-gray-500">
                            {timeDifference.duration}
                            {timeDifference.unit}
                        </span>
                    </div>

                    <div className="border-t border-grey-100 rounded-b-md "></div>
                    <div className="border-x border-grey-100 flex flex-col p-3">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <Link
                                    to={postUrl}
                                    className="flex items-center">
                                    <CommentSvg className="h-4 w-4 text-black-600" />
                                    <span className="text-xs text-gray-600 ml-1">
                                        {commentCount > 0 ? commentCount : ''}
                                    </span>
                                </Link>
                            </div>

                            <div className="flex items-center">
                                <button
                                    onClick={handleZapButton}
                                    className={`flex items-center ${
                                        fillZap
                                            ? 'text-yellow-300'
                                            : 'text-black-600'
                                    }`}>
                                    <ZapSvg className="h-4 w-4 text-black-600" />
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
                            </div>

                            <div className="flex items-center">
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
                            </div>

                            <button onClick={openShareModal} className="p-1">
                                <ShareButtonSvg className="h-6 w-6 text-gray-600" />
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-grey-200 border-2 rounded-b-md "></div>
                </div>
            </div>

            <ShareModal
                isOpen={isShareModalOpen}
                onClose={closeShareModal}
                postUrl={postUrl}
            />

            {showNotification && (
                <div className="fixed top-0 inset-x-0 flex justify-center items-start z-50">
                    <div className="mt-12 p-4 bg-black text-white rounded-lg shadow-lg transition-transform transform-gpu animate-slideInSlideOut flex items-center">
                        <p className="text-bold text-white px-2">
                            {notificationMessage}
                        </p>
                        <CloseIcon
                            className="h-6 w-6 mr-2 text-white"
                            onClick={() => setShowNotification(false)}
                        />
                    </div>
                </div>
            )}
        </>
    );
}

export default Posts;
