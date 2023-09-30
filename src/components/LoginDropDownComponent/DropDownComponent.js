import React, { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import RegistrationModal from "./NewKeysModal";
import UserDetailsForAccountCreationModal from "./UserDetailsForAccountCreationModal";
import { generateNewKeys } from "../Login";
import LoginModal from "./LoginModal";

function DropdownComponent() {
    const [newKeysModal, setNewKeysModal] = useState(false);
    const [newUserDetailsModal, setNewUserDetailsModal] = useState(false);
    const [loginModal, setLoginModal] = useState(false);
    const [sk, setSk] = useState("");
    const [userDetails, setUserDetails] = useState(null);
    const [pk, setPk] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const openNewKeysModal = () => {
        setNewKeysModal(true);
        let x = generateNewKeys();
        setSk(x["epk"]);
        setPk(x["epubKey"]);
    };
    const openUserDetailsModal = () => {
        setNewUserDetailsModal(true);
    };

    const closeModal = () => {
        setNewKeysModal(false);
        openUserDetailsModal();
    };

    const closeUserDetailModal = () => {
        setNewUserDetailsModal(false);
    };

    const openLoginModal = () => {
        const storedData = localStorage.getItem("memestr");
        if (!storedData) {
            setLoginModal(true);
        } else {
            setUserDetails(JSON.parse(storedData));
        }
    };
    const closeLoginModal = userDetails => {
        setLoginModal(false);
        setUserDetails(userDetails);
        if (Object.keys(userDetails).length !== 0) {
            setIsLoggedIn(true);
        }
    };

    useEffect(() => {
        const storedData = localStorage.getItem("memestr");
        if (storedData) {
            setUserDetails(JSON.parse(storedData));
            setIsLoggedIn(true);
        }
    }, []);

    function logout() {
        localStorage.removeItem("memestr");
        setUserDetails(null);
        setIsLoggedIn(false);
        alert("Logged out successfully!");
    }

    return (
        <div>
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button className="inline-flex justify-center rounded-full w-full text-sm font-medium border-solid-2 border-bg-black text-white bg-blue-500 border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                        {(userDetails && userDetails.picture === undefined) ||
                        !userDetails ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                class="w-9 h-9 ">
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin=""
                                    d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        ) : (
                            <img
                                src={userDetails.picture}
                                alt="..."
                                className="shadow rounded-full w-9 h-9 align-middle border-none"
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
                    <Menu.Items className="absolute p-4 right-0 w-40 mt-2 origin-top-right bg-black/[0.9] text-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {!isLoggedIn && (
                            <Menu.Item
                                as="div"
                                onClick={() => {
                                    openNewKeysModal();
                                }}
                                disabled={isLoggedIn}
                                className="ui-active:bg-blue-500 ui-active:text-white ui-not-active:bg-white ui-not-active:text-black">
                                Create Account
                            </Menu.Item>
                        )}
                        {!isLoggedIn && (
                            <Menu.Item
                                as="div"
                                disabled={isLoggedIn}
                                onClick={() => {
                                    openLoginModal();
                                }}
                                className="ui-active:bg-blue-500 ui-active:text-white ui-not-active:bg-white ui-not-active:text-black">
                                Login
                            </Menu.Item>
                        )}

                        {isLoggedIn && (
                            <Menu.Item>
                                {({ active }) => (
                                    <div
                                        class={`${
                                            active && "bg-yellow-500"
                                        } ui-active:bg-white ui-active:text-black ui-not-active:bg-white ui-not-active:text-black`}>
                                        {userDetails.name}
                                    </div>
                                )}
                            </Menu.Item>
                        )}
                        {isLoggedIn && (
                            <Menu.Item>
                                {({ active }) => (
                                    <div
                                        onClick={() => {
                                            logout();
                                        }}
                                        class={`${
                                            active && "bg-yellow-500"
                                        } ui-active:bg-blue-500 ui-active:text-white ui-not-active:bg-white ui-not-active:text-black`}>
                                        Logout
                                    </div>
                                )}
                            </Menu.Item>
                        )}
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
