import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { ReactComponent as HomeSvg } from '../../Icons/HomeSvg.svg';
import { ReactComponent as NatureSvg } from '../../Icons/NatureSvg.svg';
import { ReactComponent as FoodSvg } from '../../Icons/FoodSvg.svg';
import { ReactComponent as PhotographySvg } from '../../Icons/PhotographySvg.svg';
import { ReactComponent as PetsSvg } from '../../Icons/PetSvg.svg';
import { ReactComponent as SearchIcon } from '../../Icons/SearchIcon.svg';

function Sidebar() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const handleSearchChange = event => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = event => {
        event.preventDefault();
        navigate(`/search/${searchQuery.trim()}`);
    };

    const getNavLinkClass = ({ isActive }) => {
        return isActive
            ? 'flex items-center px-4 py-2 mt-5 text-gray-700 hover:bg-gray-100 rounded-md font-extrabold'
            : 'flex items-center px-4 py-2 mt-5 text-gray-700 hover:bg-gray-100 rounded-md';
    };

    return (
        <aside className="hidden md:block md:w-64 bg-white p-5 sticky top-0 h-screen overflow-y-auto border-r z-50">
            <h1 className="font-bungee px-4 py-2 text-xl">Category</h1>

            <form onSubmit={handleSearchSubmit}>
                <div className="flex items-center mt-4 mb-6">
                    <input
                        type="search"
                        placeholder="Search..."
                        className="w-full px-4 py-2 border rounded-l-md"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <button
                        type="submit"
                        className="bg-black px-4 py-2 border-black rounded-r-md flex items-center justify-center">
                        <SearchIcon className="h-6 w-6 text-grey-500" />
                    </button>
                </div>
            </form>

            <nav className="mt-8">
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
            </nav>
            <div className="absolute bottom-0 left-0 w-full px-6 pb-6">
                <button
                    type="button"
                    className="w-full py-3 text-white bg-gradient-to-r from-blue-500 to-teal-500 hover:from-pink-500 hover:to-yellow-500 focus:outline-none focus:ring-4 font-medium rounded-full text-md px-5 py-2.5 me-2 mb-2 flex items-center justify-center">
                    Get Started
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
