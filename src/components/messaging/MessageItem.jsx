import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns'; 
import { BsThreeDotsVertical } from 'react-icons/bs'; 
import { FiTrash2, FiEdit2 } from 'react-icons/fi'; 
const MessageItem = ({ message, isOwnMessage, senderInfo, showReadReceipt,onDeleteMessage,onUpdateMessage }) => {
  const defaultAvatar = '/Images/user.svg';
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message.text || ''); // Initialize with current text
  const menuRef = useRef(null);
  const inputRef = useRef(null);

    // --- Menu Handling ---
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
          setMenuOpen(false);
        }
      };
      if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
      else document.removeEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen]);
  
    const handleMenuToggle = (e) => {
      e.stopPropagation();
      setMenuOpen(!menuOpen);
    };
  
    // --- Delete Handling ---
    const handleDelete = (e) => {
      e.stopPropagation();
      // Optional: Add a confirmation dialog here
      if (window.confirm('Are you sure you want to delete this message?')) {
          onDeleteMessage(message.id);
      }
      setMenuOpen(false);
    };
  
    // --- Edit Handling ---
    const handleEdit = (e) => {
      e.stopPropagation();
      setIsEditing(true);
      setEditedText(message.text || ''); // Reset edit text to original on edit start
      setMenuOpen(false);
      // Focus the input shortly after it appears
      setTimeout(() => inputRef.current?.focus(), 50);
    };
  
    const handleCancelEdit = (e) => {
      e.stopPropagation();
      setIsEditing(false);
      
    };
  
    const handleSaveEdit = (e) => {
      e.stopPropagation();
      if (editedText.trim() === message.text?.trim()) {
          // No actual change, just cancel edit mode
          setIsEditing(false);
          return;
      }
      if (editedText.trim()) { // Don't save empty messages
          onUpdateMessage(message.id, editedText.trim());
          setIsEditing(false);
      } else {
          // If user cleared text, treat as delete or cancel?
          // For now, let's just cancel edit mode. Deleting should use the Delete button.
          setIsEditing(false);
          // Or maybe delete if text is empty?
          // if (window.confirm('Remove message text? This cannot be undone.')) {
          //    onUpdateMessage(message.id, ''); // Update with empty string
          //    setIsEditing(false);
          // }
      }
    };
  
    // Handle Enter key press in edit input to save
    const handleEditKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { // Save on Enter (not Shift+Enter)
            e.preventDefault();
            handleSaveEdit();
        } else if (e.key === 'Escape') { // Cancel on Escape
            handleCancelEdit();
        }
    };

  /**
   * Renders media content based on the type of media provided in the `message` object.
   * 
   * @returns {JSX.Element|null} A JSX element representing the media content or a link to the media,
   *                             or null if no media URL is provided.
   * 
   * The function handles the following media types:
   * - Images: Renders an <img> element for media types starting with "image/".
   * - Videos: Renders a <video> element for media types starting with "video/".
   * - Other files: Renders an <a> element linking to the media file.
   * 
   * The rendered elements include appropriate styling and accessibility attributes.
   */
  const renderMedia = () => {
    if (!message.mediaUrl || message.mediaUrl.length === 0) {
      return;
    }
  
    return (
      <div className="flex flex-wrap gap-2">
        {message.mediaUrl.map((url, index) => {
          if (url.includes("image")) {
            return (
              <img
                key={index}
                src={url}
                alt={`Uploaded content ${index + 1}`}
                className="max-w-xs max-h-64 rounded mt-2 cursor-pointer"
                onClick={() => window.open(url, "_blank")}
              />
            );
          } else if (url.includes("video")) {
            return (
              <video
                key={index}
                src={url}
                controls
                className="max-w-xs max-h-64 rounded mt-2"
              />
            );
          } else {
            return (
              <div
                key={index}
                className="p-3 mt-2 border rounded bg-gray-100 cursor-pointer hover:bg-gray-200"
                onClick={() => window.open(url, "_blank")}
              >
                <p className="text-blue-500">📄 Click to open document</p>
              </div>
            );
          }
        })}
      </div>
    );
  };
// --- Timestamp Formatting ---
const formatTimestamp = (ts) => {
  return ts ? format(ts.toDate(), 'p') : 'Sending...';
}

