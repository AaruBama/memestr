import { useParams, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./post.css";
import Button from "react-bootstrap/Button";
import { sendNewZaps, upvotePost } from "../Posts";
import {getEventHash, getSignature, nip19, SimplePool} from "nostr-tools";
import Comments, { saveComment } from "../Comments";
// import { useHashTagContext } from "./HashtagTool"; // Import the custom hook
// import {useHashTagContext} from "../HashtagTool";

function Post(props) {
    // const { notes, setNotes } = useHashTagContext(); // Access notes and setNotes from the context
    let params = useParams();
    const [searchParams] = useSearchParams();
    const title = searchParams.get("title");
    const postId = params.postId;
    const imageLink = searchParams.get("imageLink");
    const voteCount = searchParams.get("voteCount");
    const OpPubKey = searchParams.get("OpPubKey");
    const [replies, setReplies] = useState([]);
    const [comment, setComment] = useState("");

    const captureComment = (event) => {
        setComment(event.target.value);
    };

    useEffect(() => {
        const getComments = async (event) => {
            const relayPool = new SimplePool();
            const relays = ['wss://relay.damus.io', 'wss://relay.primal.net', "wss://nos.lol", "wss://nostr.bitcoiner.social"];
            const filters = {
                kinds: [1],
                "#e": [postId],
            };
            let replies1 = await relayPool.list(relays, [filters]);
            console.log("replies1 is", replies1)
            setReplies(replies1);
            relayPool.close(relays);
        };
        getComments();
    }, [postId]);

    const captureNewComment = async (comment) => {
        let relays = ['wss://relay.damus.io', 'wss://relay.primal.net', "wss://nos.lol"]
        const pool = new SimplePool();
        const storedData = localStorage.getItem('memestr')
        if (!storedData) {
            alert("Login required to comment.")
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
        console.log("CommenteventId is ", commentEvent.id)
        console.log("calling pool", commentEvent)
        try {
            let x = await pool.publish(relays, commentEvent);
            console.log("called pool", x);
            let c = Promise.resolve(x)
            console.log("c is", c)
        } catch (error) {
            console.error("Error while publishing comment:", error);
        }
        const commentObject = [{
            "content": comment,
            "pubkey": uesrPublicKey
        }]
        setReplies(replies => [...commentObject, ...replies])
        console.log("replies after updation is", replies)
        setComment("")
        // c.map((cc) => {console.log(cc)})
    }

    return (
        <div>
            <div className={"title-post"}>
                <h1>{title}</h1>
            </div>
            <div className={"post-content"}>
                <img alt={""} className={"post-content"} src={imageLink} />
            </div>
            <Button variant="light" size={"lg"} class="bg-white" onClick={() => upvotePost(postId, OpPubKey)}>
                + {voteCount}
            </Button>{" "}
            <Button variant="light" class="bg-white" size={"lg"} onClick={() => sendNewZaps(postId, OpPubKey)}>
                Zap
            </Button>{" "}
            <div className="commentBox">
                <div class="mb-4 ml-1">
                    <form
                        onSubmit={async (event) => {
                            event.preventDefault(); // Prevent the default form submission behavior
                            await captureNewComment(comment); // Wait for comment to be captured and saved
                            // Additional actions after comment is saved can be added here
                        }}
                    >
                        <input
                            type="text"
                            placeholder=" Add a reply..."
                            className={"comment-form"}
                            value={comment}
                            onChange={captureComment}
                            required
                        />
                        <input class="bg-gray-200 ml-1 px-2 pt-1 pb-1.5 rounded " type="submit" />
                    </form>
                </div>
            </div>
            {replies.map(function (object) {
                return <Comments reply={object} />;
            })}
        </div>
    );
}

export default Post;
