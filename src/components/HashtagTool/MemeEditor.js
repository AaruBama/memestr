import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Image, Text, Transformer, Line } from 'react-konva';
import { saveAs } from 'file-saver';
import { SketchPicker } from 'react-color';
import './MemeEditorStyle.css';
import { uploadToImgur } from '../Post/newPost';
import { ReactComponent as CloseIcon } from '../../Icons/CloseIcon.svg';

import { SimplePool, getEventHash, getSignature, nip19 } from 'nostr-tools';

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

const MemeEditor = () => {
    const [image, setImage] = useState(null);
    const [texts, setTexts] = useState([]);
    const [currentText, setCurrentText] = useState('');
    const [currentColor, setCurrentColor] = useState('#000000');
    const [currentFont, setCurrentFont] = useState('Arial');
    const [currentStyle, setCurrentStyle] = useState('normal');
    const [lines, setLines] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);

    const [editedText, setEditedText] = useState('');
    const stageRef = useRef(null);
    const fileInputRef = useRef(null);
    const transformerRef = useRef(null);
    const [selectedTextId, setSelectedTextId] = useState(null);

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

    const CANVAS_WIDTH = 400;
    const CANVAS_HEIGHT = 400;

    const fonts = [
        'Arial',
        'Times New Roman',
        'Courier New',
        'Georgia',
        'Verdana',
        'Comic Sans MS',
    ];

    const styles = ['Normal', 'Bold', 'Bolder', 'Italic'];

    const addText = () => {
        const newText = {
            id: texts.length + 1,
            text: currentText,
            x: 50,
            y: 50,
            fontSize: 24,
            fontStyle: currentStyle,
            fill: currentColor,
            fontFamily: currentFont,
        };
        setTexts([...texts, newText]);
        setCurrentText('');
    };

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

    const getDataURL = () => {
        const stage = stageRef.current;
        const dataURL = stage.toDataURL({ pixelRatio: 2 });
        return dataURL;
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
        const blob = await fetch(dataURL).then(res => res.blob());

        try {
            const response = await uploadToImgur(blob);
            const imageUrl = response.data.link;
            if (imageUrl) {
                await sendNewPostEvent(imageUrl, title, hashtags);
                setShowPostDetails(false);
                setTitle(' ');
                setHashtags([]);
                setInputValue('');
                setShowSuccessNotification(true);
                setTimeout(() => setShowSuccessNotification(false), 3000);
            }
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

            offScreenCanvas.toBlob(blob => {
                saveAs(blob, 'my-meme.png');
            });
        };
        img.src = dataURL;
    };

    const handleTextChange = e => {
        setCurrentText(e.target.value);
    };

    const handleEditedTextChange = e => {
        setEditedText(e.target.value);
    };

    const handleMouseDown = e => {
        if (!isDrawing) {
            return;
        }
        const { x, y } = e.target.getStage().getPointerPosition();
        setLines([...lines, { points: [x, y] }]);
    };

    const handleMouseMove = e => {
        if (!isDrawing) {
            return;
        }
        const stage = e.target.getStage();
        const point = stage.getPointerPosition();
        const lastLine = lines[lines.length - 1];
        if (lastLine) {
            lastLine.points = lastLine.points.concat([point.x, point.y]);
            setLines(lines.slice(0, -1).concat(lastLine));
        }
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
    };

    const handleTextSelect = textId => {
        setSelectedTextId(textId);
        const selectedText = texts.find(text => text.id === textId);
        setEditedText(selectedText ? selectedText.text : '');
        const textNode = stageRef.current.findOne(`#text-${textId}`);
        if (textNode) {
            transformerRef.current.nodes([textNode]);
            transformerRef.current.getLayer().batchDraw();
        }
    };

    const updateTextStyle = style => {
        setCurrentStyle(style.target.value);
        const updatedTexts = texts.map(text => {
            if (text.id === selectedTextId) {
                return { ...text, fontStyle: style.target.value };
            }
            return text;
        });
        setTexts(updatedTexts);
    };

    const handleColorChange = color => {
        setCurrentColor(color.hex);
        const updatedTexts = texts.map(text => {
            if (text.id === selectedTextId) {
                return { ...text, fill: color.hex };
            }
            return text;
        });
        setTexts(updatedTexts);
    };

    const handleFontChange = e => {
        setCurrentFont(e.target.value);
        const updatedTexts = texts.map(text => {
            if (text.id === selectedTextId) {
                return { ...text, fontFamily: e.target.value };
            }
            return text;
        });
        setTexts(updatedTexts);
    };

    const deleteSelectedText = () => {
        setTexts(texts.filter(text => text.id !== selectedTextId));
        setSelectedTextId(null);
        transformerRef.current.detach();
        transformerRef.current.getLayer().batchDraw();
    };

    const handleEditText = () => {
        const updatedTexts = texts.map(text => {
            if (text.id === selectedTextId) {
                return { ...text, text: editedText };
            }
            return text;
        });

        setTexts(updatedTexts);
        transformerRef.current.detach();
        transformerRef.current.getLayer().batchDraw();
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

    return (
        <>
            <h1 className="mt-2 text-3xl font-nunito font-bold text-center">
                Make a Meme
            </h1>
            <div className="flex flex-col md:flex-row overflow-auto">
                <div className="p-4 rounded-lg flex-1">
                    <div style={{ marginTop: '10px' }}>
                        <Stage
                            width={CANVAS_WIDTH}
                            height={CANVAS_HEIGHT}
                            ref={stageRef}
                            onMouseDown={handleMouseDown}
                            onTouchStart={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onTouchMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onTouchEnd={handleMouseUp}
                            className="border border-gray-300 rounded-lg">
                            <Layer>
                                {image && <Image image={image} />}
                                {texts.map(text => (
                                    <Text
                                        key={text.id}
                                        id={`text-${text.id}`}
                                        text={text.text}
                                        x={text.x}
                                        y={text.y}
                                        fontSize={text.fontSize}
                                        fontStyle={text.fontStyle}
                                        fill={text.fill}
                                        draggable
                                        fontFamily={text.fontFamily}
                                        onClick={() =>
                                            handleTextSelect(text.id)
                                        }
                                        onTap={() => handleTextSelect(text.id)}
                                        onDragEnd={e => {
                                            const updatedTexts = texts.map(
                                                t => {
                                                    if (t.id === text.id) {
                                                        return {
                                                            ...t,
                                                            x: e.target.x(),
                                                            y: e.target.y(),
                                                        };
                                                    }
                                                    return t;
                                                },
                                            );
                                            setTexts(updatedTexts);
                                        }}
                                        onTransformEnd={e => {
                                            const node = e.target;
                                            const updatedTexts = texts.map(
                                                t => {
                                                    if (t.id === text.id) {
                                                        return {
                                                            ...t,
                                                            x: node.x(),
                                                            y: node.y(),
                                                            fontSize:
                                                                node.fontSize(),
                                                            rotation:
                                                                node.rotation(),
                                                        };
                                                    }
                                                    return t;
                                                },
                                            );
                                            setTexts(updatedTexts);
                                        }}
                                    />
                                ))}
                                <Transformer ref={transformerRef} />
                                {lines.map((line, index) => (
                                    <Line
                                        key={index}
                                        points={line.points}
                                        stroke="black"
                                        strokeWidth={2}
                                        tension={0.5}
                                        lineCap="round"
                                        globalCompositeOperation={
                                            line.tool === 'eraser'
                                                ? 'destination-out'
                                                : 'source-over'
                                        }
                                    />
                                ))}
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
                            Download
                        </button>
                        <button
                            onClick={handleShowPostDetails}
                            className="px-4 py-2  bg-gray-700 text-white rounded-lg hover:bg-gray-900">
                            Post Meme
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

                <div className="flex-1 p-4">
                    <h2 className="text-xl font-nunito font-semibold mb-2">
                        Tools
                    </h2>

                    <input
                        id="fileInput"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                    />
                    <div className="mt-4">
                        <input
                            type="text"
                            value={currentText}
                            onChange={handleTextChange}
                            placeholder="Enter text"
                            className="px-4 py-2 w-full border border-gray-300 rounded-lg"
                        />
                        <button
                            onClick={addText}
                            className="px-4 py-2 mt-2 bg-slate-700 text-white rounded-lg hover:bg-slate-900">
                            Add Text
                        </button>
                    </div>

                    <div className="mt-4">
                        <h2 className="text-xl font-nunito font-semibold mb-2">
                            Selected Text
                        </h2>
                        <input
                            type="text"
                            value={editedText}
                            onChange={handleEditedTextChange}
                            placeholder="Edit selected text"
                            className="px-4 py-2 w-full border border-gray-300 rounded-lg"
                        />
                        <div className="flex flex-row gap-2">
                            <button
                                onClick={handleEditText}
                                className="px-4 py-2 mt-2  bg-slate-700 text-white rounded-lg hover:bg-slate-900">
                                Save Text
                            </button>
                            <button
                                onClick={deleteSelectedText}
                                className="px-4 py-2 mt-2 bg-red-500 text-white rounded-lg hover:bg-red-700">
                                Remove Text
                            </button>
                        </div>
                    </div>

                    <div className="mt-4">
                        <h2 className="text-xl font-nunito font-semibold mb-2">
                            Font and Color
                        </h2>
                        <div className="flex flex-row space-x-4">
                            <div className="flex-1">
                                <h3 className="text-md font-nunito mb-2">
                                    Font Family
                                </h3>
                                <select
                                    value={currentFont}
                                    onChange={handleFontChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                                    {fonts.map(font => (
                                        <option key={font} value={font}>
                                            {font}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex-1 ">
                                <h3 className="text-md font-nunito mb-2">
                                    Font Style
                                </h3>
                                <select
                                    value={currentStyle}
                                    onChange={updateTextStyle}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                                    {styles.map(style => (
                                        <option key={style} value={style}>
                                            {style}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <SketchPicker
                            color={currentColor}
                            onChange={handleColorChange}
                            className="mt-4 mb-12 md:mt-4 md:mb-0"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default MemeEditor;
