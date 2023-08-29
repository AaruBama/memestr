import "./App.css";
import HashTagTool from "./components/HashtagTool";
import PostViewTool from "./components/Post/post.js"
import Login from "./components/Login";
import React from "react";
import {
    HashRouter as Router,
    Routes,
    Route,
} from "react-router-dom";

class App extends React.Component {
    shouldComponentUpdate() {
        return false;
    }
    render() {
        console.log("yoyo");
        return (
            <div>
                <Login/>
                <Router>
                    <Routes>
                        <Route exact path="/" element={<HashTagTool/>}/>
                        <Route path="/post/:postId" element={<PostViewTool/>}/>
                    </Routes>
                </Router>
            </div>
        );
    }
}

export default App;
