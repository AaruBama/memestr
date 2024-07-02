import React, { useState, useRef, useEffect, createContext } from 'react';
import { Stage, Layer, Image, Text, Transformer } from 'react-konva';
import { saveAs } from 'file-saver';
import './MemeEditorStyle.css';
import { uploadToImgur } from '../Post/newPost';
import { ReactComponent as CloseIcon } from '../../Icons/CloseIcon.svg';

import { SimplePool, getEventHash, getSignature, nip19 } from 'nostr-tools';
import Templates from '../MakeMeme/Templates';
import Tabs from '../MakeMeme/Tabs';
import ToolsSection from '../MakeMeme/Tools';

export const sendNewPostEvent = async (imageUrl, title, hashtags) => {
    if (!imageUrl || !title) {
        alert('Can not create post without image and title.');

        return;
    }

    const relays = [
        'wss://relay.primal.net',
        'wss://relay.damus.io',
        'wss://relay.nostr.band',
        'wss://relay.nostr.bg',
        'wss://relay.nostrati.com',
        'wss://nos.lol',
        'wss://nostr.mom',
    ];
    const pool = new SimplePool();
    const storedData = localStorage.getItem('memestr');
    if (!storedData) {
        alert('Login required to upload post.');
        return;
    }

    let userPublicKey = JSON.parse(storedData).pubKey;
    let userPrivateKey = JSON.parse(storedData).privateKey;
    let sk = nip19.decode(userPrivateKey);
    let commentEvent = {
        kind: 1,
        pubkey: userPublicKey,
        created_at: Math.floor(Date.now() / 1000),
        tags: [
            ['d', 'memestr'],
            ['url', imageUrl],
            ['p', userPublicKey],
            ['category', 'memestrrr'],
        ],
        content: title + ' ' + imageUrl + ' ' + hashtags.join(' '),
    };

    commentEvent.id = getEventHash(commentEvent);
    commentEvent.sig = getSignature(commentEvent, sk.data);

    let p1 = pool.publish(relays, commentEvent);
    Promise.resolve(p1).then(
        value => {
            console.log('Success', value);
        },
        reason => {
            console.error('something went wrong', reason);
        },
    );
};

export const TemplateContext = createContext();

