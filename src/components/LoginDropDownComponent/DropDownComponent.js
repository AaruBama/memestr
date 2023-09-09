import React, {Fragment, useEffect, useState} from "react";
import {Menu, Transition} from "@headlessui/react";
import RegistrationModal from "./NewKeysModal";
import UserDetailsForAccountCreationModal from "./UserDetailsForAccountCreationModal";
import {generateNewKeys} from "../Login";
import LoginModal from "./LoginModal";


function DropdownComponent() {
    const [newKeysModal, setNewKeysModal] = useState(false);
    const [newUserDetailsModal, setNewUserDetailsModal] = useState(false);
    const [loginModal, setLoginModal] = useState(false);
    const [sk, setSk] = useState('');
    const [userDetails, setUserDetails] = useState(null);
    const [pk, setPk] = useState('');

    const openModal = () => {
        setNewKeysModal(true);
        let x = generateNewKeys()
        setSk(x["epk"])
        setPk(x["epubKey"])
    }
    const openUserDetailsModal = () => {
        setNewUserDetailsModal(true);
    }

    const closeModal = () => {
        setNewKeysModal(false);
        openUserDetailsModal();
    };

    const closeUserDetailModal = () => {
        setNewUserDetailsModal(false);
    }

    const openLoginModal = () => {
        const storedData = localStorage.getItem('memestr')
        if (!storedData) {
            setLoginModal(true);
        } else {
            setUserDetails(JSON.parse(storedData));
        }
    }
    const closeLoginModal = (userDetails) => {
        console.log("user details are", userDetails)
        setLoginModal(false);
        setUserDetails(userDetails)

        // setUserImage(userImage)
        // setUserName(userName)
    }



    useEffect(() => {
        const storedData = localStorage.getItem('memestr')
        if (storedData) {
            setUserDetails(JSON.parse(storedData));
        }
    },
        []
    );


    function logout() {
        localStorage.removeItem('memestr');
        setUserDetails(null)
        alert("Logged out successfully!")
    }

    return (
        <div>
        <Menu as="div" className="relative inline-block text-left">

                <div>
                    <Menu.Button className="inline-flex justify-center rounded-full w-full px-2 py-2 text-sm font-medium border-solid-2 border-bg-black text-white bg-blue-500 border border-gray-300 shadow-sm hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                        { ((userDetails && userDetails.picture === undefined) || !userDetails) ?
                            (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>) :
                            <div className="flex flex-wrap justify-center w-12 h-12">
                                <div className="px-4">
                                    {console.log(userDetails.picture)}
                                    <img src={userDetails} alt="..." className="shadow rounded-full max-w-full h-auto align-middle border-none" />
                                </div>
                            </div>
                        }
                    </Menu.Button>
                </div>

            <Transition
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    { (!userDetails) ?
                        (
                            <>
                            <Menu.Item
                            as="div"
                            onClick={() => {openModal();}}
                            className="ui-active:bg-blue-500 ui-active:text-white ui-not-active:bg-white ui-not-active:text-black"
                            >
                            Create Account
                            </Menu.Item>
                            <Menu.Item
                            as="div"
                            onClick={() => {openLoginModal();}}
                            className="ui-active:bg-blue-500 ui-active:text-white ui-not-active:bg-white ui-not-active:text-black"
                            >
                            Login
                            </Menu.Item>
                            </>
                        ) :
                        (<div>
                            <Menu.Item
                                as="div"
                                className="ui-active:bg-blue-500 ui-active:text-white ui-not-active:bg-white ui-not-active:text-black"
                             >
                                {userDetails.name}
                             </Menu.Item>
                                <Menu.Item
                                    as="div"
                                    onClick={() => {logout();}}
                                    className="ui-active:bg-blue-500 ui-active:text-white ui-not-active:bg-white ui-not-active:text-black"
                                >
                                    Logout
                                </Menu.Item>
                            </div>
                        )
                    }
                </Menu.Items>

            </Transition>
        </Menu>
            <RegistrationModal isOpen={newKeysModal} onClose={closeModal} sk={sk} pk={pk}/>
            <UserDetailsForAccountCreationModal isOpen={newUserDetailsModal} onClose={closeUserDetailModal} sk={sk} pk={pk}/>
            <LoginModal isOpen={loginModal} onClose={closeLoginModal} />

</div>

    );
}

export default DropdownComponent;