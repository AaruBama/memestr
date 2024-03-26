import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as SearchSVG } from '../../Icons/SearchIconBlack.svg';

function TrendingSidebar() {
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

    const [searchQuery, setSearchQuery] = useState('');
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
    const [showAll, setShowAll] = useState(false);
    const navigate = useNavigate();
    const handleTagClick = tag => {
        navigate(`/search/${tag}`);
    };
    const displayedSuggestions = showAll
        ? suggestions
        : suggestions.slice(0, 5);

    return (
        <aside className="hidden lg:block w-1/4 bg-white p-4 sticky top-0 h-screen overflow-y-auto border-l border-gray-200 z-50 ">
            <form
                onSubmit={handleSearchSubmit}
                className="md:flex items-center w-full px-2 ">
                <div className="relative w-full">
                    <input
                        type="search"
                        className="pl-4 pr-8 py-2 w-full border border-gray-200 bg-slate-50 rounded-full focus:outline-none focus:border-grey-400 transition-shadow"
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
            <div className="my-4 p-4 bg-customGray rounded-md shadow">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Trending Memes
                </h2>
                <nav>
                    {displayedSuggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            onClick={() => handleTagClick(suggestion)}
                            className={`flex items-center justify-between py-2 px-3 my-2 transition duration-150 ease-in-out ${
                                index !== 0 ? 'border-t border-gray-50' : ''
                            } rounded-lg cursor-pointer hover:shadow-lg`}>
                            <span className="font-semibold text-black">
                                #{suggestion}
                            </span>
                        </div>
                    ))}
                </nav>
                <p
                    onClick={() => setShowAll(!showAll)}
                    className="mt-4 text-blue-600 hover:text-blue-700 cursor-pointer text-sm transition duration-150 ease-in-out">
                    {showAll ? 'Show less' : 'Show more'}
                </p>
            </div>
        </aside>
    );
}
export default TrendingSidebar;
