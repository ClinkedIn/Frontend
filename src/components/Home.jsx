import Leftside from "../components/LeftSide";
import Main from "./Main";
import Rightside from "../components/RightSide";
import Header from "./UpperNavBar";
import { useState } from "react";

const Home = () => {
  document.title = "Feed | LinkedIn";
  const [showSavedPosts, setShowSavedPosts] = useState(false);

  const handleShowSavedPosts = () => {
    setShowSavedPosts(true);
  };

  return (
    <div className="w-screen bg-[#f5f5f5]">
      {/* Navbar at the top */}
      <Header />

      {/* Content grid layout */}
      <div className="pt-[52px] grid grid-cols-[1fr_2fr_1fr] max-w-[1400px] mx-auto gap-x-6 gap-y-6 w-full">
        <Leftside onShowSavedPosts={handleShowSavedPosts} />
        <Main showSavedPosts={showSavedPosts} setShowSavedPosts={setShowSavedPosts} />
        <Rightside />
      </div>
    </div>
  );
};

export default Home;