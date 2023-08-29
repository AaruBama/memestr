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
        <div className="container possti borders">
            <header>
                {isLoggedIn ?
                    <div>
                        <img className='profile1' src={loggedInUser.profile_picture} alt="Profile" />
                        <div className='username'><code>{loggedInUser.display_name}</code></div>
                        <div className='dib logout-button'><button onClick={logoutUser}>Logout</button>
                    </div></div>
                    :
                    <div className='login'><button onClick={handleLoginClick}>Login</button></div>
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