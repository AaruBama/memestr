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

    // const renderHashtagToolRoutes = () => {
    //     return Object.entries(pageFilters).map(([path, filterTags]) => (
    //         <Route
    //             key={path}
    //             path={path}
    //             element={
    //                 <HashTagToolProvider filterTags={filterTags}>
    //                     <HashtagTool />
    //                 </HashTagToolProvider>
    //             }
    //         />
    //     ));
    // };

    return (
        <Router>
            <HeaderBar />

            <HashTagToolProvider filterTags={pageFilters['/']}>
                <Routes>
                    <Route exact path="/" element={<HashtagTool />} />
                    <Route path="/post/:postId" element={<PostViewTool />} />
                </Routes>
            </HashTagToolProvider>

            <HashTagToolProvider filterTags={pageFilters['/pets']}>
                <Routes>
                    <Route exact path="/pets" element={<HashtagTool />} />
                </Routes>
            </HashTagToolProvider>
            <HashTagToolProvider filterTags={pageFilters['/nature']}>
                <Routes>
                    <Route exact path="/nature" element={<HashtagTool />} />
                </Routes>
            </HashTagToolProvider>
            <HashTagToolProvider filterTags={pageFilters['/food']}>
                <Routes>
                    <Route exact path="/food" element={<HashtagTool />} />
                </Routes>
            </HashTagToolProvider>
            <HashTagToolProvider filterTags={pageFilters['/photography']}>
                <Routes>
                    <Route
                        exact
                        path="/photography"
                        element={<HashtagTool />}
                    />
                </Routes>
            </HashTagToolProvider>
        </Router>
    );
}

export default App;
