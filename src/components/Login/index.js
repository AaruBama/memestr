import React, {Fragment, useEffect, useRef, useState} from 'react';
import getUserDetailsFromPrivateKey from '../Profile';
import './profile.css'
import {getPublicKey, nip19, generatePrivateKey} from 'nostr-tools';
import Menu from "../Menu";
import * as PropTypes from "prop-types";
import {Dialog, Transition} from "@headlessui/react";

function NewKeysNavBar(props) {
    const keys = props.keys
    let cancelButtonRef = useRef(null)
    let [isOpen, setIsOpen] = useState(false)
    // let [sCopied, setIsCopied] = useState(false)

    useEffect(() => {
        setIsOpen(props.isOpen)
    }, [props.isOpen])

    console.log("props keys", props.keys)

    function copyKey(value) {
            const textarea = document.createElement('textarea');
            textarea.value = value;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            // setIsCopied(true);
    }

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={() => {setIsOpen(false);}}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-hidden">
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                                                Private Key<span onClick={()=>copyKey(props.keys.epk)} class="text-gray-600 text-sm underline hover:text-blue-600">(Click to copy)</span>:

                                                <div class={"px-2 py-1 text-sm bg-yellow-200 bg-opacity-10 text-slate-700 border-2 rounded border-black break-all shadow-yellow-300 font-semibold" +
                                                    "font-sans"}>
                                                    {keys.epk}
                                                </div>
                                                Public Key<span onClick={()=>copyKey(props.keys.ePubKey)} className="text-gray-600 text-sm underline hover:text-blue-600">(Click to copy)</span>:
                                                <div class={"px-2 py-1 text-sm bg-yellow-200 bg-opacity-10 text-slate-700 border-2 rounded border-black break-all shadow-yellow-300 font-semibold" +
                                                    "font-sans"}>
                                                    {keys.ePubKey}
                                                </div>
                                            </Dialog.Title>

                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="button"
                                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        onClick={() => setIsOpen(false)}
                                        ref={cancelButtonRef}
                                    >
                                        I've copied my keys.
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>


            </Dialog>
        </Transition.Root>
    )
}

NewKeysNavBar.propTypes = {isOpen: PropTypes.bool};

function Login(props) {
    const [showLogin, setShowLogin] = useState(false);
    const [privateKey, setPrivateKey] = useState('');
    const [isLoggedIn, setisLoggedIn] = useState(false)
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [accountCreateModal, setAccountCreateModal] = useState(false);
    const [newKeys, setNewKeys] = useState({});


    const handleLoginClick = () => {
        const storedData = localStorage.getItem('memestr')
        if (!storedData) {
            setShowLogin(true);
        } else {
            const userDetails = JSON.parse(storedData);
            setShowLogin(false);
            setisLoggedIn(true);
            const display_name = userDetails.display_name
            const profile_picture = userDetails.picture
            setLoggedInUser({display_name, profile_picture});
        }
    };

    const handlePrivateKeyChange = (event) => {
        setPrivateKey(event.target.value);
    };

    const handleLoginSubmit = (event) => {
        event.preventDefault();
        let userDetails = null;
        const storedData = localStorage.getItem('memestr')
        if (storedData) {
            userDetails = JSON.parse(storedData);
            setShowLogin(false);
            setisLoggedIn(true);
            const display_name = userDetails.display_name
            const profile_picture = userDetails.picture
            setLoggedInUser({display_name, profile_picture});
        } else {
            userDetails = getUserDetailsFromPrivateKey(privateKey)
        }
        userDetails.then((value) => {
            const display_name = value.display_name
            const profile_picture = value.picture
            let decodedpk = nip19.decode(privateKey)
            let publicKey = getPublicKey(decodedpk.data)
            value["pubKey"] = publicKey
            value["privateKey"] = privateKey //Encrypt it.
            setShowLogin(false);
            setisLoggedIn(true);
            setLoggedInUser({display_name, profile_picture});
            localStorage.setItem('memestr', JSON.stringify(value));
        });

    };

    function logoutUser() {
        localStorage.removeItem('memestr');
        setShowLogin(true);
        setisLoggedIn(false);
        alert("Logged out successfully!")
    }

    function createNewAccount() {
        function generateNewKeys() {
            const pk = generatePrivateKey()
            const pubKey = getPublicKey(pk)
            const epk = nip19.nsecEncode(pk)
            const ePubKey = nip19.npubEncode(pubKey)
            console.log("epk", epk)
            console.log("ePubKey", ePubKey)
            setNewKeys({"epk": epk, "ePubKey": ePubKey});

        }

        generateNewKeys();
        setAccountCreateModal(true);
    }

    return (
        <div class="relative flex-column bg-gray-100 text-neutral-500 shadow-lg rounded">
            <header className={"flex flex-row items-center h-14"}>
                <div class="pl-3 basis-[50%]">
                    <Menu/>
                </div>
                {isLoggedIn ?
                    <div class="flex w-full grow gap-3 mr-2">
                        <img className='profile1' src={loggedInUser.profile_picture} alt="Profile"/>
                        <div className='pt-2 invisible'><code>{loggedInUser.display_name}</code></div>
                        <div
                            className='flex w-full justify-end rounded bg-white px-4 pb-1 pt-1.5 text-xs font-medium uppercase leading-normal text-black shadow-[0_4px_9px_-4px_#3b71ca]'>
                            <button onClick={logoutUser}>Logout</button>
                        </div>
                    </div> :
                    <div class={"basis-[50%] flex justify-end pr-4"}>
                        <button
                            type="button"
                            data-te-ripple-init
                            data-te-ripple-color="light"
                            onClick={handleLoginClick}
                            class="rounded
                                 bg-blue-500
                                  px-6
                                   pb-2
                                    pt-2.5
                                     text-xs
                                      font-medium
                                       uppercase
                                        leading-normal
                                         text-white
                                          shadow-[0_4px_9px_-4px_#3b71ca]
                                           transition
                                            duration-150
                                             ease-in-out
                                              hover:bg-primary-600
                                               hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)
                                               ]">
                            Login
                        </button>


                        <button
                            type="button"
                            data-te-ripple-init
                            data-te-ripple-color="light"
                            onClick={createNewAccount}
                            className="rounded
                                 bg-blue-500
                                  px-6
                                   pb-2
                                    pt-2.5
                                     text-xs
                                      font-medium
                                       uppercase
                                        leading-normal
                                         text-white
                                          shadow-[0_4px_9px_-4px_#3b71ca]
                                           transition
                                            duration-150
                                             ease-in-out
                                              hover:bg-primary-600
                                               hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)
                                               ]">
                            Create Account

                            <NewKeysNavBar
                                isOpen={accountCreateModal}
                                keys={newKeys}

                            />
                        </button>
                    </div>}
            </header>
            {showLogin && (<div>
                    <div className="popup-inner">
                        <form onSubmit={handleLoginSubmit}>
                            <label>
                                Private Key:
                                <input
                                    type="text"
                                    value={privateKey}
                                    onChange={handlePrivateKeyChange}
                                    placeholder='Your private key'
                                    required
                                />
                            </label>
                            <button type="submit">Login</button>
                        </form>
                    </div>
                </div>)}

        </div>)
}
export default Login;