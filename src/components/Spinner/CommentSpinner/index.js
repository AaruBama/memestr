import React from 'react';
import './index.css';

function CommentSpinner() {
    return (
        <div className="flex justify-center mt-8 h-100vh">
            <div className="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
}

export default CommentSpinner;
