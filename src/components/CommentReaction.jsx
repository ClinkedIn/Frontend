import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../constants';

const CommentReactions = ({ 
  commentId, 
  onReact,
  reactionTypes, 
  isLiked = false,
  currentReaction = 'like'
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState(isLiked ? currentReaction : null);
  const containerRef = useRef(null);

  const handleReactionClick = async (type) => {
    // If already selected this reaction, toggle it off
    if (selectedReaction === type) {
      setSelectedReaction(null);
      await onReact(commentId, type, true);
    } else {
      // First remove previous reaction if any
      if (selectedReaction) {
        await onReact(commentId, selectedReaction, true);
      }
      // Then set new reaction
      setSelectedReaction(type);
      await onReact(commentId, type, false);
    }
    setShowReactions(false);
  };

  // Handle clicks outside to close reaction panel
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowReactions(false);
      }
    };

    if (showReactions) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showReactions]);

  useEffect(() => {
    setSelectedReaction(isLiked ? currentReaction : null);
  }, [isLiked, currentReaction]);

  // Find the selected reaction object
  const activeReaction = reactionTypes.find(r => r.type === selectedReaction) || reactionTypes[0];

  return (
    <div ref={containerRef} className="relative">
      {/* Reaction button */}
      <button
        onClick={() => selectedReaction ? handleReactionClick(selectedReaction) : setShowReactions(true)}
        onMouseEnter={() => !selectedReaction && setShowReactions(true)}
        className={`outline-none p-2 px-3 bg-transparent flex items-center cursor-pointer gap-1.25 rounded-md transition duration-200 hover:bg-[rgba(0,0,0,0.08)] ${
          selectedReaction ? 'text-[#0a66c2] font-semibold' : 'text-[rgba(0,0,0,0.6)]'
        }`}
      >
        <span className="text-lg">
          {selectedReaction ? activeReaction.emoji : '👍'}
        </span>
        <span className="text-xs">
          {selectedReaction ? activeReaction.label : 'Like'}
        </span>
      </button>

      {/* Reaction picker */}
      {showReactions && (
        <div className="absolute bottom-full left-0 mb-1 bg-white rounded-full shadow-lg z-10 p-1 flex">
          {reactionTypes.map(reaction => (
            <button
              key={reaction.type}
              onClick={() => handleReactionClick(reaction.type)}
              className="reaction-button text-2xl p-1 hover:bg-gray-100 rounded-full transition-transform hover:scale-125"
              title={reaction.label}
            >
              {reaction.emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentReactions;