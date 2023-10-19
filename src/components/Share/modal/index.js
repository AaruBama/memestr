import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export function ShareModal({ isOpen, onClose }) {
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
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        This is a work under progress.
                                    </p>
                                </div>

                                <div className="mt-4">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                        onClick={onClose}>
                                        Got it, thanks!
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
