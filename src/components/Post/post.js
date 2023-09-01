import { useParams, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./post.css";
import Button from "react-bootstrap/Button";
import { sendNewZaps, upvotePost } from "../Posts";
import { SimplePool } from "nostr-tools";
import Comments, { saveComment } from "../Comments";
// import { useHashTagContext } from "./HashtagTool"; // Import the custom hook
import {useHashTagContext} from "../HashtagTool";

function Post(props) {
    const { notes, setNotes } = useHashTagContext(); // Access notes and setNotes from the context
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
            const relays = ["wss://relay.damus.io", "wss://relay.primal.net"];
            const filters = {
                kinds: [1],
                "#e": [postId],
            };
            let replies1 = await relayPool.list(relays, [filters]);
            setReplies(replies1);
            relayPool.close(relays);
        };
        getComments();
    }, [postId]);

    function captureNewComment(newComment) {
        // Update the notes state with the new comment
        const updatedNotes = notes.map((note) => {
            if (note.id === postId) {
                // Check if the note matches the current post
                const updatedNote = { ...note };
                updatedNote.comments.push(newComment);
                return updatedNote;
            }
            return note;
        });

        // Update the context's notes state
        setNotes(updatedNotes);

        // Clear the comment input field
        setComment("");

        // Save the comment
        saveComment(postId, newComment);
    }

    return (
        <div>
            <div className={"title-post"}>
                <h1>{title}</h1>
            </div>
            <div className={"post-content"}>
                <img alt={""} className={"post-content"} src={imageLink} />
            </div>
            <Button variant="light" size={"lg"} onClick={() => upvotePost(postId, OpPubKey)}>
                + {voteCount}
            </Button>{" "}
            <Button variant="light" size={"lg"} onClick={() => sendNewZaps(postId, OpPubKey)}>
                Zap
            </Button>{" "}
            <div className="commentBox">
                <div>
                    <form
                        onSubmit={() => {
                            captureNewComment(comment);
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Add a comment"
                            className={"comment-form"}
                            value={comment}
                            onChange={captureComment}
                            required
                        />

                        <Button variant="secondary" type="submit">
                            Submit
                        </Button>
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
