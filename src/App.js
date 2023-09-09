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

class App extends React.Component {
    shouldComponentUpdate() {
        return false;
    }
    render() {
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
}

export default App;
