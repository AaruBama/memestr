import React, { useState } from 'react';
import { ReactComponent as ProfileIcon } from '../../Icons/Profile.svg';
// import { ReactComponent as CloseIcon } from '../../Icons/CloseIcon.svg';

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
        <div className="mt-4 border border-gray-200 shadow-sm rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-center">
                <label className="cursor-pointer">
                    <div
                        className={`w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center ${
                            selectedImage
                                ? 'border-blue-500'
                                : 'border-gray-300'
                        }`}>
                        {selectedImage ? (
                            <img
                                src={URL.createObjectURL(selectedImage)}
                                alt="Uploaded"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center">
                                <ProfileIcon className="w-16 h-16 text-gray-400" />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col items-center mt-3">
                        <span className="block text-sm font-medium text-gray-700">
                            {selectedImage ? 'Change Image' : 'Upload Image'}
                        </span>
                        <span className="block text-xs text-gray-500">
                            {selectedImage
                                ? 'Tap to select another'
                                : 'Tap to select a file'}
                        </span>
                    </div>
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
