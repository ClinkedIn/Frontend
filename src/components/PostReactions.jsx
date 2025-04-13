import React, { useState, useEffect, useRef } from 'react';

const PostReactions = ({ postId, onReact, reactionTypes, isLiked = false, currentReaction = 'like' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const menuRef = useRef(null);
  const timeoutRef = useRef(null);
  
  // Find the current reaction object based on type
  const activeReaction = isLiked ? 
    reactionTypes.find(r => r.type.toLowerCase() === currentReaction.toLowerCase()) || reactionTypes[0] : 
    null;
  
  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target) &&
        menuRef.current && 
        !menuRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Handle mouse enter/leave with delay
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    // Add a delay before closing to allow moving to the menu
    timeoutRef.current = setTimeout(() => {
      if (!menuRef.current || !menuRef.current.matches(':hover')) {
        setIsOpen(false);
      }
    }, 300);
  };

  // Handle menu hover
  const handleMenuMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleMenuMouseLeave = () => {
    setIsOpen(false);
  };

  // Handle like button click - toggle like state
  const handleLikeClick = () => {
    // If already liked, call onReact with the isRemove flag set to true
    // Otherwise, just like the post normally
    onReact(postId, isLiked ? currentReaction : 'like', isLiked);
  };

  // Get the appropriate reaction icon
  const getReactionIcon = () => {
    if (!isLiked) {
      return <img src="/Images/like.svg" alt="like" />;
    }
    
    // Return the emoji for the current reaction type
    switch (currentReaction.toLowerCase()) {
      case 'like':
        return <span className="text-xl mr-1">👍</span>;
      case 'celebrate':
        return <span className="text-xl mr-1">👏</span>;
      case 'support':
        return <span className="text-xl mr-1">❤️</span>;
      case 'insightful':
        return <span className="text-xl mr-1">💡</span>;
      case 'funny':
        return <span className="text-xl mr-1">😄</span>;
      default:
        return <span className="text-xl mr-1">{activeReaction?.emoji || '👍'}</span>;
    }
  };
  
  // Get the label for the current reaction
  const getReactionLabel = () => {
    if (!isLiked) {
      return 'Like';
    }
    
    switch (currentReaction.toLowerCase()) {
      case 'like':
        return 'Liked';
      case 'celebrate':
        return 'Celebrated';
      case 'support':
        return 'Supported';
      case 'insightful':
        return 'Insightful';
      case 'funny':
        return 'Funny';
      default:
        return activeReaction?.label || 'Liked';
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative reaction-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Like button that changes style based on the reaction */}
      <button 
        onClick={handleLikeClick}
        className={`outline-none p-3 px-6 bg-transparent flex items-center cursor-pointer gap-1.25 rounded-md transition duration-200 hover:bg-[rgba(0,0,0,0.08)] font-semibold ${
          isLiked ? 'text-[#0a66c2]' : 'text-[rgba(0,0,0,0.6)]'
        }`}
      >
        {getReactionIcon()}
        <span>{getReactionLabel()}</span>
      </button>
      
      {/* Reaction Popup with enhanced visibility */}
      {isOpen && (
        <div 
          ref={menuRef}
          className="fixed transform -translate-x-0 bg-white rounded-full shadow-2xl border-2 border-gray-300 p-3 z-[9999]" 
          style={{
            bottom: containerRef.current ? 
              window.innerHeight - containerRef.current.getBoundingClientRect().top + 10 : '0',
            left: containerRef.current ? 
              containerRef.current.getBoundingClientRect().left : '0',
            boxShadow: '0 0 15px rgba(0,0,0,0.2)',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onMouseEnter={handleMenuMouseEnter}
          onMouseLeave={handleMenuMouseLeave}
        >
          {reactionTypes.map((reaction) => (
            <button
              key={reaction.type}
              onClick={(e) => {
                e.stopPropagation();
                // Always use false for isRemove when selecting a reaction from the menu
                onReact(postId, reaction.type, false);
                setIsOpen(false);
              }}
              className="p-2 mx-1 hover:scale-125 transition-transform duration-200 bg-gray-100 hover:bg-gray-200 rounded-full"
              title={reaction.label}
            >
              <span className="text-2xl">{reaction.emoji}</span>
            </button>
          ))}
        </div>
      )}

      {/* Add global styles for animation */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default PostReactions;