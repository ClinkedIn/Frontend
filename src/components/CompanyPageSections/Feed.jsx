import { useOutletContext } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants';
// import Main from '../Main'; // Main component was not used in the provided structure
import PostMenu from '../PostMenu.jsx';
import PostReactions from '../PostReactions';
import CommentSection from '../CommentSection';
import CreatePostModal from '../PostCreation.jsx';

const CompanyFeedPage = () => {
    const { companyInfo } = useOutletContext();
    const [loadingPoasts, setLoadingPosts] = useState(true); // Typo: loadingPoasts -> loadingPosts
    const [posts, setPosts] = useState([]);
    // const [loading, setLoading] = useState(true); // This seems redundant with loadingPosts
    // const [error, setError] = useState(null); // Not used for UI updates
    // const [postContent, setPostContent] = useState(''); // Primarily for modal, modal manages its own state
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [userReactions, setUserReactions] = useState({});
    const [expandedComments, setExpandedComments] = useState({});
    const [comments, setComments] = useState({});
    const [loadingComments, setLoadingComments] = useState({});
    // const [expandedReplies, setExpandedReplies] = useState({}); // Not used
    // const [replies, setReplies] = useState({}); // Not used
    const [user, setUser] = useState();
    const [inlinePostText, setInlinePostText] = useState('');
    const [inlinePostAttachment, setInlinePostAttachment] = useState(null);
    const inlineAttachmentInputRef = useRef(null);

    const reactionTypes = [
        { type: 'like', emoji: '👍', label: 'Like' },
        { type: 'celebrate', emoji: '👏', label: 'Celebrate' },
        { type: 'support', emoji: '❤️', label: 'Support' },
        { type: 'insightful', emoji: '💡', label: 'Insightful' },
        { type: 'funny', emoji: '😄', label: 'Funny' }
    ];

    // --- Handler for inline file input change ---
    const handleInlineFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setInlinePostAttachment(e.target.files[0]);
        } else {
            setInlinePostAttachment(null);
        }
    };

    // --- Generic Post Creation Logic (called by inline form handler & modal) ---
    const handleCreatePost = async (postData) => {
        if (!companyInfo || !companyInfo.id) {
            console.error("Company information is missing, cannot create post.");
            alert("Error: Company information is not available to associate the post with.");
            return;
        }
        // Ensure postData is provided and has content
        if (!postData || (!postData.text?.trim() && (!postData.files || postData.files.length === 0))) {
            alert("Post content (text or attachment) cannot be empty.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('description', postData.text || ""); // Ensure description is at least empty string

            if (postData.files && postData.files.length > 0) {
                for (let i = 0; i < postData.files.length; i++) {
                    formData.append('files', postData.files[i]);
                }
            }

            formData.append('whoCanSee', 'anyone');
            formData.append('whoCanComment', 'anyone');

            const response = await axios.post(
                `${BASE_URL}/companies/${companyInfo.id}/post`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true,
                }
            );

            console.log("Post creation successful:", response.data);
            const newPostFromApi = response.data.post;

            if (newPostFromApi) {
                setPosts(prevPosts => [newPostFromApi, ...prevPosts]);
            } else {
                console.warn("Post object not found in API response. Consider re-fetching posts.");
            }

            // If the modal called this function, close the modal.
            // The modal's onSubmit handler will be responsible for clearing modal-specific state.
            if (isPostModalOpen) {
                setIsPostModalOpen(false);
            }
            // Do NOT clear inline form state here. The caller (handleAttemptInlinePost) will do that.

        } catch (err) {
            console.error('Error creating post:', err);
            if (err.response) {
                console.error('Server response error data:', err.response.data);
                console.error('Server response error status:', err.response.status);
                alert(`Failed to create post: ${err.response.data.message || 'Server error'}`);
            } else if (err.request) {
                console.error('No response received from server:', err.request);
                alert('Failed to create post: No response from server. Please check your connection.');
            } else {
                console.error('Error setting up post request:', err.message);
                alert(`Failed to create post: ${err.message}`);
            }
        }
    };


    // --- Handler for the INLINE post form submission ---
    const handleAttemptInlinePost = async () => {
        if (!inlinePostText.trim() && !inlinePostAttachment) {
            alert("Please add some content or an attachment to post.");
            return;
        }

        const postDataForApi = {
            text: inlinePostText,
            files: inlinePostAttachment ? [inlinePostAttachment] : [],
        };

        await handleCreatePost(postDataForApi); // Call the generic post creation function

        // Clear the inline form fields after attempting to post
        setInlinePostText('');
        setInlinePostAttachment(null);
        if (inlineAttachmentInputRef.current) {
            inlineAttachmentInputRef.current.value = ""; // Clear the file input field visually
        }
    };


    // --- Other handlers (handleAddComment, fetchUser, etc.) ---
    const handleAddComment = async (postId, commentText, attachment = null, taggedUsers = [], parentComment = null, attachmentUrl = null) => {
        try {
            const endpoint = `${BASE_URL}/comments`;
            const formData = new FormData();
            formData.append('postId', postId);
            formData.append('commentContent', commentText);
            if (attachment) formData.append('file', attachment);
            if (attachmentUrl) formData.append('commentAttachment', attachmentUrl);
            if (taggedUsers && taggedUsers.length > 0) formData.append('taggedUsers', JSON.stringify(taggedUsers));
            if (parentComment) formData.append('parentComment', parentComment);

            const response = await axios.post(endpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                 withCredentials: true,
            });

            if (response.data && response.data.comment) {
                setComments(prev => {
                    const existingComments = prev[postId] || [];
                    if (parentComment) {
                        return {
                            ...prev,
                            [postId]: existingComments.map(comment =>
                                comment._id === parentComment
                                    ? { ...comment, replyCount: (comment.replyCount || 0) + 1, replies: [...(comment.replies || []), response.data.comment] }
                                    : comment
                            )
                        };
                    }
                    return { ...prev, [postId]: [response.data.comment, ...existingComments] };
                });
            } else {
                await fetchComments(postId);
            }

            setPosts(currentPosts => currentPosts.map(post => {
                if ((post.id === postId || post.postId === postId)) {
                    const newCommentCount = (post.commentCount || (post.metrics?.comments || 0)) + 1;
                    return {
                        ...post,
                        commentCount: newCommentCount, // Ensure this exists or is initialized
                        metrics: post.metrics ? { ...post.metrics, comments: newCommentCount } : { comments: newCommentCount }
                    };
                }
                return post;
            }));
            return response.data;
        } catch (err) {
            console.error(`Error posting comment:`, err);
            if (err.response) alert(`Failed to post comment: ${err.response.data.message || 'Server error'}`);
            else if (err.request) alert('Failed to post comment: No response from server');
            else alert(`Failed to post comment: ${err.message}`);
            throw err;
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/user/me`, { withCredentials: true });
                setUser(response.data.user);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        }
        fetchUser();
    }, []);

    const handleReactToComment = async (postId, commentId, reactionType = 'like', isRemove = false) => {
        try {
            const endpoint = `${BASE_URL}/comments/${commentId}/${reactionType.toLowerCase()}`;
            if (isRemove) await axios.delete(endpoint, { withCredentials: true });
            else await axios.post(endpoint, {}, { withCredentials: true }); // Added empty object for POST body
            fetchComments(postId);
        } catch (err) {
            console.error(`Error reacting to comment:`, err.response || err);
        }
    };

    // fetchReplies not used, can be removed or implemented if needed for threaded replies UI
    // const fetchReplies = async (commentId) => { ... };

    const handleReact = async (postId, reactionType = 'like', isRemove = false) => {
        try {
            const postIdToUse = postId.toString();
            const endpoint = `${BASE_URL}/posts/${postIdToUse}/Like`; // Assuming /Like handles various reaction types based on body
            let response;
            if (isRemove) {
                response = await axios.delete(endpoint, { withCredentials: true });
                setUserReactions(prev => { const updated = { ...prev }; delete updated[postIdToUse]; return updated; });
            } else {
                response = await axios.post(endpoint, { impressionType: reactionType.toLowerCase() }, { withCredentials: true });
                setUserReactions(prev => ({ ...prev, [postIdToUse]: reactionType }));
            }

            if (response.data) {
                if (response.data.post) { // If API returns the full updated post
                    setPosts(currentPosts => currentPosts.map((p) => (p.id === postId || p.postId === postId) ? response.data.post : p));
                } else { // Optimistic update if API only returns success/counts
                    setPosts(currentPosts => currentPosts.map(p => {
                        if (p.id === postId || p.postId === postId) {
                            const currentIsLiked = p.isLiked || (userReactions[postIdToUse] && userReactions[postIdToUse] !== null);
                            const oldReactionType = p.userReaction?.type;
                            let newMetrics = { ...(p.metrics || { likes: 0 }) };
                            let newImpressionCounts = { ...(p.impressionCounts || { total: 0 }) };

                            // Initialize reaction types if not present
                            reactionTypes.forEach(rt => {
                                newImpressionCounts[rt.type] = newImpressionCounts[rt.type] || 0;
                            });

                            if (isRemove) { // Removing current reaction
                                if (currentIsLiked && oldReactionType) {
                                    newMetrics.likes = Math.max(0, newMetrics.likes - 1);
                                    newImpressionCounts[oldReactionType] = Math.max(0, newImpressionCounts[oldReactionType] - 1);
                                    newImpressionCounts.total = Math.max(0, newImpressionCounts.total - 1);
                                }
                            } else { // Adding or changing reaction
                                if (currentIsLiked && oldReactionType && oldReactionType !== reactionType) { // Changing reaction
                                    newImpressionCounts[oldReactionType] = Math.max(0, newImpressionCounts[oldReactionType] - 1);
                                    newImpressionCounts[reactionType]++;
                                    // Total likes and metrics.likes unchanged as one reaction is swapped for another
                                } else if (!currentIsLiked) { // Adding new reaction
                                    newMetrics.likes++;
                                    newImpressionCounts[reactionType]++;
                                    newImpressionCounts.total++;
                                }
                            }
                            return { ...p, isLiked: !isRemove, userReaction: isRemove ? null : { type: reactionType }, metrics: newMetrics, impressionCounts: newImpressionCounts };
                        }
                        return p;
                    }));
                }
            }
        } catch (err) {
            console.error(`Error reacting to post:`, err.response || err);
        }
    };
    const handleHidePost = (postId) => setPosts(currentPosts => currentPosts.filter(p => (p.id || p.postId) !== postId));
    const handleSavePost = async (postId) => {
        try {
            await axios.post(`${BASE_URL}/posts/${postId}/save`, {}, { withCredentials: true });
            alert(`Post saved successfully!`);
            setPosts(currentPosts => currentPosts.map(p => ((p.id === postId || p.postId === postId) ? { ...p, isSaved: true } : p)));
        } catch (error) {
            alert('Failed to save post.');
            console.error('Error saving post:', error.response || error);
        }
    };
    const handleReportPost = async (postId) => {
        try {
            await axios.post(`${BASE_URL}/posts/${postId}/report`, { reason: 'inappropriate' }, { withCredentials: true });
            alert(`Post reported.`);
        } catch (error) {
            alert('Failed to report post.');
            console.error('Error reporting post:', error.response || error);
        }
    };

    const toggleComments = async (postId) => {
        const isExpanded = expandedComments[postId];
        setExpandedComments(prev => ({ ...prev, [postId]: !isExpanded }));
        if (!isExpanded && (!comments[postId] || comments[postId].length === 0)) { // Fetch if not expanded and no comments loaded
            await fetchComments(postId);
        }
    };

    const fetchComments = async (postId) => {
        setLoadingComments(prev => ({ ...prev, [postId]: true }));
        try {
            const response = await axios.get(`${BASE_URL}/comments/${postId}/post`, { withCredentials: true });
            setComments(prev => ({ ...prev, [postId]: response.data.comments || [] }));
        } catch (err) {
            console.error(`Error fetching comments for post ${postId}:`, err.response || err);
        } finally {
            setLoadingComments(prev => ({ ...prev, [postId]: false }));
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'some time ago';
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        if (diffInSeconds < 5) return 'Just now';
        if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        return date.toLocaleDateString();
    };

    useEffect(() => {
        if (companyInfo?.id) { // Ensure companyInfo and its id are available
            const fetchPosts = async () => {
                setLoadingPosts(true); // Set loading true at the start of fetch
                try {
                    const response = await axios.get(`${BASE_URL}/companies/${companyInfo.id}/post`, {
                        withCredentials: true,
                    });
                    setPosts(response.data.posts || []); // Ensure posts is an array
                } catch (error) {
                    console.error('Error fetching posts:', error.response || error);
                    setPosts([]); // Set to empty array on error to prevent issues with .map
                } finally {
                    setLoadingPosts(false);
                }
            };
            fetchPosts();
        } else {
            setLoadingPosts(false); // If no companyInfo.id, not loading
            setPosts([]); // And no posts
        }
    }, [companyInfo?.id]); // Depend on companyInfo.id

    // --- JSX Rendering ---
    if (loadingPoasts) { // Typo: loadingPoasts
        return (
            <div className="mt-4 bg-white justify-center flex w-full rounded-lg shadow-lg p-4">
                <h1 className="text-2xl">Loading Posts....</h1>
            </div>
        );
    }

    // Inline Post Creation Area (this will be shown if no posts, or always at the top)
    const inlinePostCreationArea = (
        <div className="overflow-hidden text-center mb-2 bg-white rounded-md border-none shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_0_0_rgba(0,0,0,0.20)]">
            <div className="flex flex-col text-[#958b7b] bg-white">
                <div className="flex items-start p-3">
                    <img
                        src={companyInfo?.logo || "/Images/CompanyLogo.png"} // Added optional chaining for companyInfo
                        alt="company logo"
                        className="w-12 h-12 rounded-full mr-3 shrink-0"
                    />
                    <div className="flex-grow">
                        <textarea
                            value={inlinePostText}
                            onChange={(e) => setInlinePostText(e.target.value)}
                            placeholder={`What's on your mind, ${companyInfo?.name || 'Company'}?`} // Optional chaining
                            className="w-full p-2 border border-[rgba(0,0,0,0.15)] rounded-md resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                            rows="3"
                        ></textarea>
                        <div className="flex items-center justify-between mt-2">
                            <div>
                                <label
                                    htmlFor="inlineAttachmentInput"
                                    className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 py-1 px-2 rounded-md hover:bg-gray-100 transition-colors inline-flex items-center"
                                >
                                     <img src="/Images/photo-icon.svg" alt="attach" className="w-4 h-4 inline mr-1" />
                                    {inlinePostAttachment ? inlinePostAttachment.name.substring(0,20) + (inlinePostAttachment.name.length > 20 ? "..." : "") : "Attach"}
                                </label>
                                <input
                                    type="file"
                                    id="inlineAttachmentInput"
                                    className="hidden"
                                    onChange={handleInlineFileChange}
                                    ref={inlineAttachmentInputRef}
                                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.ppt,.pptx,.txt,.zip,.rar,.7z"
                                />
                            </div>
                            <button
                                onClick={handleAttemptInlinePost} // CORRECTED: Call the intermediary handler
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2 px-3 rounded-full transition-colors"
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
                {/* Optional: Modal trigger buttons can be here if desired, or removed if inline is primary */}
                {/* <hr className="my-2" /> ... modal trigger buttons ... */}
            </div>
        </div>
    );


    if (posts.length === 0) {
        return (
            <div className="w-full mt-4"> {/* Added mt-4 for consistency */}
                <div className='grid-area-main'>
                    {companyInfo && user && inlinePostCreationArea} {/* Show create area if user and company info exists */}
                    <h1 className="text-2xl flex justify-center mt-4 p-4 bg-white rounded-lg shadow-lg">No Posts Yet. Be the first to share!</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-4 flex flex-col justify-center w-full rounded-lg">
            <div className='grid-area-main'>
                {companyInfo && user && inlinePostCreationArea} {/* Show create area if user and company info exists */}

                {posts.map((post) => {
                    // Normalize post data access
                    const postId = post.postId || post.id; // Prefer postId from backend response, fallback to id
                    if (!postId) {
                        console.warn("Post missing ID, skipping render:", post);
                        return null; // Don't render post without an ID
                    }
                    // Determine author details (could be company or an individual user who posted if API supports it)
                    const authorName = post.companyId?.name || `${post.firstName || ''} ${post.lastName || ''}`.trim() || 'Unknown Author';
                    const authorLogo = post.companyId?.logo || post.author?.profilePictureUrl || "/Images/CompanyLogo.png";
                    const authorHeadline = post.author?.headline || post.companyId?.tagline || post.headline || ''; // post.headline for older posts
                    const postDescription = post.postDescription || post.content?.text || post.description || ""; // Use postDescription from API
                    const displayAttachments = post.attachments  || []; // Use attachments from API

                    return (
                        <article key={postId} className="overflow-visible p-0 mb-2 bg-white rounded-md border-none shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_0_0_rgba(0,0,0,0.20)]">
                            <div className="p-3 pr-10 pb-0 flex justify-between items-start relative">
                                <a href={post.companyId ? `/company/${post.companyId.id}` : (post.author ? `/profile/${post.author.id}` : "#")} className="overflow-hidden flex mr-2">
                                    <img
                                        src={authorLogo}
                                        alt={authorName}
                                        className="w-12 h-12 rounded-full mr-2.5"
                                    />
                                    <div className="text-start">
                                        <h6 className="text-base text-black font-semibold">{authorName}</h6>
                                        <span className="text-sm text-[rgba(0,0,0,0.6)] block">{authorHeadline}</span>
                                        <span className="text-sm text-[rgba(0,0,0,0.6)] block">{formatDate(post.createdAt || post.timestamp)}</span>
                                    </div>
                                </a>
                                <PostMenu
                                    postId={postId}
                                    onHide={() => handleHidePost(postId)}
                                    onSave={() => handleSavePost(postId)}
                                    onReport={() => handleReportPost(postId)}
                                    isSaved={post.isSaved}
                                />
                            </div>
                            <div className="text-base text-start p-0 mt-2 px-4 text-[rgba(0,0,0,0.9)] overflow-hidden break-words whitespace-pre-wrap">
                                {postDescription}
                            </div>

                            {(displayAttachments.length > 0) && (
                                <div className="w-full relative bg-[#f9fafb] mt-2 p-2">
                                    {/* Simple display for now, could be a carousel for multiple files */}
                                    {displayAttachments.map((att, index) => (
                                        <div key={index} className="aspect-video relative overflow-hidden mb-1 last:mb-0"> {/* Changed to aspect-video */}
                                             {att.type && att.type.startsWith('video/') ? (
                                                <video controls src={att.url} className="absolute inset-0 w-full h-full object-contain" />
                                            ) : (
                                                <img
                                                    src={att}
                                                    alt={att.alt || `Attachment ${index + 1}`}
                                                    className="absolute inset-0 w-full h-full object-contain" // object-contain is often better
                                                    loading="lazy"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <ul className="flex justify-between mx-4 p-2 border-b border-[#e9e5df] text-sm overflow-auto">
                                <li className="flex items-center cursor-pointer hover:text-[#0a66c2] hover:underline">
                                    <div className="flex items-center">
                                        {(post.impressionCounts && Object.values(post.impressionCounts).some(val => val > 0)) && (
                                            <div className="flex -space-x-1 mr-1">
                                                {reactionTypes.map(rt => post.impressionCounts[rt.type] > 0 && (
                                                    <span key={rt.type} className="inline-block w-4 h-4 text-xs">{rt.emoji}</span>
                                                ))}
                                            </div>
                                        )}
                                        <span>{post.impressionCounts?.total || post.metrics?.likes || 0}</span>
                                    </div>
                                </li>
                                <li
                                    className="flex items-center cursor-pointer hover:text-[#0a66c2] hover:underline"
                                    onClick={() => toggleComments(postId)}
                                >
                                    <p>{post.commentCount || post.metrics?.comments || 0} comments</p>
                                </li>
                                {(post.repostCount > 0) && (
                                    <li className="flex items-center cursor-pointer hover:text-[#0a66c2] hover:underline">
                                        <p>{post.repostCount} reposts</p>
                                    </li>
                                )}
                            </ul>

                            <div className="p-0 px-2 sm:px-4 flex justify-around sm:justify-between min-h-[40px] overflow-hidden flex-wrap">
                                <PostReactions
                                    postId={postId}
                                    onReact={handleReact}
                                    reactionTypes={reactionTypes}
                                    isLiked={post.isLiked || (userReactions[postId] ? true : false)}
                                    currentReaction={userReactions[postId] || post.userReaction?.type || 'like'}
                                />
                                <button onClick={() => toggleComments(postId)} className="outline-none text-[rgba(0,0,0,0.6)] p-2 sm:p-3 sm:px-4 md:px-6 bg-transparent flex items-center cursor-pointer gap-1.25 rounded-md transition duration-200 hover:bg-[rgba(0,0,0,0.08)] font-semibold text-xs sm:text-sm">
                                    <img src="/Images/comment.svg" alt="comment" className="w-4 h-4 sm:w-auto sm:h-auto" />
                                    <span>Comment</span>
                                </button>
                                <button className="outline-none text-[rgba(0,0,0,0.6)] p-2 sm:p-3 sm:px-4 md:px-6 bg-transparent flex items-center cursor-pointer gap-1.25 rounded-md transition duration-200 hover:bg-[rgba(0,0,0,0.08)] font-semibold text-xs sm:text-sm">
                                    <img src="/Images/share.svg" alt="share" className="w-4 h-4 sm:w-auto sm:h-auto"/>
                                    <span>Share</span>
                                </button>
                                <button className="outline-none text-[rgba(0,0,0,0.6)] p-2 sm:p-3 sm:px-4 md:px-6 bg-transparent flex items-center cursor-pointer gap-1.25 rounded-md transition duration-200 hover:bg-[rgba(0,0,0,0.08)] font-semibold text-xs sm:text-sm">
                                    <img src="/Images/send.svg" alt="send" className="w-4 h-4 sm:w-auto sm:h-auto"/>
                                    <span>Send</span>
                                </button>
                            </div>

                            {expandedComments[postId] && (
                                <div className="border-t border-[#e9e5df] p-4">
                                    {loadingComments[postId] ? (
                                        <div className="text-center py-4">Loading comments...</div>
                                    ) : (
                                        <CommentSection
                                            postId={postId}
                                            comments={comments[postId] || []}
                                            authorInfo={user}
                                            onAddComment={handleAddComment}
                                            onReactToComment={(commentId, reactionType, isRemove) => handleReactToComment(postId, commentId, reactionType, isRemove)}
                                            reactionTypes={reactionTypes}
                                            formatDate={formatDate}
                                        />
                                    )}
                                </div>
                            )}
                        </article>
                    )
                })}
                 <CreatePostModal
                    isOpen={isPostModalOpen}
                    onClose={() => setIsPostModalOpen(false)}
                    onSubmit={handleCreatePost} // Modal will pass its own postData object
                    authorInfo={user} // Or companyInfo depending on who is seen as author in modal
                />
            </div>
        </div>
    );
}
export default CompanyFeedPage;