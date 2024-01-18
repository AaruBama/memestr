import React, { useEffect, useState } from 'react';
import './profile.css';
import { getPublicKey, nip19, generatePrivateKey } from 'nostr-tools';
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

function HeaderBar() {
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

    const headerClasses = `fixed w-full top-0 h-14 bg-white text-gray-700 z-40  border-b border-gray-200 ${
        !isScrolled
            ? 'transition-transform transform -translate-y-full ease-in-out duration-300'
            : ''
    }`;

    return (
        <div className={headerClasses}>
            <header className={'flex flex-row items-center h-14'}>
                <div className="pl-3 basis-[50%]">
                    <Menu />
                </div>
                <Memestr />

                <div className={'basis-[50%] flex justify-end pr-4'}>
                    <button>
                        <DropdownComponent />
                    </button>
                </div>
            </header>
        </div>
    );
}

export default HeaderBar;
