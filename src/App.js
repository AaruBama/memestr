import './App.css';
import { HashTagToolProvider } from './components/HashtagTool';
import PostViewTool from './components/Post/post.js';
import HeaderBar from './components/Login';
import FooterBar from './components/Login/FooterBar.js';
import { AuthProvider } from './AuthContext';
import MobileSearchPage from './components/Login/MobileSearchPage.js';
import React from 'react';
import MemeEditor from './components/HashtagTool/MemeEditor.js';
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
        '/vehicles': ['cars', 'motorcycle', 'car', 'motorcycles'],
        '/relationship': [
            'love',
            'dating',
            'relationship',
            'tinder',
            'bumble',
            'romance',
            'crush',
            'marriage',
            'single',
            'couple',
            'boyfriend',
            'girlfriend',
        ],
        '/crypto': [
            'crypto',
            'bitcoin',
            'btc',
            'ethereum',
            'cryptocurrency',
            'blockchain',
            'nft',
        ],
    };

    React.useEffect(() => {
        var _mtm = (window._mtm = window._mtm || []);
        _mtm.push({
            'mtm.startTime': new Date().getTime(),
            event: 'mtm.Start',
        });
        var d = document,
            g = d.createElement('script'),
            s = d.getElementsByTagName('script')[0];
        g.async = true;
        g.src =
            'https://cdn.matomo.cloud/memestrapp.matomo.cloud/container_6nxjmRiN.js';
        s.parentNode.insertBefore(g, s);
    }, []);

    function ConditionalHeader() {
        let location = useLocation();
        if (
            location.pathname !== '/search' &&
            location.pathname !== '/meme-editor'
        ) {
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
                        <Route path="/meme-editor" element={<MemeEditor />} />
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
                <HashTagToolProvider filterTags={pageFilters['/vehicles']}>
                    <Routes>
                        <Route
                            exact
                            path="/vehicles"
                            element={<HashtagTool />}
                        />
                    </Routes>
                </HashTagToolProvider>
                <HashTagToolProvider filterTags={pageFilters['/crypto']}>
                    <Routes>
                        <Route exact path="/crypto" element={<HashtagTool />} />
                    </Routes>
                </HashTagToolProvider>
                <HashTagToolProvider filterTags={pageFilters['/relationship']}>
                    <Routes>
                        <Route
                            exact
                            path="/relationship"
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
