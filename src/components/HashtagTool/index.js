import React from "react";
import { SimplePool } from "nostr-tools";
import Feed from "../Feed";

class HashTagTool extends React.Component {
  constructor() {
    super();
    this.state = {
      notes: []
    }
  }
  shouldComponentUpdate() {
    return true;
  }

  async componentDidMount() {
    const relayPool = new SimplePool();
    const filters = {
      limit: 50,
    };

    const relays = [
      "wss://relay.damus.io/",
      "wss://offchain.pub/",
      "wss://nos.lol/",
      "wss://relay.nostr.wirednet.jp/",
      "wss://nostr.wine/",
    ];
    filters["#t"] = ['memes', 'meme', 'funny', 'memestr'];


    let notes1 = await relayPool.list(relays, [filters]);
    this.setState({notes: notes1})
    // setNotes(notes);
    relayPool.close(relays)
  }

  render() {
    return <Feed notes={this.state.notes} />
  }
}
export default HashTagTool;
