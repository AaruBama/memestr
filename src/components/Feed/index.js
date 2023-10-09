import Posts from '../Posts';
import './index.css';
import React, { useEffect, useRef } from 'react';

// import Spinner from "../Spinner";

function useIntersectionObserver(loadMore) {
    const targetRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadMore();
                }
            });
        });

        const currentTarget = targetRef.current;

        if (currentTarget) {
            observer.observe(targetRef.current);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [loadMore]);

    return targetRef;
}

function Feed(props) {
    // const [isLoading, setIsLoading] = useState(false);

    // useEffect(() => {
    //     // Set isLoading to true when onLoadMore is called
    //     if (props.isLoading) {
    //         setIsLoading(true);
    //     } else {
    //         // If isLoading is false, hide the spinner
    //         setIsLoading(false);
    //     }
    // }, [props.isLoading]);

    const loadMoreRef = useIntersectionObserver(props.onLoadMore);
    return (
        <div className={'feed-container'}>
            {props.notes.map((note, index) => {
                return (
                    <div key={note.id}>
                        <Posts note={note} />
                        {index === props.notes.length - 10 && (
                            <div ref={loadMoreRef} />
                        )}
                    </div>
                );
            })}
            {/*{*/}
            {/*    isLoading && <Spinner />*/}
            {/*}*/}
        </div>
    );
}

export default Feed;