const MemeEditor = () => {
    const CANVAS_WIDTH = 400;
    const CANVAS_HEIGHT = 400;

    const [image, setImage] = useState(null);
    const [texts, setTexts] = useState([
        {
            id: Date.now(),
            text: '',
            x: 50,
            y: 50,
            fontSize: 24,
            fontStyle: 'normal',
            fontFamily: 'Impact',
            stroke: '#000000',
            fill: '#ffffff',
            strokeWidth: 1,
            width: 200,
        },
    ]);
    const [templates, setTemplates] = useState([]);

    const DEFAULT_COLOR = '#ffffff';
    const DEFAULT_FONT = 'Impact';
    const DEFAULT_OUTLINE_COLOR = '#000000';
    const DEFAULT_OUTLINE_WIDTH = 1;

    const [canvasWidth, setCanvasWidth] = useState(CANVAS_WIDTH);
    const [canvasHeight, setCanvasHeight] = useState(CANVAS_HEIGHT);

    const stageRef = useRef(null);
    const fileInputRef = useRef(null);
    const transformerRef = useRef(null);

    const [title, setTitle] = useState('');

    const [isUploading, setIsUploading] = useState(false);
    const [showPostDetails, setShowPostDetails] = useState(false);
    const [showSuccessNotification, setShowSuccessNotification] =
        useState(false);
    const MAX_TAGS = 3;
    let alertTimeout;

    const [hashtags, setHashtags] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [showMaxTagsAlert, setShowMaxTagsAlert] = useState(false);
    const [validation, setValidation] = useState(false);

    const handleKeyDown = event => {
        if (
            (event.key === ' ' || event.key === 'Enter') &&
            event.target.value.trim() !== ''
        ) {
            let tag = event.target.value.trim();
            if (!tag.startsWith('#')) {
                tag = `#${tag}`;
            }
            if (hashtags.length < MAX_TAGS) {
                setHashtags([...hashtags, tag]);
                setInputValue('');
                setShowMaxTagsAlert(false);
            } else {
                setShowMaxTagsAlert(true);
                clearTimeout(alertTimeout);
                alertTimeout = setTimeout(() => {
                    setShowMaxTagsAlert(false);
                }, 3000);
            }
            event.preventDefault();
        }
    };

    const handleHashtagsChange = event => {
        setInputValue(event.target.value);
    };

    const removeTag = index => {
        // eslint-disable-next-line no-unused-vars
        const newTags = hashtags.filter((_, i) => i !== index);
        setHashtags(newTags);
        setShowMaxTagsAlert(false);
    };

    const handleShowPostDetails = () => {
        setShowPostDetails(prevState => !prevState);
    };

    const fonts = [
        'Arial',
        'Times New Roman',
        'Courier New',
        'Georgia',
        'Verdana',
        'Comic Sans MS',
        'Impact',
    ];

    const styles = ['Normal', 'Bold', 'Italic'];

    const addText = () => {
        const newText = {
            id: Date.now(),
            text: '',
            x: 50,
            y: 50,
            fontSize: 24,
            fontStyle: 'normal',
            fontFamily: DEFAULT_FONT,
            fill: DEFAULT_COLOR,
            stroke: DEFAULT_OUTLINE_COLOR,
            strokeWidth: DEFAULT_OUTLINE_WIDTH,
            width: 200,
        };
        setTexts([...texts, newText]);
    };

    // const handleOutlineColorChange = color => {
    //     setCurrentOutlineColor(color.hex);
    //     const updatedTexts = texts.map(text => {
    //         if (text.id === selectedTextId) {
    //             return { ...text, stroke: color.hex };
    //         }
    //         return text;
    //     });
    //     setTexts(updatedTexts);
    // };

    const handleImageUpload = e => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            const img = new window.Image();
            img.src = reader.result;
            img.onload = () => {
                const canvasRatio = CANVAS_WIDTH / CANVAS_HEIGHT;
                const imgRatio = img.width / img.height;

                if (imgRatio > canvasRatio) {
                    img.width = CANVAS_WIDTH;
                    img.height = CANVAS_WIDTH / imgRatio;
                } else {
                    img.height = CANVAS_HEIGHT;
                    img.width = CANVAS_HEIGHT * imgRatio;
                }

                setImage(img);
            };
        };

        reader.readAsDataURL(file);
    };

    const handleTemplateImageSelect = imageUrl => {
        const img = new window.Image();
        img.src = imageUrl;
        img.crossOrigin = 'Anonymous'; // This is important for loading images from different origins

        img.onload = () => {
            const canvasRatio = CANVAS_WIDTH / CANVAS_HEIGHT;
            const imgRatio = img.width / img.height;

            if (imgRatio > canvasRatio) {
                img.width = CANVAS_WIDTH;
                img.height = CANVAS_WIDTH / imgRatio;
            } else {
                img.height = CANVAS_HEIGHT;
                img.width = CANVAS_HEIGHT * imgRatio;
            }

            setImage(img);
        };
    };

    const getDataURL = () => {
        const stage = stageRef.current;
        const dataURL = stage.toDataURL({ pixelRatio: 2 });
        return dataURL;
    };

    // const handleUploadToNostr = async () => {
    //     const storedData = localStorage.getItem('memestr');
    //     if (!storedData) {
    //         setValidation(true);
    //         setTimeout(() => setValidation(false), 3000);
    //         return;
    //     }
    //     setIsUploading(true);
    //     const dataURL = getDataURL();
    //     const blob = await fetch(dataURL).then(res => res.blob());
    //
    //     try {
    //         const response = await uploadToImgur(blob);
    //         const imageUrl = response.data.link;
    //         if (imageUrl) {
    //             await sendNewPostEvent(imageUrl, title, hashtags);
    //             setShowPostDetails(false);
    //             setTitle(' ');
    //             setHashtags([]);
    //             setInputValue('');
    //             setShowSuccessNotification(true);
    //             setTimeout(() => setShowSuccessNotification(false), 3000);
    //         }
    //     } catch (error) {
    //         console.error('An error occurred while uploading to Imgur:', error);
    //     }
    //     setIsUploading(false);
    // };

    // const handleDownload = () => {
    //     const stage = stageRef.current;
    //     const transformer = transformerRef.current;
    //
    //     if (transformer) {
    //         transformer.detach();
    //         transformer.getLayer().batchDraw();
    //     }
    //
    //     const boundingBox = stage.getChildren()[0].getClientRect();
    //     const scale = stage.scaleX();
    //     const width = boundingBox.width * scale;
    //     const height = boundingBox.height * scale;
    //     const x = boundingBox.x * scale;
    //     const y = boundingBox.y * scale;
    //
    //     const pixelRatio = 2;
    //     const dataURL = stage.toDataURL({
    //         x: boundingBox.x,
    //         y: boundingBox.y,
    //         width: boundingBox.width,
    //         height: boundingBox.height,
    //         pixelRatio: pixelRatio,
    //     });
    //
    //     const offScreenCanvas = document.createElement('canvas');
    //     offScreenCanvas.width = width * pixelRatio;
    //     offScreenCanvas.height = height * pixelRatio;
    //     const ctx = offScreenCanvas.getContext('2d');
    //
    //     const img = new window.Image();
    //     img.onload = () => {
    //         ctx.drawImage(
    //             img,
    //             x * pixelRatio,
    //             y * pixelRatio,
    //             width * pixelRatio,
    //             height * pixelRatio,
    //             0,
    //             0,
    //             width * pixelRatio,
    //             height * pixelRatio,
    //         );
    //
    //         offScreenCanvas.toBlob(blob => {
    //             saveAs(blob, 'my-meme.png');
    //         });
    //     };
    //     img.src = dataURL;
    // };

    const addWatermark = (canvas, text, fontSize, padding) => {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillText(text, width - padding, height - padding);

        return canvas;
    };

    const handleUploadToNostr = async () => {
        const storedData = localStorage.getItem('memestr');
        if (!storedData) {
            setValidation(true);
            setTimeout(() => setValidation(false), 3000);
            return;
        }
        setIsUploading(true);
        const dataURL = getDataURL();

        try {
            // Add the watermark to the canvas
            const canvas = document.createElement('canvas');
            const img = new window.Image();
            img.src = dataURL;
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                const watermarkText = 'memestr.app';
                const watermarkFontSize = 20;
                const watermarkPadding = 10;

                const canvasWithWatermark = addWatermark(
                    canvas,
                    watermarkText,
                    watermarkFontSize,
                    watermarkPadding,
                );

                canvasWithWatermark.toBlob(async watermarkedBlob => {
                    const response = await uploadToImgur(watermarkedBlob);
                    const imageUrl = response.data.link;
                    if (imageUrl) {
                        await sendNewPostEvent(imageUrl, title, hashtags);
                        setShowPostDetails(false);
                        setTitle(' ');
                        setHashtags([]);
                        setInputValue('');
                        setShowSuccessNotification(true);
                        setTimeout(
                            () => setShowSuccessNotification(false),
                            3000,
                        );
                    }
                });
            };
        } catch (error) {
            console.error('An error occurred while uploading to Imgur:', error);
        }
        setIsUploading(false);
    };

    const handleDownload = () => {
        const stage = stageRef.current;
        const transformer = transformerRef.current;

        if (transformer) {
            transformer.detach();
            transformer.getLayer().batchDraw();
        }

        const boundingBox = stage.getChildren()[0].getClientRect();
        const scale = stage.scaleX();
        const width = boundingBox.width * scale;
        const height = boundingBox.height * scale;
        const x = boundingBox.x * scale;
        const y = boundingBox.y * scale;

        const pixelRatio = 2;
        const dataURL = stage.toDataURL({
            x: boundingBox.x,
            y: boundingBox.y,
            width: boundingBox.width,
            height: boundingBox.height,
            pixelRatio: pixelRatio,
        });

        const offScreenCanvas = document.createElement('canvas');
        offScreenCanvas.width = width * pixelRatio;
        offScreenCanvas.height = height * pixelRatio;
        const ctx = offScreenCanvas.getContext('2d');

        const img = new window.Image();
        img.onload = () => {
            ctx.drawImage(
                img,
                x * pixelRatio,
                y * pixelRatio,
                width * pixelRatio,
                height * pixelRatio,
                0,
                0,
                width * pixelRatio,
                height * pixelRatio,
            );

            // Add the watermark
            const watermarkText = 'memestr.app';
            const watermarkFontSize = 20;
            const watermarkPadding = 10;

            ctx.font = `${watermarkFontSize}px Arial`;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';
            ctx.fillText(
                watermarkText,
                offScreenCanvas.width - watermarkPadding,
                offScreenCanvas.height - watermarkPadding,
            );

            offScreenCanvas.toBlob(blob => {
                saveAs(blob, 'my-meme.png');
            });
        };
        img.src = dataURL;
    };

    const handleTextChange = (id, newText) => {
        setTexts(
            texts.map(text =>
                text.id === id ? { ...text, text: newText } : text,
            ),
        );
    };

    const handleDeleteText = id => {
        setTexts(texts.filter(text => text.id !== id));
    };

    const handleStyleChange = (id, property, value) => {
        setTexts(
            texts.map(text =>
                text.id === id ? { ...text, [property]: value } : text,
            ),
        );
    };

    const handleColorChange = (id, color) => {
        setTexts(
            texts.map(text =>
                text.id === id ? { ...text, fill: color } : text,
            ),
        );
    };

    const handleOutlineColorChange = (id, color) => {
        setTexts(
            texts.map(text =>
                text.id === id ? { ...text, stroke: color } : text,
            ),
        );
    };

    const handleTextSelect = textId => {
        const textNode = stageRef.current.findOne(`#text-${textId}`);
        if (textNode) {
            transformerRef.current.nodes([textNode]);
            transformerRef.current.getLayer().batchDraw();
        }
    };

    useEffect(() => {
        const handleResize = () => {
            const containerWidth = stageRef.current.container().offsetWidth;
            const scale = containerWidth / CANVAS_WIDTH;

            stageRef.current.width(CANVAS_WIDTH * scale);
            stageRef.current.height(CANVAS_HEIGHT * scale);
            stageRef.current.scale({ x: scale, y: scale });
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        const fetchImages = async () => {
            if (templates.length === 0) {
                try {
                    const response = await fetch(
                        'https://6sz2qdcmae.execute-api.us-east-1.amazonaws.com/prod/',
                    );
                    if (!response.ok) {
                        throw new Error('Failed to fetch images');
                    }
                    const data = await response.json();
                    setTemplates(data);
                } catch (error) {
                    console.error('Error fetching images:', error);
                }
            }
        };

        fetchImages();
    }, [templates.length]);

    useEffect(() => {
        if (image) {
            const imgRatio = image.width / image.height;
            const canvasRatio = CANVAS_WIDTH / CANVAS_HEIGHT;

            if (imgRatio > canvasRatio) {
                setCanvasWidth(CANVAS_WIDTH);
                setCanvasHeight(CANVAS_WIDTH / imgRatio);
            } else {
                setCanvasHeight(CANVAS_HEIGHT);
                setCanvasWidth(CANVAS_HEIGHT * imgRatio);
            }
        }
    }, [image]);

    const contextValue = { templates, handleTemplateImageSelect };

    return (
        <>
            <h1 className="mt-2 text-3xl font-nunito font-bold text-center">
                Make a Meme
            </h1>
            <div className="flex flex-col md:flex-row overflow-auto">
                <div className="p-4 rounded-lg flex-1">
                    <div
                        style={{
                            marginTop: '10px',
                            border: '1px solid grey',
                            display: 'inline-block',
                        }}>
                        <Stage
                            width={canvasWidth}
                            height={canvasHeight}
                            ref={stageRef}>
                            <Layer>
                                {image && (
                                    <Image
                                        image={image}
                                        width={canvasWidth}
                                        height={canvasHeight}
                                    />
                                )}
                                {texts.map(text => (
                                    <Text
                                        key={text.id}
                                        id={`text-${text.id}`}
                                        text={text.text}
                                        x={text.x}
                                        y={text.y}
                                        fontSize={text.fontSize}
                                        fontStyle={text.fontStyle}
                                        fontFamily={text.fontFamily}
                                        fill={text.fill}
                                        width={text.width}
                                        wrap="word"
                                        stroke={text.stroke}
                                        strokeWidth={text.strokeWidth}
                                        draggable
                                        onDragEnd={e => {
                                            const node = e.target;
                                            const updatedTexts = texts.map(t =>
                                                t.id === text.id
                                                    ? {
                                                          ...t,
                                                          x: node.x(),
                                                          y: node.y(),
                                                      }
                                                    : t,
                                            );
                                            setTexts(updatedTexts);
                                        }}
                                        onClick={() =>
                                            handleTextSelect(text.id)
                                        }
                                    />
                                ))}
                                <Transformer ref={transformerRef} />
                            </Layer>
                        </Stage>
                    </div>
                    <div className="flex mt-4 justify-center gap-2">
                        <label
                            htmlFor="fileInput"
                            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-slate-900 cursor-pointer inline-block">
                            Upload Image
                        </label>
                        <button
                            onClick={handleDownload}
                            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-900">
                            Save
                        </button>
                        <button
                            onClick={handleShowPostDetails}
                            className="px-4 py-2  bg-gray-700 text-white rounded-lg hover:bg-gray-900">
                            Post on Nostr.
                        </button>
                    </div>
                    {showPostDetails && (
                        <div className="flex flex-col p-4">
                            <h2 className="text-xl font-nunito font-semibold mb-2">
                                Post Details
                            </h2>
                            <input
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="Title"
                                className="px-4 py-2 w-full border border-gray-300 rounded-lg"
                            />

                            <div className="mt-2 flex flex-wrap gap-2">
                                <div className="flex w-full">
                                    <div className="bg-white border border-gray-300 rounded-l-md p-2 flex items-center">
                                        <span className="text-indigo-600">
                                            #
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        name="hashtags"
                                        id="hashtags"
                                        value={inputValue}
                                        onChange={handleHashtagsChange}
                                        onKeyDown={handleKeyDown}
                                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-r-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                                        placeholder="Add Tags"
                                    />
                                </div>
                                {hashtags.map((tag, index) => (
                                    <div
                                        key={tag}
                                        className="flex items-center text-wrap gap-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(index)}
                                            className="text-blue-500 hover:text-blue-700">
                                            &times;
                                        </button>
                                    </div>
                                ))}
                                {showMaxTagsAlert && (
                                    <div className="fixed top-0 inset-x-0 flex justify-center items-start z-50">
                                        <div className="mt-2 p-4 bg-black text-white rounded-lg shadow-lg transition-transform transform-gpu animate-slideInSlideOut">
                                            <p>Max allowed tags: 3</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleUploadToNostr}
                                className="px-4 mt-2 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-900"
                                disabled={isUploading || !title.trim()}>
                                {isUploading
                                    ? 'Uploading...'
                                    : 'Upload to Nostr'}
                            </button>
                        </div>
                    )}

                    {showSuccessNotification && (
                        <div className="fixed top-0 inset-x-0 flex justify-center items-start notification z-50">
                            <div className="mt-12 p-4 bg-black text-white rounded-lg shadow-lg transition-transform transform-gpu animate-slideInSlideOut flex items-center">
                                <p className="text-bold text-white px-2">
                                    Meme Uploaded Successfully
                                </p>
                                <CloseIcon
                                    className="h-6 w-6 mr-2 text-white"
                                    onClick={() =>
                                        setShowSuccessNotification(false)
                                    }
                                />
                            </div>
                        </div>
                    )}
                    {validation && (
                        <div className="fixed top-0 inset-x-0 flex justify-center items-start notification z-50">
                            <div className="mt-12 p-4 bg-black text-white rounded-lg shadow-lg transition-transform transform-gpu animate-slideInSlideOut flex items-center">
                                <p className="text-bold text-white px-2">
                                    Login Required to Post
                                </p>
                                <CloseIcon
                                    className="h-6 w-6 mr-2 text-white"
                                    onClick={() => setValidation(false)}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <TemplateContext.Provider value={contextValue}>
                    <div className="container mx-auto p-4">
                        <Tabs>
                            <div title="Tools">
                                <ToolsSection
                                    texts={texts}
                                    onTextChange={handleTextChange}
                                    onAddText={addText}
                                    onDeleteText={handleDeleteText}
                                    onStyleChange={handleStyleChange}
                                    onColorChange={handleColorChange}
                                    onOutlineColorChange={
                                        handleOutlineColorChange
                                    }
                                    fonts={fonts}
                                    styles={styles}
                                    fileInputRef={fileInputRef}
                                    handleImageUpload={handleImageUpload}
                                />
                            </div>
                            <div title="Popular Memes">
                                <Templates />
                            </div>
                        </Tabs>
                    </div>
                </TemplateContext.Provider>
            </div>
        </>
    );
};

export default MemeEditor;
