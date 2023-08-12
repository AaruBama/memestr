import React, { useState } from 'react';
import getUserDetailsFromPrivateKey from '../Profile';

function Login(props) {
    const [showLogin, setShowLogin] = useState(false);
    const [privateKey, setPrivateKey] = useState('');
    const [isLoggedIn, setisLoggedIn] = useState(false)

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
        // Here you can add the logic to validate the private key and perform the login action
        // For the sake of example, let's just alert the private key

        alert('Logged in with private key: ' + privateKey);
        let userDetails = getUserDetailsFromPrivateKey(privateKey)
        setShowLogin(false);
        setisLoggedIn(true);
    };

    return (
        <div className="App">

            {!isLoggedIn && <button onClick={handleLoginClick}>Login</button>}
            {isLoggedIn && <h3>Welcome.</h3>}
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