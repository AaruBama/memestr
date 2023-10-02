import { useState } from "react";
import { Link } from "react-router-dom";
import "./index.css";
// import { Transition } from "@headlessui/react";

export default function Header() {
    const [isNavOpen, setIsNavOpen] = useState(false);

    const closeSidebar = () => {
        setIsNavOpen(false);
    };
    const handleLinkClick = () => {
        closeSidebar();
    };

    return (
        <div className="flex items-center justify-between border-gray-400">
            <nav>
                <section className='MOBILE-MENU flex style={{ transform: isNavOpen ? "translateX(0)" : "translateX(-100%)" }}'>
                    <div
                        className="HAMBURGER-ICON space-y-2"
                        onClick={() => setIsNavOpen(prev => !prev)}>
                        <span className="block h-0.5 w-8 animate-pulse bg-gray-700"></span>
                        <span className="block h-0.5 w-8 animate-pulse bg-gray-700"></span>
                        <span className="block h-0.5 w-8 animate-pulse bg-gray-700"></span>
                    </div>
                    {/*<Transition*/}
                    {/*    show={isNavOpen}*/}
                    {/*    enter='transition ease-in duration-300 transform'*/}
                    {/*    enterFrom='translate-x-[-100%] opacity-0'*/}
                    {/*    enterTo='translate-x-0 opacity-100'*/}
                    {/*    leave='transition ease-out duration-300 transform'*/}
                    {/*    leaveFrom='translate-x-0 opacity-100'*/}
                    {/*    leaveTo='translate-x-[-100%] opacity-0'>*/}

                    <div
                        className={
                            isNavOpen
                                ? "absolute flex flex-col justify-start top-0 left-0 h-screen align-baseline z-100 text-white bg-black w-400"
                                : "hideMenuNav"
                        }>
                        <div
                            // Cancel X button on nav bar
                            className="absolute top-0 left-0 p-4"
                            onClick={() => setIsNavOpen(false)}>
                            <svg
                                className="h-8 w-8 text-white font-bold"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </div>
                        <section
                            id="main-section"
                            className="flex flex-col items-start justify-between min-h-[20px] w-full pt-12 px-4 border-b-4">
                            <a class={"mb-2"} href="/">
                                Home
                            </a>
                        </section>
                        <span class={"px-4 pt-2 font-bold"}>Categories</span>
                        <section
                            id="categories"
                            className="flex flex-col items-start justify-between w-full px-4 border-b-4">
                            <ul className="flex flex-col items-start justify-between px-4">
                                {/*<li className="border-b border-gray-400 my-2 uppercase">*/}
                                {/*    <a href="/">Memes</a>*/}
                                {/*</li>*/}

                                <li className="border-b border-gray-400 my-2 uppercase">
                                    <Link
                                        to="/nsfw"
                                        onClick={() => handleLinkClick()}>
                                        <span>NSFW 🌶️</span>
                                    </Link>
                                </li>
                                <li className="border-b border-gray-400 my-2 uppercase">
                                    <Link
                                        to="/nature"
                                        onClick={() => handleLinkClick()}>
                                        <span>Nature 🔭</span>
                                    </Link>
                                </li>
                                <li className="border-b border-gray-400 my-2 uppercase">
                                    <Link
                                        to="/food"
                                        onClick={() => handleLinkClick()}>
                                        <span>Food 🍔</span>
                                    </Link>
                                </li>
                                <li className="border-b border-gray-400 my-2 uppercase">
                                    <Link
                                        to="/photography"
                                        onClick={() => handleLinkClick()}>
                                        <span>Photography 📷</span>
                                    </Link>
                                </li>
                            </ul>
                        </section>
                    </div>
                    {/*</Transition>*/}
                </section>

                {/*<ul className="DESKTOP-MENU hidden space-x-8 lg:flex">*/}
                {/*    <li>*/}
                {/*        <a href="/about">About</a>*/}
                {/*    </li>*/}
                {/*    <li>*/}
                {/*        <a href="/portfolio">Portfolio</a>*/}
                {/*    </li>*/}
                {/*    <li>*/}
                {/*        <a href="/contact">Contact</a>*/}
                {/*    </li>*/}
                {/*</ul>*/}
            </nav>
            {/*        <style>{`*/}
            {/*`}</style>*/}
        </div>
    );
}
