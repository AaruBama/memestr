import React, { useState } from 'react';

const Tabs = ({ children }) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="w-full">
            <div className="flex mb-4">
                {children.map((tab, index) => (
                    <button
                        key={index}
                        className={`${
                            activeTab === index
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-800'
                        } py-2 px-4 mr-2 rounded`}
                        onClick={() => setActiveTab(index)}>
                        {tab.props.title}
                    </button>
                ))}
            </div>
            <div>{children[activeTab]}</div>
        </div>
    );
};

export default Tabs;
