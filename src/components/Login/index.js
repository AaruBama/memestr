import React, {useState} from 'react';
import getUserDetailsFromPrivateKey from '../Profile';
import './profile.css'
import {getPublicKey, nip19, generatePrivateKey} from 'nostr-tools';
import Menu from "../Menu";
// import NewKeysNavBar from "../LoginComponent";
import DropdownComponent from "../LoginDropDownComponent/DropDownComponent";

export function generateNewKeys() {
    const pk = generatePrivateKey()

    const pubKey = getPublicKey(pk)
    const epk = nip19.nsecEncode(pk)
    const ePubKey = nip19.npubEncode(pubKey)
    console.log("epk, epubKey", epk, ePubKey)
    console.log("pk, pubKey", pk, pubKey)
    return {"epk": epk, "epubKey": ePubKey}
}


function Login(props) {
    const [showLogin, setShowLogin] = useState(false);
    const [privateKey, setPrivateKey] = useState('');
    const [isLoggedIn, setisLoggedIn] = useState(false)
    const [loggedInUser, setLoggedInUser] = useState(null);

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
            setLoggedInUser({display_name, profile_picture});
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
            setLoggedInUser({display_name, profile_picture});
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
        <div class="relative flex-column bg-gray-100 text-neutral-500 shadow-lg rounded">
            <header className={"flex flex-row items-center h-14"}>
                <div class="pl-3 basis-[50%]">
                    <Menu/>
                </div>
                {isLoggedIn ?
                    <div class="flex w-full grow gap-3 mr-2">
                        <img className='profile1' src={loggedInUser.profile_picture} alt="Profile"/>
                        <div className='pt-2 invisible'><code>{loggedInUser.display_name}</code></div>
                        <div
                            className='flex w-full justify-end rounded bg-white px-4 pb-1 pt-1.5 text-xs font-medium uppercase leading-normal text-black shadow-[0_4px_9px_-4px_#3b71ca]'>
                            <button onClick={logoutUser}>Logout</button>
                        </div>
                    </div> :
                    <div class={"basis-[50%] flex justify-end pr-4"}>
                        {/*<button*/}
                        {/*    type="button"*/}
                        {/*    data-te-ripple-init*/}
                        {/*    data-te-ripple-color="light"*/}
                        {/*    onClick={handleLoginClick}*/}
                        {/*    class="rounded*/}
                        {/*         bg-blue-500*/}
                        {/*          px-6*/}
                        {/*           pb-2*/}
                        {/*            pt-2.5*/}
                        {/*             text-xs*/}
                        {/*              font-medium*/}
                        {/*               uppercase*/}
                        {/*                leading-normal*/}
                        {/*                 text-white*/}
                        {/*                  shadow-[0_4px_9px_-4px_#3b71ca]*/}
                        {/*                   transition*/}
                        {/*                    duration-150*/}
                        {/*                     ease-in-out*/}
                        {/*                      hover:bg-primary-600*/}
                        {/*                       hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)*/}
                        {/*                       ]">*/}
                        {/*    Login*/}
                        {/*</button>*/}

                        <button><DropdownComponent /></button>

                    </div>}
            </header>
            {showLogin && (<div>
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
                    </div>
                </div>)}

        </div>)
}
export default Login;