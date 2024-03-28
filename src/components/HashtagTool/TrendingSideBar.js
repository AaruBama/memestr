import React from 'react';
import { useNavigate } from 'react-router-dom';

function TrendingSidebar() {
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

    return (
        <aside className="hidden lg:block w-1/4 bg-white p-2 sticky top-0 h-screen overflow-y-auto border-l border-gray-200 z-40 ">
            <h2 className="text-2xl font-bold text-center pt-14 text-gray-900 mb-4 ">
                Trending Memes
            </h2>

            <div className="flex flex-wrap gap-2 p-2 mt-2 overflow-x-auto justify-center">
                {suggestions.map((suggestion, index) => (
                    <button
                        key={index}
                        onClick={() => handleTagClick(suggestion)}
                        className="bg-gray-200 text-black rounded-full px-4 py-1 text-lg focus:outline-none "
                        style={{ flex: '0 0 auto' }}>
                        {suggestion}
                    </button>
                ))}
            </div>
        </aside>
    );
}
export default TrendingSidebar;
