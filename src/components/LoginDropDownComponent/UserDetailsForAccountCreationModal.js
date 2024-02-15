import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { getEventHash, getSignature, nip19, SimplePool } from 'nostr-tools';
import UploadAndDisplayImage from './UploadUserPicture';
import { getProfileFromPublicKey } from '../Profile';

function UserDetailsForAccountCreation({ isOpen, onClose, sk, pk }) {
    const [username, setUsername] = useState('');
    const [aboutMe, setAboutMe] = useState('');
    const [fileString, setFileString] = useState('');

    const choosePicture = url => {
        setFileString(url);
    };

    function handleUsernameChange(event) {
        setUsername(event.target.value);
    }

    async function registerAccount(sk, pk) {
        const relays = [
            'wss://relay.damus.io',
            'wss://relay.primal.net',
            'wss://relay.snort.social',
            'wss://relay.hllo.live',
        ];

        const pool = new SimplePool();
        const encodedSk = sk;
        sk = nip19.decode(sk);
        pk = nip19.decode(pk);

        const content = {
            name: username,
            about: aboutMe,
        };

        if (fileString.length > 0) {
            content.picture = fileString;
        }

        const userRegisterEvent = {
            kind: 0,
            pubkey: pk.data,
            created_at: Math.floor(Date.now() / 1000),
            tags: [
                ['p', pk.data],
                ['w', 'memestrAccount'],
            ],
            content: JSON.stringify(content),
        };

        userRegisterEvent.id = getEventHash(userRegisterEvent);
        userRegisterEvent.sig = getSignature(userRegisterEvent, sk.data);

        try {
            await pool.publish(relays, userRegisterEvent);

            pool.close(relays);

            const profile = await getProfileFromPublicKey(pk.data);
            let details = JSON.parse(profile.content);
            details.pubKey = pk.data;
            details.privateKey = encodedSk; // Encrypt it.
            localStorage.setItem('memestr', JSON.stringify(details));
            console.log('Set the default login in local cache.', details);
        } catch (error) {
            console.error('Error during registration:', error);
        }
    }

    // async function registerAccount(sk, pk) {
    //     let relays = [
    //         'wss://relay.damus.io',
    //         'wss://relay.primal.net',
    //         'wss://nos.lol',
    //         'wss://nostr.bitcoiner.social',
    //     ];
    //     const pool = new SimplePool();
    //     let encodedPubKey = pk
    //     sk = nip19.decode(sk);
    //     pk = nip19.decode(pk);
    //     console.log('sk pk is', sk, pk);
    //     let content = {
    //         name: username,
    //         about: aboutMe,
    //     };
    //
    //     if (fileString.length > 0) {
    //         content['picture'] = fileString;
    //     }
    //     content = JSON.stringify(content);
    //     let userRegisterEvent = {
    //         kind: 0,
    //         pubkey: pk.data,
    //         created_at: Math.floor(Date.now() / 1000),
    //         tags: [
    //             ['p', pk.data],
    //             ['w', 'memestrAccount'],
    //         ],
    //         content: content,
    //     };
    //
    //     userRegisterEvent.id = getEventHash(userRegisterEvent);
    //
    //     userRegisterEvent.sig = getSignature(userRegisterEvent, sk.data);
    //     let x = await pool.publish(relays, userRegisterEvent);
    //     console.log('userRegistration Event', userRegisterEvent);
    //     console.log('o=o=o', x);
    //
    //     pool.close(relays);
    //     let userDetails = getUserDetailsFromPrivateKey(privateKey, false);
    //     userDetails.then(value => {
    //         value['pubKey'] = encodedPubKey;
    //         value['privateKey'] = sk; //Encrypt it.
    //         localStorage.setItem('memestr', JSON.stringify(value));
    //         console.log('Set the default login in local cache.', loggedInUserDetails);
    //     }
    // }

    function handleAboutMeChange(event) {
        setAboutMe(event.target.value);
    }

    return (
        <Transition.Root show={isOpen} as={Fragment} className="z-50">
            <Dialog
                as="div"
                className="relative z-40"
                onClose={() => {
                    onClose();
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
                            <Dialog.Panel className="max-height= relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-base font-semibold leading-6 text-gray-900 pb-6">
                                                Go have fun!
                                            </Dialog.Title>

                                            <Dialog.Description>
                                                <div className="mb-4">
                                                    <label
                                                        htmlFor="username"
                                                        className="flex justify-start block mb-1 text-sm font-medium text-gray-900 dark:text-black">
                                                        Username
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="username"
                                                        onChange={
                                                            handleUsernameChange
                                                        }
                                                        value={username}
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        placeholder="Guy_who_farted"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor="about"
                                                        className="flex justify-start block mb-1 text-sm font-medium text-gray-900 dark:text-gray-800">
                                                        About
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="username"
                                                        onChange={
                                                            handleAboutMeChange
                                                        }
                                                        value={aboutMe}
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        placeholder="Guy_who_farted"
                                                        required
                                                    />
                                                </div>
                                                <UploadAndDisplayImage
                                                    setPicture={choosePicture}
                                                />
                                            </Dialog.Description>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="button"
                                        className="mt-2 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        onClick={async () => {
                                            await registerAccount(sk, pk);
                                            onClose();
                                        }}>
                                        Create Account and Login
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

// NewKeysNavBar.propTypes = {isOpen: PropTypes.bool};

export default UserDetailsForAccountCreation;
