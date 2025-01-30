import React, { useState, useEffect } from 'react';
import CommentSpinner from '../Spinner/CommentSpinner';
import Comments from '../Comments';
import { getRelayPool, RELAYS } from '../../services/RelayService';
import { parseReferences } from 'nostr-tools/references';
import { getProfileFromPublicKey } from '../Profile';
import { nip10 } from 'nostr-tools';
import { buildReplyTree } from '../Post/post';
import './commentsModal.css';

export function CommentsModal({ postId, isOpen, onClose }) {
    const [replies, setReplies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Reuse the comment fetching logic from Post component
    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const mapRootToReplies = rootReplies => {
            return rootReplies.map(rootReply => ({
                rootMessage: rootReply,
                replies: flattenReplies(rootReply.children, []),
            }));
        };

        const flattenReplies = (replies, allReplies = []) => {
            replies.forEach(reply => {
                allReplies.push(reply);
                if (reply.children.length > 0) {
                    flattenReplies(reply.children, allReplies);
                }
            });
            return allReplies;
        };

        const fetchComments = async () => {
            setIsLoading(true);
            const relayPool = getRelayPool();

            const filters = { kinds: [1], '#e': [postId] };
            let replies1 = await relayPool.list(RELAYS, [filters]);
            console.log('replies for this post are ', replies1);

            for (let i = 0; i < replies1.length; i++) {
                let event = replies1[i];
                let references = parseReferences(event);
                console.log('references from comment is ', references);
                let simpleAugmentedContent = event.content;
                for (let j = 0; j < references.length; j++) {
                    let { text, profile } = references[j];
                    if (profile) {
                        let p = await getProfileFromPublicKey(profile.pubkey);
                        let content = JSON.parse(p.content);
                        let displayName = content.display_name;
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
            const parsedReplies = replies1.map(reply => ({
                ...reply,
                parsed: nip10.parse(reply),
            }));
            console.log('parsedReplies', parsedReplies);
            const replyTree = buildReplyTree(parsedReplies);
            console.log('replyTree', replyTree);
            const processedReplies = mapRootToReplies(replyTree);
            console.log('processedReplies', processedReplies);
            setReplies(processedReplies);
            setIsLoading(false);
        };

        fetchComments();
    }, [postId, isOpen]);

    const renderReplies = replies => {
        return replies.map(reply => <Comments key={reply.id} reply={reply} />);
    };

    const CommentWithReplies = ({ rootMessage, replies }) => {
        const [showReplies, setShowReplies] = useState(false);

        const toggleReplies = () => {
            setShowReplies(prevState => !prevState);
        };

        return (
            <div key={rootMessage.id}>
                <Comments reply={rootMessage} />
                <div className="ml-16 mb-2">
                    {replies.length > 0 && (
                        <div
                            onClick={toggleReplies}
                            className="cursor-pointer text-blue-700 font-nunito text-normal ">
                            {showReplies ? 'Hide Replies' : 'View Replies'}
                        </div>
                    )}
                    {showReplies && renderReplies(replies)}
                </div>
            </div>
        );
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            {/* Mobile View - Bottom Sheet */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-xl h-[60vh] max-h-[60vh] overflow-y-auto transform ease-in-out transition-transform duration-300">
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Comments</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700">
                            ×
                        </button>
                    </div>
                    {isLoading ? (
                        <CommentSpinner />
                    ) : (
                        <div className="comments-modal-content comments-modal-container pb-4">
                            {replies.length === 0 ? (
                                <p className="text-gray-500 text-center">
                                    No comments yet
                                </p>
                            ) : (
                                replies.map(({ rootMessage, replies }) => (
                                    <div className="" key={rootMessage.id}>
                                        <CommentWithReplies
                                            rootMessage={rootMessage}
                                            replies={replies}
                                        />
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Desktop View - Right Sidebar */}
            <div className="hidden comments-modal-desktop md:block fixed right-0 top-0 h-full w-96 bg-white shadow-lg transform transition-transform duration-300 z-50">
                <div className="p-4 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Comments</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700">
                            ×
                        </button>
                    </div>
                    {isLoading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <CommentSpinner />
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto">
                            {replies.length === 0 ? (
                                <p className="text-gray-500 text-center">
                                    No comments yet
                                </p>
                            ) : (
                                replies.map(({ rootMessage, replies }) => (
                                    <CommentWithReplies
                                        key={rootMessage.id}
                                        rootMessage={rootMessage}
                                        replies={replies}
                                    />
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
