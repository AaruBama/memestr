import React from 'react';

const PostUpload = () => {
    // const [encodedMedia, setEncodedMedia] = useState(null);

    const handleFileChange = async (event) => {
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
            console.log("24, response is", response)

            // Step 4: Parse the JSON response
            // const jsonResponse = JSON.parse(response);
            const jsonResponse = response.data;
            console.log("28, response is", jsonResponse.data)

            // Step 5: Return the JSON on success
            if (jsonResponse.data) {
                console.log('Upload successful:', jsonResponse);
            } else {
                console.error('Upload failed:', jsonResponse);
            }
        } catch (error) {
            console.error('An error occurred:', error);
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

    const uploadToImgur = async (media) => {
        // if (!validateFile(file)) {
        //     alert("Only jpg,jpeg,mp4 allowed")
        // }
        const apiUrl = `https://api.imgur.com/3/upload`;

        const formData = new FormData();
        formData.append('image', media);
        const headers = new Headers();
        headers.append('Authorization', 'Client-ID c41537d03e6c984')

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers,
            body: formData,

        });


        if (!response.ok) {
            throw new Error('Upload failed');
        }
        return response.json()
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
        </div>
    );
};

export default PostUpload;
