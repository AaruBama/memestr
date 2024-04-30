import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as SearchSVG } from '../../Icons/SearchIconBlack.svg';

function TrendingSidebar() {
    const [searchQuery, setSearchQuery] = useState('');
    const suggestions = [
        'meme',
        'nostr',
        'grownstr',
        'bitcoin',
        'plebchain',
        'siamstr',
        'btc',
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
    const navigate = useNavigate();
    const handleTagClick = suggestions => {
        navigate(`/search/${suggestions}`);
    };

    const handleSearchChange = event => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = event => {
        event.preventDefault();
        if (searchQuery.trim().length > 0) {
            navigate(`/search/${searchQuery.trim()}`);
            setSearchQuery('');
        }
    };

    return (
        <aside className="hidden lg:block w-96 bg-white p-2 sticky top-0 h-screen overflow-y-auto border-l border-gray-200 z-50 ">
            <form
                onSubmit={handleSearchSubmit}
                className="hidden md:flex items-center w-80 px-2 ">
                <div className="relative w-full">
                    <input
                        type="search"
                        className="pl-4 pr-8 py-2 w-full border border-gray-200  bg-slate-50 rounded-full focus:outline-none focus:border-grey-400 transition-shadow"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent text-gray-600 hover:text-gray-500 focus:text-gray-500 outline-none">
                        <SearchSVG className="h-6 w-6" />
                    </button>
                </div>
            </form>

            <div className="flex justify-center">
                <h2 className="text-2xl font-bold text-center pt-2 text-gray-900 mb-2">
                    Trending Tags
                </h2>
            </div>

            <div className="flex flex-wrap gap-2 p-2 mt-2 overflow-x-auto justify-center">
                {suggestions.map((suggestion, index) => (
                    <button
                        key={index}
                        onClick={() => handleTagClick(suggestion)}
                        className="bg-gray-200 text-black rounded-full px-4 py-1 text-sm focus:outline-none "
                        style={{ flex: '0 0 auto' }}>
                        {suggestion}
                    </button>
                ))}
            </div>
        </aside>
    );
}
export default TrendingSidebar;
