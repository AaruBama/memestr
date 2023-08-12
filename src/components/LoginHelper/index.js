import React, { useState } from 'react';

function LoginMenu() {
  const [showLogin, setShowLogin] = useState(false);
  const [privateKey, setPrivateKey] = useState('');

  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handlePrivateKeyChange = (event) => {
    setPrivateKey(event.target.value);
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    // Here you can add the logic to validate the private key and perform the login action
    // For the sake of example, let's just alert the private key
    alert('Logged in with private key: ' + privateKey);
    setShowLogin(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <nav>
          <ul>
            <li>
              <button onClick={handleLoginClick}>Login</button>
            </li>
          </ul>
        </nav>
      </header>
      {showLogin && (
        <div className="login-popup">
          <div className="login-form">
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
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginMenu;
