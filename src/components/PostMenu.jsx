import React, { useState, useEffect, useRef } from 'react';

/**
 * PostMenu component renders a dropdown menu with options to hide, save, report, or delete a post.
 * The menu toggles visibility when the ellipsis button is clicked and closes when clicking outside.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.postId - The unique identifier of the post.
 * @param {Function} props.onHide - Callback function triggered when the "Hide this post" option is selected.
 * @param {Function} props.onSave - Callback function triggered when the "Save this post" option is selected.
 * @param {Function} props.onReport - Callback function triggered when the "Report this post" option is selected.
 * @param {Function} [props.onDelete] - Callback function triggered when the "Delete post" option is selected.
 * @param {boolean} [props.isPostOwner=false] - Whether the current user is the owner of the post.
 * @param {boolean} [props.isSaved=false] - Whether the post is currently saved by the user.
 * @returns {JSX.Element} The rendered PostMenu component.
 */
const PostMenu = ({ 
  postId, 
  onHide, 
  onSave, 
  onReport, 
  onDelete, 
  isPostOwner = false, 
  isSaved = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  
  /**
   * Toggles the state of the menu between open and closed.
   * Updates the `isOpen` state by inverting its current value.
   */
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={toggleMenu}
        className="bg-transparent border-none cursor-pointer p-1.25 rounded-full hover:bg-[rgba(0,0,0,0.08)] transition duration-200"
      >
        <img src="/Images/ellipsis.svg" alt="ellipsis" className="w-full h-full" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-8 z-10 bg-white rounded-md shadow-lg border border-[rgba(0,0,0,0.15)] min-w-[250px]">
          <ul className="py-1">
            <li 
              onClick={() => {
                onHide(postId);
                setIsOpen(false);
              }}
              className="px-4 py-2 hover:bg-[rgba(0,0,0,0.05)] cursor-pointer flex items-center text-[rgba(0,0,0,0.6)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Hide this post
            </li>
            <li 
              onClick={() => {
                onSave(postId);
                setIsOpen(false);
              }}
              className="px-4 py-2 hover:bg-[rgba(0,0,0,0.05)] cursor-pointer flex items-center text-[rgba(0,0,0,0.6)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              {isSaved ? "Unsave this post" : "Save this post"}
            </li>
            
            {/* Only show delete option if user is post owner */}
            {isPostOwner && onDelete && (
              <li 
                onClick={() => {
                  onDelete(postId);
                  setIsOpen(false);
                }}
                className="px-4 py-2 hover:bg-[rgba(0,0,0,0.05)] cursor-pointer flex items-center text-red-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete post
              </li>
            )}
            
            <li className="border-t border-[rgba(0,0,0,0.08)]"></li>
            <li 
              onClick={() => {
                onReport(postId);
                setIsOpen(false);
              }}
              className="px-4 py-2 hover:bg-[rgba(0,0,0,0.05)] cursor-pointer flex items-center text-[rgba(0,0,0,0.6)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Report this post
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default PostMenu;