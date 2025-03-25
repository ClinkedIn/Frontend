import React, { useState, useEffect, useRef } from 'react';

const PostReactions = ({ postId, onReact, reactionTypes }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const menuRef = useRef(null);
  const timeoutRef = useRef(null);
  
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

  return (
    <div 
      ref={containerRef}
      className="relative reaction-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Regular Like button */}
      <button 
        onClick={() => onReact(postId, 'like')}
        className="outline-none text-[rgba(0,0,0,0.6)] p-3 px-6 bg-transparent flex items-center cursor-pointer gap-1.25 rounded-md transition duration-200 hover:bg-[rgba(0,0,0,0.08)] font-semibold"
      >
        <img className="unLiked" src="/Images/like.svg" alt="like" />
        <span>Like</span>
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
                onReact(postId, reaction.type);
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