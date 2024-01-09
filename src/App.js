import './App.css';
import { HashTagToolProvider } from './components/HashtagTool';
import PostViewTool from './components/Post/post.js';
import HeaderBar from './components/Login';
import { AuthProvider } from './AuthContext'; // Import AuthProvider
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import HashtagTool from './components/HashtagTool';
import PetFeed, { PetsFeedProvider } from './components/CategoryView/PetFeed';
import NatureFeed, {
    NatureProvider,
} from './components/CategoryView/NatureProvider';

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
            {' '}
            {/* Wrap everything inside AuthProvider */}
            <Router>
                <HeaderBar />
                <HashTagToolProvider>
                    <Routes>
                        <Route exact path="/" element={<HashtagTool />} />
                        <Route
                            path="/post/:postId"
                            element={<PostViewTool />}
                        />
                    </Routes>
                </HashTagToolProvider>
                <PetsFeedProvider filterTags={pageFilters['/pets']}>
                    <Routes>
                        <Route exact path="/pets" element={<PetFeed />} />
                    </Routes>
                </PetsFeedProvider>
                <NatureProvider filterTags={pageFilters['/nature']}>
                    <Routes>
                        <Route exact path="/nature" element={<NatureFeed />} />
                    </Routes>
                </NatureProvider>
                {/* It seems NatureProvider is used for multiple routes, consider using a more generic name if it's not specific to nature */}
                <NatureProvider filterTags={pageFilters['/food']}>
                    <Routes>
                        <Route exact path="/food" element={<NatureFeed />} />
                    </Routes>
                </NatureProvider>
                <NatureProvider filterTags={pageFilters['/photography']}>
                    <Routes>
                        <Route
                            exact
                            path="/photography"
                            element={<NatureFeed />}
                        />
                    </Routes>
                </NatureProvider>
            </Router>
        </AuthProvider>
    );
}

export default App;
