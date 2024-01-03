import React, { Fragment, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import RegistrationModal from './NewKeysModal';
import UserDetailsForAccountCreationModal from './UserDetailsForAccountCreationModal';
import { generateNewKeys } from '../Login';
import LoginModal from './LoginModal';
import { ReactComponent as CreateAccountIcon } from '../../Icons/CreateAccountSvg.svg';
import { ReactComponent as LoginIcon } from '../../Icons/LoginSvg.svg';
import { ReactComponent as Profile } from '../../Icons/ProfileLogo.svg';

function DropdownComponent() {
    const [newKeysModal, setNewKeysModal] = useState(false);
    const [newUserDetailsModal, setNewUserDetailsModal] = useState(false);
    const [loginModal, setLoginModal] = useState(false);
    const [sk, setSk] = useState('');
    const [userDetails, setUserDetails] = useState(getUserDetailsFromLocal());
    const [pk, setPk] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const openNewKeysModal = () => {
        setNewKeysModal(true);
        let x = generateNewKeys();
        setSk(x['epk']);
        setPk(x['epubKey']);
    };

    function getUserDetailsFromLocal() {
        const storedData = localStorage.getItem('memestr');
        return storedData ? JSON.parse(storedData) : null;
    }

    const openUserDetailsModal = () => {
        setNewUserDetailsModal(true);
    };

    const closeModal = () => {
        setNewKeysModal(false);
        openUserDetailsModal();
    };

    const closeUserDetailModal = () => {
        setNewUserDetailsModal(false);

        if (getUserDetailsFromLocal()) {
            setIsLoggedIn(true);
        }
    };

    const openLoginModal = () => {
        // Reset userDetails when opening login modal
        setUserDetails(null);
        setLoginModal(true);
    };

    const closeLoginModal = userDetails => {
        setLoginModal(false);
        if (userDetails && Object.keys(userDetails).length !== 0) {
            setUserDetails(userDetails);
            setIsLoggedIn(true);
        } else {
            setUserDetails({});
        }
    };

    useEffect(() => {
        const storedData = localStorage.getItem('memestr');
        if (storedData) {
            setUserDetails(JSON.parse(storedData));
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
            setUserDetails(null); // Reset userDetails
        }
    }, [isLoggedIn]); // Now useEffect depends on isLoggedIn

    function logout() {
        localStorage.removeItem('memestr');
        setUserDetails(null);
        setIsLoggedIn(false);
        alert('Logged out successfully');
    }

    return (
        <div className="inline-block text-left">
            <Menu as="div" className="relative">
                <div>
                    <Menu.Button className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-teal-500 p-2 hover:from-pink-500 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                        {!userDetails || userDetails.picture === undefined ? (
                            <Profile />
                        ) : (
                            <img
                                src={userDetails.picture}
                                alt="Profile"
                                className="w-8 h-8 rounded-full"
                            />
                        )}
                    </Menu.Button>
                </div>

                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95">
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            {!isLoggedIn ? (
                                <>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={openNewKeysModal}
                                                className={`${
                                                    active
                                                        ? 'font-semibold'
                                                        : 'font-normal'
                                                } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 hover:text-gray-900`}
                                                disabled={isLoggedIn}>
                                                <CreateAccountIcon className="mr-2 h-5 w-5" />
                                                Create Account
                                            </button>
                                        )}
                                    </Menu.Item>

                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={openLoginModal}
                                                className={`${
                                                    active
                                                        ? 'font-semibold'
                                                        : 'font-normal'
                                                } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 hover:text-gray-900`}>
                                                <LoginIcon className="mr-2 h-5 w-5" />
                                                Login
                                            </button>
                                        )}
                                    </Menu.Item>
                                </>
                            ) : (
                                <>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <span
                                                className={`${
                                                    active
                                                        ? 'font-semibold text-gray-900'
                                                        : 'font-normal text-gray-700'
                                                } flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                                                {userDetails.name}
                                            </span>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={logout}
                                                className={`${
                                                    active
                                                        ? 'font-semibold text-gray-900'
                                                        : 'font-normal text-gray-700'
                                                } group flex w-full items-center rounded-md px-2 py-2 text-sm hover:text-gray-900`}>
                                                Logout
                                            </button>
                                        )}
                                    </Menu.Item>
                                </>
                            )}
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
            <RegistrationModal
                isOpen={newKeysModal}
                onClose={closeModal}
                sk={sk}
                pk={pk}
            />
            <UserDetailsForAccountCreationModal
                isOpen={newUserDetailsModal}
                onClose={closeUserDetailModal}
                sk={sk}
                pk={pk}
            />
            <LoginModal isOpen={loginModal} onClose={closeLoginModal} />
        </div>
    );
}

export default DropdownComponent;
