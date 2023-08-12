import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import { useState } from 'react';
import Login from './components/Login'

function AppF() {
   const [seen, setSeen] = useState(false)

   function togglePop () {
       setSeen(!seen);
   };

   return (
       <div>
           <button onClick={togglePop}>Login</button>
           {seen ? <Login toggle={togglePop} /> : null}
       </div>
   )
}

export default function MenuBar() {
   return (
      <Menu menuButton={<MenuButton>Menu</MenuButton>} transition>
         <MenuItem value="Login" onClick={
            AppF
            }>Login
         </MenuItem>
         <MenuItem>Login</MenuItem>
         <MenuItem>Sign Up</MenuItem>
      </Menu>
   );
}
