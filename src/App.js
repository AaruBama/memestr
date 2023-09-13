import "./App.css";
import { HashTagToolProvider} from "./components/HashtagTool";
import PostViewTool from "./components/Post/post.js"
import HeaderBar from "./components/Login";
import React, {useEffect} from "react";
import {
    HashRouter as Router,
    Routes,
    Route
} from "react-router-dom";

import HashtagTool from "./components/HashtagTool";
import ReactGA from "react-ga4";

ReactGA.initialize('G-K500PHWCNK');


const App = () => {
    // const location = useLocation();
    useEffect(() => {
        ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Homepage" })
    }, []);

        return (
            <div>
                <HeaderBar/>
                <Router>
                    <HashTagToolProvider>
                        <Routes>
                            <Route exact path="/" element={<HashtagTool />}/>
                            <Route path="/post/:postId" element={<PostViewTool/>}/>
                        </Routes>
                    </HashTagToolProvider>
                </Router>
            </div>
        );

}

export default App;
