import {useParams, useSearchParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import "./post.css"
import Button from "react-bootstrap/Button";
import {sendNewZaps, upvotePost} from "../Posts";
import {SimplePool} from "nostr-tools";
import Comments, {saveComment} from "../Comments";

import {Stack} from "react-bootstrap";


function Post(props) {
    let params = useParams();
    const [searchParams] = useSearchParams();
    const title = searchParams.get('title');
    const postId = params.postId
    const imageLink = searchParams.get('imageLink')
    const voteCount = searchParams.get('voteCount')
    const OpPubKey = searchParams.get('OpPubKey')
    const [replies, setReplies] = useState([])
    const [comment, setComment] = useState('');

    const captureComment = (event) => {
        setComment(event.target.value);
    };

    useEffect(() => {
        const getComments = async (event) => {
            const relayPool = new SimplePool();
            const relays = ['wss://relay.damus.io', 'wss://relay.primal.net']
            const filters = {
                kinds: [1],
                "#e": [postId],
            };
            let replies1 = await relayPool.list(relays, [filters])
            setReplies(replies1)
            relayPool.close(relays);
        };
        getComments();
    }, [postId]);

    // {/*/!*    Algo:::*/}
    // {/*    1. basis postId, fetch comments/replies*/}
    // {/*    2. convert them to comments iterable.*/}
    // {/*    3. would render each one in their own div.*/}
    // {/*    4. add a menu to every comment to zap or reply.*/}
    // {/*    5. Add new comment modal.*/}
    // {/*    6. Css to fetch the newly submitted comment.*/}
    return (
        <div>
            <div className={"title-post"}><h1>{title}</h1></div>
            <div className={"post-content"}><img alt={""} className={"post-content"} src={imageLink}/></div>
            <Button variant="light" size={"lg"} onClick={() => upvotePost(postId, OpPubKey)}>+ {voteCount}</Button>{' '}
            <Button variant="light" size={"lg"} onClick={() => sendNewZaps(postId, OpPubKey)}>Zap</Button>{' '}
            <div>
                <Stack direction="horizontal" gap={3}>
                <div style={{display: "inline-block"}}>
                    <div className="commentBox dib pd20">
                        <form onSubmit={() => saveComment(postId, comment)}>
                            <input type="text" placeholder="Comment"
                                   value={comment}
                                   onChange={captureComment}
                                   required/>

                            <Button variant="secondary" type="submit">Submit</Button>
                        </form>
                    </div>
                </div>
                </Stack>
            </div>
            {replies.map(function (object) {
                return <Comments reply={object}/>;
            })}
        </div>
    );
}

export default Post;
