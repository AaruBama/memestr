import React, { Fragment, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import RegistrationModal from './NewKeysModal';
import UserDetailsForAccountCreationModal from './UserDetailsForAccountCreationModal';
import { generateNewKeys } from '../Login';
import LoginModal from './LoginModal';
import { ReactComponent as LoginIcon } from '../../Icons/LoginSvg.svg';
import { ReactComponent as Profile } from '../../Icons/ProfileLogo.svg';
import { useAuth } from '../../AuthContext';
import { ReactComponent as Logout } from '../../Icons/LogoutSvg.svg';
import { ReactComponent as ProfileCircle } from '../../Icons/ProfileCircle.svg';
import { ReactComponent as ExtensionLogin } from '../../Icons/ExtentionLogin.svg';
import { getUserDetailsFromPublicKey } from '../Profile';

function DropdownComponent() {
    const navigate = useNavigate(); // Initialize navigate
    const [newKeysModal, setNewKeysModal] = useState(false);
    const [newUserDetailsModal, setNewUserDetailsModal] = useState(false);
    const [loginModal, setLoginModal] = useState(false);
    const [sk, setSk] = useState('');
    const [userDetails, setUserDetails] = useState(getUserDetailsFromLocal());
    const [pk, setPk] = useState('');
    const { isLoggedIn, setIsLoggedIn } = useAuth();

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

    const loginWithExtension = async () => {
        if (window.nostr) {
            try {
                const publicKey = await window.nostr.getPublicKey();
                const userDetails =
                    await getUserDetailsFromPublicKey(publicKey);
                if (userDetails) {
                    setUserDetails({
                        display_name: userDetails.display_name,
                        picture: userDetails.picture,
                        name: userDetails.name,
                        pubKey: publicKey,
                    });
                    setIsLoggedIn(true);

                    localStorage.setItem(
                        'memestr',
                        JSON.stringify({
                            display_name: userDetails.display_name,
                            picture: userDetails.picture,
                            name: userDetails.name,
                            pubKey: publicKey,
                        }),
                    );
                } else {
                    alert('User details not found.');
                }
            } catch (error) {
                console.error('Error logging in with extension:', error);
                alert('There was an error during the login process.');
            }
        } else {
            alert(
                'No extension found. Please try logging in with key instead.',
            );
        }
    };

    useEffect(() => {
        const storedData = localStorage.getItem('memestr');
        if (storedData) {
            setUserDetails(JSON.parse(storedData));
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
            setUserDetails(null);
        }
    }, [isLoggedIn, setIsLoggedIn]);

    function logout() {
        localStorage.removeItem('memestr');
        setUserDetails(null);
        setIsLoggedIn(false);
        alert('Logged out successfully');
    }

    const redirectToProfile = () => {
        navigate('/profile');
    };

    return (
        <div className="inline-block text-left">
            <Menu as="div" className="relative ">
                <div>
                    <Menu.Button className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-teal-500 p-2 hover:from-pink-500 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 hidden md:inline-flex">
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

                <div className="md:hidden">
                    <Menu.Button>
                        {!userDetails || userDetails.picture === undefined ? (
                            <ProfileCircle />
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
                    <Menu.Items
                        className={`absolute z-50 md:z-10 mb-12 md:mt-12 w-48 h-max p-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none right-0 md:right-0 bottom-0 md:top-0`}>
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
                                                <ProfileCircle className="mr-2 h-6 w-6" />
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
                                                <LoginIcon className="mr-2 h-6 w-6" />
                                                Login
                                            </button>
                                        )}
                                    </Menu.Item>

                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={loginWithExtension}
                                                className={`${
                                                    active
                                                        ? 'font-semibold'
                                                        : 'font-normal'
                                                } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 hover:text-gray-900`}>
                                                <ExtensionLogin className="mr-2 h-6 w-6" />
                                                Extension Login
                                            </button>
                                        )}
                                    </Menu.Item>
                                </>
                            ) : (
                                <>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={redirectToProfile}
                                                className={`${
                                                    active
                                                        ? 'font-semibold text-gray-900'
                                                        : 'font-normal text-gray-700'
                                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                                                <ProfileCircle className="mr-2 h-6 w-6" />
                                                {userDetails.name}
                                            </button>
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
                                                <Logout className="mr-2 h-6 w-6" />
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
