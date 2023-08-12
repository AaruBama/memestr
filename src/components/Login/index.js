import React, { useState } from 'react';
import getUserDetailsFromPrivateKey from '../Profile';
import './profile.css'

function Login(props) {
    const [showLogin, setShowLogin] = useState(false);
    const [privateKey, setPrivateKey] = useState('');
    const [isLoggedIn, setisLoggedIn] = useState(false)
    const [loggedInUser, setLoggedInUser] = useState(null);

    const handleLoginClick = () => {
        setShowLogin(true);
    };

    const loginUser = () => {
        setisLoggedIn(true);
    }

    const handlePrivateKeyChange = (event) => {
        setPrivateKey(event.target.value);
    };

    const handleLoginSubmit = (event) => {
        event.preventDefault();
        let status = false
        let userDetails = null;
        const storedData = localStorage.getItem('memestr')
        if (storedData) {
            userDetails = JSON.parse(storedData);
            setShowLogin(false);
            setisLoggedIn(true);
            const display_name = value.display_name
            const profile_picture = value.picture
            setLoggedInUser({ display_name, profile_picture });
        } else {
            userDetails = getUserDetailsFromPrivateKey(privateKey)
        }
        console.log("user details are", userDetails)
        userDetails.then((value) => {
            status = true
            const display_name = value.display_name
            const profile_picture = value.picture
            console.log("username is ", display_name)
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
        <div className="Login">
            <div className='container'>
                {isLoggedIn ?
                    <div>
                        <img className='profile1' src={loggedInUser.profile_picture} alt="Profile" />
                        <div className='username'>Welcome, {loggedInUser.display_name}</div>
                        <button className='logout' onClick={logoutUser}>Logout</button>
                    </div>
                    :
                    <button onClick={handleLoginClick}>Login</button>
                }
            </div>
            {/* {!isLoggedIn && <button onClick={handleLoginClick}>Login</button>} */}
            {showLogin && (
                <div className="popup">
                    <div className="popup-inner">
                        <h2>Login</h2>
                        <form onSubmit={handleLoginSubmit}>
                            <label>
                                Private Key:
                                <input
                                    type="text"
                                    value={privateKey}
                                    onChange={handlePrivateKeyChange}
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