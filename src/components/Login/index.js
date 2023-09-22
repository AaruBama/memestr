import React from 'react';
import './profile.css'
import {getPublicKey, nip19, generatePrivateKey} from 'nostr-tools';
import Menu from "../Menu";
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


function HeaderBar(props) {

    return (
        <div class="relative flex-column bg-gray-100 text-neutral-500 shadow-lg rounded">
            <header className={"flex flex-row items-center h-14"}>
                <div class="pl-3 basis-[50%]">
                    <Menu/>
                </div>

                <div class={"basis-[50%] flex justify-end pr-4"}>
                    <button><DropdownComponent /></button>

                </div>
            </header>


        </div>)
}
export default HeaderBar;