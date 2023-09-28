import React, { Fragment, useState } from "react";
import { getEventHash, getSignature, nip19, SimplePool } from "nostr-tools";
import { Dialog, Transition } from "@headlessui/react";

const PostUpload = ({ isOpen, onClose }) => {
    const [link, setLink] = useState(null);
    const [title, setTitle] = useState("");
    const [retryCount, setRetryCount] = useState(0);
    const [postStage, setPostStage] = useState(0);

    // function checkFileUploaded(retryCount) {
    //     console.log("running checkFileUploaded", retryCount)
    //     if (retryCount >= 5) {
    //         console.error('Upload failed after 5 retries. Please try later.');
    //         alert('Upload failed after 5 retries. Please try later.');
    //         return false;
    //     }
    //
    //     if (postStage === 2) {
    //         // Execute your function when postStage is 3
    //         console.log('Post submitted successfully.');
    //         return true
    //         // Add your logic here
    //     } else {
    //         setTimeout(() => {
    //             checkFileUploaded(retryCount + 1);
    //         }, 1000);
    //     }
    // };

    const sendNewPostEvent = () => {
        // const uploaded = checkFileUploaded(retryCount)
        // if (!uploaded){
        //     alert("sww");
        //     return;
        // }
        if (postStage === 0 || title === "") {
            alert("Can not create post without media and title.");
            return;
        }
        if (postStage !== 2) {
            if (retryCount < 3) {
                setTimeout(() => {
                    setRetryCount(prevRetryCount => prevRetryCount + 1);
                }, 1000);
            } else {
                alert("Timed out before we could upload post. Try again later");
                return;
            }
        }
        let relays = ["wss://relay.damus.io"];
        const pool = new SimplePool();
        const storedData = localStorage.getItem("memestr");
        if (!storedData) {
            alert("Login required to Upload Post.");
            return;
        }
        let uesrPublicKey = JSON.parse(storedData).pubKey;
        let userPrivateKey = JSON.parse(storedData).privateKey;
        let sk = nip19.decode(userPrivateKey);
        let commentEvent = {
            kind: 1,
            pubkey: uesrPublicKey,
            created_at: Math.floor(Date.now() / 1000),
            tags: [
                ["d", "memestr"],
                ["url", link],
                ["p", uesrPublicKey],
                ["category", "memestrrr"],
            ],
            content: title + " " + link,
        };

        // console.log("event", commentEvent)

        commentEvent.id = getEventHash(commentEvent);
        commentEvent.sig = getSignature(commentEvent, sk.data);
        let p1 = pool.publish(relays, commentEvent);
        // console.log("p1", p1)
        Promise.resolve(p1).then(
            value => {
                console.log("Success", value);
                setPostStage(4); // Success!
            },
            reason => {
                console.error("something went wrong", reason); // Error!
            },
        );
    };
    const handleFileChange = async event => {
        setPostStage(1);
        const file = event.target.files[0];

        // Check if a file is selected
        if (!file) {
            return;
        }

        try {
            // Step 1: Convert the media to base64 data
            // const base64Data = await convertToBase64(file);
            // console.log("base64 is", base64Data)
            //
            // // Step 2: Set the base64 data to the state
            // setEncodedMedia(base64Data);

            // Step 3: Make a curl call
            const response = await uploadToImgur(file);
            console.log("24, response is", response.data.link);
            setLink(response.data.link);
            setPostStage(2);
        } catch (error) {
            console.error("An error occurred:", error);
            setLink(null);
        }
    };

    // Helper function to convert media to base64
    // const convertToBase64 = (file) => {
    //     return new Promise((resolve, reject) => {
    //         const reader = new FileReader();
    //         reader.onload = () => {
    //             resolve(reader.result);
    //         };
    //         reader.onerror = (error) => {
    //             reject(error);
    //         };
    //         reader.readAsDataURL(file);
    //     });
    // };

    // Helper function to make the API call
    // const uploadToImgbb = async (encodedMedia) => {
    //     console.log("Encoded media is", encodedMedia)
    //     const apiKey = '32ece32ad2ce29376f55cba38a41f807';
    //     const apiUrl = `https://api.imgbb.com/1/upload?key=${apiKey}`;
    //
    //     const formData = new FormData();
    //     formData.append('image', encodedMedia);
    //
    //
    //     const response = await fetch(apiUrl, {
    //         method: 'POST',
    //         body: formData,
    //     });
    //
    //     if (!response.ok) {
    //         throw new Error('Upload failed');
    //     }
    //
    //     return response.json();
    // };

    const uploadToImgur = async media => {
        // if (!validateFile(file)) {
        //     alert("Only jpg,jpeg,mp4 allowed")
        // }
        const apiUrl = `https://api.imgur.com/3/upload`;

        const formData = new FormData();
        formData.append("image", media);
        const headers = new Headers();
        headers.append("Authorization", "Client-ID c41537d03e6c984");

        const response = await fetch(apiUrl, {
            method: "POST",
            headers,
            body: formData,
        });

        const parsedjson = await response.json();

        if (!response.ok) {
            throw new Error("Upload failed");
        }
        return parsedjson;
    };

    function handleTitleChange(event) {
        setTitle(event.target.value);
    }

    return (
        <div>
            <Transition.Root show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
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
                                <Dialog.Panel className="max-height= relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                <Dialog.Title
                                                    as="h3"
                                                    className="text-base font-semibold leading-6 text-gray-900 pb-6">
                                                    Post something.
                                                </Dialog.Title>

                                                <Dialog.Description>
                                                    <div class="mb-4 required">
                                                        <label
                                                            htmlFor="title"
                                                            className="flex justify-start block mb-1 text-sm font-medium text-gray-900 dark:text-black">
                                                            Title
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="title"
                                                            onChange={
                                                                handleTitleChange
                                                            }
                                                            value={title}
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                            placeholder="Title..."
                                                            required={true}
                                                        />
                                                    </div>

                                                    <input
                                                        type="file"
                                                        onChange={
                                                            handleFileChange
                                                        }
                                                    />
                                                </Dialog.Description>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="submit"
                                            className="mt-2 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                            onClick={() => {
                                                sendNewPostEvent();
                                                onClose();
                                            }}>
                                            Post.
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </div>
    );
};

export default PostUpload;
