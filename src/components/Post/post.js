import {useParams, useSearchParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import "./post.css"
import Button from "react-bootstrap/Button";
import {upvotePost} from "../Posts";
import {SimplePool} from "nostr-tools";
import Comments from "../Comments";

function Post(props) {
    let params = useParams();const [searchParams] = useSearchParams();
    const title = searchParams.get('title');
    const postId = params.postId
    const imageLink = searchParams.get('imageLink')
    const voteCount = searchParams.get('voteCount')
    const OpPubKey = searchParams.get('OpPubKey')
    const [replies, setReplies] = useState([])

    useEffect(() => {
        const getComments = async (event) => {
            const relayPool = new SimplePool();
            const relays = ['wss://relay.damus.io', 'wss://relay.primal.net']
            const filters = {
                kinds: [1],
                "#e": [postId],
                // "alt": ["reply"]
            };
            let replies1 = await relayPool.list(relays, [filters])
            console.log("replies1 is ", replies1)
            setReplies(replies1)
            relayPool.close(relays);
        };
        getComments();
    }, [postId]);


    return (
        <div >
            <div className={"title-post"}> <h1>{title}</h1> </div>
            <div className={"post-content"} ><img alt={""} className={"post-content"} src={imageLink}/></div>
            <Button variant="light" size={"lg"} onClick={() => upvotePost(postId, OpPubKey)}>+ {voteCount}</Button>{' '}
        {/*/!*    Algo:::*/}
        {/*    1. basis postId, fetch comments/replies*/}
        {/*    2. convert them to comments iterable.*/}
        {/*    3. would render each one in their own div.*/}
        {/*    4. add a menu to every comment to zap or reply.*/}
        {/*    5. Add new comment modal.*/}
        {/*    6. Css to fetch the newly submitted comment.*/}



        {/**!/*/}
            {replies.map(function(object){
                console.log("reply object is", object);
                return <Comments reply={object} />;
            })}
        </div>
    );
}
export default Post;
