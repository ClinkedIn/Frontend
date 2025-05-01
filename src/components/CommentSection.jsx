import React, { useState, useRef, useEffect } from 'react';

/**
 * CommentSection component for displaying and interacting with a comment section.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {string} props.postId - The ID of the post associated with the comment section.
 * @param {Array} props.comments - An array of comment objects to display.
 * @param {Object} props.authorInfo - Information about the author of the post.
 * @param {string} props.authorInfo.profileImage - URL of the author's profile image.
 * @param {string} props.authorInfo.name - Name of the author.
 * @param {Function} props.onAddComment - Callback function to handle adding a new comment.
 * @param {Function} props.onReactToComment - Callback function to handle reactions to comments.
 * @param {Array} props.reactionTypes - Array of available reaction types for comments.
 * @param {Function} props.formatDate - Function to format the date of a comment.
 *
 * @returns {JSX.Element} The rendered CommentSection component.
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
  const [commentText, setCommentText] = useState('');
  const [commentAttachment, setCommentAttachment] = useState(null);
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [parentCommentId, setParentCommentId] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showImageUrlInput, setShowImageUrlInput] = useState(false);
  const [showTagUserInput, setShowTagUserInput] = useState(false);
  const [tagUserName, setTagUserName] = useState({ firstName: '', lastName: '' });
  
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const urlInputRef = useRef(null);

  // Auto-resize textarea as user types
  /**
   * Handles the change event for a text input or textarea element.
   * Updates the comment text state and dynamically adjusts the height of the element
   * based on its scroll height, with a maximum height of 150px.
   *
   * @param {Object} e - The event object from the input or textarea element.
   * @param {HTMLTextAreaElement} e.target - The target element triggering the event.
   */
  const handleTextChange = (e) => {
    setCommentText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
  };

  // Auto-focus textarea when replyingTo changes
  useEffect(() => {
    if (replyingTo && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [replyingTo]);

  // Auto-focus URL input when shown
  useEffect(() => {
    if (showImageUrlInput && urlInputRef.current) {
      urlInputRef.current.focus();
    }
  }, [showImageUrlInput]);

  // Handle file selection
  /**
   * Handles the file selection event from an input element.
   * Updates the comment attachment state with the selected file,
   * clears the attachment URL, and hides the image URL input field.
   *
   * @param {Object} e - The event object from the file input element.
   * @param {FileList} e.target.files - The list of files selected by the user.
   */
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCommentAttachment(e.target.files[0]);
      setAttachmentUrl('');
      setShowImageUrlInput(false);
    }
  };

  // Handle image URL input
  /**
   * Handles changes to the attachment URL input field.
   * Updates the attachment URL state and resets the comment attachment state.
   *
   * @param {Object} e - The event object from the input field.
   * @param {string} e.target.value - The new value of the input field.
   */
  const handleAttachmentUrlChange = (e) => {
    setAttachmentUrl(e.target.value);
    setCommentAttachment(null);
  };

  // Add a tagged user
  /**
   * Handles the addition of a tagged user to the comment section.
   * 
   * This function performs the following actions:
   * 1. Validates the input for the tagged user's first and last name.
   * 2. Creates a new user object with a temporary ID and default properties.
   * 3. Updates the list of tagged users with the new user.
   * 4. Appends an @ mention of the tagged user to the comment text.
   * 5. Resets the input fields for tagging a user and hides the input form.
   * 6. Refocuses the textarea for further comment editing.
   * 
   * @function
   * @returns {void} Does not return a value.
   */
  const handleAddTaggedUser = () => {
    if (!tagUserName.firstName.trim() || !tagUserName.lastName.trim()) return;
    
    const newUser = {
      userId: `user-${Date.now()}`, // Generate a temporary ID
      userType: "User",
      firstName: tagUserName.firstName.trim(),
      lastName: tagUserName.lastName.trim(),
      companyName: null
    };
    
    // Add to tagged users list
    setTaggedUsers([...taggedUsers, newUser]);
    
    // Add @ mention to comment text
    const mention = `@${newUser.firstName} ${newUser.lastName}`;
    setCommentText(prevText => 
      `${prevText}${prevText.length > 0 && !prevText.endsWith(' ') ? ' ' : ''}${mention} `
    );
    
    // Reset input and hide it
    setTagUserName({ firstName: '', lastName: '' });
    setShowTagUserInput(false);
    
    // Focus back on textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Remove tag
  /**
   * Removes a tagged user from the list of tagged users based on their user ID.
   *
   * @param {string} userId - The unique identifier of the user to be removed from the tagged users list.
   */
  const removeTag = (userId) => {
    setTaggedUsers(taggedUsers.filter(user => user.userId !== userId));
  };

  // Start reply to a comment
  /**
   * Handles the reply action for a specific comment.
   * Sets the parent comment ID and the name of the person being replied to,
   * and focuses the textarea for the reply input.
   *
   * @param {Object} comment - The comment object being replied to.
   * @param {string} comment._id - The unique identifier of the comment.
   * @param {string} comment.firstName - The first name of the comment author.
   * @param {string} comment.lastName - The last name of the comment author.
   */
  const handleReply = (comment) => {
    setParentCommentId(comment._id);
    setReplyingTo(`${comment.firstName} ${comment.lastName}`);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Cancel reply
  /**
   * Cancels the reply action by resetting the parent comment ID and the replying-to state.
   * This function is typically used to clear the reply context in a comment section.
   */
  const cancelReply = () => {
    setParentCommentId(null);
    setReplyingTo(null);
  };

  // Submit comment
  /**
   * Handles the submission of a comment. Validates the input, sends the comment data
   * to the `onAddComment` function, and resets the form upon successful submission.
   *
   * @async
   * @function handleSubmit
   * @returns {Promise<void>} Resolves when the comment submission process is complete.
   *
   * @throws Will log an error to the console if the comment submission fails.
   *
   * @description
   * - Prevents submission if the comment text, attachment, or attachment URL is empty.
   * - Sets the `isSubmitting` state to `true` during the submission process.
   * - Calls the `onAddComment` function with the following parameters:
   *   - `postId`: The ID of the post the comment belongs to.
   *   - `commentText`: The text content of the comment.
   *   - `commentAttachment`: The file attachment for the comment, if any.
   *   - `taggedUsers`: An array of tagged users, or `undefined` if no users are tagged.
   *   - `parentCommentId`: The ID of the parent comment, if replying to another comment.
   *   - `attachmentUrl`: The URL of the attachment, or `undefined` if not provided.
   * - Resets the form fields and UI states after successful submission.
   * - Adjusts the height of the textarea to its default state.
   */
  const handleSubmit = async () => {
    if (!commentText.trim() && !commentAttachment && !attachmentUrl) return;
    
    setIsSubmitting(true);
    try {
      await onAddComment(
        postId, 
        commentText, 
        commentAttachment,
        taggedUsers.length > 0 ? taggedUsers : undefined,
        parentCommentId,
        attachmentUrl || undefined
      );
      
      // Reset form
      setCommentText('');
      setCommentAttachment(null);
      setAttachmentUrl('');
      setTaggedUsers([]);
      setParentCommentId(null);
      setReplyingTo(null);
      setShowImageUrlInput(false);
      setShowTagUserInput(false);
      
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle keydown to submit on Ctrl+Enter or just Enter
  /**
   * Handles the keydown event for a text input, triggering form submission
   * when the Enter key is pressed. If the Enter key is pressed with the Ctrl key
   * or without the Shift key, the default behavior is prevented, and the submit
   * handler is called.
   *
   * @param {KeyboardEvent} e - The keyboard event object.
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || !e.shiftKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="comment-section">
      {/* Comment input */}
      <div className="flex items-start mb-4">
        <img 
          src={authorInfo.profilePicture} 
          alt={authorInfo.name}
          className="w-8 h-8 rounded-full mr-2 mt-1"
        />
        <div className="flex-1 bg-[#f3f2ef] rounded-lg px-3 pt-2 pb-1 relative">
          {replyingTo && (
            <div className="flex items-center text-xs text-[#0a66c2] mb-1">
              <span>Replying to {replyingTo}</span>
              <button 
                onClick={cancelReply} 
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
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
            className="w-full resize-none bg-transparent border-none outline-none text-sm min-h-[36px] max-h-[150px] overflow-auto"
            rows={1}
          />
          
          {/* Tagged users chips */}
          {taggedUsers.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1 mb-2">
              {taggedUsers.map(user => (
                <span 
                  key={user.userId}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {user.firstName} {user.lastName}
                  <button 
                    onClick={() => removeTag(user.userId)} 
                    className="ml-1 text-blue-400 hover:text-blue-600"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
          
          {/* Image URL input */}
          {showImageUrlInput && (
            <div className="mt-2 mb-2">
              <div className="flex items-center">
                <input
                  ref={urlInputRef}
                  type="text"
                  placeholder="Enter image URL"
                  value={attachmentUrl}
                  onChange={handleAttachmentUrlChange}
                  className="flex-1 text-sm border border-gray-300 rounded px-2 py-1"
                />
                <button 
                  onClick={() => setShowImageUrlInput(false)}
                  className="ml-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          {/* Tag user input */}
          {showTagUserInput && (
            <div className="mt-2 mb-2">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="First name"
                    value={tagUserName.firstName}
                    onChange={(e) => setTagUserName({...tagUserName, firstName: e.target.value})}
                    className="flex-1 text-sm border border-gray-300 rounded px-2 py-1 mr-1"
                  />
                  <input
                    type="text"
                    placeholder="Last name"
                    value={tagUserName.lastName}
                    onChange={(e) => setTagUserName({...tagUserName, lastName: e.target.value})}
                    className="flex-1 text-sm border border-gray-300 rounded px-2 py-1"
                  />
                </div>
                <div className="flex justify-end">
                  <button 
                    onClick={() => setShowTagUserInput(false)}
                    className="text-sm text-gray-500 hover:text-gray-700 mr-2"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddTaggedUser}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    disabled={!tagUserName.firstName.trim() || !tagUserName.lastName.trim()}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Attachment preview */}
          {commentAttachment && (
            <div className="mt-2 relative inline-block">
              <img 
                src={URL.createObjectURL(commentAttachment)} 
                alt="Attachment preview" 
                className="max-h-20 max-w-full rounded border border-gray-300"
              />
              <button 
                onClick={() => setCommentAttachment(null)}
                className="absolute -top-2 -right-2 bg-gray-200 rounded-full p-1 text-xs"
              >
                ✕
              </button>
            </div>
          )}
          
          {/* URL attachment preview */}
          {attachmentUrl && (
            <div className="mt-2 relative inline-block">
              <img 
                src={attachmentUrl} 
                alt="Attachment preview" 
                className="max-h-20 max-w-full rounded border border-gray-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/Images/broken-image.svg';
                  e.target.className = 'max-h-20 max-w-full rounded border border-gray-300 opacity-50';
                }}
              />
              <button 
                onClick={() => setAttachmentUrl('')}
                className="absolute -top-2 -right-2 bg-gray-200 rounded-full p-1 text-xs"
              >
                ✕
              </button>
            </div>
          )}
          
          {/* Comment actions */}
          <div className="flex justify-between items-center mt-2">
            <div className="flex space-x-2">
              {/* Photo upload button */}
              <button 
                onClick={() => fileInputRef.current.click()}
                className="text-[rgba(0,0,0,0.6)] p-1 rounded-full hover:bg-[rgba(0,0,0,0.08)]"
                title="Add photo"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                </svg>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                accept="image/*"
                style={{ display: 'none' }}
              />
              
              {/* Image URL button */}
              <button 
                onClick={() => {
                  setShowImageUrlInput(true);
                  setShowTagUserInput(false);
                }}
                className="text-[rgba(0,0,0,0.6)] p-1 rounded-full hover:bg-[rgba(0,0,0,0.08)]"
                title="Add image URL"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M19.902 4.098a3.75 3.75 0 00-5.304 0l-4.5 4.5a3.75 3.75 0 001.035 6.037.75.75 0 01-.646 1.353 5.25 5.25 0 01-1.449-8.45l4.5-4.5a5.25 5.25 0 117.424 7.424l-1.757 1.757a.75.75 0 11-1.06-1.06l1.757-1.757a3.75 3.75 0 000-5.304zm-7.389 4.267a.75.75 0 011-.353 5.25 5.25 0 011.449 8.45l-4.5 4.5a5.25 5.25 0 11-7.424-7.424l1.757-1.757a.75.75 0 111.06 1.06l-1.757 1.757a3.75 3.75 0 000 5.304 3.75 3.75 0 005.304 0l4.5-4.5a3.75 3.75 0 00-1.035-6.037.75.75 0 01-.354-1z" clipRule="evenodd" />
                </svg>
              </button>
              
              {/* Tag user button */}
              <button 
                onClick={() => {
                  setShowTagUserInput(true);
                  setShowImageUrlInput(false);
                }}
                className="text-[rgba(0,0,0,0.6)] p-1 rounded-full hover:bg-[rgba(0,0,0,0.08)]"
                title="Tag someone"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {/* Post button */}
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || (!commentText.trim() && !commentAttachment && !attachmentUrl)}
              className={`text-sm font-semibold px-3 py-1 rounded-full ${
                (commentText.trim() || commentAttachment || attachmentUrl)
                  ? 'bg-[#0a66c2] text-white hover:bg-[#084482]' 
                  : 'bg-[#0a66c2]/50 text-white cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Comments list */}
      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="comment flex">
              <img 
                src={comment.profilePicture} 
                alt={`${comment.firstName} ${comment.lastName}`}
                className="w-8 h-8 rounded-full mr-2 mt-1"
              />
              <div className="flex-1">
                <div className="bg-[#f3f2ef] rounded-lg px-3 py-2">
                  <div className="flex items-center">
                    <h4 className="font-semibold text-sm">{comment.firstName} {comment.lastName}</h4>
                    <span className="text-xs text-gray-500 ml-2">{comment.headline}</span>
                  </div>
                  <p className="text-sm mt-1">{comment.commentContent}</p>
                  
                  {/* Comment attachment */}
                  {comment.commentAttachment && (
                    <div className="mt-2">
                      <img 
                        src={comment.commentAttachment} 
                        alt="Comment attachment" 
                        className="max-h-48 rounded"
                        loading="lazy"
                      />
                    </div>
                  )}
                  
                  {/* Tagged users */}
                  {comment.taggedUsers && comment.taggedUsers.length > 0 && (
                    <div className="text-xs text-[#0a66c2] mt-1">
                      {comment.taggedUsers.map((user, index) => (
                        <span key={user.userId} className="mr-1">
                          @{user.firstName} {user.lastName}
                          {index < comment.taggedUsers.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Comment actions */}
                <div className="flex items-center text-xs text-gray-500 mt-1 space-x-3 pl-1">
                  <span className="hover:text-[#0a66c2] hover:underline cursor-pointer">
                    {formatDate(comment.createdAt)}
                  </span>
                  
                  {/* Comment reactions */}
                  <div className="flex items-center">
                    <button 
                      onClick={() => onReactToComment(
                        comment._id, 
                        'like', 
                        comment.isLiked ? true : false
                      )}
                      className={`hover:text-[#0a66c2] hover:underline cursor-pointer ${
                        comment.isLiked ? 'text-[#0a66c2] font-semibold' : ''
                      }`}
                    >
                      Like
                    </button>
                    
                    {comment.impressionCounts && comment.impressionCounts.total > 0 && (
                      <span className="ml-1">
                        • {comment.impressionCounts.total}
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
                </div>
                
                {/* Comment replies - simplified for now */}
                {comment.replyCount > 0 && (
                  <button className="text-xs text-[#0a66c2] hover:underline mt-1 pl-1">
                    View {comment.replyCount} {comment.replyCount === 1 ? 'reply' : 'replies'}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-2">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;