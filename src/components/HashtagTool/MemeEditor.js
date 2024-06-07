import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Image, Text, Transformer, Line } from 'react-konva';
import { saveAs } from 'file-saver';
import { SketchPicker } from 'react-color';
import './MemeEditorStyle.css';

const MemeEditor = () => {
    const [image, setImage] = useState(null);
    const [texts, setTexts] = useState([]);
    const [currentText, setCurrentText] = useState('');
    const [currentColor, setCurrentColor] = useState('#000000');
    const [currentFont, setCurrentFont] = useState('Arial');
    const [lines, setLines] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [editedText, setEditedText] = useState('');
    const stageRef = useRef(null);
    const fileInputRef = useRef(null);
    const transformerRef = useRef(null);
    const [selectedTextId, setSelectedTextId] = useState(null);

    const CANVAS_WIDTH = 400;
    const CANVAS_HEIGHT = 400;

    const fonts = [
        'Arial',
        'Times New Roman',
        'Courier New',
        'Georgia',
        'Verdana',
        'Comic Sans MS',
        'Bold',
    ];

    const addText = () => {
        const newText = {
            id: texts.length + 1,
            text: currentText,
            x: 50,
            y: 50,
            fontSize: 24,
            fontStyle: 'normal',
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

    const handleDownload = () => {
        const stage = stageRef.current;
        const transformer = transformerRef.current;

        if (transformer) {
            transformer.detach();
            transformer.getLayer().batchDraw();
        }

        const uri = stage.toDataURL({ pixelRatio: 2 });
        saveAs(uri, 'my-meme.png');
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
        const updatedTexts = texts.map(text => {
            if (text.id === selectedTextId) {
                return { ...text, fontStyle: style };
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
                            onMousemove={handleMouseMove}
                            onTouchMove={handleMouseMove}
                            onMouseup={handleMouseUp}
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
                                        fontFamily={text.fontFamily}
                                        draggable
                                        onClick={() =>
                                            handleTextSelect(text.id)
                                        }
                                        onTap={() => handleTextSelect(text.id)}
                                    />
                                ))}
                                {lines.map((line, i) => (
                                    <Line
                                        key={i}
                                        points={line.points}
                                        stroke="black"
                                        strokeWidth={2}
                                        tension={0.5}
                                        lineCap="round"
                                        lineJoin="round"
                                    />
                                ))}
                                <Transformer ref={transformerRef} />
                            </Layer>
                        </Stage>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center justify-center space-x-2 mt-4">
                            <button
                                onClick={() => updateTextStyle('normal')}
                                className="px-4 py-2 bg-white text-black rounded-lg border border-gray-300 hover:bg-gray-200">
                                Normal
                            </button>
                            <button
                                onClick={() => updateTextStyle('bold')}
                                className="px-4 py-2 bg-white text-black rounded-lg border border-gray-300 hover:bg-gray-200">
                                Bold
                            </button>
                            <button
                                onClick={() => updateTextStyle('italic')}
                                className="px-4 py-2 bg-white text-black rounded-lg border border-gray-300 hover:bg-gray-200">
                                Italic
                            </button>
                        </div>
                        {selectedTextId && (
                            <div className="flex flex-col items-center mt-4 space-y-2">
                                <input
                                    type="text"
                                    value={editedText}
                                    onChange={handleEditedTextChange}
                                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-700"
                                />
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleEditText}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700">
                                        Edit Text
                                    </button>
                                    <button
                                        onClick={deleteSelectedText}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800">
                                        Delete Text
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="p-4 rounded-lg editor-controls flex-1">
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                    />
                    <div className="flex space-x-2 mb-2 mt-2">
                        <button
                            onClick={() => fileInputRef.current.click()}
                            className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-900">
                            Upload Image
                        </button>
                        <button
                            onClick={handleDownload}
                            className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-900">
                            Download Meme
                        </button>
                    </div>
                    <p className="text-md font-nunito ml-1">Edit your Meme</p>
                    <div className="flex items-center space-x-2 mt-2">
                        <input
                            type="text"
                            value={currentText}
                            onChange={handleTextChange}
                            placeholder="Type your text here"
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-700"
                        />
                        <button
                            onClick={addText}
                            className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-900">
                            Add Text
                        </button>
                    </div>
                    <div className="flex flex-col space-y-2 mt-2">
                        <label className="text-md font-nunito ml-1">
                            Font Family
                        </label>
                        <select
                            value={currentFont}
                            onChange={handleFontChange}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-700">
                            {fonts.map(font => (
                                <option key={font} value={font}>
                                    {font}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-12 md:mt-4 md:mb-0">
                        <label className="text-md font-nunito ml-1">
                            Text Color
                        </label>
                        <SketchPicker
                            color={currentColor}
                            onChangeComplete={handleColorChange}
                            className="mt-2"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default MemeEditor;
