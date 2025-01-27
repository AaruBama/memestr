import React, { useState, useRef, useEffect } from 'react';
import { ReactComponent as MoreOptionsIcon } from '../../Icons/LikeSvg.svg';
const MoreOptionsMenu = ({ options = [], onOptionSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = event => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleOptionSelect = option => {
        onOptionSelect?.(option);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={toggleMenu}
                className="p-2 hover:bg-gray-100 rounded-full">
                <MoreOptionsIcon width={20} height={20} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-200 border rounded-lg shadow-lg">
                    <ul>
                        {options.map((option, index) => (
                            <li
                                key={index}
                                onClick={() => handleOptionSelect(option)}
                                className="px-4 py-2 text-16/[20]  hover:bg-gray-100 rounded cursor-pointer duration-200">
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MoreOptionsMenu;
