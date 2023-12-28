import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
    const [isNavOpen, setIsNavOpen] = useState(false);

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

        // Cleanup function
        return () => document.body.classList.remove('overflow-hidden');
    }, [isNavOpen]); // isNavOpen is the only dependency now

    return (
        <div className="relative">
            <div
                className="HAMBURGER-ICON space-y-2 p-4"
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
                className={`fixed inset-y-0 left-0 transform w-full max-w-xs bg-white p-6 overflow-y-auto transition-transform duration-300 z-40 ${
                    isNavOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold">Memestr</h1>
                    <button
                        onClick={closeSidebar}
                        className="rounded-md text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-6 h-6">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M6 18 18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <nav className="mt-8">
                    <Link
                        to="/"
                        onClick={handleLinkClick}
                        className="flex items-center px-4 py-2 mt-5 text-gray-700 hover:bg-gray-100 rounded-md">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="16"
                            width="18"
                            viewBox="0 0 576 512">
                            <path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
                        </svg>
                        <span className="ml-3">Home</span>
                    </Link>
                    <Link
                        to="/pets"
                        onClick={handleLinkClick}
                        className="flex items-center px-4 py-2 mt-5 text-gray-700 hover:bg-gray-100 rounded-md">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="16"
                            width="16"
                            viewBox="0 0 512 512">
                            <path d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5s.3-86.2 32.6-96.8s70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3s29.1 51.7 10.2 84.1s-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5s46.9 53.9 32.6 96.8s-52.1 69.1-84.4 58.5z" />
                        </svg>
                        <span className="ml-3">Pets</span>
                    </Link>
                    <Link
                        to="/nature"
                        onClick={handleLinkClick}
                        className="flex items-center px-4 py-2 mt-5 text-gray-700 hover:bg-gray-100 rounded-md">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="16"
                            width="16"
                            viewBox="0 0 512 512">
                            <path d="M272 96c-78.6 0-145.1 51.5-167.7 122.5c33.6-17 71.5-26.5 111.7-26.5h88c8.8 0 16 7.2 16 16s-7.2 16-16 16H288 216s0 0 0 0c-16.6 0-32.7 1.9-48.3 5.4c-25.9 5.9-49.9 16.4-71.4 30.7c0 0 0 0 0 0C38.3 298.8 0 364.9 0 440v16c0 13.3 10.7 24 24 24s24-10.7 24-24V440c0-48.7 20.7-92.5 53.8-123.2C121.6 392.3 190.3 448 272 448l1 0c132.1-.7 239-130.9 239-291.4c0-42.6-7.5-83.1-21.1-119.6c-2.6-6.9-12.7-6.6-16.2-.1C455.9 72.1 418.7 96 376 96L272 96z" />
                        </svg>
                        <span className="ml-3">Nature</span>
                    </Link>
                    <Link
                        to="/food"
                        onClick={handleLinkClick}
                        className="flex items-center px-4 py-2 mt-5 text-gray-700 hover:bg-gray-100 rounded-md">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="16"
                            width="16"
                            viewBox="0 0 512 512">
                            <path d="M0 192c0-35.3 28.7-64 64-64c.5 0 1.1 0 1.6 0C73 91.5 105.3 64 144 64c15 0 29 4.1 40.9 11.2C198.2 49.6 225.1 32 256 32s57.8 17.6 71.1 43.2C339 68.1 353 64 368 64c38.7 0 71 27.5 78.4 64c.5 0 1.1 0 1.6 0c35.3 0 64 28.7 64 64c0 11.7-3.1 22.6-8.6 32H8.6C3.1 214.6 0 203.7 0 192zm0 91.4C0 268.3 12.3 256 27.4 256H484.6c15.1 0 27.4 12.3 27.4 27.4c0 70.5-44.4 130.7-106.7 154.1L403.5 452c-2 16-15.6 28-31.8 28H140.2c-16.1 0-29.8-12-31.8-28l-1.8-14.4C44.4 414.1 0 353.9 0 283.4z" />
                        </svg>
                        <span className="ml-3">Food</span>
                    </Link>
                    <Link
                        to="/photography"
                        onClick={handleLinkClick}
                        className="flex items-center px-4 py-2 mt-5 text-gray-700 hover:bg-gray-100 rounded-md">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="16"
                            width="16"
                            viewBox="0 0 512 512">
                            <path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" />
                        </svg>
                        <span className="ml-3">Photography</span>
                    </Link>
                </nav>
                <div className="absolute bottom-0 left-0 w-full px-6 pb-6">
                    <button
                        type="button"
                        className="w-full py-3 text-white bg-gradient-to-r from-blue-500 to-teal-500 hover:from-pink-500 hover:to-yellow-500 focus:outline-none focus:ring-4 font-medium rounded-full text-md px-5 py-2.5 me-2 mb-2 flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24"
                            width="24"
                            viewBox="0 0 512 512"
                            className="mr-2"
                            fill="currentColor">
                            <path d="M352 96l64 0c17.7 0 32 14.3 32 32l0 256c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c53 0 96-43 96-96l0-256c0-53-43-96-96-96l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm-9.4 182.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L242.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z" />
                        </svg>
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
}
