import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import { copyValueToClipboard } from '../../LoginDropDownComponent/NewKeysModal';
import ShareOnWhatsApp from '../shareOnWhatsApp';

export function ShareModal({ isOpen, onClose, postUrl }) {
    let shareUrl = 'https://memestr.app/#' + postUrl;

    // function shareOnWhatsapp() {
    //     <WhatsappShareButton title={shareUrl} />;
    // }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="transform ease-out duration-300 transition-transform"
                    enterFrom="opacity-0 translate-y-full"
                    enterTo="opacity-100 translate-y-0"
                    leave="transform ease-in duration-300 transition-transform"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-full">
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="transform ease-out duration-300 transition-transform"
                            enterFrom="opacity-0 translate-y-full"
                            enterTo="opacity-100 translate-y-0"
                            leave="transform ease-in duration-200 transition-transform"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-full">
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900">
                                    Share
                                </Dialog.Title>
                                <span className="flex flex-row gap-2 m-2 justify-start">
                                    <span>
                                        <button
                                            className="flex items-center my-2 h-8 w-8"
                                            onClick={() => {
                                                copyValueToClipboard(shareUrl);
                                            }}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                x="0"
                                                y="0"
                                                viewBox="0 0 18 22.5">
                                                <path
                                                    fill="#000"
                                                    fillRule="nonzero"
                                                    d="M433.1 220.995V221h-5.109a2 2 0 00-1.991 1.995v10.01c0 1.1.894 1.995 1.995 1.995h10.01a2 2 0 001.995-2v-4.023a1 1 0 012 0V233a4 4 0 01-3.995 4h-10.01a3.997 3.997 0 01-3.995-3.995v-10.01a4 4 0 013.991-3.995h5.109v.005a1 1 0 010 1.99zm2.507 7.112l1.237 1.238-3.136 3.135c-1.111 1.112-3.034.748-4.366-.583-1.326-1.326-1.694-3.255-.587-4.363l3.14-3.139 1.237 1.237-3.14 3.14c-.28.28-.115 1.145.608 1.867.728.729 1.584.89 1.871.604l3.136-3.136zm2.497-.022l-1.238-1.238 3.136-3.135c.287-.287.125-1.143-.603-1.872-.723-.722-1.587-.887-1.869-.606l-3.139 3.139-1.237-1.238 3.139-3.139c1.108-1.107 3.037-.739 4.363.587 1.331 1.332 1.695 3.255.583 4.366l-3.135 3.136zm-2.46-3.728a.876.876 0 111.238 1.237l-2.526 2.527a.876.876 0 11-1.238-1.238l2.527-2.526z"
                                                    transform="translate(-424 -219)"></path>
                                            </svg>
                                        </button>
                                        <span className="text-sm text-gray-500 my-2">
                                            Copy Link
                                        </span>
                                    </span>
                                    <div>
                                        <button>
                                            <ShareOnWhatsApp
                                                shareUrl={shareUrl}
                                            />
                                        </button>
                                    </div>
                                </span>

                                <div className="my-4">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
    );
}
