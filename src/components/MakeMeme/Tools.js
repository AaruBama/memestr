import { SketchPicker } from 'react-color';
import { ReactComponent as GearIcon } from '../../Icons/Bitcoin.svg';

import React, { useState, useRef, useEffect } from 'react';

const TextInput = ({
    text,
    onTextChange,
    onDelete,
    onStyleChange,
    onColorChange,
    onOutlineColorChange,
    fonts,
    styles,
}) => {
    const [openPanel, setOpenPanel] = useState(null);
    const panelRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = event => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                setOpenPanel(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const togglePanel = panelName => {
        setOpenPanel(openPanel === panelName ? null : panelName);
    };

    return (
        <div className="mb-4 relative">
            <div className="flex items-center">
                <input
                    type="text"
                    value={text.text}
                    onChange={e => onTextChange(text.id, e.target.value)}
                    placeholder="Enter text"
                    className="px-2 py-2 w-full border border-gray-300 rounded-lg"
                />
                <button
                    className="ml-2 p-2 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    onClick={() => togglePanel('gear')}>
                    <GearIcon className="w-5 h-5 text-gray-600" />
                </button>
                <button
                    className="ml-2 w-8 h-8 rounded"
                    style={{ backgroundColor: text.fill }}
                    onClick={() => togglePanel('fillColor')}></button>
                <button
                    className="ml-2 w-8 h-8 rounded border-2 border-gray-300"
                    style={{ backgroundColor: text.stroke }}
                    onClick={() => togglePanel('outlineColor')}></button>
                <button
                    className="ml-2 px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-700"
                    onClick={() => onDelete(text.id)}>
                    Delete
                </button>
            </div>
            {openPanel && (
                <div ref={panelRef} className="absolute right-0 mt-2 z-10">
                    {openPanel === 'gear' && (
                        <div className="w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                            <div className="p-4">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Font Family:
                                    </label>
                                    <select
                                        value={text.fontFamily}
                                        onChange={e =>
                                            onStyleChange(
                                                text.id,
                                                'fontFamily',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-2 py-1 border border-gray-300 rounded-md">
                                        {fonts.map((font, index) => (
                                            <option key={index} value={font}>
                                                {font}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Font Style:
                                    </label>
                                    <select
                                        value={text.fontStyle}
                                        onChange={e =>
                                            onStyleChange(
                                                text.id,
                                                'fontStyle',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full px-2 py-1 border border-gray-300 rounded-md">
                                        {styles.map((style, index) => (
                                            <option key={index} value={style}>
                                                {style}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Font Size:
                                    </label>
                                    <input
                                        type="number"
                                        value={text.fontSize}
                                        onChange={e =>
                                            onStyleChange(
                                                text.id,
                                                'fontSize',
                                                Number(e.target.value),
                                            )
                                        }
                                        min="8"
                                        max="72"
                                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Outline Width:
                                    </label>
                                    <input
                                        type="number"
                                        value={text.strokeWidth}
                                        onChange={e =>
                                            onStyleChange(
                                                text.id,
                                                'strokeWidth',
                                                Number(e.target.value),
                                            )
                                        }
                                        min="0"
                                        max="20"
                                        className="w-full px-2 py-1 border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    {openPanel === 'fillColor' && (
                        <SketchPicker
                            color={text.fill}
                            onChangeComplete={color =>
                                onColorChange(text.id, color.hex)
                            }
                        />
                    )}
                    {openPanel === 'outlineColor' && (
                        <SketchPicker
                            color={text.stroke}
                            onChangeComplete={color =>
                                onOutlineColorChange(text.id, color.hex)
                            }
                        />
                    )}
                </div>
            )}
        </div>
    );
};

const ToolsSection = ({
    texts,
    onTextChange,
    onAddText,
    onDeleteText,
    onStyleChange,
    onColorChange,
    onOutlineColorChange,
    fonts,
    styles,
    fileInputRef,
    handleImageUpload,
}) => {
    return (
        <div className="flex-1 p-4">
            <div className="flex-1">
                {/* Image Upload Section */}
                <div>
                    <input
                        id="fileInput"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                    />
                </div>
            </div>
            {texts.map(text => (
                <TextInput
                    key={text.id}
                    text={text}
                    onTextChange={onTextChange}
                    onDelete={onDeleteText}
                    onStyleChange={onStyleChange}
                    onColorChange={onColorChange}
                    onOutlineColorChange={onOutlineColorChange}
                    fonts={fonts}
                    styles={styles}
                />
            ))}
            <button
                onClick={onAddText}
                className="px-4 py-2 mt-2 bg-slate-700 text-white rounded-lg hover:bg-slate-900">
                Add Another Text
            </button>
        </div>
    );
};

export default ToolsSection;
