import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as SearchIcon } from '../../Icons/SearchIconBlack.svg';
import { ReactComponent as BackArrow } from '../../Icons/BackArrow.svg';

const MobileSearchBar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const suggestions = [
        'bitcoin',
        'nostr',
        'grownstr',
        'plebchain',
        'siamstr',
        'btc',
        'meme',
        'privacy',
        'security',
        'memes',
        'tunestr',
        'music',
        'coffeechain',
        'press',
        'presse',
        'memestr',
        'photography',
        'funny',
        'france',
        'artstr',
        'foodstr',
        'news',
        'btcprague',
        'sats',
        'zaps',
        'china',
        'permaculture',
        'inflation',
        'primal',
        'plebs',
        'permies',
        'photestr',
        'homesteading',
        'bible',
        'biblestr',
        'christian',
        'crypto',
        'yestr',
        'new',
        'thainostrich',
        'nostrich',
        'wisdom',
        'hodl',
        'us',
        'dance',
    ];

    const handleSearchChange = event => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = event => {
        event.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search/${searchQuery.trim()}`);
        }
    };

    const handleClose = () => {
        navigate(-1);
    };

    const handleSuggestionClick = suggestion => {
        navigate(`/search/${suggestion}`);
    };

    const maxSuggestionsHeight = '700px';

    return (
        <div
            className={`fixed inset-0 bottom-12 px-6 pr-6 pt-5 bg-white md:hidden `}
            style={{ paddingBottom: '48rem' }}>
            <form
                onSubmit={handleSearchSubmit}
                className="flex items-center justify-center">
                <button type="button" onClick={handleClose} className="mr-6">
                    <BackArrow className="h-6 w-6 text-white" />
                </button>
                <input
                    type="search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search..."
                    className="flex-grow p-2 px-4 bg-gray-200 rounded-full shadow-md text-black"
                />
                <button type="submit" className="ml-2">
                    <SearchIcon className="h-6 w-6 text-white" />
                </button>
            </form>

            <div
                className="flex flex-wrap gap-2 p-2 mt-4 overflow-x-auto justify-center"
                style={{ maxHeight: maxSuggestionsHeight, overflowY: 'auto' }}>
                {suggestions.map((suggestion, index) => (
                    <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="bg-gray-200 text-black rounded-full px-4 py-1 text-lg focus:outline-none "
                        style={{ flex: '0 0 auto' }}>
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MobileSearchBar;
