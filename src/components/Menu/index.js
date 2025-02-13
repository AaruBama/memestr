import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as HomeSvg } from '../../Icons/HomeSvg.svg';
import { ReactComponent as NatureSvg } from '../../Icons/NatureSvg.svg';
import { ReactComponent as FoodSvg } from '../../Icons/FoodSvg.svg';
import { ReactComponent as PhotographySvg } from '../../Icons/PhotographySvg.svg';
import { ReactComponent as PetsSvg } from '../../Icons/PetSvg.svg';
import { ReactComponent as HamBurger } from '../../Icons/HamburgerIcon.svg';
import { ReactComponent as LoveSvg } from '../../Icons/heart.svg';
import { ReactComponent as BitcoinSvg } from '../../Icons/Bitcoin.svg';
import { ReactComponent as VehiclesSvg } from '../../Icons/Vehicles.svg';
import { ReactComponent as GamingSvg } from '../../Icons/Gaming.svg';
import { ReactComponent as ArtSvg } from '../../Icons/Art.svg';
import { ReactComponent as SportsSvg } from '../../Icons/Sports.svg';
import { ReactComponent as NewsSvg } from '../../Icons/News.svg';

export default function Header() {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const navigate = useNavigate();

    const closeSidebar = () => {
        setIsNavOpen(false);
    };

    const handleLinkClick = () => {
        closeSidebar();
    };

    useEffect(() => {
        if (isNavOpen) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
        return () => document.body.classList.remove('overflow-hidden');
    }, [isNavOpen]);

    return (
        <div className="relative z-50">
            <div
                className="md:hidden HAMBURGER-ICON space-y-2"
                onClick={() => setIsNavOpen(prev => !prev)}>
                <span className="block h-0.5 w-8 animate-pulse bg-gray-700"></span>
                <span className="block h-0.5 w-8 animate-pulse bg-gray-700"></span>
                <span className="block h-0.5 w-8 animate-pulse bg-gray-700"></span>
            </div>

            <div
                className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity ${
                    isNavOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
                onClick={closeSidebar}></div>

            <div
                className={`fixed inset-y-0 left-0 transform w-full max-w-xs bg-white p-6 overflow-y-auto transition-transform duration-300 ${
                    isNavOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="flex justify-between items-center sticky top-0 bg-white z-10">
                    <h1 className="font-mono bg-white px-4 py-2 text-xl">
                        Category
                    </h1>
                    <button
                        onClick={closeSidebar}
                        className="rounded-md text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500">
                        <HamBurger />
                    </button>
                </div>
                <nav className="mt-2 mb-2 overflow-y-auto h-[calc(100vh-12rem)]">
                    <Link
                        to="/"
                        onClick={handleLinkClick}
                        className="flex items-center px-4 py-2 mt-5 text-gray-700 hover:bg-gray-100 rounded-md">
                        <HomeSvg />
                        <span className="ml-3">Home</span>
                    </Link>
                    <Link
                        to="/pets"
                        onClick={handleLinkClick}
                        className="flex items-center px-4 py-2 mt-5 text-gray-700 hover:bg-gray-100 rounded-md">
                        <PetsSvg />
                        <span className="ml-3">Pets</span>
                    </Link>
                    <Link
                        to="/nature"
                        onClick={handleLinkClick}
                        className="flex items-center px-4 py-2 mt-5 text-gray-700 hover:bg-gray-100 rounded-md">
                        <NatureSvg />
                        <span className="ml-3">Nature</span>
                    </Link>
                    <Link
                        to="/food"
                        onClick={handleLinkClick}
                        className="flex items-center px-4 py-2 mt-5 text-gray-700 hover:bg-gray-100 rounded-md">
                        <FoodSvg />
                        <span className="ml-3">Food</span>
                    </Link>
                    <Link
                        to="/photography"
                        onClick={handleLinkClick}
                        className="flex items-center px-4 py-2 mt-5 text-gray-700 hover:bg-gray-100 rounded-md">
                        <PhotographySvg />
                        <span className="ml-3">Photography</span>
                    </Link>
                    <Link
                        to="/vehicles"
                        onClick={handleLinkClick}
                        className="flex items-center px-4 py-2 mt-5 text-gray-700 hover:bg-gray-100 rounded-md">
                        <VehiclesSvg />
                        <span className="ml-3">Vehicles</span>
                    </Link>
                    <Link
                        to="/crypto"
                        onClick={handleLinkClick}
                        className="flex items-center px-4 py-2 mt-5 text-gray-700 hover:bg-gray-100 rounded-md">
                        <BitcoinSvg />
                        <span className="ml-3">Crypto</span>
                    </Link>
                    <Link
                        to="/relationship"
                        onClick={handleLinkClick}
                        className="flex items-center px-4 py-2 mt-5 text-gray-700 hover:bg-gray-100 rounded-md">
                        <LoveSvg />
                        <span className="ml-3">Love & Relationships</span>
                    </Link>
                    <Link
                        to="/gaming"
                        onClick={handleLinkClick}
                        className="flex items-center px-4 py-2 mt-5 text-gray-700 hover:bg-gray-100 rounded-md">
                        <GamingSvg />
                        <span className="ml-3">Gaming</span>
                    </Link>
                    <Link
                        to="/art"
                        onClick={handleLinkClick}
                        className="flex items-center px-4 py-2 mt-5 text-gray-700 hover:bg-gray-100 rounded-md">
                        <ArtSvg />
                        <span className="ml-3">Art</span>
                    </Link>
                    <Link
                        to="/news"
                        onClick={handleLinkClick}
                        className="flex items-center px-4 py-2 mt-5 text-gray-700 hover:bg-gray-100 rounded-md">
                        <NewsSvg />
                        <span className="ml-3">News</span>
                    </Link>
                    <Link
                        to="/sports"
                        onClick={handleLinkClick}
                        className="flex items-center px-4 py-2 mt-5 text-gray-700 hover:bg-gray-100 rounded-md">
                        <SportsSvg />
                        <span className="ml-3">Sports</span>
                    </Link>
                </nav>
                <div className="sticky bottom-0 left-0 w-full px-6 bg-white">
                    <button
                        type="button"
                        className="w-full py-3 text-white bg-gradient-to-r from-blue-500 to-teal-500 hover:from-pink-500 hover:to-yellow-500 focus:outline-none focus:ring-4 font-medium rounded-full text-md px-5 me-2 mb-8 flex items-center justify-center"
                        onClick={() => {
                            closeSidebar();
                            navigate('/meme-editor');
                        }}>
                        Make a Meme
                    </button>
                </div>
            </div>
        </div>
    );
}
