import Leftside from "../components/LeftSide";
import React, { useState } from "react";
import Main from "./Main";
import Rightside from "../components/RightSide";
import Header from "./UpperNavBar";

const Home = () => {
  document.title = "Feed | LockedIn";

  // State to control which posts to show
  const [showSavedPosts, setShowSavedPosts] = useState(false);

  // Handlers to pass down
  const handleShowSavedPosts = () => setShowSavedPosts(true);
  const handleShowAllPosts = () => setShowSavedPosts(false);

  return (
    <div className="w-screen bg-[#f5f5f5]">
      {/* Navbar at the top */}
      <Header />

      {/* Content grid layout */}
      <div className="pt-[52px] grid grid-cols-[1fr_2fr_1fr] max-w-[1400px] mx-auto gap-x-6 gap-y-6 w-full">
       <Leftside 
          onShowSavedPosts={handleShowSavedPosts} 
          onShowAllPosts={handleShowAllPosts} 
        />
        <Main 
          showSavedPosts={showSavedPosts}
          onShowSavedPosts={handleShowSavedPosts}
          onShowAllPosts={handleShowAllPosts}
        />
        <Rightside />
      </div>
    </div>
  );
};

export default Home;
