import React, {Fragment, useEffect, useRef, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import * as PropTypes from "prop-types";

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

export default NewKeysNavBar;
