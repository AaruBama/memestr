import Posts, { extractLinksFromText } from '../Posts';
import './index.css';
import React, { useEffect, useRef } from 'react';
import { PageContext } from '../../context/PageContext';

function useIntersectionObserver(loadMore, options = {}) {
    const targetRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        loadMore();
                    }
                });
            },
            {
                root: options.root || null, // Default to viewport
                rootMargin: options.rootMargin || '0px', // Default margin
                threshold: options.threshold || 1.0, // Fully visible by default
            },
        );

        const currentTarget = targetRef.current;

        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [loadMore, options]);

    return targetRef;
}
//eslint
function Feed(props) {
    const className = props.className || '';
    const loadMoreRef = useIntersectionObserver(
        () => {
            if (!props.isLoading) {
                props.onLoadMore();
            }
        },
        {
            root: null, // Use the viewport
            rootMargin: '200px', // Trigger 200px before the target element is in view
            threshold: 0.1, // Trigger when 10% of the element is visible
        },
    );

    const triggerPoint = Math.max(0, props.notes.length - 10);

    return (
        <PageContext.Provider value={props.isHomePage}>
            <div
                className={`
                      feed-container
                      mx-auto max-w-xl
                      ${className}
                    `}>
                {props.notes
                    .filter(
                        note => extractLinksFromText(note.content).length > 0,
                    ) // Filter before mapping
                    .map((note, index) => (
                        <div key={note.id}>
                            <Posts note={note} />
                            {index === triggerPoint && (
                                <div ref={loadMoreRef} />
                            )}
                        </div>
                    ))}
            </div>
        </PageContext.Provider>
    );
}

export default Feed;
