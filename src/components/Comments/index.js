import './index.css';
import { getUserDetailsFromPublicKey } from '../Profile';
import React, { useEffect, useState } from 'react';
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
    const [picture, setpicture] = useState('');
    const [username, setUsername] = useState(null);
    const [name, setName] = useState('Anonymous');

    let comment = props.reply;
    // let { unit, duration } = calculateTimeDifference(comment.created_at);
    const commentatorPubKey = comment.pubkey;
    useEffect(() => {
        let a = getUserDetailsFromPublicKey(commentatorPubKey);
        a.then(value => {
            setpicture(value.picture);
            setUsername(value.display_name);
            setName(value.name);
        }).catch();
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
                    {/*<span*/}
                    {/*    className=' pl-2 items-center text-gray-500 text-sm pr-1'>*/}
                    {/*        {duration}*/}
                    {/*    {unit}{' '}*/}
                    {/*    </span>*/}
                </div>
                <p className={'comment'}>{comment.content}</p>
            </div>
        </div>
    );
}

export default Comments;
