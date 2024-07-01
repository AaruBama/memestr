import React, { useEffect, useRef, useState } from 'react';
import { SketchPicker } from 'react-color';
import { ReactComponent as GearIcon } from '../../Icons/Bitcoin.svg';
// Import SketchPicker from react-color

const ToolsSection = ({
    currentText,
    handleTextChange,
    editedText,
    handleEditedTextChange,
    handleEditText,
    deleteSelectedText,
    currentFont,
    handleFontChange,
    fonts,
    currentStyle,
    updateTextStyle,
    styles,
    currentColor,
    handleColorChange,
    fileInputRef,
    handleImageUpload,
    currentOutlineColor,
    handleOutlineColorChange,
    currentOutlineWidth,
    setCurrentOutlineWidth,
}) => {
    const [showOutlineColorPicker, setShowOutlineColorPicker] = useState(false);
    const [showPanel, setShowPanel] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const panelRef = useRef(null);
    const buttonRef = useRef(null);
    const colorPickerRef = useRef(null);

    const togglePanel = () => {
        setShowPanel(!showPanel);
    };

    const toggleColorPicker = () => {
        setShowColorPicker(!showColorPicker);
    };

    useEffect(() => {
        const handleClickOutside = event => {
            if (
                panelRef.current &&
                !panelRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setShowPanel(false);
            }
            if (
                colorPickerRef.current &&
                !colorPickerRef.current.contains(event.target)
            ) {
                setShowColorPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex-1 p-4">
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
                {/*<button*/}
                {/*    onClick={addText}*/}
                {/*    className="px-4 py-2 mt-2 bg-slate-700 text-white rounded-lg hover:bg-slate-900">*/}
                {/*    Add Text*/}
                {/*</button>*/}
            </div>

            <div className="mt-4 relative">
                <h2 className="text-xl font-nunito font-semibold mb-2">
                    Selected Text
                </h2>
                <div className="flex items-center border border-gray-300">
                    <input
                        type="text"
                        value={editedText}
                        onChange={handleEditedTextChange}
                        placeholder="Edit selected text"
                        className="px-2 py-2 w-full "
                    />
                    <button
                        className="w-10 h-10"
                        style={{ backgroundColor: currentColor }}
                        onClick={toggleColorPicker}></button>
                    <button
                        className="ml-2 w-8 h-8 rounded border-2 border-gray-300"
                        style={{ backgroundColor: currentOutlineColor }}
                        onClick={() =>
                            setShowOutlineColorPicker(!showOutlineColorPicker)
                        }></button>
                    <button
                        ref={buttonRef}
                        className="ml-2 p-2 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        onClick={togglePanel}>
                        <GearIcon className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
                {showOutlineColorPicker && (
                    <div className="absolute right-0 mt-2 z-10">
                        <SketchPicker
                            color={currentOutlineColor}
                            onChangeComplete={handleOutlineColorChange}
                        />
                    </div>
                )}
                {showPanel && (
                    <div
                        ref={panelRef}
                        className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <div className="p-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Font Family:
                                </label>
                                <select
                                    value={currentFont}
                                    onChange={handleFontChange}
                                    className="w-full px-2 py-1 border border-gray-300 rounded-md">
                                    {fonts.map((font, index) => (
                                        <option key={index} value={font}>
                                            {font}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Font Style:
                                </label>
                                <select
                                    value={currentStyle}
                                    onChange={updateTextStyle}
                                    className="w-full px-2 py-1 border border-gray-300 rounded-md">
                                    {styles.map((style, index) => (
                                        <option key={index} value={style}>
                                            {style}
                                        </option>
                                    ))}
                                </select>
                                <div className="mb-4 mt-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Outline Width:
                                    </label>
                                    <input
                                        type="number"
                                        value={currentOutlineWidth}
                                        onChange={e =>
                                            setCurrentOutlineWidth(
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
                    </div>
                )}
                {showColorPicker && (
                    <div
                        ref={colorPickerRef}
                        className="absolute right-0 mt-2 z-10">
                        <SketchPicker
                            color={currentColor}
                            onChangeComplete={handleColorChange}
                        />
                    </div>
                )}
            </div>

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
    );
};

export default ToolsSection;
