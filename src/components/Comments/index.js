import "./index.css"
import {getUserDetailsFromPublicKey} from "../Profile";
import React, {useEffect, useState} from "react";
import {SimplePool} from "nostr-tools";



function Comments (props) {
    const [picture, setpicture] = useState('')
    const [username, setUsername] = useState('Anonymous')
    let comment = props.reply
    const commentatorPubKey = comment.pubkey
    useEffect(() => {
        let a = getUserDetailsFromPublicKey(commentatorPubKey);
        a.then((value) => {
            // picture = value.picture
            setpicture(value.picture)
            setUsername(value.display_name)
        });
    }, [])

    return (
        <div className={"comment-container"}>
            <img className='profile1' src={picture} alt="Profile" />
            <span className={"username-comment"}>{username}</span>
            {comment.content}
        </div>
    )

}
export default Comments;