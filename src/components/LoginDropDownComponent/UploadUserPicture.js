import React, { useState } from 'react';
import { ReactComponent as CloudUpload } from '../../Icons/CloudUpload.svg';

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
        <div className="mt-4 border-2 border-gray-300 border-dashed rounded-lg p-4">
            <div className="space-y-2 text-center">
                <h3 className="text-lg font-medium text-gray-700">
                    Add Picture
                </h3>

                {selectedImage && (
                    <div className="flex flex-col items-center justify-center">
                        <img
                            alt="Uploaded"
                            className="w-48 h-48 object-cover rounded-md mb-2"
                            src={URL.createObjectURL(selectedImage)}
                        />
                        <button
                            onClick={() => {
                                setSelectedImage(null);
                                setPicture('');
                            }}
                            className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                            Remove
                        </button>
                    </div>
                )}

                {!selectedImage && (
                    <label className="flex flex-col items-center justify-center w-full h-32 bg-white text-blue-600 rounded-lg tracking-wide uppercase border border-blue-500 cursor-pointer hover:bg-blue-50 hover:text-blue-700">
                        <CloudUpload className="text-blue-700" />
                        <span className="mt-2 text-base leading-normal">
                            Select a file
                        </span>
                        <input
                            type="file"
                            className="hidden"
                            onChange={event => {
                                setSelectedImage(event.target.files[0]);
                                choosePicture(event.target.files[0]).then(
                                    console.log,
                                );
                            }}
                        />
                    </label>
                )}
            </div>
        </div>
    );
};

export default UploadAndDisplayImage;
