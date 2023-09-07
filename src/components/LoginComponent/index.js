import React, {Fragment, useEffect, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import {generateNewKeys} from "../Login";

function NewKeysNavBar({ isOpenm, onClose }) {
    console.log("NewKeys Nv Bar opening with isOpenm", isOpenm)
    const [sk, pk] = generateNewKeys()
    const [isOpen, setIsOpen] = useState(false)

    function closeModal() {
        setIsOpen(false);
        onClose();
    }

    function openModal() {
        setIsOpen(true)
    }

    useEffect(() => {
        if (isOpenm) {
            openModal(); // Open the modal when isOpenm is true
        }
    }, [isOpenm]);

    function copyKey(value) {
        console.log("Copying value")
        const textarea = document.createElement('textarea');
        textarea.value = value;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    return (
        // <Transition.Root show={isOpen} as={Fragment}>
        //     <Dialog as="div" className="relative z-10" onClose={() => {onClose()}}>
        //         <Transition.Child
        //             as={Fragment}
        //             enter="ease-out duration-300"
        //             enterFrom="opacity-0"
        //             enterTo="opacity-100"
        //             leave="ease-in duration-200"
        //             leaveFrom="opacity-100"
        //             leaveTo="opacity-10"
        //         >
        //             <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        //         </Transition.Child>
        //
        //         <div className="fixed inset-0 z-10 overflow-hidden">
        //             <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
        //                 <Transition.Child
        //                     as={Fragment}
        //                     enter="ease-out duration-300"
        //                     enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        //                     enterTo="opacity-100 translate-y-0 sm:scale-100"
        //                     leave="ease-in duration-200"
        //                     leaveFrom="opacity-100 translate-y-0 sm:scale-100"
        //                     leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        //                 >
        //                     <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
        //                         <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
        //                             <div className="sm:flex sm:items-start">
        //                                 <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
        //                                     <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
        //                                         Private Key<span onClick={()=>copyKey(sk)} class="text-gray-600 text-sm underline hover:text-blue-600">(Click to copy)</span>:
        //
        //                                         <div class={"px-2 py-1 text-sm bg-yellow-200 bg-opacity-10 text-slate-700 border-2 rounded border-black break-all shadow-yellow-300 font-semibold" +
        //                                             "font-sans"}>
        //                                             {sk}
        //                                         </div>
        //                                         Public Key<span onClick={()=>copyKey(pk)} className="text-gray-600 text-sm underline hover:text-blue-600">(Click to copy)</span>:
        //                                         <div class={"px-2 py-1 text-sm bg-yellow-200 bg-opacity-10 text-slate-700 border-2 rounded border-black break-all shadow-yellow-300 font-semibold" +
        //                                             "font-sans"}>
        //                                             {pk}
        //                                         </div>
        //                                     </Dialog.Title>
        //
        //                                 </div>
        //                             </div>
        //                         </div>
        //                         <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        //                             <button
        //                                 type="button"
        //                                 className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
        //                                 onClick={() => {onClose();}}
        //                             >
        //                                 I've copied my keys.
        //                             </button>
        //                         </div>
        //                     </Dialog.Panel>
        //                 </Transition.Child>
        //             </div>
        //         </div>
        //
        //
        //     </Dialog>
        // </Transition.Root>
        <>
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900"
                                >
                                    Payment successful
                                </Dialog.Title>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        Your payment has been successfully submitted. We’ve sent
                                        you an email with all of the details of your order.
                                    </p>
                                </div>

                                <div className="mt-4">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                        onClick={closeModal}
                                    >
                                        Got it, thanks!
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
        </>
    )
}

// NewKeysNavBar.propTypes = {isOpen: PropTypes.bool};

export default NewKeysNavBar;
