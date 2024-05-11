import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { getEventHash, getSignature, nip19, SimplePool } from 'nostr-tools';
import UploadAndDisplayImage from './UploadUserPicture';
import { getProfileFromPublicKey } from '../Profile';
import { ReactComponent as TickIcon } from '../../Icons/RoundTick.svg';

function InputField({ label, placeholder, value, onChange }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <input
                type="text"
                className="w-full px-4 py-2 mt-1 border rounded-md bg-gray-50 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}

function TextAreaField({ label, placeholder, value, onChange }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <textarea
                className="w-full px-4 py-2 mt-1 border rounded-md bg-gray-50 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder={placeholder}
                value={value}
                onChange={onChange}></textarea>
        </div>
    );
}

export function LoadingScreen() {
    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
            <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        </div>
    );
}

function UserDetailsForAccountCreation({ isOpen, onClose, sk, pk }) {
    const [username, setUsername] = useState('');
    const [aboutMe, setAboutMe] = useState('');
    const [fileString, setFileString] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const choosePicture = url => {
        setFileString(url);
    };

    function handleUsernameChange(event) {
        setUsername(event.target.value);
    }
    async function registerAccount(sk, pk) {
        setIsLoading(true);

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
            link: fileString,
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
            setIsLoading(false);
            onClose();
            console.log('Set the default login in local cache.', details);
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000);
        } catch (error) {
            console.error('Error during registration:', error);
            setIsLoading(false); // Set loading to false on failure
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
        <>
            <Transition.Root show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={onClose}>
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-full p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-lg transition-all">
                                    <div className="text-center mb-4">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-xl font-semibold leading-6 text-gray-800">
                                            Create Your Account
                                        </Dialog.Title>
                                        <p className="text-sm text-gray-600">
                                            Start exploring the world of memes!
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <InputField
                                            label="Username:"
                                            placeholder="Username"
                                            value={username}
                                            onChange={handleUsernameChange}
                                        />

                                        <TextAreaField
                                            label="About Me:"
                                            placeholder="Tell us about yourself"
                                            value={aboutMe}
                                            onChange={handleAboutMeChange}
                                        />

                                        <UploadAndDisplayImage
                                            label="Profile Picture:"
                                            setPicture={choosePicture}
                                        />

                                        <button
                                            type="button"
                                            className="w-full rounded-md bg-gradient-to-r from-blue-500 to-teal-500 hover:bg-blue-700 px-4 py-2 text-sm font-bold text-white shadow focus:outline-none transition duration-300"
                                            onClick={async () => {
                                                await registerAccount(sk, pk);
                                                onClose();
                                            }}>
                                            Create Account and Login
                                        </button>
                                        {isLoading && <LoadingScreen />}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>

            {showPopup && (
                <div className="fixed top-0 inset-x-0 flex justify-center items-start z-50">
                    <div className="mt-12 p-4 bg-black text-white rounded-lg shadow-lg transition-transform transform-gpu animate-slideInSlideOut flex items-center">
                        <TickIcon className="h-6 w-6 mr-2 text-white" />
                        <p>Created Account Successfully</p>
                    </div>
                </div>
            )}
        </>
    );
}
export default UserDetailsForAccountCreation;
