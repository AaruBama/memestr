import './App.css';
import { HashTagToolProvider } from './components/HashtagTool';
import PostViewTool from './components/Post/post.js';
import HeaderBar from './components/Login';
import FooterBar from './components/Login/FooterBar.js';
import { AuthProvider } from './AuthContext';
import MobileSearchPage from './components/Login/MobileSearchPage.js';
import React from 'react';
import {
    HashRouter as Router,
    Routes,
    Route,
    useParams,
    useLocation,
} from 'react-router-dom';
import HashtagTool from './components/HashtagTool';
import ProfilePage from './components/LoginDropDownComponent/ProfilePage.js';
import UserProfilePage from './components/LoginDropDownComponent/UserProfilePage.js';

function SearchRouteWrapper() {
    let { searchQuery } = useParams();
    return (
        <HashTagToolProvider filterTags={[searchQuery]}>
            <HashtagTool />
        </HashTagToolProvider>
    );
}

function App() {
    const pageFilters = {
        '/': null,
        '/pets': ['pets', 'dogs', 'cats'],
        '/nature': ['nature', 'flowers', 'sky', 'sea'],
        '/food': ['food'],
        '/photography': ['photography'],
    };

    function ConditionalHeader() {
        let location = useLocation();
        if (location.pathname !== '/search') {
            return <HeaderBar />;
        }
        return null;
    }

    return (
        <AuthProvider>
            <Router>
                <ConditionalHeader />
                <HashTagToolProvider filterTags={pageFilters['/']}>
                    <Routes>
                        <Route exact path="/" element={<HashtagTool />} />
                        <Route
                            path="/post/:postId"
                            element={<PostViewTool />}
                        />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route
                            path="/userprofile/:pubKey"
                            element={<UserProfilePage />}
                        />
                        <Route
                            path="/search/:searchQuery"
                            element={<SearchRouteWrapper />}
                        />

                        <Route path="/search" element={<MobileSearchPage />} />
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
                <FooterBar />
            </Router>
        </AuthProvider>
    );
}

export default App;
