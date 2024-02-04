import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import getUserDetailsFromPrivateKey from '../Profile';
import { getPublicKey, nip19 } from 'nostr-tools';
import { ReactComponent as CloseIcon } from '../../Icons/CloseIcon.svg';
function LoginModal({ isOpen, onClose }) {
    const [loggedInUserDetails, setLoggedInUserDetails] = useState({});
    const [privateKey, setPrivateKey] = useState('');

    function handlePrivateKeyChange(event) {
        setPrivateKey(event.target.value);
    }
    function logUserIn() {
        if (privateKey.trim() === '') {
            return;
        }
        const storedData = localStorage.getItem('memestr');
        if (storedData) {
            const userDetails = JSON.parse(storedData);
            setLoggedInUserDetails({
                display_name: userDetails.display_name,
                picture: userDetails.picture,
                name: userDetails.name,
            });
            onClose(userDetails); // Close the modal if user data is in localStorage
        } else {
            getUserDetailsFromPrivateKey(privateKey).then(value => {
                const newUserDetails = {
                    display_name: value.display_name,
                    picture: value.picture,
                    name: value.name,
                    pubKey: getPublicKey(nip19.decode(privateKey).data),
                    privateKey, // Consider encrypting this
                };
                setLoggedInUserDetails(newUserDetails);
                localStorage.setItem('memestr', JSON.stringify(newUserDetails));
                onClose(newUserDetails); // Close the modal after setting new user details
            });
        }
    }

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-40"
                onClose={() => {
                    onClose(loggedInUserDetails);
                }}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-10">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-40 overflow-hidden">
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-lg font-semibold leading-6 text-gray-900 p-3 sm:p-0">
                                                Login to Memestr
                                                <button
                                                    type="button"
                                                    className="absolute top-3 right-3 p-3 sm:p-0"
                                                    onClick={() => {
                                                        onClose(
                                                            loggedInUserDetails,
                                                        );
                                                    }}>
                                                    <CloseIcon
                                                        className="h-6 w-6 text-gray-700"
                                                        aria-hidden="true"
                                                    />
                                                </button>
                                            </Dialog.Title>
                                            <div className="mt-5">
                                                <Dialog.Description>
                                                    <div className="mb-3">
                                                        <label
                                                            htmlFor="loginKey"
                                                            className="flex justify-start block mb-2 text-sm font-medium font-sans text-gray-500 dark:text-black">
                                                            Enter your Nostr
                                                            private key
                                                            (starting with
                                                            “nsec”):
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="loginKey"
                                                            onChange={
                                                                handlePrivateKeyChange
                                                            }
                                                            value={privateKey}
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                            placeholder="Guy_who_farted"
                                                            required
                                                        />
                                                        <div className="flex align-middle justify mt text-sm text-gray-300 p-1">
                                                            We don't store your
                                                            keys.
                                                        </div>
                                                    </div>
                                                </Dialog.Description>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-3 bg-white text-right">
                                    <button
                                        type="button"
                                        className={`inline-flex justify-end rounded-md border border-transparent shadow-sm px-4 py-2 text-white font-medium sm:text-sm ${
                                            privateKey.trim()
                                                ? 'bg-gradient-to-r from-blue-500 to-teal-500 hover:bg-blue-700'
                                                : 'bg-gradient-to-r from-blue-500 to-teal-500 hover:bg-blue-700'
                                        }`}
                                        disabled={!privateKey.trim()}
                                        onClick={() => {
                                            logUserIn();
                                        }}>
                                        Login
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}

export default LoginModal;
