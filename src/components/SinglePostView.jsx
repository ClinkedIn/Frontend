import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import PostMenu from './PostMenu';
import PostReactions from './PostReactions';
import CommentSection from './CommentSection';
import { BASE_URL } from '../constants';

/**
 * Component to display a single post based on a post ID with styling
 * that exactly matches the feed rendering
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} props.postId - The ID of the post to display
 * @returns {JSX.Element} SinglePostView component
 */
const SinglePostView = ({ postId }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedComments, setExpandedComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [userReaction, setUserReaction] = useState(null);
  
  const API_ENDPOINT = `${BASE_URL}/posts`;
  const reactionTypes = ['like', 'support', 'celebrate', 'love', 'insightful', 'funny'];

  /**
   * Fetches the post data from the API
   */
  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_ENDPOINT}/${postId}`, {
        withCredentials: true
      });
      
      // Check if the API returns post directly or wrapped in a property
      const postData = response.data.post || response.data;
      setPost(postData);
      
      // Set initial user reaction if available
      if (postData.userReaction) {
        setUserReaction(postData.userReaction.type || 'like');
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching post:', err);
      setError('Failed to load post. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetches comments for this post
   */
  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const response = await axios.get(`${API_ENDPOINT}/${postId}/comments`, {
        withCredentials: true
      });
      
      setComments(response.data.comments || []);
    } catch (err) {
      console.error(`Error fetching comments for post ${postId}:`, err);
    } finally {
      setLoadingComments(false);
    }
  };

  // Fetch post when component mounts or postId changes
  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  /**
   * Formats the post creation date
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted time ago string
   */
  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return 'some time ago';
    }
  };

  /**
   * Toggles the visibility of comments
   */
  const toggleComments = async () => {
    if (!expandedComments && !comments.length) {
      await fetchComments();
    }
    setExpandedComments(!expandedComments);
  };

  /**
   * Handles user reaction to post
   */
  const handleReact = async (postId, reactionType, isRemove = false) => {
    try {
      if (isRemove) {
        await axios.delete(`${API_ENDPOINT}/${postId}/like`);
        setUserReaction(null);
      } else {
        await axios.post(`${API_ENDPOINT}/${postId}/like`, { impressionType: reactionType });
        setUserReaction(reactionType);
      }
      
      // Refresh post to get updated counts
      fetchPost();
    } catch (err) {
      console.error(`Error ${isRemove ? 'removing' : 'adding'} ${reactionType} reaction:`, err);
    }
  };
  
  /**
   * Handles adding a comment to the post
   */
  const handleAddComment = async (postId, commentText, attachment = null) => {
    try {
      const formData = new FormData();
      formData.append('text', commentText);
      
      if (attachment) {
        formData.append('files', attachment);
      }
      
      await axios.post(`${API_ENDPOINT}/${postId}/comments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Refresh comments
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  
  /**
   * Handles post menu actions
   */
  const handleHidePost = () => {
    // Just hide locally in this case
    setPost(null);
  };
  
  const handleSavePost = async () => {
    try {
      await axios.post(`${API_ENDPOINT}/${postId}/save`);
      alert('Post saved successfully!');
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post. Please try again.');
    }
  };
  
  const handleReportPost = async () => {
    try {
      const reason = prompt('Please provide a reason for reporting this post:');
      if (!reason) return;
      
      await axios.post(`${API_ENDPOINT}/${postId}/report`, {
        policy: reason
      });
      alert('Post reported. Thank you for helping keep our community safe.');
    } catch (error) {
      console.error('Error reporting post:', error);
      alert('Failed to report post. Please try again.');
    }
  };
  
  const handleDeletePost = async () => {
    try {
      if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
        return false;
      }
      
      await axios.delete(`${API_ENDPOINT}/${postId}`);
      setPost(null);
      alert('Post deleted successfully.');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  // Display loading state
  if (loading) {
    return (
      <div className="overflow-visible p-0 mb-2 bg-white rounded-md border-none shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_0_0_rgba(0,0,0,0.20)] animate-pulse">
        <div className="p-3 flex">
          <div className="w-12 h-12 bg-gray-200 rounded-full mr-2.5"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
        <div className="px-4 py-2">
          <div className="h-4 bg-gray-200 rounded mb-3"></div>
          <div className="h-4 bg-gray-200 rounded mb-3 w-11/12"></div>
        </div>
        <div className="aspect-[16/9] bg-gray-200"></div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="overflow-visible p-4 mb-2 bg-white rounded-md border-none shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_0_0_rgba(0,0,0,0.20)]">
        <div className="text-red-500 text-center">
          <p className="font-semibold mb-2">Error Loading Post</p>
          <p>{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={fetchPost}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Display empty state
  if (!post) {
    return (
      <div className="overflow-visible p-4 mb-2 bg-white rounded-md border-none shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_0_0_rgba(0,0,0,0.20)]">
        <div className="text-gray-500 text-center">
          <p>Post not found</p>
        </div>
      </div>
    );
  }

  // Main post render - matching feed styling exactly
  return (
    <article className="overflow-visible p-0 mb-2 bg-white rounded-md border-none shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_0_0_rgba(0,0,0,0.20)]">
      <div className="p-3 pr-10 pb-0 flex justify-between items-start relative">
        <a href={`/profile/${post.userId}`} className="overflow-hidden flex">
          <img 
            src={post.profilePicture || "/Images/user.svg"} 
            alt="user" 
            className="w-12 h-12 rounded-full mr-2.5" 
          />
          <div className="text-start">
            <h6 className="text-base text-black font-semibold">
              {`${post.firstName || ''} ${post.lastName || ''}`}
            </h6>
            <span className="text-sm text-[rgba(0,0,0,0.6)] block">
              {post.headline || ''}
            </span>
            <span className="text-sm text-[rgba(0,0,0,0.6)] block">
              {formatDate(post.createdAt)}
            </span>
          </div>
        </a>
        
        <PostMenu
          postId={post.postId || post.id}
          onHide={handleHidePost}
          onSave={handleSavePost}
          onReport={handleReportPost}
          onDelete={post.isMine ? handleDeletePost : undefined}
          isPostOwner={post.isMine}
          isSaved={post.isSaved}
        />
      </div>
      <div className="text-base text-start p-0 pl-4 pr-4 text-[rgba(0,0,0,0.9)] overflow-hidden">
        {post.postDescription || post.content?.text || ''}
      </div>
      
      {/* Handle different media formats */}
      {(post.content?.files && post.content.files.length > 0) && (
        <div className="w-full relative bg-[#f9fafb] mt-2">
          <div className="aspect-[16/9] relative overflow-hidden">
            {post.content.files[0].url.match(/\.(mp4|webm|ogg)$/i) ? (
              <video 
                src={post.content.files[0].url}
                className="absolute inset-0 w-full h-full object-contain"
                controls
                preload="metadata"
              />
            ) : (
              <img 
                src={post.content.files[0].url} 
                alt={post.content.files[0].alt || "Post image"} 
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            )}
          </div>
        </div>
      )}

      {(post.attachments && post.attachments.length > 0) && (
        <div className="w-full relative bg-[#f9fafb] mt-2">
          <div className="aspect-[16/9] relative overflow-hidden">
            {typeof post.attachments[0] === 'string' && post.attachments[0].match(/\.(mp4|webm|ogg)$/i) ? (
              <video
                src={post.attachments[0]}
                className="absolute inset-0 w-full h-full object-contain"
                controls
                preload="metadata"
              />
            ) : (
              <img 
                src={post.attachments[0]} 
                alt="Post attachment" 
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            )}
          </div>
        </div>
      )}
      
      {/* Updated metrics section with reaction emojis */}
      <ul className="flex justify-between mx-4 p-2 border-b border-[#e9e5df] text-sm overflow-auto">
        <li className="flex items-center">
          <div className="flex items-center">
            {/* Show impression icons if there are any */}
            {post.impressionCounts && post.impressionCounts.total > 0 && (
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
          onClick={toggleComments}
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
          currentReaction={userReaction || 'like'}
        />
        
        <button 
          onClick={toggleComments}
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
      {expandedComments && (
        <div className="border-t border-[#e9e5df] p-4">
          {loadingComments ? (
            <div className="text-center py-4">Loading comments...</div>
          ) : (
            <CommentSection 
              postId={post.id || post.postId}
              comments={comments}
              authorInfo={{user: {profilePicture: "/Images/user.svg", firstName: "User", lastName: ""}}}
              onAddComment={handleAddComment}
              onReactToComment={() => {}}
              reactionTypes={reactionTypes}
              formatDate={formatDate}
            />
          )}
        </div>
      )}
    </article>
  );
};

export default SinglePostView;