import { TemplateContext } from '../HashtagTool/MemeEditor';
import React, { useContext } from 'react';

const Templates = () => {
    const context = useContext(TemplateContext);

    const { templates, handleTemplateImageSelect } = context || {};

    if (!templates || templates.length === 0) {
        return <div>No images available.</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-xl font-nunito font-semibold mb-4">
                Image Gallery
            </h2>
            <div className="flex flex-wrap gap-4">
                {templates.map((template, index) => (
                    <div key={index} className="relative">
                        <img
                            src={template}
                            alt={`${index}`}
                            className="rounded-lg w-36 h-36 object-cover cursor-pointer"
                            onClick={() => handleTemplateImageSelect(template)}
                            crossOrigin="anonymous"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Templates;
