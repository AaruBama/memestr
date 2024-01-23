import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export function copyValueToClipboard(value) {
    const textarea = document.createElement('textarea');
    textarea.value = value;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

function RegistrationModal({ isOpen, onClose, sk, pk }) {
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

                <div className="fixed inset-0 z-10 overflow-hidden">
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
                                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-base font-semibold leading-6 text-gray-900 pb-6">
                                                Public Key
                                                <span
                                                    onClick={() =>
                                                        copyValueToClipboard(pk)
                                                    }
                                                    className="text-gray-600 text-sm underline hover:text-blue-600">
                                                    (Click to copy)
                                                </span>
                                                :
                                                <div
                                                    className={
                                                        'px-2 py-1 text-sm bg-yellow-200 bg-opacity-10 text-slate-700 border-2 rounded border-black break-all shadow-yellow-300 font-semibold' +
                                                        'font-sans'
                                                    }>
                                                    {pk}
                                                </div>
                                                Private Key
                                                <span
                                                    onClick={() =>
                                                        copyValueToClipboard(sk)
                                                    }
                                                    className="text-gray-600 text-sm underline hover:text-blue-600">
                                                    (Click to copy)
                                                </span>
                                                :
                                                <div
                                                    className={
                                                        'px-2 py-1 text-sm bg-yellow-200 bg-opacity-10 text-slate-700 border-2 rounded border-black break-all shadow-yellow-300 font-semibold' +
                                                        'font-sans'
                                                    }>
                                                    {sk}
                                                </div>
                                            </Dialog.Title>

                                            {/*<Dialog.Description>*/}
                                            {/*    <div className="mb-4">*/}
                                            {/*    <label htmlFor="username" className="flex justify-start block mb-1 text-sm font-medium text-gray-900 dark:text-black">Username</label>*/}
                                            {/*    <input type="text"*/}
                                            {/*           id="username"*/}
                                            {/*           onChange={handleUsernameChange}*/}
                                            {/*           className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Guy_who_farted" required />*/}
                                            {/*    </div>*/}

                                            {/*    <div>*/}
                                            {/*        <label htmlFor="about" className="flex justify-start block mb-1 text-sm font-medium text-gray-900 dark:text-gray-800">About</label>*/}
                                            {/*        <input type="text" id="about" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="OG Memestr" required />*/}
                                            {/*    </div>*/}
                                            {/*</Dialog.Description>*/}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button
                                        type="button"
                                        className="mt-2 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                        onClick={() => {
                                            onClose();
                                        }}>
                                        I've Saved my keys
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

export default RegistrationModal;
