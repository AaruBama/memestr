import React from 'react';
import { ReactComponent as SubmitIcon } from '../../Icons/SubmitIcon.svg';
import './commentInput.css';

const CommentInput = ({
    comment,
    setComment,
    onSubmit,
    variant = 'desktop', // 'mobile' or 'desktop'
}) => {
    const handleSubmit = e => {
        e.preventDefault();
        onSubmit(comment);
    };

    const captureComment = event => {
        setComment(event.target.value);
    };

    return (
        <div className={`comment-input-container ${variant}`}>
            <form onSubmit={handleSubmit} className="comment-input-form">
                <input
                    type="text"
                    placeholder="Add a comment..."
                    className="comment-input"
                    value={comment}
                    onChange={captureComment}
                    aria-label="Add a comment"
                />
                <button
                    type="submit"
                    className="comment-submit-btn"
                    aria-label="Submit comment">
                    <SubmitIcon className="comment-submit-icon" />
                </button>
            </form>
        </div>
    );
};

export default CommentInput;
