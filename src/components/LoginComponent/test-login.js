import React, { useState, useEffect } from 'react';

function LoginTest() {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Function to handle the login button click
    const handleLoginClick = () => {
        // Implement your predefined login method here
        console.log('Logging in...');
    };

    // Function to handle the "Create Account" button click
    const handleCreateAccountClick = () => {
        setShowModal(true);
    };

    // Function to close the modal
    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Toggle the dropdown when the button is clicked
    const handleButtonClick = () => {
        setShowDropdown(!showDropdown);
    };

    // Close the dropdown when clicking outside of it
    useEffect(() => {
        const closeDropdown = () => {
            if (showDropdown) {
                setShowDropdown(false);
            }
        };

        window.addEventListener('click', closeDropdown);

        return () => {
            window.removeEventListener('click', closeDropdown);
        };
    }, [showDropdown]);

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="relative">
                <button
                    onClick={handleButtonClick}
                    className="px-4 py-2 bg-blue-500 text-white rounded focus:outline-none"
                >
                    Dropdown
                </button>

                {showDropdown && (
                    <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded shadow-lg">
                        <button
                            onClick={handleLoginClick}
                            className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                        >
                            Login
                        </button>
                        <button
                            onClick={handleCreateAccountClick}
                            className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                        >
                            Create Account
                        </button>
                    </div>
                )}

                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="bg-white p-4 rounded shadow-md">
                            <p className="text-center">Success</p>
                            <button
                                onClick={handleCloseModal}
                                className="block mt-4 mx-auto px-4 py-2 bg-blue-500 text-white rounded focus:outline-none"
                            >
                                Okay
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LoginTest;
