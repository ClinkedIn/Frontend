import React from 'react';

// Dummy user data
const dummyUser = {
  photoURL: '/Images/photo.svg',
  displayName: 'John Doe',
};

const Leftside = () => {
  return (
    <div className="grid-area-leftside">
      <div className="text-center overflow-hidden mb-2 bg-white rounded-md relative border-none shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_0_0_rgba(0,0,0,0.20)] transition-shadow duration-83">
        <div className="border-b border-[rgba(0,0,0,0.15)] p-3 pb-4 break-words">
          <div className="bg-[url('/Images/card-bg.svg')] bg-center bg-[length:462px] h-[54px] -m-3 mb-0"></div>
          <a href="/feed">
            <img
              src={dummyUser.photoURL}
              className="w-[72px] h-[72px] box-border bg-white bg-clip-content bg-center bg-[length:60%] bg-no-repeat border-2 border-white -mt-[38px] mb-3 mx-auto rounded-full"
              alt="User profile"
            />
            <div className="text-base leading-6 text-[rgba(0,0,0,0.9)] font-semibold">
              Welcome, {dummyUser.displayName}
            </div>
          </a>
          <a href="/feed">
            <div className="text-[#0a66c2] mt-1 text-xs leading-[1.33] font-normal">
              Add a photo
            </div>
          </a>
        </div>
        <div className="border-b border-[rgba(0,0,0,0.15)] pt-3 pb-3">
          <a href="/feed" className="no-underline flex justify-between items-start p-1 px-3 hover:bg-[rgba(0,0,0,0.08)]">
            <div className="flex flex-col text-left">
              <span className="text-xs leading-[1.333] text-[rgba(0,0,0,0.6)]">Connections</span>
              <span className="text-xs leading-[1.333] text-black font-semibold">Grow your network</span>
            </div>
            <p className="text-[#0a66c2] text-[13px] font-semibold">130</p>
          </a>
        </div>
        <a href="#" className="border-[rgba(0,0,0,0.8)] text-left p-3 text-xs block hover:bg-[rgba(0,0,0,0.08)]">
          <span className="flex items-center text-black">
            <img src="/Images/item-icon.svg" alt="Item icon" className="mr-1" />
            My Items
          </span>
        </a>
      </div>

      <div className="text-center overflow-hidden mb-2 bg-white rounded-md relative border-none shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_0_0_rgba(0,0,0,0.20)] p-2 pt-0 text-left flex flex-col sticky top-[75px]">
        <a href="/feed" className="text-black p-1 px-3 text-xs hover:text-[#0a66c2]">
          <span>Groups</span>
        </a>
        <a href="/feed" className="text-black p-1 px-3 text-xs hover:text-[#0a66c2]">
          <span className="flex items-center justify-between">
            Events
            <img src="/Images/plus-icon.svg" alt="Plus icon" />
          </span>
        </a>
        <a href="/feed" className="text-black p-1 px-3 text-xs hover:text-[#0a66c2]">
          <span>Follow Hashtags</span>
        </a>
        <a href="/feed" className="text-[rgba(0,0,0,0.6)] no-underline border-t border-[#d6cec2] p-3 text-xs hover:bg-[rgba(0,0,0,0.08)]">
          <span>Discover more</span>
        </a>
      </div>
    </div>
  );
};

export default Leftside;