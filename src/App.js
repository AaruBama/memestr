import './App.css';
import { HashTagToolProvider } from './components/HashtagTool';
import PostViewTool from './components/Post/post.js';
import HeaderBar from './components/Login';
import { AuthProvider } from './AuthContext'; // Import AuthProvider
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import HashtagTool from './components/HashtagTool';
function App() {
    const pageFilters = {
        '/': null,
        '/pets': ['pets', 'dogs', 'cats'],
        '/nature': ['nature', 'flowers', 'sky', 'sea'],
        '/food': ['food'],
        '/photography': ['photography'],
    };

    return (
        <AuthProvider>
            <Router>
                <HeaderBar />
                <HashTagToolProvider filterTags={pageFilters['/']}>
                    <Routes>
                        <Route exact path="/" element={<HashtagTool />} />
                        <Route
                            path="/post/:postId"
                            element={<PostViewTool />}
                        />
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
        </AuthProvider>
    );
}

export default App;
