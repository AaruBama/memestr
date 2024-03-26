import React, { useState, useEffect } from 'react';
import { ReactComponent as CloseIcon } from '../Icons/CloseIcon.svg';

export function Notification({ message, show, duration = 3000, onClose }) {
    const [visible, setVisible] = useState(show);
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                setVisible(false);
                if (onClose) {
                    onClose();
                }
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [show, duration, onClose]);
    if (!visible) {
        return null;
    }
    return (
        <div className="fixed top-0 inset-x-0 flex justify-center items-start z-50">
            <div className="mt-12 p-4 bg-black text-white rounded-lg shadow-lg transition-transform transform-gpu animate-slideInSlideOut flex items-center">
                <p className="text-bold text-white px-2">{message}</p>
                <CloseIcon
                    className="h-6 w-6 mr-2 text-white cursor-pointer"
                    onClick={() => setVisible(false)}
                />
            </div>
        </div>
    );
}
