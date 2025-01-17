import './App.css';
import { HashTagToolProvider } from './context/HashtagContext';
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
        '/': ['memes', 'meme', 'funny', 'memestr'],
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
                <Routes>
                    <Route
                        exact
                        path="/"
                        element={
                            <HashTagToolProvider filterTags={pageFilters['/']}>
                                <HashtagTool />
                            </HashTagToolProvider>
                        }
                    />
                    <Route path="/post/:postId" element={<PostViewTool />} />
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
                    <Route
                        path="/pets"
                        element={
                            <HashTagToolProvider
                                filterTags={pageFilters['/pets']}>
                                <HashtagTool />
                            </HashTagToolProvider>
                        }
                    />
                    <Route
                        path="/nature"
                        element={
                            <HashTagToolProvider
                                filterTags={pageFilters['/nature']}>
                                <HashtagTool />
                            </HashTagToolProvider>
                        }
                    />
                    <Route
                        path="/food"
                        element={
                            <HashTagToolProvider
                                filterTags={pageFilters['/food']}>
                                <HashtagTool />
                            </HashTagToolProvider>
                        }
                    />
                    <Route
                        path="/photography"
                        element={
                            <HashTagToolProvider
                                filterTags={pageFilters['/photography']}>
                                <HashtagTool />
                            </HashTagToolProvider>
                        }
                    />
                    <Route
                        path="/vehicles"
                        element={
                            <HashTagToolProvider
                                filterTags={pageFilters['/vehicles']}>
                                <HashtagTool />
                            </HashTagToolProvider>
                        }
                    />
                    <Route
                        path="/crypto"
                        element={
                            <HashTagToolProvider
                                filterTags={pageFilters['/crypto']}>
                                <HashtagTool />
                            </HashTagToolProvider>
                        }
                    />
                    <Route
                        path="/relationship"
                        element={
                            <HashTagToolProvider
                                filterTags={pageFilters['/relationship']}>
                                <HashtagTool />
                            </HashTagToolProvider>
                        }
                    />
                </Routes>
                <FooterBar />
            </Router>
        </AuthProvider>
    );
}

export default App;
