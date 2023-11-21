import './App.css';
import { HashTagToolProvider } from './components/HashtagTool';
import PostViewTool from './components/Post/post.js';
import HeaderBar from './components/Login';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HashtagTool from './components/HashtagTool';
import PetFeed, { PetsFeedProvider } from './components/CategoryView/PetFeed';
import NatureFeed, {
    NatureProvider,
} from './components/CategoryView/NatureProvider';
import BestForMobile from './components/Menu/BestForMobile';

function App() {
    const pageFilters = {
        '/': null, // Default filters (null or any other default filters you want to use)
        '/pets': ['pets', 'dogs', 'cats'],
        '/nature': ['nature', 'flowers', 'sky', 'sea'],
        '/food': ['food'],
        '/photography': ['photography'],
    };

    // const location = useLocation();

    return (
        <div>
            <BestForMobile />
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
        </div>
    );
}

export default App;
