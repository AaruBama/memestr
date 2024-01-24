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
    const loadMoreRef = useIntersectionObserver(props.onLoadMore);
    return (
        <div className="feed-container bg-white mt-12 mx-auto max-w-xl lg:mr-60">
            {props.notes.map((note, index) => (
                <div key={note.id}>
                    <Posts note={note} />
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