return (
// Add group class for hover effect on menu button
<div className={`group flex gap-2 my-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
  {/* Avatar (only for other messages) */}
  {!isOwnMessage && (
    <img
      src={senderInfo?.profilePicture || defaultAvatar}
      alt={senderInfo?.fullName || 'Sender'}
      className="w-8 h-8 rounded-full flex-shrink-0 self-end mb-1" // Align bottom
    />
  )}
     {/* Ellipsis Menu (only for own messages and not editing) */}
     {isOwnMessage && !isEditing && !message.isDeleted && (
       <div className="relative self-center mr-1" ref={menuRef}>
           {/* Show button on group hover */}
           <button
               onClick={handleMenuToggle}
               // Use opacity for hover effect, more accessible than display:none
               className=" text-gray-400 hover:text-gray-600 rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
               aria-label="Message options"
               aria-haspopup="true"
               aria-expanded={menuOpen}
           >
               <BsThreeDotsVertical className="h-4 w-4" />
           </button>

           {/* Dropdown Menu */}
           {menuOpen && (
               <div
                   className="absolute  right-0 bottom-0 mt-1 w-32 bg-white rounded-md shadow-lg border z-20"
                   role="menu" aria-orientation="vertical"
               >
                   <div className="py-1" role="none">
                       {/* Edit Button - Disable if message has media? Or allow text edit only? */}
                       <button
                           onClick={handleEdit}
                           className="w-full text-left flex items-center px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                           role="menuitem" tabIndex={-1}
                       >
                           <FiEdit2 className="mr-2 h-4 w-4 text-gray-500" aria-hidden="true" />
                           Edit
                       </button>
                       {/* Delete Button */}
                       <button
                           onClick={handleDelete}
                           className="w-full text-left flex items-center px-3 py-1.5 text-sm text-red-600 hover:bg-gray-100 hover:text-red-700"
                           role="menuitem" tabIndex={-1}
                       >
                           <FiTrash2 className="mr-2 h-4 w-4" aria-hidden="true" />
                           Delete
                       </button>
                   </div>
               </div>
           )}
       </div>
   )}

  {/* Message Bubble and Content Area */}
  <div className={`relative flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
     {/* Bubble styling */}
     <div
       className={`relative max-w-md lg:max-w-lg px-3 py-2 rounded-lg bg-gray-200 text-gray-800 ${
         isOwnMessage
           ? ' rounded-br-none'
           : ' rounded-bl-none'
       }`}
     >
       
       {!isOwnMessage && senderInfo && (
          <p className="text-xs font-semibold mb-1 text-gray-700">{senderInfo.firstName + " " + senderInfo.lastName}</p>
        )}

       {/* Message Content (Editing or Display) */}
       {isEditing ? (
           <div className="flex flex-col">
               <textarea
                   ref={inputRef}
                   value={editedText}
                   onChange={(e) => setEditedText(e.target.value)}
                   onKeyDown={handleEditKeyDown}
                   className={`w-full p-1  rounded text-white-600 focus:outline-none  focus:ring-blue-300 resize-none overflow-hidden min-h-[40px] text-sm`}
                   rows={Math.max(1, Math.min(5, editedText.split('\n').length))} // Auto-resize roughly
                   aria-label="Edit message"
               />
               <div className="flex justify-end gap-2 mt-1 text-xs">
                   <button onClick={handleCancelEdit} className="text-white-600 hover:underline font-medium">Cancel</button>
                   <button onClick={handleSaveEdit} className="text-white-600 hover:underline font-medium">Save</button>
               </div>
           </div>
       ) : (
           <>
               {/* Display Text (if not just media) */}
               {message.text && <p className="whitespace-pre-wrap break-words">{message.text}</p>}
               {/* Display Media */}
               {renderMedia()}
               {/* Timestamp and Edited Status */}
               <div className={`text-xs mt-1 flex items-center justify-end gap-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
                   {message.editedAt && <span className="italic text-xs">(edited)</span>}
                   <span>{formatTimestamp(message.timestamp)}</span>
               </div>
           </>
       )}
     </div>

     {/* Read Receipt (only for own messages) */}
     {isOwnMessage && showReadReceipt && !isEditing && (
       <p className="text-xs text-gray-500 mt-0.5 mr-1">Read</p>
     )}
     {isOwnMessage && !showReadReceipt && !isEditing && (
       <p className="text-xs text-gray-500 mt-0.5 mr-1">Sent</p>
     )}
  </div>

  {/* Spacer for own messages to align left content */}
  {isOwnMessage && <div className="w-8 flex-shrink-0"></div>}

</div>
);
};

export default MessageItem;