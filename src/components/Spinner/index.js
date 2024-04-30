import React from 'react';
import './index.css';

function Spinner() {
    console.log('loading spinner');
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '50vh',
                marginTop: '25vh',
                backgroundColor: 'transparent',
            }}>
            <div className="lds-ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
}

export default Spinner;
