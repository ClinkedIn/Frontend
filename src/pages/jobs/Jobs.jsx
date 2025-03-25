import React from 'react';
import Header from '../../components/UpperNavBar';
import ProfileCard from '../../components/ProfileCard';
import FooterLinks from '../../components/FooterLinks';
import { FaClipboardList, FaBookmark, FaFileAlt, FaPen } from 'react-icons/fa';

const Jobs = () => {
  const dummyUser = {
    name: "Hamsa Saber",
    location: "Cairo, Egypt",
    university: "Cairo University",
    profileImage: "https://via.placeholder.com/80",
  };

  return (
    <div className="bg-[#f4f2ee] min-h-screen md:pl-[150px] md:pr-[150px]">
      <Header />
      <div className="container mx-auto px-4 pt-20 flex flex-col md:flex-row gap-6">
        {/* Left Sidebar */}
        <div className="w-full md:w-1/4  p-4">
          <ProfileCard user={dummyUser} />
          <div className="bg-white shadow-md rounded-lg pt-1 space-y-1 mt-2.5 ">
            <button className="flex items-center font-semibold text-[#3d3d3d] gap-3 w-full text-left py-3 px-6 hover:bg-gray-100">
              <FaClipboardList className="font-semibold text-[#3d3d3d]" /> Preferences
            </button>
            <button className="flex items-center gap-3 font-semibold w-full text-left py-3 px-6 hover:bg-gray-100 ">
              <FaBookmark className="font-semibold text-[#3d3d3d]" /> My jobs
            </button>
            <button className="flex items-center gap-3 font-semibold w-full text-left p-5 hover:bg-gray-100 ">
              <FaFileAlt className="font-semibold text-[#3d3d3d]" /> Interview prep
            </button>
            <button className="flex items-center gap-3 w-full font-semibold text-left p-5 text-blue-600 hover:bg-gray-100 rounded-md">
              <FaPen className="text-blue-600 font-bold" /> Post a free job
            </button>
          </div>
          <FooterLinks />
        </div>
        
        {/*Top picks for you */}
        <div className="flex-1 bg-white shadow-md rounded-lg p-6">
        </div>
      </div>
     
    </div>
  );
};

export default Jobs;
