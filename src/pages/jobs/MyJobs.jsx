import { useState, useEffect } from "react";
import axios from "axios";
import { BsBookmarkFill } from "react-icons/bs";
import Header from "../../components/UpperNavBar";
import JobCard from "../../components/jobs/JobCard";
import { BASE_URL } from "../../constants";
import { useLocation } from "react-router-dom";

/**
 * * MyJobs component displays either the user's saved/applied jobs
 * or the jobs they have posted, depending on the selected tab.
 *
 * @component
 * @returns {JSX.Element} Rendered MyJobs component
 */
const MyJobs = () => {
  const [selectedTab, setSelectedTab] = useState("my-jobs");
  const [activeFilter, setActiveFilter] = useState("Saved");
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState("");
    const [refreshTrigger, setRefreshTrigger] = useState(false);
  
const location = useLocation();
const {allJobs} = location.state || {} // Extract job from location state
console.log("allJobs in MyJobs:", allJobs); // Log the job object
  /**
   * Fetches currently logged-in user data and updates state.
   */
  const fetchUser = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/me`, {
        withCredentials: true,
      });
      setUser(response.data.user); // important! go into .user
      console.log("User data:", response.data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  /**
   * Fetches jobs saved by the user.
   */
  const fetchSavedJobs = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/jobs/saved`, {
        withCredentials: true,
      });
      setJobs(response.data.jobs);
      console.log("Saved jobs:", response.data.jobs);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
      setJobs([]);
    }
  };

  /**
   * Fetches jobs the user has applied to, filtered by status.
   */
  const fetchMyApplications = async (status) => {
    try {
      const response = await axios.get(`${BASE_URL}/jobs/my-applications?status=${status.toLowerCase()}`, {
        withCredentials: true,
      });
      setJobs(response.data.applications);
      console.log(`Applications for status ${status}:`, response.data.applications);
    } catch (error) {
      console.error(`Error fetching applications with status ${status}:`, error);
      setJobs([]);
    }
  };

  /**
   * Fetches jobs posted by companies the user is admin of.
   */
  const fetchPostedJobs = async () => {

    try {
      const allCompanyJobs = await Promise.all(
        user.companies.map(async (companyId) => {
          const response = await axios.get(`${BASE_URL}/jobs/company/${companyId}`, {
            withCredentials: true,
          });
          return response.data || []; 
        })
      );

      // Flatten the array of arrays into one array
      const mergedJobs = allCompanyJobs.flat();
      setJobs(mergedJobs);
      console.log("Posted jobs:", mergedJobs);
    } catch (error) {
      console.error("Error fetching posted jobs:", error);
      setJobs([]);
    }
  };

  // Handle loading data when selectedTab or activeFilter changes
  useEffect(() => {
    fetchUser();
  }, [refreshTrigger]);

  useEffect(() => {
    if (!user) return;

    setJobs([]); // Clear jobs first
    if (selectedTab === "my-jobs") {
      if (activeFilter === "Saved") {
        fetchSavedJobs();
      } else {
        fetchMyApplications(activeFilter);
      }
    } else if (selectedTab === "posted-jobs") {
      fetchPostedJobs();
    }
  }, [selectedTab, activeFilter, user]);

  // Determine filter options based on selected tab
  const filterOptions =
    selectedTab === "posted-jobs" ? ["Posted"] : ["Saved", "Pending", "Viewed", "Accepted", "Rejected"];

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
        {selectedTab !== "posted-jobs" && (
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
        )}

        {/* Job Listings */}
        <div className="space-y-4 pl-6 pr-6">
          {jobs && jobs.length > 0 ? (
            jobs.map((job, index) => (
              <JobCard key={index} job={job} state={selectedTab} user={user} jobs={allJobs} companyId={job.companyId} onDelete={() => setRefreshTrigger(prev => !prev)} />
            ))
          ) : (
            <p>No jobs available at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyJobs;
