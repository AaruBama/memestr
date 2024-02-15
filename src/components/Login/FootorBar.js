import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ReactComponent as HomeSvg } from '../../Icons/HomeMobile.svg';
import { ReactComponent as SearchSvg } from '../../Icons/SearchIconBlack.svg';
import { ReactComponent as MessageSvg } from '../../Icons/Notification.svg';
import DropdownComponent from '../LoginDropDownComponent/DropDownComponent';
import { ReactComponent as PlusSvg } from '../../Icons/PlusArrow.svg';
import PostUpload from '../Post/newPost';

const FooterBar = () => {
    const [newPostModal, setNewPostModal] = useState(false);
    const location = useLocation();
    const isActive = path => location.pathname === path;

    const navigate = useNavigate();

    const activeStyle = 'font-bold underline  border-t-2 border-black';

    function showNewPostModal() {
        setNewPostModal(true);
    }

    function closePostModal() {
        setNewPostModal(false);
    }

    return (
        <div className="fixed inset-x-0 bottom-0 bg-white border-t border-gray-400 shadow-md flex flex-col justify-around items-center pb-2 md:hidden z-49">
            <div className="flex w-full justify-around items-center">
                <button
                    onClick={() => navigate('/')}
                    className={`flex flex-col items-center text-center py-3  px-6 ${
                        isActive('/') ? activeStyle : ''
                    }`}>
                    <HomeSvg
                        className={
                            isActive('/') ? 'text-black' : 'text-gray-200'
                        }
                    />
                </button>
                <button
                    onClick={() => navigate('/search')}
                    className={`flex flex-col items-center text-center py-3 px-6 ${
                        isActive('/search') ? activeStyle : ''
                    }`}>
                    <SearchSvg
                        className={
                            isActive('/search') ? 'text-black' : 'text-gray-200'
                        }
                    />
                </button>
                <button
                    className="flex flex-col items-center text-center p-1 px-6"
                    onClick={showNewPostModal}
                    title="Upload">
                    <PlusSvg className="w-10 h-10" />
                </button>

                {newPostModal && (
                    <PostUpload
                        isOpen={newPostModal}
                        onClose={closePostModal}
                    />
                )}
                <button className="flex flex-col items-center text-center p-1 px-6">
                    <MessageSvg />
                </button>
                <button className="flex flex-col items-center text-center p-1 px-6">
                    <DropdownComponent />
                </button>
            </div>
        </div>
    );
};

export default FooterBar;
