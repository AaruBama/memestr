import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as HomeSvg } from '../../Icons/HomeSvg.svg';
import { ReactComponent as ProfileSvg } from '../../Icons/ProfileCircle.svg';
import { ReactComponent as SearchSvg } from '../../Icons/SearchIconBlack.svg';
import { ReactComponent as MessageSvg } from '../../Icons/CommentSvg.svg';
import { ReactComponent as CrossSvg } from '../../Icons/CloseIcon.svg';
import { ReactComponent as SearchIcon } from '../../Icons/SearchIcon.svg';

const FooterBar = () => {
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const navigate = useNavigate();

    const toggleSearch = () => {
        setIsSearchVisible(!isSearchVisible);
    };

    const handleSearchSubmit = event => {
        event.preventDefault();
        let searchQuery = event.target.searchQuery.value.trim();
        if (searchQuery) {
            navigate(`/search/${searchQuery}`);
            setIsSearchVisible(false);
        }
    };

    const navigateHome = () => {
        navigate('/');
    };
    return (
        <div className="fixed inset-x-0 bottom-0 bg-white shadow-md flex flex-col justify-around items-center py-2 md:hidden">
            {isSearchVisible ? (
                <form
                    onSubmit={handleSearchSubmit}
                    className="w-full px-4 flex items-center">
                    <input
                        type="search"
                        name="searchQuery"
                        placeholder="Search..."
                        className="flex-grow p-2 border rounded-l-md"
                    />
                    <button
                        type="submit"
                        className="bg-black px-4 py-2 border-black rounded-r-md flex items-center justify-center">
                        <SearchIcon className="h-6 w-6 text-grey-500" />
                    </button>
                    <button onClick={toggleSearch} className="ml-2">
                        <CrossSvg className="h-6 w-6" /> {/* Cross Icon */}
                    </button>
                </form>
            ) : (
                <div className="flex w-full justify-around">
                    <button
                        onClick={navigateHome}
                        className="flex flex-col items-center text-center px-1">
                        <HomeSvg className="h-6 w-6" />
                    </button>
                    <button
                        onClick={toggleSearch}
                        className="flex flex-col items-center text-center px-1">
                        <SearchSvg className="h-6 w-6" />
                    </button>
                    <button className="flex flex-col items-center text-center px-1">
                        <MessageSvg className="h-5 w-6" />
                    </button>
                    <button className="flex flex-col items-center text-center px-1">
                        <ProfileSvg className="h-6 w-6" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default FooterBar;
