import "./App.css";
import HashTagTool from "./components/HashtagTool";
import PostViewTool from "./components/Post/post.js"
import Login from "./components/Login";
import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";

function App() {
  return (
    <div >
        <Login />
        <Router>
            <Routes>
                <Route path="/" element={<HashTagTool />} />
                <Route path="/post/:postId" element={<PostViewTool note={{}}/>} />
                {/*<Route path="/dashboard" element={<Dashboard />} />*/}
            </Routes>
        </Router>
    </div>
  );
}

export default App;
