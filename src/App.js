import "./App.css";
import { HashTagToolProvider} from "./components/HashtagTool";
import PostViewTool from "./components/Post/post.js"
import HeaderBar from "./components/Login";
import React from "react";
import {
    HashRouter as Router,
    Routes,
    Route,
} from "react-router-dom";

import HashtagTool from "./components/HashtagTool";
import CategorizedFeed, {NFSWProvider} from "./components/CategoryView/CategorizedFeed";

function App(){
    const pageFilters = {
        "/": null, // Default filters (null or any other default filters you want to use)
        "/nsfw": ["tits", "boobs", "ass"],
    };


        return (
            <div>

                <Router>
                    <HeaderBar/>
                    <HashTagToolProvider>
                        <Routes>
                            <Route exact path="/" element={<HashtagTool />}/>
                            <Route path="/post/:postId" element={<PostViewTool/>}/>
                        </Routes>
                    </HashTagToolProvider>
                    <NFSWProvider filterTags={pageFilters["/nsfw"]}>
                        <Routes>
                            <Route exact path="/nsfw" element={<CategorizedFeed />}/>
                        </Routes>
                    </NFSWProvider>
                </Router>
            </div>
        );
    }


export default App;
