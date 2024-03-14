import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './profile.css';
import { generatePrivateKey, getPublicKey, nip19 } from 'nostr-tools';
import Menu from '../Menu';
import DropdownComponent from '../LoginDropDownComponent/DropDownComponent';
import { ReactComponent as Memestr } from '../../Icons/MemestrLogo.svg';
import { ReactComponent as SearchSVG } from '../../Icons/SearchIconBlack.svg';

export function generateNewKeys() {
    const pk = generatePrivateKey();

    const pubKey = getPublicKey(pk);
    const epk = nip19.nsecEncode(pk);
    const ePubKey = nip19.npubEncode(pubKey);
    return { epk: epk, epubKey: ePubKey };
}

function HeaderBar({ isSearchVisible }) {
    const [isScrolled, setIsScrolled] = useState(true);

    const [prevScrollY, setPrevScrollY] = useState(0);
    const scrollThreshold = 100;

    const navigate = useNavigate();
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

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const isScrollingUp = scrollY < prevScrollY;

            if (scrollY > scrollThreshold) {
                setIsScrolled(isScrollingUp);
            } else {
                setIsScrolled(true);
            }

            setPrevScrollY(scrollY);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [prevScrollY]);

    const headerClasses = `fixed w-full top-0 h-14 bg-white  z-50 text-gray-700 border-b border-gray-200 ${
        !isScrolled || isSearchVisible
            ? 'transition-transform transform -translate-y-full ease-in-out duration-300'
            : ''
    }`;

    return (
        <div className={headerClasses}>
            <header
                className={
                    'flex flex-row items-center justify-between h-14 px-3'
                }>
                <div className="flex basis-1/3 justify-start ">
                    <Menu />
                </div>

                <div className="flex basis-1/3 justify-center">
                    <Memestr />
                </div>

                <div className="flex basis-1/3 justify-end items-center">
                    <form
                        onSubmit={handleSearchSubmit}
                        className="hidden md:flex items-center w-42 px-2 ">
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
                    <button className="hidden md:block">
                        <DropdownComponent />
                    </button>
                </div>
            </header>
        </div>
    );
}
export default HeaderBar;
