import React, { useState } from 'react';

const HashtagFollowButton = ({ hashtag }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = () => {
    setIsFollowing((prev) => !prev);
    // Optionally, send follow/unfollow API request here
  };

  return (
    <button
      onClick={handleFollow}
      className={
        isFollowing
          ? "bg-[#0a66c2] text-white border-[#0a66c2] py-2 px-4 rounded-full font-semibold flex items-center justify-center max-h-8 max-w-[480px] text-center outline-none text-base transition duration-200"
          : "bg-transparent text-[rgba(0,0,0,0.6)] border border-[rgba(0,0,0,0.6)] py-2 px-4 rounded-full font-semibold flex items-center justify-center max-h-8 max-w-[480px] text-center outline-none text-base transition duration-200 hover:bg-[rgba(0,0,0,0.08)] hover:border-2"
      }
    >
      <img src="/Images/plus-icon.svg" alt="plus" className="mr-1" />
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
};

export default HashtagFollowButton;