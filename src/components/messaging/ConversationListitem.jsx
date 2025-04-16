
import React, { useState, useRef, useEffect } from 'react';
import { formatDistanceToNowStrict } from 'date-fns'; // For relative time
import { BsThreeDotsVertical, BsCheckCircle, BsEnvelope } from 'react-icons/bs';
/**
 * ConversationListItem component renders a single conversation item in a list.
 * It displays the other user's profile picture, name, last message, timestamp, 
 * and an unread message count badge. It also includes a dropdown menu for 
 * marking the conversation as read or unread.
 *
 * @param {Object} props - The props object.
 * @param {Object} props.conversation - The conversation object containing details about the conversation.
 * @param {Object} props.currentUser - The current logged-in user object.
 * @param {Object} props.otherUserInfo - The other user's information object (e.g., profile picture, full name).
 * @param {boolean} props.isSelected - Indicates whether the conversation is currently selected.
 * @param {Function} props.onClick - Callback function triggered when the conversation item is clicked.
 * @param {Function} props.onMarkReadUnread - Callback function to mark the conversation as read or unread.
 * 
 * @returns {JSX.Element} The rendered ConversationListItem component.
 */
const ConversationListItem = ({
  conversation,
  currentUser,
  otherUserInfo,
  isSelected,
  onClick,
  onMarkReadUnread
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null); // Ref for detecting clicks outside the menu


   // Close menu if clicking outside
   useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]); 


  
  if (!otherUserInfo) {
    //render a loading state or minimal info
    return (
      <div className={`flex items-center p-3 hover:bg-gray-100 cursor-pointer border-b border-l-4 ${isSelected ? 'bg-gray-100 border-blue-500' : 'border-transparent'}`}>
        <div className="w-12 h-12 bg-gray-300 rounded-full mr-3 animate-pulse"></div>
        <div className="flex-grow">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-1 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
      </div>
    );
  }

  const lastMessageText = conversation.lastMessage?.text || 'No messages yet';
  const timestamp = conversation.lastUpdatedAt?.toDate();
  const unreadCount = conversation.unreadCounts?.[currentUser?.uid] || 0;

  /**
   * Toggles the state of the menu and prevents the click event from propagating.
   *
   * @param {React.MouseEvent} e - The mouse event triggered by the user interaction.
   */
  const handleMenuToggle = (e) => {
    e.stopPropagation(); // Prevent item click when opening menu
    setMenuOpen(!menuOpen);
  };

  /**
   * Handles the click event for marking a conversation as read or unread.
   *
   * @param {Object} e - The event object from the click event.
   * @param {boolean} markAsUnread - A flag indicating whether to mark the conversation as unread (true) or read (false).
   * @returns {void}
   */
  const handleMarkClick = (e, markAsUnread) => {
    e.stopPropagation(); // Prevent item click
    setMenuOpen(false); // Close menu
    onMarkReadUnread(conversation.id, markAsUnread); // Call handler from parent
    
  };
  return (
    <div
      className={`relative flex items-start p-3 hover:bg-gray-100 cursor-pointer  border-l-4 ${isSelected ? 'bg-gray-100 border-green-600' : 'border-transparent'}`}
      onClick={onClick}
      role="button"
      aria-selected={isSelected}
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
    >
      {/* Profile Picture */}
      <img
        src={otherUserInfo.profilePicture || defaultAvatar}
        alt={otherUserInfo.fullName}
        className="w-12 h-12 rounded-full mr-3 flex-shrink-0"
        onError={(e) => e.target.src = defaultAvatar}
      />
      {/* Text Content Area */}
      <div className="flex-grow min-w-0">
         {/* Top row: Name and Timestamp */}
         <div className="flex justify-between items-center mb-1">
             <p className={`font-semibold truncate ${unreadCount > 0 ? 'text-black' : 'text-gray-800'}`}>
                 {otherUserInfo.fullName}
             </p>
             {timestamp && ( /* timestamp display */
                 <p className={`text-xs flex-shrink-0 ml-2 ${unreadCount > 0 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                     {formatDistanceToNowStrict(timestamp, { addSuffix: false })}
                 </p>
             )}
         </div>
         {/* Bottom row: Last message snippet and Unread badge */}
         <div className="flex justify-between items-center">
             <p className={`text-sm text-gray-600 truncate ${unreadCount > 0 ? 'font-medium' : ''}`}>
                 {conversation.lastMessage?.senderId === currentUser?.uid && 'You: '}
                 {lastMessageText}
             </p>
             {unreadCount > 0 && ( /*unread badge*/
                 <span className="bg-blue-500 text-white text-xs font-bold rounded-full px-2 py-0.5 ml-2 flex-shrink-0">
                     {unreadCount}
                 </span>
             )}
         </div>
      </div>

      {/* Ellipsis Menu Button  */}
      <button
        onClick={handleMenuToggle}
        className="p-1 ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full flex-shrink-0 z-10"
        aria-label="Conversation options"
        aria-haspopup="true"
        aria-expanded={menuOpen}
      >
        <BsThreeDotsVertical className="h-5 w-5" />
      </button>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute top-8 right-4 mt-1 w-48 bg-white rounded-md shadow-lg border z-20"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1" role="none">
            {/* Mark as Unread Option */}
            {unreadCount === 0 && (
              <button
                onClick={(e) => handleMarkClick(e, true)}
                className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
                tabIndex={-1}
              >
                
                <BsEnvelope className="mr-3 h-4 w-4 text-gray-500" aria-hidden="true" />
                Mark as Unread
              </button>
            )}
            {/* Mark as Read Option */}
            {unreadCount > 0 && (
              <button
                onClick={(e) => handleMarkClick(e, false)}
                className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
                tabIndex={-1}
              >
                 
                 <BsCheckCircle className="mr-3 h-4 w-4 text-gray-500" aria-hidden="true" />
                Mark as Read
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationListItem;