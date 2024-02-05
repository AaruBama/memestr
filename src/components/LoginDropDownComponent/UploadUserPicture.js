import React, { useState } from 'react';
import { ReactComponent as ProfileIcon } from '../../Icons/Profile.svg';
import { ReactComponent as CloseIcon } from '../../Icons/CloseIcon.svg';

const UploadAndDisplayImage = ({ setPicture }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    const choosePicture = async file => {
        const apiUrl = 'https://void.cat/upload?cli=true';
        const headers = new Headers();
        const formData = new FormData();

        // Set headers
        headers.append('V-Content-Type', file.type);
        headers.append('V-Full-Digest', await calculateSHA256(file));
        headers.append('V-Filename', file.name);
        // Append the file to FormData
        formData.append('file', file);

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers,
                body: formData,
            });

            if (!response.ok) {
                throw new Error(
                    `Failed to upload file: ${response.statusText}`,
                );
            }

            const responseData = await response.json();
            if (!responseData.ok) {
                setSelectedImage(null);
                setPicture('');
                alert("Picture couldn't be uploaded. Try later.");
            } else {
                // setResponseJson(responseData)
                setPicture(responseData.file);
                return responseData;
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            return null;
        }
    };

    const calculateSHA256 = async file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = event => {
                const arrayBuffer = event.target.result;
                const cryptoSubtle = window.crypto.subtle;

                cryptoSubtle.digest('SHA-256', arrayBuffer).then(hashBuffer => {
                    const hashArray = Array.from(new Uint8Array(hashBuffer));
                    const hashHex = hashArray
                        .map(byte => byte.toString(16).padStart(2, '0'))
                        .join('');
                    resolve(hashHex);
                });
            };

            reader.onerror = () => {
                reject(new Error('Error reading file for SHA-256 calculation'));
            };

            reader.readAsArrayBuffer(file);
        });
    };

    return (
        <div className="mt-4 border-2 border-gray-300 shadow-sm rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div
                        className={`flex items-center justify-center w-24 h-24 border-2 border-gray-300 rounded-full ${
                            selectedImage ? 'mr-4' : ''
                        }`}>
                        {selectedImage ? (
                            <img
                                src={URL.createObjectURL(selectedImage)}
                                alt="Uploaded"
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <ProfileIcon className="w-16 h-16 text-white" />
                        )}
                    </div>
                    {selectedImage && (
                        <button
                            onClick={() => {
                                setSelectedImage(null);
                                setPicture('');
                            }}
                            className="flex items-center justify-center ml-4 w-10 h-10 bg-red-500 rounded-full hover:bg-red-600 transition duration-300">
                            <CloseIcon className="w-6 h-6 text-white" />
                        </button>
                    )}
                </div>

                <label className="flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-full shadow-sm tracking-wide uppercase border border-gray-300 cursor-pointer hover:bg-gray-300 transition duration-300">
                    <span className="text-base leading-normal">
                        Upload Image
                    </span>
                    <input
                        type="file"
                        className="hidden"
                        onChange={event => {
                            const file = event.target.files[0];
                            if (file) {
                                setSelectedImage(file);
                                choosePicture(file).then(console.log);
                            }
                        }}
                    />
                </label>
            </div>
        </div>
    );
};

export default UploadAndDisplayImage;
