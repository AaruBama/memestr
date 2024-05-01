import './index.css';
import { getUserDetailsFromPublicKey } from '../Profile';
import React, { useEffect, useState } from 'react';
import pic from '../Comments/profile.jpeg';
// import { calculateTimeDifference } from '../Posts';

// export const saveComment = (postId, comment) => {
//     console.log("Saving comment. ", comment)
//     let relays = ['wss://relay.damus.io', 'wss://relay.primal.net', "wss://nos.lol"]
//     const pool = new SimplePool();
//     const storedData = localStorage.getItem('memestr')
//     if (!storedData) {
//         alert("Login required to comment.")
//         return
//     }
//     let uesrPublicKey = JSON.parse(storedData).pubKey
//     let userPrivateKey = JSON.parse(storedData).privateKey
//     let sk = nip19.decode(userPrivateKey)
//     let commentEvent = {
//         kind: 1,
//         pubkey: uesrPublicKey,
//         created_at: Math.floor(Date.now() / 1000),
//         tags: [["e", postId], ["p", uesrPublicKey], ["alt", "reply"]],
//         content: comment,
//     }
//
//     commentEvent.id = getEventHash(commentEvent)
//     commentEvent.sig = getSignature(commentEvent, sk.data)
//     console.log("calling pool")
//     let x = pool.publish(relays, commentEvent)
//     console.log("called pool", x)
//     x.map(
//         (p1) => {
//             p1.then((resposne) => {
//                 console.log("Pool resolved", resposne)
//             }
//             ).catch((error) => {
//                 console.log("Pool is fucked", error)
//             })
//         })
// }

function Comments(props) {
    const [picture, setPicture] = useState(pic);
    const [username, setUsername] = useState(null);
    const [name, setName] = useState('Anonymous');
    let comment = props.reply;
    const commentatorPubKey = comment.pubkey;

    useEffect(() => {
        let a = getUserDetailsFromPublicKey(commentatorPubKey);
        a.then(value => {
            if (value && value.picture) {
                setPicture(value.picture);
                setUsername(value.display_name);
                setName(value.name);
            } else {
                setPicture(pic);
                setUsername('Unknown');
                setName('Anonymous');
            }
        }).catch(error => {
            console.error('Error fetching user details:', error);
            setPicture(pic);
            setUsername('Unknown');
            setName('Anonymous');
        });
    }, [commentatorPubKey]);

    return (
        <div className={'comment-container'}>
            <img className="profile1" src={picture} alt="Profile" />
            <div>
                <div className={'flex flex-row w-full'}>
                    <span className={'username-comment'}>{username}</span>
                    <span className={'name-comment text-gray-400'}>
                        @{name}
                    </span>
                </div>
                <p className={'comment'}>{comment.content}</p>
            </div>
        </div>
    );
}

export default Comments;
