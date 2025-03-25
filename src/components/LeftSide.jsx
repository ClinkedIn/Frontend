import React, { useState } from 'react';

// Dummy user data - replace with real user data from your auth system
const dummyUser = {
  photoURL: 'https://picsum.photos/72',
  displayName: 'Saif Wael',
  headline: 'Software Engineer',
  viewCount: 23,
  impressions: 8,
};

const Leftside = () => {
  const [isShowMore, setIsShowMore] = useState(false);

  return (
    <div className="grid-area-leftside">
      {/* Profile Card */}
      <div className="text-center overflow-hidden mb-2 bg-white rounded-lg border-none shadow-[0_0_0_1px_rgba(0,0,0,0.15)] transition-shadow duration-83">
        {/* Background and Profile Section */}
        <div className="border-b border-[rgba(0,0,0,0.08)] pb-2">
          <div className="bg-[url('/Images/card-bg.svg')] bg-center bg-cover h-[54px] -m-1"></div>
          <a href="/in/saifwael" className="block relative">
            <img
              src={dummyUser.photoURL}
              className="w-[72px] h-[72px] box-border bg-white border-2 border-white -mt-9 mb-3 mx-auto rounded-full"
              alt="User profile"
            />
            <div className="text-base leading-6 text-[rgba(0,0,0,0.9)] font-semibold hover:underline">
              {dummyUser.displayName}
            </div>
          </a>
          <p className="text-xs text-[rgba(0,0,0,0.6)] px-3 mt-1">
            {dummyUser.headline}
          </p>
        </div>
        
        {/* Stats Section */}
        <div className="border-b border-[rgba(0,0,0,0.08)] py-2">
          <a href="/feed/stats" className="no-underline flex justify-between items-center p-2 px-3 hover:bg-[rgba(0,0,0,0.08)]">
            <div className="flex flex-col text-left">
              <span className="text-xs leading-4 text-[rgba(0,0,0,0.6)]">Who's viewed your profile</span>
            </div>
            <p className="text-[#0a66c2] text-xs font-semibold">{dummyUser.viewCount}</p>
          </a>
          <a href="/feed/stats/impressions" className="no-underline flex justify-between items-center p-2 px-3 hover:bg-[rgba(0,0,0,0.08)]">
            <div className="flex flex-col text-left">
              <span className="text-xs leading-4 text-[rgba(0,0,0,0.6)]">Impressions of your post</span>
            </div>
            <p className="text-[#0a66c2] text-xs font-semibold">{dummyUser.impressions}</p>
          </a>
        </div>

        {/* Premium Section */}
        <div className="border-b border-[rgba(0,0,0,0.08)] py-3 px-3 text-left">
          <a href="/premium/products" className="text-xs text-[rgba(0,0,0,0.6)] hover:text-[rgba(0,0,0,0.9)]">
            <span className="flex items-start">
              <img src="/Images/linkedin.png" alt="Premium" className="w-4 h-4 mr-1" />
              Access exclusive tools & insights
              <br />
              <span className="font-semibold text-[#915907] ml-5 mt-1">Try Premium for free</span>
            </span>
          </a>
        </div>

        {/* My Items Section */}
        <a href="/my-items" className="flex items-center text-xs text-[rgba(0,0,0,0.6)] font-semibold p-3 hover:bg-[rgba(0,0,0,0.08)]">
          <img src="/Images/item-icon.svg" alt="Item icon" className="w-4 h-4 mr-2" />
          My Items
        </a>
      </div>

      {/* Recent & Groups Section */}
      <div className="text-center overflow-hidden mb-2 bg-white rounded-lg border-none shadow-[0_0_0_1px_rgba(0,0,0,0.15)] text-left flex flex-col sticky top-[75px]">
        <div className="px-3 pt-3 pb-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold">Recent</span>
            <button className="p-1 rounded hover:bg-[rgba(0,0,0,0.08)]">
              <img src="/Images/down-icon.svg" alt="Toggle" className={`w-4 h-4 transition-transform ${isShowMore ? 'rotate-180' : ''}`} onClick={() => setIsShowMore(!isShowMore)} />
            </button>
          </div>
          
          {isShowMore && (
            <div className="mt-2">
              <a href="/groups/recent" className="text-xs text-[rgba(0,0,0,0.6)] flex items-center py-1 hover:text-[#0a66c2]">
                <img src="/Images/hashtag.svg" alt="#" className="w-4 h-4 mr-2" />
                javascript
              </a>
              <a href="/groups/recent" className="text-xs text-[rgba(0,0,0,0.6)] flex items-center py-1 hover:text-[#0a66c2]">
                <img src="/Images/hashtag.svg" alt="#" className="w-4 h-4 mr-2" />
                webdevelopment
              </a>
              <a href="/groups/recent" className="text-xs text-[rgba(0,0,0,0.6)] flex items-center py-1 hover:text-[#0a66c2]">
                <img src="/Images/group-icon.svg" alt="Group" className="w-4 h-4 mr-2" />
                React Developers
              </a>
            </div>
          )}
          
          <div className="my-2">
            <a href="/groups" className="text-xs text-[#0a66c2] font-semibold hover:underline">
              Groups
            </a>
          </div>
          
          <div className="flex justify-between items-center my-2">
            <a href="/events" className="text-xs text-[#0a66c2] font-semibold hover:underline">
              Events
            </a>
            <a href="/events/create" className="p-1 rounded hover:bg-[rgba(0,0,0,0.08)]">
              <img src="/Images/plus-icon.svg" alt="Add" className="w-4 h-4" />
            </a>
          </div>
          
          <a href="/hashtags" className="block text-xs text-[#0a66c2] font-semibold my-2 hover:underline">
            Followed Hashtags
          </a>
        </div>
        
        <div className="border-t border-[rgba(0,0,0,0.08)] mt-1">
          <a href="/discover-more" className="text-[rgba(0,0,0,0.6)] font-semibold no-underline block p-3 text-xs text-center hover:bg-[rgba(0,0,0,0.08)]">
            Discover more
          </a>
        </div>
      </div>
    </div>
  );
};

export default Leftside;