import "./index.css"
import {getUserDetailsFromPublicKey} from "../Profile";
import React, {useEffect, useState} from "react";
import {getEventHash, getSignature, nip19, SimplePool} from "nostr-tools";

export const saveComment = (postId, comment) => {
    let relays = ['wss://relay.damus.io', 'wss://relay.primal.net', "wss://nos.lol", "wss://nostr.bitcoiner.social"]
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
    pool.publish(relays, commentEvent)
    pool.close(relays);
}

function Comments (props) {
    const [picture, setpicture] = useState('')
    const [username, setUsername] = useState(null)
    const [name, setName] = useState('Anonymous')


    let comment = props.reply
    const commentatorPubKey = comment.pubkey
    useEffect(() => {
        let a = getUserDetailsFromPublicKey(commentatorPubKey);
        a.then((value) => {
            setpicture(value.picture)
            setUsername(value.display_name)
            setName(value.name)
        }).catch(
            console.log("something went wrong fetching comment from the pubkey")

        )
        ;
    }, [commentatorPubKey] )

    return (
        <div className={"comment-container"}>
            <img className='profile1' src={picture} alt="Profile" />
            <div>
                {/*<div className={"username-comment"}>{username} @{name}</div>*/}
                <span className={"username-comment"}>{username}</span>
                <span className={"name-comment"}>@{name}</span>
                <div className={"comment"}>{comment.content}</div>
            </div>
        </div>
    )

}
export default Comments;