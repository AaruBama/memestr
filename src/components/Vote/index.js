// import { finishEvent, Kind } from './event.ts'
// import { finishReactionEvent, getReactedEventPointer } from './nip25.ts'
// import { generatePrivateKey, getPublicKey, SimplePool, getEventHash, getSignature, nip25} from 'nostr-tools'

// function upvotePost(note) {
//     console.log("Inside the vote component")
//     console.log("Value of note is ", note)
//     const pool = new SimplePool()

//     // let nip = nip25.finishReactionEvent()

//     let relays = ['wss://relay.damus.io', 'wss://relay.primal.net']

//     let privateKey = generatePrivateKey() // `sk` is a hex string
//     let publicKey = getPublicKey(privateKey) // `pk` is a hex string
//     let event = {
//         kind: 7,
//         pubkey: publicKey,
//         created_at: Math.floor(Date.now() / 1000),
//         tags: [["e", note.id], ["p", note.pubkey]],
//         content: '+'
//       }
//       event.id = getEventHash(event)
//       event.sig = getSignature(event, privateKey)
//       console.log("event is created. The created event is - ", event)
//       let pubs = pool.publish(relays, event)
//       console.log("pubs is ", pubs)
    
// }

