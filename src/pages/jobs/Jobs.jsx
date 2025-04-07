import React, { useEffect, useState } from 'react';
import Header from '../../components/UpperNavBar';
import ProfileCard from '../../components/ProfileCard';
import FooterLinks from '../../components/FooterLinks';
import axios from "axios";
import { FaClipboardList, FaBookmark, FaFileAlt, FaPen,FaArrowRight } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import JobCard from '../../components/jobs/JobCard';

const Jobs = () => {
   const [user, setUser] = useState();
   const [searchQuery, setSearchQuery] = useState("");
   const [showPreferences, setShowPreferences] = useState(false);
   const [jobs, setJobs]=useState()
  
   const getJobs = async () => {
    try {
      const response = await axios.get("http://localhost:3000/jobs", {
      });
      setJobs(response.data)
      console.log("Jobs Data:", response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("Error - Server Response:", error.response.data);
      } else if (error.request) {
        console.error("Error - No Response:", error.request);
      } else {
        console.error("Error:", error.message);
      }
    }
  };
  

   const testLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/user/login', {
        email: "Charlie.Kreiger@yahoo.com",
        password: "password123"
      },
      
    );

      console.log("Login Response:", response.data);
    } catch (error) {
      if (error.response) {
  
        console.error("Login Error - Server Response:", error.response.data);
      } else if (error.request) {
        // Request made but no response received
        console.error("Login Error - No Response:", error.request);
      } else {
        // Something else happened
        console.error("Login Error:", error.message);
      }
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:3000/user/me", {
    
        withCredentials:true
      });
  
      setUser(response.data);
      console.log("User data:", response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  useEffect(() => {

      testLogin(); // Ensure login is completed first
      fetchUser(); // Fetch user data after login
      getJobs(); // Fetch jobs after user data is retrieved
   
  }, []);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="container bg-[#f4f2ee] min-h-screen ">
      <Header onSearchChange={handleSearchChange} />
      <div className="container mx-auto px-4 pt-20 flex flex-col md:flex-row gap-6">
        {/* Left Sidebar */}
        <div className="w-full md:w-1/4 p-4">
          {/* <ProfileCard user={user} /> */}
          <div className="bg-white shadow-md rounded-lg pt-1 space-y-1 mt-2.5">
            <button 
              onClick={() => setShowPreferences(true)}
              className="flex items-center font-semibold text-[#3d3d3d] gap-3 w-full text-left py-3 px-6 hover:bg-gray-100">
              <FaClipboardList className="font-semibold text-[#3d3d3d]" /> Preferences
            </button>
            <button className="flex items-center gap-3 font-semibold w-full text-left py-3 px-6 hover:bg-gray-100">
              <FaBookmark className="font-semibold text-[#3d3d3d]" /> My jobs
            </button>
            <button className="flex items-center gap-3 w-full font-semibold text-left p-5 text-blue-600 hover:bg-gray-100 rounded-md">
              <FaPen className="text-blue-600 font-bold" /> Post a free job
            </button>
          </div>
        </div>

        {/*Top picks for you */}
        <div className="flex-1 bg-white shadow-md rounded-lg p-6 mr-[315px]">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2" >
            Job Picks for you
          </h2>
          {jobs && jobs.length > 0 ? (
            jobs.map((job, index) => (
              <JobCard key={index} job={job} />
            ))
          ) : (
            <p>No jobs available at the moment.</p>
          )}
        </div>
      </div>
      
      {/* Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 "
        onClick={() => setShowPreferences(false)}>
          <div className="bg-white shadow-lg rounded-lg relative "
            onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowPreferences(false)} className="absolute top-3 right-3 text-gray-600 hover:text-black">
              <IoMdClose size={24} />
            </button>
            <h2 className=" p-6 text-lg font-semibold border-b border-[#eaeaea]">Preferences</h2>
            
            {/* My Interests Section */}
            <div className="p-6 ">
              <h3 className="text-md font-semibold mb-2">My Interests</h3>
              <div className='flex flex-col text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-md'>
              <button className="w-full  flex justify-between items-center ">Open to work  <FaArrowRight />
              </button>
              <p className='text-xs text-[#5e5e5e]'> Share job preferences with recuiters or others</p>
              </div>
            </div>
            
            {/* My Qualifications Section */}
            <div className='p-6 '>
              <h3 className="text-md font-semibold mb-2">My Qualifications</h3>
              <div className='flex flex-col text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-md'>
              <button className="w-full  flex justify-between items-center ">Resumes and application data  <FaArrowRight />     
              </button>
              </div>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
