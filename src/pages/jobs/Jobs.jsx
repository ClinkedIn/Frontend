/**
 * Jobs Component
 * 
 * This component renders a job listing page with user profile information, 
 * sidebar navigation for job preferences, and a list of job recommendations. 
 * It also includes a modal for setting job preferences.
 * 
 * Features:
 * - Authenticates a test user and fetches user data
 * - Fetches a list of job postings from the server
 * - Displays job postings using the JobCard component
 * - Sidebar for preferences, my jobs, and posting a job
 * - Modal for editing user job preferences and qualifications
 * 
 * @component
 * @returns {JSX.Element} The rendered job listing page
 */
import React, { useEffect, useState } from 'react';
import Header from '../../components/UpperNavBar';
import ProfileCard from '../../components/ProfileCard';
import FooterLinks from '../../components/FooterLinks';
import axios from "axios";
import { FaClipboardList, FaBookmark, FaFileAlt, FaPen,FaArrowRight } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import JobCard from '../../components/jobs/JobCard';
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../constants";


/**
 * Jobs functional component
 * @returns {JSX.Element}
 */
const Jobs = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState();
    const [searchQuery, setSearchQuery] = useState("");
    const [showPreferences, setShowPreferences] = useState(false);
    const [jobs, setJobs]=useState()
    
    // useEffect(() => {
    // const testLogin = async () => {
    //     try {
    //       const response = await axios.post('http://localhost:3000/api/user/login', {
    //         email: "Sidney55@gmail.com",
    //         password: "password123"
    //       },{
    //         withCredentials:true
    //       }
          
    //     );
    
    //       console.log("Login Response:", response.data);
    //     } catch (error) {
    //       if (error.response) {
      
    //         console.error("Login Error - Server Response:", error.response.data);
    //       } else if (error.request) {
    //         // Request made but no response received
    //         console.error("Login Error - No Response:", error.request);
    //       } else {
    //         // Something else happened
    //         console.error("Login Error:", error.message);
    //       }
    //     }
    //   };},[])
    
 /**
   * Fetches job listings from the backend server
   * @async
   * @function
   * @returns {Promise<Object[]>} Array of job objects
   */
   const getJobs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/jobs`, {
      });
      setJobs(response.data)
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
 /**
   * Fetches current user profile data
   * @async
   * @function
   */
  const fetchUser = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/user/me`, {
    
        withCredentials:true
      });
  
      setUser(response.data);
      console.log("User data:", response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  useEffect(() => {
    // const loginAndFetchData = async () => {
      // await testLogin(); // Ensure login is completed first
      fetchUser();
      getJobs(); 
    // };
  
    // loginAndFetchData();
  }, []);
 /**
   * Handles change in search query input
   * @function
   * @param {string} query - The search input string
   */
  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };
  return (
    <div className="bg-[#f4f2ee] min-h-screen ">
      <Header />
      <div className="mx-auto px-4 pt-20 flex flex-col md:flex-row gap-6">
        {/* Left Sidebar */}
        <div className="w-full md:w-1/4 p-4">
           <ProfileCard user={user} /> 

      
          <div className="bg-white shadow-md rounded-lg pt-1 space-y-1 mt-2.5">
            <button 
              onClick={() => setShowPreferences(true)}
              className="flex items-center font-semibold text-[#3d3d3d] gap-3 w-full text-left py-3 px-6 hover:bg-gray-100">
              <FaClipboardList className="font-semibold text-[#3d3d3d]" /> Preferences
            </button>
            <button 
            onClick={() => navigate("/myjobs",{
              state: {allJobs:jobs }
          })}
            className="flex items-center gap-3 font-semibold w-full text-left py-3 px-6 hover:bg-gray-100">
              <FaBookmark className="font-semibold text-[#3d3d3d]" /> My jobs
            </button>
            <button 
            onClick={() => navigate("/starthiring", { state: user })}
            className="flex items-center gap-3 w-full font-semibold text-left p-5 text-blue-600 hover:bg-gray-100 rounded-md"
          >
            <FaPen className="text-blue-600 font-bold" /> Post a free job
          </button>
          </div>
        </div>

        {/*Top picks for you */}
        <div className="flex flex-col bg-white shadow-md rounded-lg p-6 mr-[315px] w-full lg:w-3/4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2" >
            Job Picks for you
          </h2>
          {jobs && jobs.length > 0 ? (
            jobs
            .map((job, index) => (
              <div ><JobCard key={index} 
              job={job} jobs={jobs}
              onDelete={(jobIdToDelete) => {
                setJobs(prevJobs => prevJobs.filter(j => j.id !== jobIdToDelete && j._id !== jobIdToDelete));
              }}
              /></div>
              
            ))
          ) : (
            <p>No jobs available at the moment.</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default Jobs;
