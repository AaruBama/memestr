import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect } from 'react';
import { useState } from 'react';
import { copyValueToClipboard } from '../../LoginDropDownComponent/NewKeysModal';
// import ShareOnWhatsApp from '../shareOnWhatsApp';

import { ReactComponent as CopyLinkSvg } from '../../../Icons/CopyLinkSvg.svg';

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
    let shareUrl = 'https://memestr.app/#' + postUrl;

    const [showAlert, setShowAlert] = useState(false);

    const showAlertWithTimeout = duration => {
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, duration);
    };

    return (
        <>
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
            {showAlert && (
                <div className="relative">
                    <div className="h-screen bg-gray-600 dark:bg-gray-900 opacity-30 absolute inset-0" />

                    <Alert message="Link Copied Successfully" duration={3000} />
                </div>
            )}
        </>
    );
}
