import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostMenu from './PostMenu.jsx';
import CreatePostModal from './PostCreation.jsx';
import PostReactions from './PostReactions.jsx';
import CommentSection from './CommentSection.jsx';
import { BASE_URL } from "../constants";

// Set axios defaults to include credentials with all requests
axios.defaults.withCredentials = true;

const Main = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postContent, setPostContent] = useState('');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [userReactions, setUserReactions] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [comments, setComments] = useState({});
  const [loadingComments, setLoadingComments] = useState({});
  
  // Use exact API endpoint as specified
  const API_ENDPOINT = `${BASE_URL}/posts`;
  const COMMENTS_ENDPOINT = `${BASE_URL}/comments`;
  
  // Available reaction types
  const reactionTypes = [
    { type: 'like', emoji: '👍', label: 'Like' },
    { type: 'celebrate', emoji: '👏', label: 'Celebrate' },
    { type: 'support', emoji: '❤️', label: 'Support' },
    { type: 'insightful', emoji: '💡', label: 'Insightful' },
    { type: 'funny', emoji: '😄', label: 'Funny' }
  ];
  
  // Author information (normally would come from your auth system)
  const authorInfo = {
    id: "user456",
    name: "Hamsa Saber",
    headline: "Software Engineer at Tech Company",
    profileImage: "https://picsum.photos/80?random=1",
  };

  // Define fetchUser and fetchNotifications functions
  const fetchUser = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/profile`, { withCredentials: true });
      console.log("User data:", response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/notifications`, { withCredentials: true });
      console.log("Notifications:", response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  
  // Fetch posts function
  const fetchPosts = async () => {
    try {
      console.log("Attempting to fetch posts...");
      const response = await axios.get(API_ENDPOINT, { withCredentials: true });
      console.log("Response received:", response);
      
      // Handle the data based on structure
      let postsData = response.data;
      
      // Check if response has posts property (from the JSON example you provided)
      if (response.data && response.data.posts) {
        postsData = response.data.posts;
        console.log("Pagination info:", response.data.pagination);
      }
      
      console.log("Posts data:", postsData);
      setPosts(postsData);
      
      // Initialize user reactions from posts data
      const initialReactions = {};
      postsData.forEach(post => {
        const postId = post.id || post.postId;
        if (post.userReaction) {
          initialReactions[postId] = post.userReaction.type;
        } else if (post.isLiked) {
          initialReactions[postId] = post.isLiked.type;
          console.log(post.isLiked.type);
        }
      });
      setUserReactions(initialReactions);
      
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch comments for a specific post
  const fetchComments = async (postId) => {
    try {
      setLoadingComments(prev => ({ ...prev, [postId]: true }));
      
      const endpoint = `${COMMENTS_ENDPOINT}/${postId}/post`;
      console.log(`Fetching comments for post ${postId} from ${endpoint}`);
      
      const response = await axios.get(endpoint);
      console.log(`Comments response for post ${postId}:`, response.data);
      
      if (response.data && response.data.comments) {
        setComments(prev => ({
          ...prev,
          [postId]: response.data.comments
        }));
      }
    } catch (err) {
      console.error(`Error fetching comments for post ${postId}:`, err);
      
      if (err.response) {
        console.error('Comments error response:', err.response.data);
        console.error('Status code:', err.response.status);
      }
    } finally {
      setLoadingComments(prev => ({ ...prev, [postId]: false }));
    }
  };
  
  // Toggle comments display for a post
  const toggleComments = async (postId) => {
    const isExpanded = expandedComments[postId];
    
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !isExpanded
    }));
    
    // If expanding comments and we don't have them yet, fetch them
    if (!isExpanded && !comments[postId]) {
      await fetchComments(postId);
    }
  };
  
  // Add a new comment to a post with all API parameters
  const handleAddComment = async (postId, commentText, attachment = null, taggedUsers = [], parentComment = null, attachmentUrl = null) => {
    try {
      const endpoint = `${COMMENTS_ENDPOINT}/${postId}/post`;
      console.log(`Posting comment to ${endpoint}:`, commentText);
      
      // Use FormData to support file uploads
      const formData = new FormData();
      
      // Required parameters
      formData.append('postId', postId);
      formData.append('commentContent', commentText);
      
      // Add attachment file if provided (using 'file' as the field name per API spec)
      if (attachment) {
        formData.append('file', attachment);
      }
      
      // Add attachment URL if provided
      if (attachmentUrl) {
        formData.append('commentAttachment', attachmentUrl);
      }
      
      // Add tagged users if any
      if (taggedUsers && taggedUsers.length > 0) {
        formData.append('taggedUsers', JSON.stringify(taggedUsers));
      }
      
      // Add parent comment ID for replies
      if (parentComment) {
        formData.append('parentComment', parentComment);
      }
      
      // Log what we're sending
      console.log("Sending comment:");
      console.log("- Post ID:", postId);
      console.log("- Content:", commentText);
      console.log("- File attachment:", attachment ? "Yes" : "No");
      console.log("- URL attachment:", attachmentUrl);
      console.log("- Tagged users:", taggedUsers.length > 0 ? taggedUsers : "None");
      console.log("- Parent comment:", parentComment || "None (top-level comment)");
      
      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log(`Comment posted successfully:`, response.data);
      
      // If we receive the comment in the response, add it to our comment list
      if (response.data && response.data.comment) {
        setComments(prev => {
          const existingComments = prev[postId] || [];
          
          // If it's a reply and we're showing replies, handle accordingly
          if (parentComment) {
            // Find parent comment and increment its reply count
            return {
              ...prev,
              [postId]: existingComments.map(comment => 
                comment._id === parentComment 
                  ? {
                      ...comment, 
                      replyCount: (comment.replyCount || 0) + 1,
                      // If we're tracking replies in-memory, could add to replies array too
                      replies: [...(comment.replies || []), response.data.comment]
                    }
                  : comment
              )
            };
          }
          
          // For top-level comments, add to the beginning of the array
          return {
            ...prev,
            [postId]: [response.data.comment, ...existingComments]
          };
        });
      } else {
        // If API doesn't return the comment object, just refresh comments
        await fetchComments(postId);
      }
      
      // Update comment count in posts
      setPosts(posts.map(post => {
        if ((post.id === postId || post.postId === postId)) {
          return {
            ...post,
            commentCount: (post.commentCount || 0) + 1,
            metrics: post.metrics ? {
              ...post.metrics,
              comments: (post.metrics.comments || 0) + 1
            } : undefined
          };
        }
        return post;
      }));
      
      return response.data;
      
    } catch (err) {
      console.error(`Error posting comment:`, err);
      
      //error handling
      if (err.response) {
        console.error('Comment error response:', err.response.data);
        console.error('Status code:', err.response.status);
        alert(`Failed to post comment: ${err.response.data.message || 'Server error'}`);
      } else if (err.request) {
        console.error('No response received:', err.request);
        alert('Failed to post comment: No response from server');
      } else {
        console.error('Error setting up request:', err.message);
        alert(`Failed to post comment: ${err.message}`);
      }
      throw err;
    }
  };


  
  // Handle reacting to a comment
  const handleReactToComment = async (postId, commentId, reactionType = 'like', isRemove = false) => {
    try {
      const endpoint = `${COMMENTS_ENDPOINT}/${commentId}/${reactionType.toLowerCase()}`;
      console.log(`${isRemove ? 'Removing' : 'Sending'} ${reactionType} reaction to comment ${commentId}`);
      
      let response;
      
      if (isRemove) {
        response = await axios.delete(endpoint);
      } else {
        response = await axios.post(endpoint);
      }
      
      console.log(`Comment reaction response:`, response.data);
      
      // Refresh comments for this post to get updated reaction counts
      fetchComments(postId);
      
    } catch (err) {
      console.error(`Error reacting to comment:`, err);
      
      if (err.response) {
        console.error('Comment reaction error:', err.response.data);
        console.error('Status code:', err.response.status);
      }
    }
  };
  
  // Fetch data when component mounts
  useEffect(() => {
    const initializeData = async () => {
      try {
        
        // Then fetch other data
        await Promise.all([
          fetchUser(),
          fetchNotifications(),
          fetchPosts()
        ]);
      } catch (error) {
        console.error("Error during initialization:", error);
        setError('Authentication failed. Please try again later.');
        setLoading(false);
      }
    };
    
    initializeData();
  }, []);
  
  // Handle creating a new post
  const handleCreatePost = async (postData) => {
    try {
      console.log("Creating post with data:", postData);
      
      // Create FormData for proper multipart/form-data encoding
      const formData = new FormData();
      
      // Add description (required)
      formData.append('description', postData.text);
      
      // Add attachments if any
      if (postData.files && postData.files.length > 0) {
        for (let i = 0; i < postData.files.length; i++) {
          formData.append('files', postData.files[i]);
        }
      }
      
      // Add privacy settings
      formData.append('whoCanSee', 'anyone');
      formData.append('whoCanComment', 'anyone');
      
      // Log form data for debugging
      console.log("Sending post with description:", postData.text);
      console.log("Number of files:", postData.files ? postData.files.length : 0);
      
      const response = await axios.post(API_ENDPOINT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log("Post creation successful:", response.data);
      
      // Check response structure
      const newPost = response.data.post || response.data;
      setPosts([newPost, ...posts]);
      
    } catch (err) {
      console.error('Error creating post:', err);
      
      if (err.response) {
        // The request was made but server responded with error
        console.error('Server response:', err.response.data);
        console.error('Status code:', err.response.status);
        alert(`Failed to create post: ${err.response.data.message || 'Server error'}`);
      } else if (err.request) {
        // Request was made but no response received
        console.error('No response received:', err.request);
        alert('Failed to create post: No response from server');
      } else {
        // Error setting up request
        alert(`Failed to create post: ${err.message}`);
      }
    }
  };
  
  // Handle reacting to a post - Updated to handle both liking and unliking with reaction types
  const handleReact = async (postId, reactionType = 'like', isRemove = false) => {
    try {
      const postIdToUse = postId.toString();
      const endpoint = `${API_ENDPOINT}/${postIdToUse}/Like`;
      console.log(`${isRemove ? 'Removing' : 'Sending'} ${reactionType} reaction to: ${endpoint}`);
      
      let response;
      
      if (isRemove) {
        // Remove the reaction using DELETE method
        response = await axios.delete(endpoint);
        console.log(`Reaction removed response:`, response.data);
        
        // Update user reactions state to remove the reaction
        setUserReactions(prev => {
          const updated = { ...prev };
          delete updated[postIdToUse];
          return updated;
        });
        
      } else {
        // Add the reaction using POST method
        response = await axios.post(endpoint, {
          impressionType: reactionType.toLowerCase()
        });
        console.log(`Reaction added response:`, response.data);
        
        // Update user reactions state to track the reaction type
        setUserReactions(prev => ({
          ...prev,
          [postIdToUse]: reactionType
        }));
      }
      
      // Update the post in the UI
      if (response.data) {
        // If the API returns the updated post
        if (response.data.post) {
          setPosts(
            posts.map((post) => (post.id === postId || post.postId === postId) ? response.data.post : post)
          );
        } else {
          // If API just returns success but not the updated post, update locally
          setPosts(
            posts.map((post) => {
              if (post.id === postId || post.postId === postId) {
                // Simple if-check for metrics update
                let likeDelta = 0;
                if (!isRemove && !post.isLiked) {
                  likeDelta = 1; // Add a like if not already liked
                } else if (isRemove && post.isLiked) {
                  likeDelta = -1; // Remove a like if already liked
                }
                
                return { 
                  ...post, 
                  isLiked: !isRemove,
                  userReaction: isRemove ? null : { type: reactionType },
                  // Use the delta only if needed
                  metrics: post.metrics ? {
                    ...post.metrics,
                    likes: post.metrics.likes + likeDelta
                  } : undefined,
                  impressionCounts: post.impressionCounts ? {
                    ...post.impressionCounts,
                    total: post.impressionCounts.total + likeDelta,
                    [reactionType.toLowerCase()]: (post.impressionCounts[reactionType.toLowerCase()] || 0) + likeDelta
                  } : undefined
                };
              }
              return post;
            })
          );
        }
      }
    } catch (err) {
      console.error(`Error ${isRemove ? 'removing' : 'adding'} ${reactionType} reaction:`, err);
      
      if (err.response) {
        console.error('Reaction error response:', err.response.data);
        console.error('Status code:', err.response.status);
      }
    }
  };
  
  // Handle PostMenu actions
  const handleHidePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId && post.postId !== postId));
  };

  const handleSavePost = async (postId) => {
    try {
      await axios.post(`${API_ENDPOINT}/${postId}/save`);
      console.log(`Post ${postId} saved`);
      alert(`Post saved successfully!`);
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post. Please try again.');
    }
  };

  const handleReportPost = async (postId) => {
    try {
      await axios.post(`${API_ENDPOINT}/${postId}/report`, {
        reason: 'inappropriate'
      });
      console.log(`Post ${postId} reported`);
      alert(`Post reported. Thank you for helping keep LinkedIn safe.`);
    } catch (error) {
      console.error('Error reporting post:', error);
      alert('Failed to report post. Please try again.');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) return (
    <div className="bg-[#f3f2ef] min-h-screen">
      <div className="grid-area-main">Loading posts...</div>
    </div>
  );
  
  if (error) return (
    <div className="bg-[#f3f2ef] min-h-screen">
      <div className="grid-area-main">{error}</div>
    </div>
  );

  return (
    <div className="bg-[#f3f2ef] min-h-screen pb-8">
      <div className="grid-area-main">
        {/* Create Post Form */}
        <div className="overflow-hidden text-center mb-2 bg-white rounded-md border-none shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_0_0_rgba(0,0,0,0.20)]">
          <div className="flex flex-col text-[#958b7b] mb-2 bg-white">
            <div className="flex items-center p-2 pl-4 pr-4">
              <img
                src={authorInfo.profileImage}
                alt="user"
                className="w-12 h-12 rounded-full mr-2"
              />
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="text-[rgba(0,0,0,0.6)] outline-none min-h-[48px] leading-1.5 text-sm font-semibold flex items-center p-2 pl-4 flex-grow border border-[rgba(0,0,0,0.15)] rounded-[35px] cursor-pointer hover:bg-[rgba(0,0,0,0.08)] text-left"
              >
                Start a post
              </button>
            </div>

            <div className="flex justify-around flex-wrap p-1 pb-1">
              <button 
                onClick={() => setIsPostModalOpen(true)}
                className="text-[rgba(0,0,0,0.6)] outline-none border-none bg-transparent min-h-[48px] leading-1.5 text-sm font-semibold flex items-center transition duration-200 p-2 hover:bg-[rgba(0,0,0,0.08)] rounded-md"
              >
                <img src="/Images/photo-icon.svg" alt="pic" className="mr-2.5 ml-[-0.5rem]" />
                <span>Photo</span>
              </button>
              <button 
                onClick={() => setIsPostModalOpen(true)}
                className="text-[rgba(0,0,0,0.6)] outline-none border-none bg-transparent min-h-[48px] leading-1.5 text-sm font-semibold flex items-center transition duration-200 p-2 hover:bg-[rgba(0,0,0,0.08)] rounded-md"
              >
                <img src="/Images/vedio-icon.svg" alt="vedio" className="mr-2.5 ml-[-0.5rem]" />
                <span>Video</span>
              </button>
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="text-[rgba(0,0,0,0.6)] outline-none border-none bg-transparent min-h-[48px] leading-1.5 text-sm font-semibold flex items-center transition duration-200 p-2 hover:bg-[rgba(0,0,0,0.08)] rounded-md"
              >
                <img src="/Images/job-icon.svg" alt="job" className="mr-2.5 ml-[-0.5rem]" />
                <span>Job</span>
              </button>
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="text-[rgba(0,0,0,0.6)] outline-none border-none bg-transparent min-h-[48px] leading-1.5 text-sm font-semibold flex items-center transition duration-200 p-2 hover:bg-[rgba(0,0,0,0.08)] rounded-md"
              >
                <img src="/Images/article-icon.svg" alt="article" className="mr-2.5 ml-[-0.5rem]" />
                <span>Write article</span>
              </button>
            </div>
          </div>
        </div>

        {/* Post List */}
        {posts.map((post) => (
          <article key={post.id || post.postId} className="overflow-visible p-0 mb-2 bg-white rounded-md border-none shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_0_0_rgba(0,0,0,0.20)]">
            <div className="p-3 pr-10 pb-0 flex justify-between items-start relative">
              <a href="/feed" className="overflow-hidden flex">
                <img 
                  src={post.author?.profileImage || post.profilePicture} 
                  alt="user" 
                  className="w-12 h-12 rounded-full mr-2.5" 
                />
                <div className="text-start">
                  <h6 className="text-base text-black font-semibold">
                    {post.author?.name || `${post.firstName} ${post.lastName}`}
                  </h6>
                  <span className="text-sm text-[rgba(0,0,0,0.6)] block">
                    {post.author?.headline || post.headline}
                  </span>
                  <span className="text-sm text-[rgba(0,0,0,0.6)] block">
                    {formatDate(post.timestamp || post.createdAt)}
                  </span>
                </div>
              </a>
              
              <PostMenu
                postId={post.id || post.postId}
                onHide={handleHidePost}
                onSave={handleSavePost}
                onReport={handleReportPost}
                isSaved={post.isSaved}
              />
            </div>
            <div className="text-base text-start p-0 pl-4 pr-4 text-[rgba(0,0,0,0.9)] overflow-hidden">
              {post.content?.text || post.postDescription}
            </div>
            
            {/* Handle different media formats */}
            {(post.content?.files && post.content.files.length > 0) && (
              <div className="w-full relative bg-[#f9fafb] mt-2">
                <div className="aspect-[16/9] relative overflow-hidden">
                  <img 
                    src={post.content.files[0].url} 
                    alt={post.content.files[0].alt || "Post image"} 
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
            
            {(post.attachments && post.attachments.length > 0) && (
              <div className="w-full relative bg-[#f9fafb] mt-2">
                <div className="aspect-[16/9] relative overflow-hidden">
                  <img 
                    src={post.attachments[0]} 
                    alt="Post attachment" 
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
            
            {/* Updated metrics section with reaction emojis */}
            <ul className="flex justify-between mx-4 p-2 border-b border-[#e9e5df] text-sm overflow-auto">
              <li className="flex items-center cursor-pointer hover:text-[#0a66c2] hover:underline">
                <div className="flex items-center">
                  {/* Handle different reaction formats */}
                  {post.reactions && post.reactions.length > 0 && (
                    <div className="flex -space-x-1 mr-1">
                      {post.reactions.slice(0, 3).map((reaction, index) => (
                        <span key={index} className="inline-block w-4 h-4 text-xs">
                          {reaction.type === 'like' && '👍'}
                          {reaction.type === 'celebrate' && '👏'}
                          {reaction.type === 'support' && '❤️'}
                          {reaction.type === 'insightful' && '💡'}
                          {reaction.type === 'funny' && '😄'}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Handle impression counts format */}
                  {post.impressionCounts && (
                    <div className="flex -space-x-1 mr-1">
                      {post.impressionCounts.like > 0 && <span className="inline-block w-4 h-4 text-xs">👍</span>}
                      {post.impressionCounts.celebrate > 0 && <span className="inline-block w-4 h-4 text-xs">👏</span>}
                      {post.impressionCounts.support > 0 && <span className="inline-block w-4 h-4 text-xs">❤️</span>}
                      {post.impressionCounts.insightful > 0 && <span className="inline-block w-4 h-4 text-xs">💡</span>}
                      {post.impressionCounts.funny > 0 && <span className="inline-block w-4 h-4 text-xs">😄</span>}
                    </div>
                  )}
                  
                  {/* Display count based on available data */}
                  <span>
                    {post.metrics?.likes || post.impressionCounts?.total || 0}
                  </span>
                </div>
              </li>
              <li 
                className="flex items-center cursor-pointer hover:text-[#0a66c2] hover:underline"
                onClick={() => toggleComments(post.id || post.postId)}
              >
                <p>{post.metrics?.comments || post.commentCount || 0} comments</p>
              </li>
              
              {/* Show reposts if available */}
              {(post.repostCount > 0) && (
                <li className="flex items-center cursor-pointer hover:text-[#0a66c2] hover:underline">
                  <p>{post.repostCount} reposts</p>
                </li>
              )}
            </ul>
            
            {/* Updated post action buttons with PostReactions component */}
            <div className="p-0 px-4 flex justify-between min-h-[40px] overflow-hidden">
              <PostReactions 
                postId={post.id || post.postId}
                onReact={handleReact}
                reactionTypes={reactionTypes}
                isLiked={post.isLiked ? true : false}
                currentReaction={
                  userReactions[post.id || post.postId] || 
                  (post.userReaction ? post.userReaction.type : 'like')
                }
              />
              
              <button 
                onClick={() => toggleComments(post.id || post.postId)}
                className="outline-none text-[rgba(0,0,0,0.6)] p-3 px-6 bg-transparent flex items-center cursor-pointer gap-1.25 rounded-md transition duration-200 hover:bg-[rgba(0,0,0,0.08)] font-semibold"
              >
                <img src="/Images/comment.svg" alt="comment" />
                <span>Comment</span>
              </button>
              <button className="outline-none text-[rgba(0,0,0,0.6)] p-3 px-6 bg-transparent flex items-center cursor-pointer gap-1.25 rounded-md transition duration-200 hover:bg-[rgba(0,0,0,0.08)] font-semibold">
                <img src="/Images/share.svg" alt="share" />
                <span>Share</span>
              </button>
              <button className="outline-none text-[rgba(0,0,0,0.6)] p-3 px-6 bg-transparent flex items-center cursor-pointer gap-1.25 rounded-md transition duration-200 hover:bg-[rgba(0,0,0,0.08)] font-semibold">
                <img src="/Images/send.svg" alt="send" />
                <span>Send</span>
              </button>
            </div>
            
            {/* Comment Section - Only show when expanded */}
            {expandedComments[post.id || post.postId] && (
              <div className="border-t border-[#e9e5df] p-4">
                {loadingComments[post.id || post.postId] ? (
                  <div className="text-center py-4">Loading comments...</div>
                ) : (
                  <CommentSection 
                    postId={post.id || post.postId}
                    comments={comments[post.id || post.postId] || []}
                    authorInfo={authorInfo}
                    onAddComment={handleAddComment}
                    onReactToComment={(commentId, reactionType, isRemove) => 
                      handleReactToComment(post.id || post.postId, commentId, reactionType, isRemove)
                    }
                    reactionTypes={reactionTypes}
                    formatDate={formatDate}
                  />
                )}
              </div>
            )}
          </article>
        ))}
      </div>
      
      {/* Post Creation Modal */}
      <CreatePostModal 
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onSubmit={handleCreatePost}
        authorInfo={authorInfo}
      />
    </div>
  );
};

export default Main;