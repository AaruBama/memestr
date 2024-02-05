import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ReactComponent as Copy } from '../../Icons/Copy.svg';
import { ReactComponent as Tick } from '../../Icons/RoundTick.svg';
import { ReactComponent as QuestionIcon } from '../../Icons/QuestionMarkIcon.svg';
export function copyValueToClipboard(value) {
    const textarea = document.createElement('textarea');
    textarea.value = value;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

function RegistrationModal({ isOpen, onClose, sk, pk }) {
    const [copied, setCopied] = useState(false);
    const [copySuccessPublic, setCopySuccessPublic] = useState(false);
    const [copySuccessPrivate, setCopySuccessPrivate] = useState(false);
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);

    const toggleTooltip = () => {
        setIsTooltipOpen(!isTooltipOpen);
    };

    const copyValueToClipboardPublic = value => {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        setCopySuccessPublic(true);
        setTimeout(() => setCopySuccessPublic(false), 500);
    };

    const copyValueToClipboardPrivate = value => {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        setCopySuccessPrivate(true);
        setTimeout(() => setCopySuccessPrivate(false), 500);
    };

    useEffect(() => {
        if (copied) {
            const tooltip = document.createElement('div');
            tooltip.innerHTML = `
                <div class="fixed top-8 right-6 flex items-center px-3 py-2 bg-white text-black rounded-md z-50">
                <svg class="mr-2" fill="#000" width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm5.676,8.237-6,5.5a1,1,0,0,1-1.383-.03l-3-3a1,1,0,1,1,1.414-1.414l2.323,2.323,5.294-4.853a1,1,0,1,1,1.352,1.474Z"/></svg>
                    Copied to clipboard
                </div>
            `;
            document.body.appendChild(tooltip);

            setTimeout(() => document.body.removeChild(tooltip), 2000);
        }
    }, [copied]);
    return (
        <>
            <div className="relative z-0">
                <Transition.Root show={isOpen} as={Fragment}>
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
                                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-100 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                        <div className="bg-white px-6 py-5">
                                            <div className="text-center">
                                                <Dialog.Title
                                                    as="h3"
                                                    className="text-lg font-semibold leading-6 text-gray-800">
                                                    Your Keys
                                                </Dialog.Title>
                                                <p className="mt-1 text-sm text-gray-600">
                                                    Please save these keys
                                                    securely.
                                                </p>

                                                <div className="mt-4">
                                                    <div className="text-left">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-sm font-medium text-gray-700">
                                                                Public Key:
                                                            </span>
                                                            <div
                                                                onClick={() =>
                                                                    copyValueToClipboardPublic(
                                                                        pk,
                                                                    )
                                                                }
                                                                className="cursor-pointer transition duration-300 ease-in-out transform ">
                                                                {copySuccessPublic ? (
                                                                    <div className="opacity-0 transition-opacity duration-1000">
                                                                        <Tick className="h-6 w-6 text-green-500" />
                                                                    </div>
                                                                ) : (
                                                                    <div className="opacity-100 transition-opacity duration-1000">
                                                                        <Copy className="h-6 w-6" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="bg-gray-50 p-2 text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm">
                                                            <div className="break-all">
                                                                {pk}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-left mt-4">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-sm font-medium text-gray-700">
                                                                Private Key:
                                                            </span>
                                                            <div
                                                                onClick={() =>
                                                                    copyValueToClipboardPrivate(
                                                                        sk,
                                                                    )
                                                                }
                                                                className="cursor-pointer transition duration-300 ease-in-out transform ">
                                                                {copySuccessPrivate ? (
                                                                    <div className="opacity-0 transition-opacity duration-1000">
                                                                        <Tick className="h-6 w-6 text-green-500" />
                                                                    </div>
                                                                ) : (
                                                                    <div className="opacity-100 transition-opacity duration-1000">
                                                                        <Copy className="h-6 w-6" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="bg-gray-50 p-2 text-sm text-gray-700 border border-gray-300 rounded-md shadow-sm hide-scrollbar">
                                                            <div className="break-all">
                                                                {sk}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center bg-white px-6 py-3">
                                            <div className="relative">
                                                <QuestionIcon
                                                    className="h-6 w-6 cursor-pointer"
                                                    onClick={toggleTooltip}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                className="inline-flex justify-center rounded-md border border-transparent bg-gradient-to-r from-blue-500 to-teal-500 hover:bg-blue-700 px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none"
                                                onClick={() => onClose()}>
                                                I've Saved my Keys
                                            </button>
                                        </div>

                                        {isTooltipOpen && (
                                            <div className="absolute bottom-4 left-16 w-64 p-4 bg-white border border-gray-300 shadow-lg rounded-lg text-sm z-50">
                                                <p>
                                                    Our meme-sharing application
                                                    leverages the Nostr
                                                    protocol, which requires a
                                                    unique set of cryptographic
                                                    keys for each user. The
                                                    public key is your
                                                    identifier on the network,
                                                    while the private key
                                                    secures your communications
                                                    and should be kept secret.
                                                </p>
                                            </div>
                                        )}
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </Dialog>
                </Transition.Root>
            </div>
        </>
    );
}

export default RegistrationModal;
