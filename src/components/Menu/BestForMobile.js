import { useState, useEffect } from 'react';

function BestForMobile() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 5000);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    return isVisible ? (
        <div className="hidden lg:block fixed top-14 left-0 w-full bg-yellow-500 text-red-500 text-center p-2">
            Best optimized for mobile view
        </div>
    ) : null;
}

export default BestForMobile;
