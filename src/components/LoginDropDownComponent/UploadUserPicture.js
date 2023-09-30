import React, { useState } from "react";

const UploadAndDisplayImage = ({ setPicture }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    const choosePicture = async file => {
        const apiUrl = "https://void.cat/upload?cli=true";
        const headers = new Headers();
        const formData = new FormData();

        // Set headers
        headers.append("V-Content-Type", file.type);
        headers.append("V-Full-Digest", await calculateSHA256(file));
        headers.append("V-Filename", file.name);
        // Append the file to FormData
        formData.append("file", file);

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
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
                setPicture("");
                alert("Picture couldn't be uploaded. Try later.");
            } else {
                console.log("responseData", responseData);
                // setResponseJson(responseData)
                setPicture(responseData.file);
                return responseData;
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            return null;
        }
    };

    const calculateSHA256 = async file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = event => {
                const arrayBuffer = event.target.result;
                const cryptoSubtle = window.crypto.subtle;

                cryptoSubtle.digest("SHA-256", arrayBuffer).then(hashBuffer => {
                    const hashArray = Array.from(new Uint8Array(hashBuffer));
                    const hashHex = hashArray
                        .map(byte => byte.toString(16).padStart(2, "0"))
                        .join("");
                    resolve(hashHex);
                });
            };

            reader.onerror = () => {
                reject(new Error("Error reading file for SHA-256 calculation"));
            };

            reader.readAsArrayBuffer(file);
        });
    };

    return (
        <div
            className={
                "border-separate border-spacing-2 border border-solid border-2 border-b rounded-[10px] mt-4"
            }>
            <div class={"flex-nowrap bg-gray-500/[.06] px-2"}>
                <h3 class={"flex justify-start p-2"}>Add Picture</h3>

                <div class={"pb-2"}>
                    {selectedImage && (
                        <div>
                            <img
                                alt="userProfile"
                                width={"250px"}
                                src={URL.createObjectURL(selectedImage)}
                            />
                            <button
                                onClick={() => {
                                    setSelectedImage(null);
                                    // setPicture(selectedImage)
                                }}>
                                Remove
                            </button>
                        </div>
                    )}

                    <input
                        type="file"
                        name="myImage"
                        onChange={event => {
                            console.log(event.target.files[0]);
                            setSelectedImage(event.target.files[0]);
                            // setPicture(event.target.files[0])
                            choosePicture(event.target.files[0]).then(r => {
                                console.log(r);
                            });
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default UploadAndDisplayImage;
