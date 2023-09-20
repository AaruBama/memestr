import {useState} from "react";
import {Link} from "react-router-dom";

export default function Header() {
    const [isNavOpen, setIsNavOpen] = useState(false);

    const closeSidebar = () => {
        setIsNavOpen(false);
    };
    const handleLinkClick = () => {
        closeSidebar();
    };

    return (
        <div className="flex items-center justify-between border-gray-400 py-8">
            <nav>
                <section className="MOBILE-MENU flex">
                    <div
                        className="HAMBURGER-ICON space-y-2"
                        onClick={() => setIsNavOpen((prev) => !prev)}
                    >
                        <span className="block h-0.5 w-8 animate-pulse bg-gray-700"></span>
                        <span className="block h-0.5 w-8 animate-pulse bg-gray-700"></span>
                        <span className="block h-0.5 w-8 animate-pulse bg-gray-700"></span>
                    </div>

                    <div className={isNavOpen ? "showMenuNav" : "hideMenuNav"}>
                        <div
                            className="absolute top-0 left-0 px-4 py-4"
                            onClick={() => setIsNavOpen(false)}
                        >
                            <svg
                                className="h-8 w-8 text-black font-bold"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </div>
                        <section id="main-section"
                                 className="flex flex-col items-start justify-between min-h-[20px] w-full pt-24 px-4 border-b-4">
                            <a class={"mb-2"} href="/">Home</a>
                        </section>
                        <span class={"px-4 pt-2"}>Categories</span>
                        <section id="categories"
                                 className="flex flex-col items-start justify-between w-full px-4 border-b-4">
                            <ul className="flex flex-col items-start justify-between px-4">

                                <li className="border-b border-gray-400 my-2 uppercase">
                                    <a href="/">Memes</a>
                                </li>

                                <Link to="/nsfw" onClick={() => handleLinkClick()}>
                                    <li className="border-b border-gray-400 my-2 uppercase">
                                        <span>NSFW</span>
                                    </li>
                                </Link>
                                <li className="border-b border-gray-400 my-2 uppercase">
                                    <a href="/contact">Nature</a>
                                </li>
                                <li className="border-b border-gray-400 my-2 uppercase">
                                    <a href="/contact">Pets</a>
                                </li>
                                <li className="border-b border-gray-400 my-2 uppercase">
                                    <a href="/contact">Random</a>
                                </li>
                                <li className="border-b border-gray-400 my-2 uppercase">
                                    <a href="/contact">Bitcoin</a>
                                </li>
                                <li className="border-b border-gray-400 my-2 uppercase">
                                    <a href="/contact">PlebChain</a>
                                </li>
                                <li className="border-b border-gray-400 my-2 uppercase">
                                    <a href="/contact">Food and Coffee</a>
                                </li>
                                <li className="border-b border-gray-400 my-2 uppercase">
                                    <a href="/contact">News</a>
                                </li>
                            </ul>
                        </section>

                    </div>
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
            <style>{`
      .hideMenuNav {
        display: none;
      }
      .showMenuNav {
        position: absolute;
        width: 100%;
        height: 100vh;
        background: white;
        top: 0;
        left: 0;
        z-index: 10;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: baseline;
      }
    `}</style>
        </div>
    );
}
