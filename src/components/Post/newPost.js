import React, { Fragment, useState } from 'react';
import { getEventHash, getSignature, nip19, SimplePool } from 'nostr-tools';
import { Dialog, Transition } from '@headlessui/react';

const PostUpload = ({ isOpen, onClose }) => {
    const [link, setLink] = useState(null);
    const [title, setTitle] = useState('');
    const [hashtags, setHashtags] = useState('');
    const [preview, setPreview] = useState('');
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
        if (postStage === 0 || title === '') {
            alert('Can not create post without media and title.');
            return;
        }
        if (postStage !== 2) {
            if (retryCount < 3) {
                setTimeout(() => {
                    setRetryCount(prevRetryCount => prevRetryCount + 1);
                }, 1000);
            } else {
                alert('Timed out before we could upload post. Try again later');
                return;
            }
        }
        let relays = ['wss://relay.damus.io'];
        const pool = new SimplePool();
        const storedData = localStorage.getItem('memestr');
        if (!storedData) {
            alert('Login required to Upload Post.');
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
                ['d', 'memestr'],
                ['url', link],
                ['p', uesrPublicKey],
                ['category', 'memestrrr'],
            ],
            content: title + ' ' + link,
        };

        // console.log("event", commentEvent)

        commentEvent.id = getEventHash(commentEvent);
        commentEvent.sig = getSignature(commentEvent, sk.data);
        let p1 = pool.publish(relays, commentEvent);
        // console.log("p1", p1)
        Promise.resolve(p1).then(
            value => {
                console.log('Success', value);
                setPostStage(4); // Success!
            },
            reason => {
                console.error('something went wrong', reason); // Error!
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
            console.log('24, response is', response.data.link);
            setLink(response.data.link);
            setPostStage(2);
        } catch (error) {
            console.error('An error occurred:', error);
            setLink(null);
        }

        if (file) {
            setPreview(URL.createObjectURL(file));
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
        const apiUrl = 'https://api.imgur.com/3/upload';

        const formData = new FormData();
        formData.append('image', media);
        const headers = new Headers();
        headers.append('Authorization', 'Client-ID c41537d03e6c984');

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers,
            body: formData,
        });

        const parsedjson = await response.json();

        if (!response.ok) {
            throw new Error('Upload failed');
        }
        return parsedjson;
    };

    // function handleTitleChange(event) {
    //     setTitle(event.target.value);
    // }

    function handleTitleChange(event) {
        setTitle(event.target.value);
    }

    function handleHashtagsChange(event) {
        setHashtags(event.target.value);
    }
    const previewStyle = {
        maxHeight: '300px', // Limit the height of the image
        maxWidth: '100%', // Ensure the image is not wider than its container
        objectFit: 'contain', // Keeps the aspect ratio of the image
    };

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
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    <div
                                        className="bg-white px-4 py-5 sm:p-6 overflow-auto"
                                        style={{ maxHeight: '80vh' }}>
                                        <div className="mb-4">
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                Post Something
                                            </h3>
                                        </div>
                                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-1">
                                            <div className="sm:col-span-2">
                                                <label
                                                    htmlFor="title"
                                                    className="block text-sm font-medium text-gray-700">
                                                    Title
                                                </label>
                                                <div className="mt-1">
                                                    <input
                                                        type="text"
                                                        name="title"
                                                        id="title"
                                                        onChange={
                                                            handleTitleChange
                                                        }
                                                        value={title}
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        placeholder="Enter the title of your post"
                                                    />
                                                </div>
                                            </div>

                                            <div className="sm:col-span-2">
                                                <label
                                                    htmlFor="hashtags"
                                                    className="block text-sm font-medium text-gray-700">
                                                    Hashtags
                                                </label>
                                                <div className="mt-1">
                                                    <input
                                                        type="text"
                                                        name="hashtags"
                                                        id="hashtags"
                                                        onChange={
                                                            handleHashtagsChange
                                                        }
                                                        value={hashtags}
                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        placeholder="Add hashtags (e.g., #funny #meme)"
                                                    />
                                                </div>
                                            </div>

                                            <div className="sm:col-span-2">
                                                <label
                                                    htmlFor="file-upload"
                                                    className="block text-sm font-medium text-gray-700">
                                                    Upload Image
                                                </label>
                                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                                    <div className="space-y-1 text-center">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={1.5}
                                                            stroke="currentColor"
                                                            className="mx-auto h-12 w-12 text-gray-400">
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                                                            />
                                                        </svg>

                                                        <div className="flex text-sm text-gray-600">
                                                            <label
                                                                htmlFor="file-upload"
                                                                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                                                                <span>
                                                                    Upload a
                                                                    file
                                                                </span>
                                                                <input
                                                                    id="file-upload"
                                                                    name="file-upload"
                                                                    type="file"
                                                                    onChange={
                                                                        handleFileChange
                                                                    }
                                                                    className="sr-only"
                                                                />
                                                            </label>
                                                            <p className="pl-1">
                                                                or drag and drop
                                                            </p>
                                                        </div>
                                                        <p className="text-xs text-gray-500">
                                                            PNG, JPG, GIF up to
                                                            10MB
                                                        </p>
                                                        {preview && (
                                                            <img
                                                                src={preview}
                                                                alt="Preview"
                                                                className="mt-4 w-full rounded"
                                                                style={
                                                                    previewStyle
                                                                } // Apply the style for the preview
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-base font-medium text-white hover:from-pink-500 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                                            onClick={() => {
                                                sendNewPostEvent();
                                                onClose();
                                            }}>
                                            Post
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
