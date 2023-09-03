import React, { useState } from 'react';
import getUserDetailsFromPrivateKey from '../Profile';
import './profile.css'
import { getPublicKey, nip19 } from 'nostr-tools';

function Login(props) {
    const [showLogin, setShowLogin] = useState(false);
    const [privateKey, setPrivateKey] = useState('');
    const [isLoggedIn, setisLoggedIn] = useState(false)
    const [loggedInUser, setLoggedInUser] = useState(null);

    const handleLoginClick = () => {
        const storedData = localStorage.getItem('memestr')
        if (!storedData) {
            setShowLogin(true);
        } else {
            const userDetails = JSON.parse(storedData);
            setShowLogin(false);
            setisLoggedIn(true);
            const display_name = userDetails.display_name
            const profile_picture = userDetails.picture
            setLoggedInUser({ display_name, profile_picture });
        }
    };

    const handlePrivateKeyChange = (event) => {
        setPrivateKey(event.target.value);
    };

    const handleLoginSubmit = (event) => {
        event.preventDefault();
        let userDetails = null;
        const storedData = localStorage.getItem('memestr')
        if (storedData) {
            userDetails = JSON.parse(storedData);
            setShowLogin(false);
            setisLoggedIn(true);
            const display_name = userDetails.display_name
            const profile_picture = userDetails.picture
            setLoggedInUser({ display_name, profile_picture });
        } else {
            userDetails = getUserDetailsFromPrivateKey(privateKey)
        }
        userDetails.then((value) => {
            const display_name = value.display_name
            const profile_picture = value.picture
            let decodedpk = nip19.decode(privateKey)
            let publicKey = getPublicKey(decodedpk.data)
            value["pubKey"] = publicKey
            value["privateKey"] = privateKey //Encrypt it.
            setShowLogin(false);
            setisLoggedIn(true);
            setLoggedInUser({ display_name, profile_picture });
            localStorage.setItem('memestr', JSON.stringify(value));
        });

    };

    function logoutUser() {
        localStorage.removeItem('memestr');
        setShowLogin(true);
        setisLoggedIn(false);
        alert("Logged out successfully!")
    }

    return (
        <div class="relative flex w-full flex-wrap bg-gray-200 pt-2 pb-1 text-neutral-500 shadow-lg mb-1">
            <header>
                {isLoggedIn ?
                    <div class="flex flex-column w-full gap-2">
                        <img className='profile1' src={loggedInUser.profile_picture} alt="Profile" />
                        <div className='pt-2'><code>{loggedInUser.display_name}</code></div>
                        <div className='flex w-full justify-end rounded bg-white px-3 pb-1 pt-1.5 text-xs font-medium uppercase leading-normal text-black shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]'><button onClick={logoutUser}>Logout</button></div>
                    </div>
                    :
                    <div className='flex self-end'>
                        {/*<button onClick={handleLoginClick}>Login</button>*/}
                        <button
                            type="button"
                            data-te-ripple-init
                            data-te-ripple-color="light"
                            onClick={handleLoginClick}
                            class="rounded bg-white px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-black shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]">
                            Login
                        </button>
                    </div>
                }
            </header>
            {showLogin && (
                <div>
                    <div className="popup-inner">
                        <form onSubmit={handleLoginSubmit}>
                            <label>
                                Private Key:
                                <input
                                    type="text"
                                    value={privateKey}
                                    onChange={handlePrivateKeyChange}
                                    placeholder='Your private key'
                                    required
                                />
                            </label>
                            <button type="submit">Login</button>
                        </form>
                    </div> </div>
            )}

        </div>
    )
}
export default Login;