import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect } from 'react';
import { useState } from 'react';
import { copyValueToClipboard } from '../../LoginDropDownComponent/NewKeysModal';
import noProfilePictureURL from '../../../Icons/noImageUser.svg';

// import ShareOnWhatsApp from '../shareOnWhatsApp';

import { ReactComponent as CopyLinkSvg } from '../../../Icons/CopyLinkSvg.svg';
import { getUserFromName, sendDM } from '../../../helpers/user';

const Alert = ({ message, duration }) => {
    const [showAlert, setShowAlert] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowAlert(false);
        }, duration);

        return () => {
            clearTimeout(timeout);
        };
    }, [duration]);

    return showAlert ? (
        <div
            className={`fixed inset-0 flex items-center text-yellow-400 justify-center bg-opacity-50 bg-gray-800 dark:bg-gray-900 transition-opacity`}
            style={{
                height: showAlert ? '5%' : '0',
                transition: `height ${duration}ms ease-in-out`,
            }}
            role="alert">
            {message}
        </div>
    ) : null;
};

export function ShareModal({ isOpen, onClose, postUrl }) {
    const [inputValue, setInputValue] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);

    const [searchedUser, setSearchedUser] = useState(null);

    let shareUrl = 'https://memestr.app/#' + postUrl;

    const [showAlert, setShowAlert] = useState(false);
    const [sendButtonDisabled, setSendButtonDisabled] = useState(true);

    const toggleUserSelection = userId => {
        setSelectedUsers(prevSelectedUsers => {
            const newSelectedUsers = prevSelectedUsers.includes(userId)
                ? prevSelectedUsers.filter(id => id !== userId)
                : [...prevSelectedUsers, userId];

            setSendButtonDisabled(newSelectedUsers.length === 0);

            return newSelectedUsers;
        });
    };

    const isUserSelected = userId => {
        return selectedUsers.includes(userId);
    };

    const handleSearch = async e => {
        e.preventDefault();
        setSearchedUser(null);
        if (inputValue.trim() !== '') {
            const userList = await getUserFromName(inputValue);
            const parsedUsers = parseUserContent(userList);
            setSearchedUser(parsedUsers);
        }
    };

    const handleInputChange = async e => {
        const value = e.target.value;
        setInputValue(value);
    };

    const parseUserContent = userList => {
        const uniqueKeysSet = new Set();
        const usersWithDistinctKeys = [];
        userList.forEach(user => {
            if (!uniqueKeysSet.has(user.pubkey)) {
                uniqueKeysSet.add(user.pubkey);
                const content = JSON.parse(user.content);
                let name = 'Anonymous';
                if (content.name && content.name.trim !== '') {
                    name = content.name;
                }
                usersWithDistinctKeys.push({
                    id: user.pubkey,
                    picture: content.picture,
                    name: name,
                });
            }
        });
        return usersWithDistinctKeys;
    };

    const showAlertWithTimeout = duration => {
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, duration);
    };

    function removeSelectedUsers() {
        setSelectedUsers([]);
    }

    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={onClose}>
                    {/*Backgroun black color*/}
                    <Transition.Child
                        as={Fragment}
                        enter="transform ease-out duration-50 transition-transform"
                        enterFrom="opacity-0 translate-y-full"
                        enterTo="opacity-100 translate-y-0"
                        leave="transform ease-in duration-50 transition-transform"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-full">
                        <div className="fixed inset-0 bg-black bg-opacity-50" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="transform ease-out duration-100 transition-transform"
                                enterFrom="opacity-0 translate-y-full"
                                enterTo="opacity-100 translate-y-0"
                                leave="transform ease-in duration-100 transition-transform"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-full">
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900">
                                        Share
                                    </Dialog.Title>
                                    <form
                                        className="flex"
                                        onSubmit={handleSearch}>
                                        <input
                                            type="text"
                                            value={inputValue}
                                            onChange={handleInputChange}
                                            className="flex-grow w-full border border-gray-300 p-2 mt-2"
                                            placeholder="Username..."
                                        />
                                        <button
                                            type="submit"
                                            className="mt-2 ml-2 p-2 bg-blue-500 text-white rounded">
                                            Submit
                                        </button>
                                    </form>

                                    <div className="mt-4">
                                        {searchedUser && (
                                            <div className="flex flex-wrap pl-4 ">
                                                {searchedUser.map(user => (
                                                    <div
                                                        key={user.id}
                                                        className={
                                                            'flex flex-col items-center m-2 ' +
                                                            (isUserSelected(
                                                                user.id,
                                                            )
                                                                ? 'selected-user'
                                                                : '')
                                                        }
                                                        style={{
                                                            width: '80px', // Add margin to create a gap
                                                        }}
                                                        onClick={() =>
                                                            toggleUserSelection(
                                                                user.id,
                                                            )
                                                        }>
                                                        <div className="w-full h-12 flex items-center justify-center overflow-hidden ">
                                                            <img
                                                                src={
                                                                    user.picture ||
                                                                    noProfilePictureURL
                                                                }
                                                                alt={
                                                                    user.name ||
                                                                    'Anonymous'
                                                                }
                                                                className="w-12 h-12 rounded-full"
                                                                onError={e => {
                                                                    e.target.src =
                                                                        noProfilePictureURL; // Replace with your default image URL
                                                                    e.target.alt =
                                                                        'Default Image';
                                                                }}
                                                            />
                                                            {isUserSelected(
                                                                user.id,
                                                            ) && (
                                                                <div className="selected-overlay">
                                                                    {/* Add a tick mark or any other indicator */}
                                                                    ✓
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span className="mt-1 text-s text-center block">
                                                            {user.name}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <span className="flex flex-row gap-2 m-2 justify-start">
                                        <span>
                                            <button
                                                className="flex items-center my-2"
                                                onClick={() => {
                                                    copyValueToClipboard(
                                                        encodeURIComponent(
                                                            shareUrl,
                                                        ),
                                                    );
                                                    showAlertWithTimeout(3000);
                                                }}>
                                                <CopyLinkSvg />
                                            </button>
                                            <span className="text-sm text-gray-500 my-2">
                                                Copy Link
                                            </span>
                                        </span>
                                        {/*<div>*/}
                                        {/*    <button disabled={true}>*/}
                                        {/*        <ShareOnWhatsApp*/}
                                        {/*            shareUrl={shareUrl}*/}
                                        {/*        />*/}
                                        {/*    </button>*/}
                                        {/*</div>*/}
                                    </span>

                                    <div className="my-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                sendDM(selectedUsers, shareUrl);
                                                removeSelectedUsers();
                                            }}
                                            className={`mt-2 p-2 bg-green-500 text-white rounded ${
                                                sendButtonDisabled
                                                    ? 'cursor-not-allowed opacity-50'
                                                    : ''
                                            }`}
                                            disabled={sendButtonDisabled}>
                                            Send
                                        </button>
                                        <button
                                            type="button"
                                            className="mx-2 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={onClose}>
                                            I'm done, thanks!
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            {showAlert && (
                <div className="relative">
                    <div className="h-screen bg-gray-600 dark:bg-gray-900 opacity-30 absolute inset-0" />

                    <Alert message="Link Copied Successfully" duration={3000} />
                </div>
            )}
        </>
    );
}
