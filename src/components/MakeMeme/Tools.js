import React from 'react';
import { SketchPicker } from 'react-color'; // Import SketchPicker from react-color

const ToolsSection = ({
    currentText,
    handleTextChange,
    addText,
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
}) => {
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
                        <h3 className="text-md font-nunito mb-2">Font Style</h3>
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
    );
};

export default ToolsSection;
