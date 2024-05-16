import React, { useState } from 'react';
import { ReactComponent as ProfileIcon } from '../../Icons/Profile.svg';
import { uploadToImgur } from '../Post/newPost';

const UploadAndDisplayImage = ({ setPicture }) => {
    const [selectedImage, setSelectedImage] = useState(null);
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
                        onChange={async event => {
                            const file = event.target.files[0];
                            if (file) {
                                try {
                                    const responce = await uploadToImgur(file);
                                    setPicture(responce.data.link);
                                    setSelectedImage(file);
                                } catch (error) {
                                    console.error('An error occured', error);
                                    setPicture(null);
                                }
                            }
                        }}
                    />
                </label>
            </div>
        </div>
    );
};

export default UploadAndDisplayImage;
