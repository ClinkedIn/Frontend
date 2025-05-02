// JobBoardPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/UpperNavBar";
import { useLocation } from "react-router-dom";
import JobCard from '../../components/jobs/JobCard';
import Filter from "../../components/jobs/Filter";
import ApplyJob from "../../components/jobs/ApplyJob";
import { BASE_URL } from "../../constants";
/**
 * JobBoardPage component displays a job board with job listings, company filters,
 * and job details with options to save and apply for jobs.
 *
 * @component
 * @example
 * return (
 *   <JobBoardPage />
 * )
 */
const JobBoardPage = () => {
  const [jobs, setJobs] = useState([]); // Stores list of job postings
  const [companies, setCompanies] = useState([]); // Stores list of companies
  const [selectedJob, setSelectedJob] = useState(null); // Stores the selected job details
  const [tab, setTab] = useState(); // Stores the current tab state
  const location = useLocation(); // Accesses the location object from React Router
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility
  const [refreshTrigger, setRefreshTrigger] = useState(false); // Used to trigger job list refresh

  const [experience, setExperience] = useState(0); // Filter by minimum experience
  const [workType, setWorkType] = useState(""); // Filter by work type (e.g., full-time, part-time)
  const [selectedCompany, setSelectedCompany] = useState(""); // Filter by company
  const [applications, setApplications] = useState([]); // Stores job applications

  /**
   * Opens the job application modal
   */
  const openModal = () => setIsModalOpen(true);

  /**
   * Closes the job application modal
   */
  const closeModal = () => setIsModalOpen(false);

  /**
   * Fetches the list of companies from the server
   */
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/companies`);
        setCompanies(res.data);
      } catch (err) {
        console.error("Error fetching companies", err);
      }
    };
    fetchCompanies();
  }, []);

  /**
 * Fetches all applications by looping through statuses and merging the results.
 */
  const fetchMyApplications = async () => {
    const statuses = ['pending', 'accepted', 'rejected'];
    try {
      const responses = await Promise.all(
        statuses.map((status) =>
          axios.get(`${BASE_URL}/jobs/my-applications?status=${status}`, {
            withCredentials: true,
          })
        )
      );
      const allApplications = responses.flatMap(res => res.data.applications);
      setApplications(allApplications);
      setRefreshTrigger(prev => !prev);
      console.log('All applications:', allApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
    }
  };
  
  useEffect(() => {
    fetchMyApplications();
  }, []);
  
  /**
   * Fetches job listings based on location state or initial page load
   */
  useEffect(() => {
    if (location.state) {
      setJobs(location.state.jobs || []);
      setSelectedJob(location.state.selectedJob || null);
      setTab(location.state.currentPath || null);
    }
  }, [location.state]);
  console.log("jobs in JobBoardPage:", jobs); // Log the job object

  /**
   * Filters jobs based on experience, work type, or selected company
   */
  useEffect(() => {
    const shouldFilter = experience || workType || selectedCompany;
    if (!shouldFilter) return;
    const fetchFilteredJobs = async () => {
      try {
        const params = new URLSearchParams();
        if (experience) params.append('minExperience', experience);
        if (workType) params.append('q', workType);
        if (selectedCompany) params.append('companyId', selectedCompany);

        const res = await axios.get(`${BASE_URL}/search/jobs?${params}`);
        setJobs(res.data.jobs || []);
      } catch (err) {
        console.error("Error filtering jobs", err);
      }
    };

    fetchFilteredJobs();
  }, [experience, workType, selectedCompany, refreshTrigger]);

  /**
   * Saves or unsaves the selected job
   */
  const handleSave = async () => {
    const jobId = selectedJob?._id || selectedJob?.id || selectedJob?.jobId;
    if (!jobId) return;

    try {
      if (!selectedJob.isSaved) {
        await axios.post(`${BASE_URL}/jobs/${jobId}/save`, {}, { withCredentials: true });
        setSelectedJob(prev => ({ ...prev, isSaved: true }));
        alert("Job saved!");
      } else {
        await axios.delete(`${BASE_URL}/jobs/${jobId}/save`, { withCredentials: true });
        setSelectedJob(prev => ({ ...prev, isSaved: false }));
        alert("Job unsaved!");
      }
      setRefreshTrigger(prev => !prev);
    } catch (error) {
      console.error("Save error:", error);
      if (error.response) alert(`Failed: ${error.response.data.message}`);
    }
  };
  console.log("selectedJob", selectedJob);
  console.log("jobs in JobBoardPage:", jobs); // Log the job object
  return (
    <div className={`flex flex-col md:flex-row h-screen  mt-32 md:mt-36  md:pl-[172px] md:pr-[172px]`}>
      <Header />
      
        <Filter
          experience={experience}
          setExperience={setExperience}
          workType={workType}
          setWorkType={setWorkType}
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
          companies={companies}
        />

      <div className="md:w-1/3 w-full h-1/2 md:h-full overflow-y-auto border-r border-gray-300 bg-gray-50">
        <div className="pl-2 py-3 text-sm bg-[#0a66c2] text-white w-full">
          {location.state?.searchQuery || location.state?.location
            ? `Search Results for ${location.state.searchQuery || location.state.location}`
            : "Top job picks for you"}
          <br />
          {jobs.length || 0} results
        </div>

        {jobs.length > 0 ? (
          jobs.map((job, index) => (
            <div key={index}>
              <JobCard job={job} jobs={jobs} />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 p-4">No jobs available for the selected filters.</p>
        )}
      </div>

      <div className="md:w-2/3 w-full h-1/2 md:h-full overflow-y-auto p-6 bg-white">
        {selectedJob ? (
          <div>
            <div className="flex flex-row gap-5">
              <img
                src={selectedJob?.companyId?.logo || "https://picsum.photos/80?random=1"}
                alt="Company Logo"
                className="w-12 h-12 object-contain"
              />
              <p>{selectedJob?.companyId?.name || ""}</p>
            </div>
            <h2 className="text-xl font-semibold mb-2">{selectedJob.title}</h2>
            <p className="text-sm text-gray-600 mb-1">{selectedJob.jobLocation}</p>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mr-2">
              {selectedJob.jobType || "Full-time"}
            </span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
              {selectedJob.workplaceType || "On-site"}
            </span>

            <div className="mt-4">
            {(() => {
                      const jobId = selectedJob?._id || selectedJob?.id || selectedJob?.jobId;
                      const hasApplied = applications.some(app => app.job?.jobId === jobId || app.job?._id === jobId);

                      return (
                        <button
                          onClick={openModal}
                          disabled={hasApplied}
                          className={`mt-4 mr-4 px-4 py-2 rounded-full text-white ${
                            hasApplied
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700"
                          }`}
                        >
                          {hasApplied ? "Already Applied!" : "Easy Apply"}
                        </button>
                      );
                    })()}
              <ApplyJob isOpen={isModalOpen} onClose={closeModal} job={selectedJob} jobId={selectedJob._id} onApplicationSuccess={fetchMyApplications} />

              <button onClick={handleSave} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700">
                {selectedJob.isSaved ? "Unsave Job" : "Save Job"}
              </button>

              <h3 className="font-medium text-sm mb-1 mt-2">About the job</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {selectedJob.description || "No description available."}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">Select a job to see details</p>
        )}
      </div>
    </div>
  );
};

export default JobBoardPage;
