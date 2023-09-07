import React, {Fragment, useState} from "react";
import { Menu, Transition } from "@headlessui/react";
import NewKeysNavBar from "./index";


function DropdownComponent() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        console.log("Opening Modal")
        setIsModalOpen(true);
    };

    const closeModal = () => {
        console.log("Setting model close")
        setIsModalOpen(false);
    };

    // function createNewAccount() {
    //     openModal();
    //     // setAccountCreateModal(true);
    // }
    return (
        <Menu as="div" className="relative inline-block text-left">

                <div>
                    <Menu.Button className="inline-flex justify-center rounded-full w-full px-2 py-2 text-sm font-medium border-solid-2 border-bg-black text-white bg-blue-500 border border-gray-300 shadow-sm hover:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Hello
                    </Menu.Button>
                </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                className={`${active && 'bg-blue-500'}`}
                                onClick={() => {
                                    openModal();
                                    }
                                }
                            >
                                Create Account
                                <NewKeysNavBar isOpenm={isModalOpen} onClose={closeModal} />
                            </button>
                        )}
                    </Menu.Item>

                </Menu.Items>

            </Transition>
        </Menu>
    );
}

export default DropdownComponent;