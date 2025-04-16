import { useState, useEffect } from "react";
import axios from "axios";
import { BsBookmarkFill } from "react-icons/bs";
import Header from "../../components/UpperNavBar";
import JobCard from '../../components/jobs/JobCard';
import { BASE_URL } from "../../constants";


/**
 * * MyJobs component displays either the user's saved/applied jobs
 * or the jobs they have posted, depending on the selected tab.
 *
 * @component
 * @returns {JSX.Element} Rendered MyJobs component
 */
const MyJobs=()=> {
    const [selectedTab, setSelectedTab] = useState("my-jobs");
    const [activeFilter, setActiveFilter] = useState("Saved");
    const [jobs, setJobs] = useState([]);
    const [user, setUser]=useState()

  /**
   * Fetches currently logged-in user data and updates state.
   *
   * @async
   * @function
   * @returns {Promise<void>}
   */
  const fetchUser = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/me`, {
    
        withCredentials:true
      });
  
      setUser(response.data);
      console.log("User data:", response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  /**
   * Fetches jobs saved by the user.
   * Updates job list state with the retrieved jobs.
   *
   * @async
   * @function
   * @returns {Promise<void>}
   */
    const fetchSavedJobs = async () => {
      
        try {
          const response = await axios.get(`${BASE_URL}/jobs/saved`, {
            withCredentials: true // Send cookies with request
          });
          setJobs(response.data.jobs);
          console.log("jobs saved:",response.data.jobs)
        } catch (err) {
          console.log("error in save jobs")
          setJobs(staticJobs);
        }
       
    };

     /**
   * Fetches jobs the user has applied to, filtered by status.
   *
   * @async
   * @function
   * @param {string} status - The application status to filter by (e.g., "Pending", "Accepted")
   * @returns {Promise<void>}
   */
     // Function to fetch jobs according to the current filter
  const fetchMyApplications = async (status) => {
    try {
      const response = await axios.get(`${BASE_URL}/jobs/my-applications?status=${status.toLowerCase()}`, {
        withCredentials: true,
      });
      setJobs(response.data.applications);
      console.log(`Fetched jobs for status: ${status}`, response.data);
    } catch (error) {
      console.error(`Error fetching jobs with status ${status}:`, error);
      setJobs([]);
    }
  };
/**
   * Effect to handle login, fetch user and job data when selectedTab or activeFilter changes.
   */
    useEffect(() => {
      // const loginAndFetchData = async () => {
      //   await testLogin(); // Ensure login is completed first
        fetchUser()
        
    setJobs([]); // Clear jobs before fetching new ones
        if (selectedTab === "my-jobs" && activeFilter === "Saved") {
          fetchSavedJobs();
        } else if (selectedTab === "my-jobs") {
          fetchMyApplications(activeFilter);
        }
      // }
      // loginAndFetchData();
    },  [selectedTab, activeFilter]);
  

 /**
   * List of filters based on the selected tab.
   * @type {string[]}
   */
  // Determine filter options based on selected tab
  const filterOptions =
    selectedTab === "posted-jobs" ? ["Drafts", "Posted"] : ["Saved", "Pending", "Viewed", "Accepted", "Rejected"];

  return (
    <div className="flex bg-[#F5F3EE] p-6 mt-14">
      <Header />

      {/* Left Sidebar */}
      <div className="w-1/4 bg-white p-4 rounded-lg shadow-md h-auto">
        <div className="flex items-center text-gray-600 mb-3">
          <BsBookmarkFill className="w-5 h-5 mr-2" />
          <h2 className="text-lg font-semibold">My items</h2>
        </div>
        <ul className="space-y-1">
          <li
            className={`flex justify-between items-center p-2 cursor-pointer ${
              selectedTab === "posted-jobs" ? "text-blue-600 border-l-4 border-blue-600 " : "text-gray-700"
            }`}
            onClick={() => setSelectedTab("posted-jobs")}
          >
            <span>Posted jobs</span>
          </li>
          <li
            className={`flex justify-between items-center p-2 cursor-pointer ${
              selectedTab === "my-jobs" ? "text-blue-600 border-l-4 border-blue-600 " : "text-gray-700"
            }`}
            onClick={() => setSelectedTab("my-jobs")}
          >
            <span>My jobs</span>

          </li>
        </ul>
      </div>

      {/* Middle Section */}
      <div className="flex-1 bg-white pt-6 pb-6 mx-4 rounded-lg shadow-md">
        <h2 className="text-2xl mb-4 pl-6">{selectedTab === "posted-jobs" ? "Posted Jobs" : "My Jobs"}</h2>

        {/* Dynamic Filter Buttons */}
        <div className="flex space-x-3 mb-6 pb-1 border-b border-[#e8e8e8] pl-6">
          {filterOptions.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm border ${
                activeFilter === filter
                  ? "bg-[#01754f] text-white font-semibold hover:bg-[#004c33]"
                  : "bg-white text-gray-700 font-semibold border-gray-400 hover:bg-[#f3f3f3] hover:border-2"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Job Listings */}
        <div className="space-y-4 pl-6 pr-6">
          {jobs && jobs.length > 0 ? (
            jobs.map((job, index) => (
              <JobCard key={index} job={job} state={activeFilter} />
            ))
          ) : (
            <p>No jobs available at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}
export default MyJobs;