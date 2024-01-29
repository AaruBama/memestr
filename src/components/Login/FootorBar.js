import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ReactComponent as HomeSvg } from '../../Icons/HomeMobile.svg';
import { ReactComponent as SearchSvg } from '../../Icons/SearchIconBlack.svg';
import { ReactComponent as MessageSvg } from '../../Icons/Notification.svg';
import DropdownComponent from '../LoginDropDownComponent/DropDownComponent';
import { ReactComponent as UploadSvg } from '../../Icons/UploadSvg.svg';
import PostUpload from '../Post/newPost';

const FooterBar = () => {
    const [newPostModal, setNewPostModal] = useState(false);
    const location = useLocation();
    const isHome = location.pathname === '/';
    const isSearch = location.pathname.startsWith('/search');
    function showNewPostModal() {
        setNewPostModal(true);
    }

    function closePostModal() {
        setNewPostModal(false);
    }

    const navigate = useNavigate();
    const navigateHome = () => {
        navigate('/');
    };

    const handleSearchClick = () => {
        navigate('/search');
    };

    return (
        <div className="fixed inset-x-0 bottom-0 bg-white border-t border-gray-400 shadow-md flex flex-col justify-around items-center py-2 md:hidden z-49">
            <div className="flex w-full justify-around items-center">
                <button
                    onClick={navigateHome}
                    className="flex flex-col items-center text-center p-1">
                    <HomeSvg
                        className={
                            isHome ? 'fill-current text-black' : 'text-gray-300'
                        }
                    />
                </button>
                <button
                    onClick={handleSearchClick}
                    className="flex flex-col items-center text-center p-1">
                    <SearchSvg
                        className={
                            isSearch
                                ? 'fill-current text-black'
                                : 'text-gray-200'
                        }
                    />
                </button>
                <button
                    onClick={showNewPostModal}
                    title="Upload"
                    className="relative p-2 rounded-full bg-cyan-300 shadow-lg hover:shadow-xl transition duration-300">
                    <UploadSvg className="w-6 h-6 text-white" />
                </button>
                {newPostModal && (
                    <PostUpload
                        isOpen={newPostModal}
                        onClose={closePostModal}
                    />
                )}
                <button className="flex flex-col items-center text-center p-1">
                    <MessageSvg />
                </button>
                <button className="flex flex-col items-center text-center p-1">
                    <DropdownComponent />
                </button>
            </div>
        </div>
    );
};

export default FooterBar;
