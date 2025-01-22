import React, { useEffect, useState } from 'react';
import { relayInit } from 'nostr-tools';
import Feed from '../Feed';
import PostUpload from '../Post/newPost';
import Spinner from '../Spinner';
import TrendingSidebar from './TrendingSideBar';
import Sidebar from './SideBar';
import MemeEditor from './MemeEditor';
import { ReactComponent as UploadSvg } from '../../Icons/UploadSvg.svg';
import { ReactComponent as CloseIcon } from '../../Icons/CloseIcon.svg';
import { useHashTagContext } from '../../context/HashtagContext';

export async function getCommentCount(id) {
    try {
        if (sessionStorage.getItem('cc_' + id)) {
            return parseInt(sessionStorage.getItem('cc_' + id), 10);
        }

        const relay = relayInit('wss://saltivka.org');
        await relay.connect();

        let event = await relay.count([
            {
                kinds: [1],
                '#e': [id],
            },
        ]);

        if (event) {
            const count = event['count'];
            sessionStorage.setItem('cc_' + id, count);
            return count;
        }

        return 0;
    } catch (error) {
        console.error('Error fetching comments count:', error);
        return 0;
    }
}

export function useResetScrollOnFilterChange(filterTags) {
    useEffect(() => {
        window.scrollTo(0, 0);
        // Or, if you're scrolling within a specific element:
        // document.getElementById('your-scrollable-element-id').scrollTop = 0;
    }, [filterTags]);
}

export function HashtagTool() {
    const { notes, LoadMoreMedia, isLoading, filterTags } = useHashTagContext();
    console.log('notes are ', notes, ' with filter tags ', filterTags);
    const [newPostModal, setNewPostModal] = useState(false);
    const [loadingMorePosts, setLoadingMorePosts] = useState(false);
    const [showMemeEditor, setShowMemeEditor] = useState(false);
    const [showSuccessNotification, setShowSuccessNotification] =
        useState(false);

    function handlePostUploadSuccess() {
        setShowSuccessNotification(true);
        setTimeout(() => setShowSuccessNotification(false), 3000); // Auto-hide after 3 seconds
    }

    useResetScrollOnFilterChange(filterTags);

    function showNewPostModal() {
        setNewPostModal(true);
    }

    function closePostModal() {
        setNewPostModal(false);
    }

    function handleLoadMore() {
        setLoadingMorePosts(true);
        LoadMoreMedia().then(() => {
            setLoadingMorePosts(false);
        });
    }

    const LoadingSpinner = ({ isVisible }) => {
        if (!isVisible) {
            return null;
        }

        return (
            <div className="fixed bottom-0 left-0 w-full flex items-center justify-center bg-opacity-50 p-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
            </div>
        );
    };

    const Notification = ({ isVisible, message, onClose }) => {
        if (!isVisible) {
            return null;
        }

        return (
            <div className="fixed top-0 inset-x-0 flex justify-center items-start notification z-50">
                <div className="mt-12 p-4 bg-black text-white rounded-lg shadow-lg transition-transform transform-gpu animate-slideInSlideOut flex items-center">
                    <p className="text-bold text-white px-2">{message}</p>
                    <CloseIcon
                        className="h-6 w-6 mr-2 text-white"
                        onClick={onClose}
                    />
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="flex flex-col md:flex-row min-h-screen">
                <Sidebar
                    showMemeEditor={showMemeEditor}
                    setShowMemeEditor={setShowMemeEditor}
                />
                <main className="flex-1 overflow-y-auto bg-gray-50">
                    {isLoading && <Spinner />}
                    <Feed
                        notes={notes}
                        onLoadMore={handleLoadMore}
                        isLoading={isLoading || loadingMorePosts}
                    />

                    <LoadingSpinner isVisible={loadingMorePosts} />

                    <button
                        onClick={showNewPostModal}
                        title="Upload"
                        style={{ zIndex: 50 }}
                        className="hidden md:block fixed bottom-4 right-8  bg-gradient-to-r from-blue-500 to-teal-500 hover:from-pink-500 hover:to-yellow-500 w-14 h-14 rounded-full flex items-center justify-center text-white drop-shadow-lg hover:drop-shadow-2xl">
                        <UploadSvg className="m-auto h-6 w-6" />
                    </button>

                    {newPostModal && (
                        <PostUpload
                            isOpen={newPostModal}
                            onClose={closePostModal}
                            onUploadSuccess={handlePostUploadSuccess}
                        />
                    )}

                    <Notification
                        isVisible={showSuccessNotification}
                        message="Post Uploaded Successfully"
                        onClose={() => setShowSuccessNotification(false)}
                    />
                </main>
                <TrendingSidebar showMemeEditor={showMemeEditor} />
                {showMemeEditor && (
                    <div className="fixed editor-container inset-0 flex items-center justify-center bg-black bg-opacity-40 transition-opacity overflow-auto">
                        <div className="bg-white p-6 rounded-md shadow-md relative max-h-full lg:w-2/3 overflow-auto">
                            <MemeEditor />
                            <button
                                type="button"
                                className="absolute top-4 right-4 mt-2 mr-2 text-gray-600 hover:text-gray-800"
                                onClick={() => setShowMemeEditor(false)}>
                                <CloseIcon />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default HashtagTool;
