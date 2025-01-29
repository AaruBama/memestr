import React from 'react';
import { NavLink } from 'react-router-dom';
import { ReactComponent as HomeSvg } from '../../Icons/HomeSvg.svg';
import { ReactComponent as NatureSvg } from '../../Icons/NatureSvg.svg';
import { ReactComponent as FoodSvg } from '../../Icons/FoodSvg.svg';
import { ReactComponent as PhotographySvg } from '../../Icons/PhotographySvg.svg';
import { ReactComponent as VehiclesSvg } from '../../Icons/Vehicles.svg';
import { ReactComponent as PetsSvg } from '../../Icons/PetSvg.svg';
import { ReactComponent as LoveSvg } from '../../Icons/heart.svg';
import { ReactComponent as BitcoinSvg } from '../../Icons/Bitcoin.svg';
import { ReactComponent as GamingSvg } from '../../Icons/Gaming.svg';
import { ReactComponent as ArtSvg } from '../../Icons/Art.svg';
import { ReactComponent as SportsSvg } from '../../Icons/Sports.svg';
import { ReactComponent as NewsSvg } from '../../Icons/News.svg';
import './MemeEditorStyle.css';

function Sidebar({ setShowMemeEditor }) {
    const getNavLinkClass = ({ isActive }) => {
        return isActive
            ? 'flex items-center px-4 py-2 mt-5 text-gray-700 hover:bg-gray-100 rounded-md font-extrabold'
            : 'flex items-center px-4 py-2 mt-5 text-gray-700 hover:bg-gray-100 rounded-md';
    };

    return (
        <aside className="hidden md:block md:w-72 bg-white p-5 sticky top-0 h-screen overflow-y-auto border-r z-50">
            <h1 className="font-bungee px-4 py-2 text-xl sticky top-0 bg-white z-10">
                Category
            </h1>
            <nav className="overflow-y-auto h-[calc(100vh-10rem)]">
                <NavLink to="/" className={getNavLinkClass}>
                    <HomeSvg />
                    <span className="ml-3">Home</span>
                </NavLink>
                <NavLink to="/pets" className={getNavLinkClass}>
                    <PetsSvg />
                    <span className="ml-3">Pets</span>
                </NavLink>
                <NavLink to="/nature" className={getNavLinkClass}>
                    <NatureSvg />
                    <span className="ml-3">Nature</span>
                </NavLink>
                <NavLink to="/food" className={getNavLinkClass}>
                    <FoodSvg />
                    <span className="ml-3">Food</span>
                </NavLink>
                <NavLink to="/photography" className={getNavLinkClass}>
                    <PhotographySvg />
                    <span className="ml-3">Photography</span>
                </NavLink>
                <NavLink to="/vehicles" className={getNavLinkClass}>
                    <VehiclesSvg />
                    <span className="ml-3">Vehicles</span>
                </NavLink>
                <NavLink to="/crypto" className={getNavLinkClass}>
                    <BitcoinSvg />
                    <span className="ml-3">Crypto</span>
                </NavLink>
                <NavLink to="/relationship" className={getNavLinkClass}>
                    <LoveSvg />
                    <span className="ml-3">Love & Relationship</span>
                </NavLink>
                <NavLink to="/gaming" className={getNavLinkClass}>
                    <GamingSvg />
                    <span className="ml-3">Gaming</span>
                </NavLink>
                <NavLink to="/art" className={getNavLinkClass}>
                    <ArtSvg />
                    <span className="ml-3">Art</span>
                </NavLink>
                <NavLink to="/news" className={getNavLinkClass}>
                    <NewsSvg />
                    <span className="ml-3">News</span>
                </NavLink>
                <NavLink to="/sports" className={getNavLinkClass}>
                    <SportsSvg />
                    <span className="ml-3">Sports</span>
                </NavLink>
            </nav>
            <div className="sticky bottom-0 left-0 w-full px-6 pb-4 bg-white">
                <button
                    type="button"
                    className="w-full text-white bg-gradient-to-r from-blue-500 to-teal-500 hover:from-pink-500 hover:to-yellow-500 focus:outline-none focus:ring-4 font-medium rounded-full text-md px-5 py-3 me-2 mb-2 flex items-center justify-center"
                    onClick={() => setShowMemeEditor(true)}>
                    Make a Meme
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
