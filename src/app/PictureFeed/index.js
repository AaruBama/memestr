import NDK from '@nostr-dev-kit/ndk';
import { useEffect } from 'react';
import 'websocket-polyfill';

const VideoFeed = () => {
    useEffect(() => {
        console.log('Video is Feed');
        async function fetchData() {
            console.log('Fetching data');
            try {
                const ndk = new NDK({
                    explicitRelayUrls: [
                        'wss://relay.damus.io',
                        'wss://relay.primal.net',
                        'wss://nos.lol/',
                    ],
                });

                await ndk.connect();

                const filter = { kinds: [20], limit: 10 };
                console.log('Fetching data1');
                const events = await ndk.fetchEvents(filter);
                for (let event of events) {
                    let e = event.tags;
                    console.log(e);
                }
                console.log('events', events);
                return events;
            } catch (error) {
                console.error(error);
            }
        }
        fetchData()
            .then(() => console.log('fetchData completed'))
            .catch(err => console.error('Error in fetchData:', err));
    }, []);

    return <div>Video Feed</div>;
};

export default VideoFeed;
