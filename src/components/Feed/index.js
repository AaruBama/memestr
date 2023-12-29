import Posts from '../Posts';
import './index.css';
import React, { useEffect, useRef } from 'react';

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
        <div className="feed-container mt-12 mx-auto max-w-xl">
            {props.notes.map((note, index) => (
                <div key={note.id} className="mb-8">
                    {' '}
                    {/* Adjusted margin-bottom for spacing */}
                    {/* Post component with border */}
                    <div className="bg-white">
                        <Posts note={note} />
                    </div>
                    {/* Load more reference */}
                    {index === props.notes.length - 10 && (
                        <div ref={loadMoreRef} />
                    )}
                </div>
            ))}
        </div>
    );
}

export default Feed;
