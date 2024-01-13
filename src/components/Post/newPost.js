import React, { Fragment, useState, useEffect, useRef } from 'react';
import { getEventHash, getSignature, nip19, SimplePool } from 'nostr-tools';
import { Dialog, Transition } from '@headlessui/react';
import { ReactComponent as CloseIcon } from '../../Icons/CloseIcon.svg';
import { ReactComponent as UpwardArrow } from '../../Icons/upwardArrow.svg';
import { ReactComponent as UploadNew } from '../../Icons/uploadNewPost.svg';

const PostUpload = ({ isOpen, onClose }) => {
    const [link, setLink] = useState(null);
    const [title, setTitle] = useState('');
    const [hashtags, setHashtags] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [preview, setPreview] = useState('');
    const [retryCount, setRetryCount] = useState(0);
    const [postStage, setPostStage] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [showMaxTagsAlert, setShowMaxTagsAlert] = useState(false);
    const MAX_TAGS = 3;
    let alertTimeout = useRef(null);

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
        if (!title || !link) {
            alert('Can not create post without media and title.');
            return;
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

        if (!file) {
            return;
        }

        setIsUploading(true); // Start uploading

        try {
            const response = await uploadToImgur(file);
            setLink(response.data.link);
            setPostStage(2);
        } catch (error) {
            console.error('An error occurred:', error);
            setLink(null);
        }

        setIsUploading(false); // Finish uploading

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
    function handleTitleChange(event) {
        setTitle(event.target.value);
    }

    const handleHashtagsChange = event => {
        setInputValue(event.target.value);
    };

    const handleKeyDown = event => {
        if (event.key === ' ' && event.target.value.trim() !== '') {
            if (hashtags.length < MAX_TAGS) {
                setHashtags([...hashtags, inputValue.trim()]);
                setInputValue(''); // Clear the input after adding the tag
                setShowMaxTagsAlert(false);
            } else {
                // alert('Max allowed tags: 3');

                setShowMaxTagsAlert(true);
                clearTimeout(alertTimeout); // Clear any existing timeout
                alertTimeout = setTimeout(() => {
                    setShowMaxTagsAlert(false); // Hide the alert after 3 seconds
                }, 3000);
            }
            event.preventDefault();
        }
    };

    const removeTag = indexToRemove => {
        // eslint-disable-next-line no-unused-vars
        setHashtags(hashtags.filter((_, index) => index !== indexToRemove));
    };

    // const previewStyle = {
    //     maxHeight: '300px',
    //     maxWidth: '100%',
    //     objectFit: 'contain',
    // };

    useEffect(() => {
        return () => {
            if (alertTimeout) {
                clearTimeout(alertTimeout);
            }
        };
    }, []);

    return (
        <div>
            <Transition.Root show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={onClose}>
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

                    <div className="fixed inset-0 z-10 p-4 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-[95%]  sm:max-w-lg mx-auto">
                                    <div className="flex justify-end p-2 sm:p-4">
                                        <button
                                            type="button"
                                            className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            onClick={onClose}>
                                            <span className="sr-only">
                                                Close
                                            </span>

                                            <CloseIcon />
                                        </button>
                                    </div>

                                    <div
                                        className="flex-1 overflow-auto"
                                        style={{ paddingBottom: '80px' }}>
                                        <div className="bg-white px-4 pt-2 pb-4">
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
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                                                            placeholder="Enter the title of your post"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label
                                                        htmlFor="hashtags"
                                                        className="block text-sm font-medium text-gray-700">
                                                        Tags
                                                    </label>

                                                    <div className="mt-1 flex flex-wrap gap-2 ">
                                                        <input
                                                            type="text"
                                                            name="hashtags"
                                                            id="hashtags"
                                                            value={inputValue}
                                                            onChange={
                                                                handleHashtagsChange
                                                            }
                                                            onKeyDown={
                                                                handleKeyDown
                                                            }
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                                            placeholder="Add a tag and press 'space' (e.g., #meme)"
                                                        />
                                                        {hashtags.map(
                                                            (tag, index) => (
                                                                <div
                                                                    key={tag}
                                                                    className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                                                    {tag}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            removeTag(
                                                                                index,
                                                                            )
                                                                        }
                                                                        className="text-blue-500 hover:text-blue-700">
                                                                        &times;
                                                                    </button>
                                                                </div>
                                                            ),
                                                        )}

                                                        {showMaxTagsAlert && (
                                                            <div className="fixed top-0 inset-x-0 flex justify-center items-start z-50">
                                                                <div className="mt-2 p-4 bg-black text-white rounded-lg shadow-lg transition-transform transform-gpu animate-slideInSlideOut">
                                                                    <p>
                                                                        Max
                                                                        allowed
                                                                        tags: 3
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="sm:col-span-2">
                                                    <label
                                                        htmlFor="file-upload"
                                                        className="block text-sm font-medium text-gray-700">
                                                        Upload Image
                                                    </label>
                                                    <div className="mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                                        <div className="space-y-1 text-center">
                                                            {!preview &&
                                                                !isUploading && (
                                                                    <>
                                                                        <UploadNew />
                                                                        <label
                                                                            htmlFor="file-upload"
                                                                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                                                                            <span>
                                                                                Upload
                                                                                a
                                                                                file
                                                                                or
                                                                                drag
                                                                                and
                                                                                drop
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
                                                                        <p className="text-xs text-gray-500">
                                                                            PNG,
                                                                            JPG,
                                                                            GIF
                                                                            up
                                                                            to
                                                                            10MB
                                                                        </p>
                                                                    </>
                                                                )}
                                                            {isUploading && (
                                                                <div className="flex justify-center items-center">
                                                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                                                </div>
                                                            )}
                                                            {preview && (
                                                                <div className="relative">
                                                                    <img
                                                                        src={
                                                                            preview
                                                                        }
                                                                        alt="Preview"
                                                                        className="mt-4 w-full h-auto max-h-[300px] object-contain rounded"
                                                                    />
                                                                    <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-2 bg-white bg-opacity-75">
                                                                        <label
                                                                            htmlFor="file-upload"
                                                                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer">
                                                                            <UpwardArrow />
                                                                            <input
                                                                                id="file-upload"
                                                                                name="file-upload"
                                                                                type="file"
                                                                                onChange={
                                                                                    handleFileChange
                                                                                }
                                                                                className="sr-only"
                                                                            />
                                                                            <span className="sr-only">
                                                                                Change
                                                                                image
                                                                            </span>
                                                                        </label>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setPreview(
                                                                                    null,
                                                                                ); // Remove preview
                                                                                setLink(
                                                                                    null,
                                                                                ); // Remove link
                                                                                // Additional logic to handle the removal on the backend might be required
                                                                            }}
                                                                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700">
                                                                            <CloseIcon />
                                                                            <span className="sr-only">
                                                                                Remove
                                                                                image
                                                                            </span>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="fixed bottom-0 left-0 right-0 bg-gray-50 p-2 sm:p-4 text-right shadow-top">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
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
