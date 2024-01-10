import './App.css';
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import HashtagTool from './components/HashtagTool';
import PostViewTool from './components/Post/post.js';
import HeaderBar from './components/Login';
import { HashTagToolProvider } from './components/HashtagTool';

function App() {
    const pageFilters = {
        '/': null,
        '/pets': ['pets', 'dogs', 'cats'],
        '/nature': ['nature', 'flowers', 'sky', 'sea'],
        '/food': ['food'],
        '/photography': ['photography'],
    };

    const renderHashtagToolRoutes = () => {
        return Object.entries(pageFilters).map(([path, filterTags]) => (
            <Route
                key={path}
                path={path}
                element={
                    <HashTagToolProvider filterTags={filterTags}>
                        <HashtagTool />
                    </HashTagToolProvider>
                }
            />
        ));
    };

    return (
        <Router>
            <HeaderBar />
            <Routes>
                {renderHashtagToolRoutes()}
                <Route path="/post/:postId" element={<PostViewTool />} />
            </Routes>
        </Router>
    );
}

export default App;
