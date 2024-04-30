import React, { useEffect, useState } from 'react';
import './profile.css';
import { generatePrivateKey, getPublicKey, nip19 } from 'nostr-tools';
import Menu from '../Menu';
import DropdownComponent from '../LoginDropDownComponent/DropDownComponent';
import { ReactComponent as Memestr } from '../../Icons/MemestrLogo.svg';

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

                <div className="flex basis-1/3 justify-between items-center pl-20">
                    <Memestr />
                    <button className="hidden md:block pr-1">
                        <DropdownComponent />
                    </button>
                </div>

                <div className="flex basis-1/3 justify-end items-center"></div>
            </header>
        </div>
    );
}
export default HeaderBar;
