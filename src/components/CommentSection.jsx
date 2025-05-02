import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from "../constants";

/**
 * CommentSection component
 */
const CommentSection = ({
  postId,
  comments,
  authorInfo,
  onAddComment,
  onReactToComment,
  reactionTypes,
  formatDate
}) => {
  // Add local comments state to manage UI updates directly
  const [localComments, setLocalComments] = useState(comments);

  // Update local comments when props change
  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  // Input & reply states
  const [commentText, setCommentText] = useState('');
  const [commentAttachment, setCommentAttachment] = useState(null);
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [parentCommentId, setParentCommentId] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);

  // Optimistic likes & per‑comment loading
  const [optimisticLikes, setOptimisticLikes] = useState({});
  const [likeLoading, setLikeLoading] = useState({});

  // Replies state
  const [expandedReplies, setExpandedReplies] = useState({});
  const [replies, setReplies] = useState({});
  const [loadingReplies, setLoadingReplies] = useState({});

  // Optimistic likes for replies
  const [optimisticReplyLikes, setOptimisticReplyLikes] = useState({});
  const [replyLikeLoading, setReplyLikeLoading] = useState({});

  // Edit/delete states
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');
  const [isDeleting, setIsDeleting] = useState({});
  const [isEditing, setIsEditing] = useState({});

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto‑resize textarea
  const handleTextChange = e => {
    setCommentText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
  };

  // Auto‑resize edit textarea
  const handleEditTextChange = e => {
    setEditText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
  };

  // Auto‑focus when replying
  useEffect(() => {
    if (replyingTo && textareaRef.current) textareaRef.current.focus();
  }, [replyingTo]);

  // Clear optimistic flags when the real comments prop changes (keep this)
  useEffect(() => {
    setOptimisticLikes({});
    setOptimisticReplyLikes({});
  }, [comments]); // Note: This depends on the 'comments' prop, not 'localComments'

  // File select
  const handleFileSelect = e => {
    if (e.target.files?.[0]) {
      setCommentAttachment(e.target.files[0]);
      setAttachmentUrl('');
    }
  };

  // Submit new comment
  const handleSubmit = async () => {
    if (!commentText.trim() && !commentAttachment && !attachmentUrl) return;
    setIsSubmitting(true);
    try {
      // Call parent function to add comment - parent should handle updating the main comments list
      const newComment = await onAddComment(
        postId,
        commentText,
        commentAttachment,
        undefined, // taggedUsers - assuming not implemented here based on current code
        parentCommentId,
        attachmentUrl || undefined
      );
      // Reset local input state
      setCommentText('');
      setCommentAttachment(null);
      setAttachmentUrl('');
      setParentCommentId(null);
      setReplyingTo(null);
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
      // No need to update localComments here, rely on parent passing updated props
    } catch (err) {
      console.error('Error posting comment:', err);
      alert(`Failed to post comment: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && (e.ctrlKey || !e.shiftKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Reply controls
  const handleReply = comment => {
    setParentCommentId(comment._id);
    setReplyingTo(`${comment.firstName} ${comment.lastName}`);
  };
  const cancelReply = () => {
    setParentCommentId(null);
    setReplyingTo(null);
  };

  // Fetch replies (if needed)
  const fetchReplies = async commentId => {
    setLoadingReplies(prev => ({ ...prev, [commentId]: true }));
    try {
      const res = await axios.get(`${BASE_URL}/comments/reply/${commentId}`, { withCredentials: true });
      setReplies(prev => ({ ...prev, [commentId]: res.data.replies || [] }));
    } catch (err) {
      console.error('Error fetching replies:', err);
    } finally {
      setLoadingReplies(prev => ({ ...prev, [commentId]: false }));
    }
  };

  // Like logic for parent comments
  const handleLikeClick = async comment => {
    const id = comment._id;
    if (likeLoading[id]) return;

    const isLikedNow = optimisticLikes[id]?.isLiked
      ?? (comment.isLiked?.like === true);

    // Optimistic UI update for parent comment like
    setLocalComments(prev => prev.map(c => {
      if (c._id === id) {
        const currentTotal = c.impressionCounts?.total || 0;
        return {
          ...c,
          isLiked: { like: !isLikedNow }, // Simplified optimistic update
          impressionCounts: {
            ...c.impressionCounts,
            total: isLikedNow ? Math.max(0, currentTotal - 1) : currentTotal + 1
          }
        };
      }
      return c;
    }));
    setOptimisticLikes(prev => ({ // Keep separate optimistic state for revert logic if needed
      ...prev,
      [id]: {
        isLiked: !isLikedNow,
        count: isLikedNow
          ? Math.max(0, (comment.impressionCounts?.total || 0) - 1)
          : (comment.impressionCounts?.total || 0) + 1
      }
    }));
    setLikeLoading(prev => ({ ...prev, [id]: true }));

    try {
      if (isLikedNow) {
        await axios.delete(`${BASE_URL}/comments/${id}/like`, { withCredentials: true });
      } else {
        await axios.post(
          `${BASE_URL}/comments/${id}/like`,
          { impressionType: 'like' },
          { withCredentials: true }
        );
      }
      // Notify parent, but local UI is already updated optimistically
      onReactToComment(postId, id, 'like', isLikedNow);
    } catch (err) {
      console.error('Comment reaction error:', err);
      // Revert optimistic UI update on error (except 400 which might be "already liked/unliked")
      if (err.response?.status !== 400) {
        setLocalComments(prev => prev.map(c => c._id === id ? comment : c)); // Revert to original comment data
        setOptimisticLikes(prev => {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        });
      }
    } finally {
      setLikeLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  // Like logic for replies
  const handleReplyLikeClick = async (reply, parentId) => {
    const id = reply._id;
    if (replyLikeLoading[id]) return;

    const isLikedNow = optimisticReplyLikes[id]?.isLiked
      ?? (reply.isLiked?.like === true);

    // Optimistic UI update for reply like
    setReplies(prev => ({
      ...prev,
      [parentId]: (prev[parentId] || []).map(r => {
        if (r._id === id) {
          const currentTotal = r.impressionCounts?.total || 0;
          return {
            ...r,
            isLiked: { like: !isLikedNow },
            impressionCounts: {
              ...r.impressionCounts,
              total: isLikedNow ? Math.max(0, currentTotal - 1) : currentTotal + 1
            }
          };
        }
        return r;
      })
    }));
    setOptimisticReplyLikes(prev => ({ // Keep separate optimistic state
      ...prev,
      [id]: {
        isLiked: !isLikedNow,
        count: isLikedNow
          ? Math.max(0, (reply.impressionCounts?.total || 0) - 1)
          : (reply.impressionCounts?.total || 0) + 1
      }
    }));
    setReplyLikeLoading(prev => ({ ...prev, [id]: true }));

    try {
      if (isLikedNow) {
        await axios.delete(`${BASE_URL}/comments/${id}/like`, { withCredentials: true });
      } else {
        await axios.post(
          `${BASE_URL}/comments/${id}/like`,
          { impressionType: 'like' },
          { withCredentials: true }
        );
      }
      // Optionally notify parent if needed, e.g., for aggregated counts
      // onReactToComment(postId, id, 'like-reply', isLikedNow); // Example if needed
    } catch (err) {
      console.error('Reply reaction error:', err);
      // Revert optimistic UI update on error
      if (err.response?.status !== 400) {
        setReplies(prev => ({
          ...prev,
          [parentId]: (prev[parentId] || []).map(r => r._id === id ? reply : r) // Revert to original reply data
        }));
        setOptimisticReplyLikes(prev => {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        });
      }
    } finally {
      setReplyLikeLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  // Edit comment logic
  const handleStartEdit = comment => {
    setEditingCommentId(comment._id);
    setEditText(comment.commentContent);
    // Auto-resize textarea when starting edit
    setTimeout(() => {
      const textarea = document.getElementById(`edit-textarea-${comment._id}`);
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
        textarea.focus();
      }
    }, 0);
  };

  const handleSaveEdit = async (commentId, isReply = false, parentId = null) => {
    console.log(`Saving edit for comment ${commentId}, isReply: ${isReply}, parentId: ${parentId}`);
    const trimmedEditText = editText.trim();
    if (!trimmedEditText) return;

    setIsEditing(prev => ({ ...prev, [commentId]: true }));

    try {
      const response = await axios.put(
        `${BASE_URL}/comments/${commentId}`,
        { commentContent: trimmedEditText },
        { withCredentials: true }
      );

      console.log("Edit response:", response.data);

      if (isReply && parentId) {
        // Update the reply in local 'replies' state
        setReplies(prev => ({
          ...prev,
          [parentId]: (prev[parentId] || []).map(reply =>
            reply._id === commentId
              ? { ...reply, commentContent: trimmedEditText }
              : reply
          )
        }));
      } else {
        // For parent comments, update 'localComments' state directly
        setLocalComments(prev =>
          prev.map(comment =>
            comment._id === commentId
              ? { ...comment, commentContent: trimmedEditText }
              : comment
          )
        );
        // Optionally notify parent if needed for other reasons (e.g., analytics)
        // onReactToComment(postId, commentId, 'edit', trimmedEditText);
      }
    } catch (err) {
      console.error('Error editing comment:', err);
      alert(`Failed to update comment: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsEditing(prev => ({ ...prev, [commentId]: false }));
      setEditingCommentId(null);
      setEditText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditText('');
  };

  // Delete comment logic
  const handleDeleteComment = async (commentId, isReply = false, parentId = null) => {
    console.log(`Deleting comment ${commentId}, isReply: ${isReply}, parentId: ${parentId}`);

    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    setIsDeleting(prev => ({ ...prev, [commentId]: true }));

    try {
      const response = await axios.delete(`${BASE_URL}/comments/${commentId}`, {
        withCredentials: true
      });

      console.log("Delete response:", response.data);

      if (isReply && parentId) {
        // Remove the reply from local 'replies' state
        setReplies(prev => ({
          ...prev,
          [parentId]: (prev[parentId] || []).filter(reply => reply._id !== commentId)
        }));

        // Update the parent comment's reply count in 'localComments' state
        setLocalComments(prevLocalComments => { // Changed variable name for clarity
          return prevLocalComments.map(comment => {
            if (comment._id === parentId) {
              const currentCount = comment.replyCount || 0;
              const newReplyCount = Math.max(0, currentCount - 1);
              // --- Add this console log for debugging ---
              console.log(`Updating parent ${parentId} reply count from ${currentCount} to ${newReplyCount}`);
              // --- End of console log ---
              return { ...comment, replyCount: newReplyCount };
            } else {
              return comment;
            }
          });
        });
      } else {
        // For parent comments, remove from 'localComments' state
        setLocalComments(prev => prev.filter(comment => comment._id !== commentId));

        // Clean up any expanded replies state for the deleted comment
        setReplies(prev => {
          const newReplies = { ...prev };
          delete newReplies[commentId];
          return newReplies;
        });
        setExpandedReplies(prev => {
          const newExpanded = { ...prev };
          delete newExpanded[commentId];
          return newExpanded;
        });

        // Optionally notify parent if needed for other reasons (e.g., update total post comment count)
        // onReactToComment(postId, commentId, 'delete');
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert(`Failed to delete comment: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsDeleting(prev => ({ ...prev, [commentId]: false }));
    }
  };

  return (
    <div className="comment-section">
      {/* New comment input */}
      <div className="flex items-start mb-4">
        <img
          src={authorInfo?.user?.profilePicture || '/Images/default-profile.png'} // Added fallback
          alt={authorInfo?.name || 'User'} // Added fallback
          className="w-8 h-8 rounded-full mr-2 mt-1 object-cover" // Added object-cover
        />
        <div className="flex-1 bg-[#f3f2ef] rounded-lg px-3 pt-2 pb-1 relative">
          {replyingTo && (
            <div className="flex items-center text-xs text-[#0a66c2] mb-1">
              <span>Replying to {replyingTo}</span>
              <button onClick={cancelReply} className="ml-2 text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
          )}
          <textarea
            ref={textareaRef}
            value={commentText}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder={replyingTo ? `Reply to ${replyingTo}...` : "Add a comment..."}
            className="w-full resize-none bg-transparent border-none outline-none text-sm min-h-[36px] max-h-[150px] overflow-y-auto" // Changed overflow to overflow-y
            rows={1}
          />
          {/* Media preview for image file */}
          {commentAttachment && (
            <div className="mt-2 relative inline-block">
              <img
                src={URL.createObjectURL(commentAttachment)}
                alt="Preview"
                className="max-h-20 max-w-full rounded border border-gray-300 object-cover" // Added object-cover
              />
              <button
                onClick={() => setCommentAttachment(null)}
                className="absolute -top-2 -right-2 bg-gray-200 rounded-full p-1 text-xs leading-none" // Added leading-none
              >
                ✕
              </button>
            </div>
          )}
          {/* Media preview for image URL */}
          {attachmentUrl && (
            <div className="mt-2 relative inline-block">
              <img
                src={attachmentUrl}
                alt="Preview"
                className="max-h-20 max-w-full rounded border border-gray-300 object-cover" // Added object-cover
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = '/Images/broken-image.svg';
                  e.target.className = 'max-h-20 max-w-full rounded border border-gray-300 opacity-50';
                }}
              />
              <button
                onClick={() => setAttachmentUrl('')}
                className="absolute -top-2 -right-2 bg-gray-200 rounded-full p-1 text-xs leading-none" // Added leading-none
              >
                ✕
              </button>
            </div>
          )}
          <div className="flex justify-between items-center mt-2">
            <div className="flex space-x-2">
              <button
                onClick={() => fileInputRef.current.click()}
                className="text-[rgba(0,0,0,0.6)] p-1 rounded-full hover:bg-[rgba(0,0,0,0.08)]"
                title="Add photo"
              >
                {/* SVG icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2h-3.172a2 2 0 01-1.414-.586l-.828-.828A2 2 0 0012.172 3H7a2 2 0 00-2 2z" />
                </svg>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                style={{ display: 'none' }}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || (!commentText.trim() && !commentAttachment && !attachmentUrl)}
              className={`text-sm font-semibold px-3 py-1 rounded-full transition-colors duration-200 ${
                (commentText.trim() || commentAttachment || attachmentUrl)
                  ? 'bg-[#0a66c2] text-white hover:bg-[#084482]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed' // Adjusted disabled style
              }`}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </div>

      {/* Existing comments - use localComments */}
      <div className="space-y-4">
        {localComments.length > 0 ? (
          localComments.map(comment => (
            <div key={comment._id} className="comment flex">
              <img
                src={comment.profilePicture || '/Images/default-profile.png'} // Added fallback
                alt={`${comment.firstName} ${comment.lastName}`}
                className="w-8 h-8 rounded-full mr-2 mt-1 object-cover" // Added object-cover
              />
              <div className="flex-1">
                <div className="bg-[#f3f2ef] rounded-lg px-3 py-2">
                  <div className="flex items-center flex-wrap"> {/* Added flex-wrap */}
                    <h4 className="font-semibold text-sm mr-2"> {/* Added margin */}
                      {comment.firstName} {comment.lastName}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {comment.headline}
                    </span>
                  </div>

                  {/* Editing state for parent comment */}
                  {editingCommentId === comment._id ? (
                    <div className="mt-2">
                      <textarea
                        id={`edit-textarea-${comment._id}`} // Added ID for focusing
                        value={editText}
                        onChange={handleEditTextChange}
                        className="w-full resize-none bg-white border border-gray-300 rounded p-2 text-sm min-h-[60px] max-h-[150px] overflow-y-auto" // Style consistency
                        rows={2}
                      />
                      <div className="flex justify-end mt-2 space-x-2">
                        <button
                          onClick={handleCancelEdit}
                          className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(comment._id)}
                          disabled={isEditing[comment._id] || !editText.trim()} // Disable if empty
                          className={`text-xs px-3 py-1 rounded transition-colors duration-200 ${
                            !editText.trim() || isEditing[comment._id]
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-[#0a66c2] text-white hover:bg-[#084482]'
                          }`}
                        >
                          {isEditing[comment._id] ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm mt-1 whitespace-pre-wrap break-words"> {/* Added whitespace and break */}
                        {comment.commentContent}
                      </p>
                      {comment.commentAttachment && (
                        <div className="mt-2">
                          {/* Consider adding a link or modal for larger view */}
                          <img
                            src={comment.commentAttachment}
                            alt="Attachment"
                            className="max-h-48 rounded object-contain" // Changed to object-contain
                            loading="lazy"
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Actions: date, like, reply, edit, delete */}
                <div className="flex items-center text-xs text-gray-500 mt-1 space-x-3 pl-1 flex-wrap"> {/* Added flex-wrap */}
                  <span title={new Date(comment.createdAt).toLocaleString()} className="hover:text-[#0a66c2] hover:underline cursor-default"> {/* Changed cursor */}
                    {formatDate(comment.createdAt)}
                  </span>

                  {/* Like button + count */}
                  <div className="flex items-center">
                    <button
                      onClick={() => handleLikeClick(comment)}
                      disabled={likeLoading[comment._id]}
                      className={`hover:text-[#0a66c2] hover:underline cursor-pointer ${
                        (optimisticLikes[comment._id]?.isLiked ?? comment.isLiked?.like)
                          ? 'text-[#0a66c2] font-semibold'
                          : ''
                      }`}
                    >
                      Like
                    </button>
                    {/* Display count only if > 0 */}
                    {((optimisticLikes[comment._id]?.count ?? comment.impressionCounts?.total) || 0) > 0 && (
                      <span className="ml-1">
                        • {(optimisticLikes[comment._id]?.count ?? comment.impressionCounts?.total)}
                      </span>
                    )}
                  </div>

                  {/* Reply button */}
                  <button
                    onClick={() => handleReply(comment)}
                    className="hover:text-[#0a66c2] hover:underline cursor-pointer"
                  >
                    Reply
                  </button>

                  {/* Edit/Delete buttons - only show if current user is the author */}
                  {authorInfo?.user?._id === comment.userId && (
                    <>
                      <button
                        onClick={() => handleStartEdit(comment)}
                        disabled={editingCommentId === comment._id}
                        className="hover:text-[#0a66c2] hover:underline cursor-pointer disabled:text-gray-400 disabled:cursor-not-allowed" // Added disabled style
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        disabled={isDeleting[comment._id]}
                        className="hover:text-red-500 hover:underline cursor-pointer disabled:text-gray-400 disabled:cursor-not-allowed" // Added disabled style
                      >
                        {isDeleting[comment._id] ? 'Deleting...' : 'Delete'}
                      </button>
                    </>
                  )}
                </div>

                {/* View replies */}
                {/* Rely on the replyCount from the comment object in localComments state */}
                {comment.replyCount > 0 && (
                  <button
                    className="text-xs text-[#0a66c2] hover:underline mt-1 pl-1"
                    onClick={() => {
                      const isCurrentlyExpanded = expandedReplies[comment._id];
                      setExpandedReplies(prev => ({
                        ...prev,
                        [comment._id]: !isCurrentlyExpanded
                      }));
                      // Fetch only if expanding and replies aren't loaded yet or are empty
                      if (!isCurrentlyExpanded && !replies[comment._id]?.length) {
                        fetchReplies(comment._id);
                      }
                    }}
                  >
                    {loadingReplies[comment._id]
                      ? 'Loading...'
                      : expandedReplies[comment._id]
                        ? 'Hide replies'
                        : `View ${comment.replyCount} ${comment.replyCount === 1 ? 'reply' : 'replies'}`
                    }
                  </button>
                )}

                {/* Show replies when expanded */}
                {expandedReplies[comment._id] && !loadingReplies[comment._id] && ( // Don't render replies section while loading
                  <div className="ml-8 mt-2 space-y-2"> {/* Added space-y */}
                    {(replies[comment._id] || []).length > 0 ? (
                      replies[comment._id].map(reply => (
                        <div key={reply._id} className="flex"> {/* Removed mb-2, using space-y on parent */}
                          <img
                            src={reply.profilePicture || '/Images/default-profile.png'} // Added fallback
                            alt={`${reply.firstName} ${reply.lastName}`}
                            className="w-7 h-7 rounded-full mr-2 mt-1 object-cover" // Added object-cover
                          />
                          <div className="flex-1">
                            <div className="bg-[#e9e8e7] rounded-lg px-3 py-2">
                              <div className="flex items-center flex-wrap"> {/* Added flex-wrap */}
                                <h4 className="font-semibold text-xs mr-2"> {/* Added margin */}
                                  {reply.firstName} {reply.lastName}
                                </h4>
                                <span className="text-xs text-gray-500">
                                  {reply.headline}
                                </span>
                              </div>

                              {/* Editing state for reply */}
                              {editingCommentId === reply._id ? (
                                <div className="mt-2">
                                  <textarea
                                    id={`edit-textarea-${reply._id}`} // Added ID
                                    value={editText}
                                    onChange={handleEditTextChange}
                                    className="w-full resize-none bg-white border border-gray-300 rounded p-2 text-xs min-h-[50px] max-h-[120px] overflow-y-auto" // Style consistency
                                    rows={2}
                                  />
                                  <div className="flex justify-end mt-2 space-x-2">
                                    <button
                                      onClick={handleCancelEdit}
                                      className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-0.5 rounded"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => handleSaveEdit(reply._id, true, comment._id)}
                                      disabled={isEditing[reply._id] || !editText.trim()} // Disable if empty
                                      className={`text-xs px-2 py-0.5 rounded transition-colors duration-200 ${
                                        !editText.trim() || isEditing[reply._id]
                                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                          : 'bg-[#0a66c2] text-white hover:bg-[#084482]'
                                      }`}
                                    >
                                      {isEditing[reply._id] ? 'Saving...' : 'Save'}
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <p className="text-xs mt-1 whitespace-pre-wrap break-words"> {/* Added whitespace and break */}
                                    {reply.commentContent}
                                  </p>
                                  {reply.commentAttachment && (
                                    <div className="mt-2">
                                      <img
                                        src={reply.commentAttachment}
                                        alt="Attachment"
                                        className="max-h-32 rounded object-contain" // Changed to object-contain
                                        loading="lazy"
                                      />
                                    </div>
                                  )}
                                </>
                              )}
                            </div>

                            {/* Reply actions */}
                            <div className="flex items-center text-xs text-gray-500 mt-1 space-x-3 pl-1 flex-wrap"> {/* Added flex-wrap */}
                              <span title={new Date(reply.createdAt).toLocaleString()} className="hover:text-[#0a66c2] hover:underline cursor-default"> {/* Changed cursor */}
                                {formatDate(reply.createdAt)}
                              </span>

                              {/* Like button for reply */}
                              <div className="flex items-center">
                                <button
                                  onClick={() => handleReplyLikeClick(reply, comment._id)}
                                  disabled={replyLikeLoading[reply._id]}
                                  className={`hover:text-[#0a66c2] hover:underline cursor-pointer ${
                                    (optimisticReplyLikes[reply._id]?.isLiked ?? reply.isLiked?.like)
                                      ? 'text-[#0a66c2] font-semibold'
                                      : ''
                                  }`}
                                >
                                  Like
                                </button>
                                {/* Display count only if > 0 */}
                                {((optimisticReplyLikes[reply._id]?.count ?? reply.impressionCounts?.total) || 0) > 0 && (
                                  <span className="ml-1">
                                    • {(optimisticReplyLikes[reply._id]?.count ?? reply.impressionCounts?.total)}
                                  </span>
                                )}
                              </div>

                              {/* Edit/Delete buttons for reply */}
                              {authorInfo?.user?._id === reply.userId && (
                                <>
                                  <button
                                    onClick={() => handleStartEdit(reply)}
                                    disabled={editingCommentId === reply._id}
                                    className="hover:text-[#0a66c2] hover:underline cursor-pointer disabled:text-gray-400 disabled:cursor-not-allowed" // Added disabled style
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteComment(reply._id, true, comment._id)}
                                    disabled={isDeleting[reply._id]}
                                    className="hover:text-red-500 hover:underline cursor-pointer disabled:text-gray-400 disabled:cursor-not-allowed" // Added disabled style
                                  >
                                    {isDeleting[reply._id] ? 'Deleting...' : 'Delete'}
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-xs text-gray-400">No replies yet.</div> // This handles the empty state when expanded
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-2">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;