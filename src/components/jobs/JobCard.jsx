/**
 * JobCard Component
 *
 * Displays a single job listing card with interactive features:
 * - Clicking the job title navigates to job details or board
 * - Clicking the delete icon removes or unsaves the job
 * - Fetches and displays company information if a company ID is provided
 *
 * @component
 * @param {Object} props - Props passed to the component
 * @param {Object} props.job - The job object containing job data (title, company info, location, etc.)
 * @param {Array<Object>} props.jobs - The list of job objects, used when navigating to the job board
 * @param {string} props.state - The current tab or page context (e.g., "posted-jobs", "my-jobs")
 * @param {Object} props.user - The user object, passed along during navigation
 * @param {Function} props.onDelete - Callback function to notify parent after a job is deleted or unsaved
 * @param {string} props.companyId - Optional company ID used to fetch company details if not included in the job object
 *
 * @returns {JSX.Element} The rendered job card component
 */

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "../../constants";
import axios from "axios";

const JobCard = ({ job, jobs, state, user, onDelete, companyId }) => {
  const [selectedJob, setSelectedJob] = useState();
  const [company, setCompany] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        if (companyId) {
          const response = await axios.get(`${BASE_URL}/companies/${companyId}`, {
            withCredentials: true,
          });
          setCompany(response.data);
          console.log("Company data:", response.data);
        } else {
          console.warn("No company ID provided");
        }
      } catch (error) {
        console.error("Error in company fetching:", error);
      }
    };
    fetchCompany();
  }, []);

  /**
   * Handles clicking on the job title.
   * Navigates to the job details page or job board depending on current state.
   *
   * @param {Object} job - The job object being clicked
   */
  const handleJobClick = (job) => {
    setSelectedJob(job);
    if (state === "posted-jobs") {
      navigate("/jobdetails", { state: { job, user } });
    } else {
      console.log("Navigating to job board with jobs:", jobs);
      navigate("/job-board", { state: { jobs, selectedJob: job } });
    }
  };

  /**
   * Handles deletion or unsaving of a job.
   * Calls the parent `onDelete` callback if provided.
   */
  const handleDeleteClick = async () => {
    console.log("❌ Delete button clicked");
    try {
      const jobId = job.jobId ?? job.id ?? job.job?.id ?? job._id ?? job.job?._id;
      if (!jobId) {
        console.warn("Job ID not found");
        return;
      }

      const url =
        state === "my-jobs"
          ? `${BASE_URL}/jobs/${jobId}/save`
          : `${BASE_URL}/jobs/${jobId}`;

      await axios.delete(url, { withCredentials: true });

      console.log("Job deleted or unsaved successfully");
      if (onDelete) {
        onDelete(jobId);
      }
    } catch (error) {
      console.error("Failed to delete or unsave job:", error);
      alert(error.response?.data?.message);
    }
  };

  return (
    <div className="flex items-start justify-between bg-white p-4 border-b-2 border-gray-200">
      {/* Company Logo */}
      <img
        src={
          job.companyId?.logo ??
          job.company?.logo ??
          job.job?.company?.logo ??
          "https://picsum.photos/80?random=1"
        }
        alt="Company Logo"
        className="w-12 h-12 object-contain"
      />

      {/* Job Details */}
      <div className="flex-1 ml-3">
        <p
          onClick={() => handleJobClick(job)}
          className="cursor-pointer text-blue-600 font-semibold hover:underline"
        >
          {job.title ?? job.job?.title}
        </p>
        <p className="text-gray-700 text-sm">
          {(job.company?.name ??
            job.job?.company?.name ??
            company.company?.name ??
            job.companyId?.name ??
            " ")}{" "}
          · {job.jobLocation}
        </p>
      </div>

      {/* Delete Button */}
      <button onClick={handleDeleteClick} className="text-gray-500 hover:text-gray-800">
        <X size={18} />
      </button>
    </div>
  );
};

export default JobCard;
