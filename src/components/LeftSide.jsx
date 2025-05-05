import React, { useState, useEffect } from 'react'
import { BASE_URL } from "../constants";
import axios from 'axios';

// Dummy user data - replace with real user data from your auth system
const dummyUser = {
  photoURL: 'https://picsum.photos/72',
  displayName: 'Saif Wael',
  headline: 'Software Engineer',
  viewCount: 23,
  impressions: 8,
};

const getUserInfo = async () => {
  const response = await axios.get(`${BASE_URL}/user/me`, { withCredentials: true });
  return response.data;
};

const Leftside = ({ onShowSavedPosts, onShowAllPosts }) => {
  const [userData, setUserData] = useState(null);
  const [isShowMore, setIsShowMore] = useState(false);

  const [activeView, setActiveView] = useState('feed'); // 'feed' or 'saved'

  const handleSavedPostsClick = () => {
    if (activeView === 'feed') {
      setActiveView('saved');
      onShowSavedPosts();
    } else {
      setActiveView('feed');
      onShowAllPosts();
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserInfo();
        setUserData(data);
      } catch (err) {
        console.error('Failed to fetch user info:', err);
      }
    };
    fetchUser();
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const displayName = userData.user.firstName + " " + userData.user.lastName;
  const headline = userData.user.headline;

  return (
    <div className="grid-area-leftside">
      {/* Profile Card */}
      <div className="text-center overflow-hidden mb-2 bg-white rounded-lg border-none shadow-[0_0_0_1px_rgba(0,0,0,0.15)] transition-shadow duration-83">
        {/* Background and Profile Section */}
        <div className="border-b border-[rgba(0,0,0,0.08)] pb-2">
          <div className="bg-[url('/Images/card-bg.svg')] bg-center bg-cover h-[54px] -m-1"></div>
          <a href="/in/saifwael" className="block relative">  
            <img
              src={userData.user.profilePicture}
              className="w-[72px] h-[72px] box-border bg-white border-2 border-white -mt-9 mb-3 mx-auto rounded-full"
              alt="User profile"
            />
            <div className="text-base leading-6 text-[rgba(0,0,0,0.9)] font-semibold hover:underline">
              {displayName}
            </div>
          </a>
          <p className="text-xs text-[rgba(0,0,0,0.6)] px-3 mt-1">
            {headline}
          </p>
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
        <button
          type="button"
          onClick={handleSavedPostsClick}
          className="flex items-center text-xs text-[rgba(0,0,0,0.6)] font-semibold p-3 hover:bg-[rgba(0,0,0,0.08)] w-full text-left"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <img src="/Images/item-icon.svg" alt="Item icon" className="w-4 h-4 mr-2" />
          {activeView === 'feed' ? 'My Items' : 'Back to Feed'}
        </button>
      </div>
    </div>
  );
};

export default Leftside;