import React, { useEffect, useState } from 'react';
import { getPublicKey, SimplePool} from 'nostr-tools'
import { nip19 } from "nostr-tools";



async function authy() {
  let relays = ['wss://relay.damus.io', 'wss://relay.primal.net']
  const relayPool = new SimplePool();
  const skk = "nsec1mf54zukt27mr9ry5pv853qa470280scua4sqvfs3ftnxuayks8dqr3q9z2"
  let sk = nip19.decode(skk)
  const pubKey = getPublicKey(sk.data)
  const filters = {
      kinds: [0],
      "authors": [pubKey]
  };
  // const name = "GHOST@nostrplebs.com"
  // let xx=await nip05.queryProfile(name)
  let profile = await relayPool.list(relays, [filters])
  console.log("user profile is ", profile[0].content)
  return profile
  
}


const UserProfile = () => {
  const [publicKey, setPublicKey] = useState(''); // Replace with the user's public key
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!publicKey) {
        return;
      }

      try {
        const profile = authy();
        setProfileData(profile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [publicKey]);

  return (
    <div>
      <h1>User Profile</h1>
      <label>
        Public Key:
        <input
          type="text"
          value={publicKey}
          onChange={(e) => setPublicKey(e.target.value)}
        />
      </label>
      <div>
        {profileData ? (
          <div>
            <h2>Profile Information</h2>
            <p>Name: {profileData.name}</p>
            <p>Email: {profileData.email}</p>
            {/* Include other profile data fields as needed */}
          </div>
        ) : (
          <p>No profile data available.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;