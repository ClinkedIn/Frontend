import React, { useState } from "react";
import { X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom"; // Add useLocation
import { BASE_URL } from "../../constants";

/**
 * The JobCard component displays the details of a job listing.
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.job - The job object to display.
 * @param {Array} props.jobs - A list of jobs, used for passing job data to the job board page.
 * @param {string} props.state - The current selectedTab ("Saved", "Pending", etc).
 */
const JobCard = ({ job, jobs, state, user }) => {
  const [selectedJob, setSelectedJob] = useState();
  const navigate = useNavigate();
  const location = useLocation();

  console.log("Jobcard state", state);
  /**
   * Handles the click event on the job title. 
   */
  const handleJobClick = (job) => {
    setSelectedJob(job);

    // If user is on "posted-jobs" tab, go to /jobdetails
    if ( state === "posted-jobs" ) {
      navigate("/jobdetails", {
        state: { job, user },
      });
    } else {
      // Else, normal navigation to /job-board
      navigate("/job-board", {
        state: {
          jobs,
          selectedJob: job,
        },
      });
    }
  };

  return (
    <div className="flex items-start justify-between bg-white p-4 border-b-2 border-gray-200">
      {/* Company Logo */}
      <img
        src={job.companyId?.logo ?? job.company?.logo ?? job.job?.company?.logo?? "https://picsum.photos/80?random=1"}
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
          {(job.company?.name ?? job.job?.company?.name ??  "Unknown Company")} · {job.jobLocation}
        </p>
      </div>

      {/* Close Button */}
      <button className="text-gray-500 hover:text-gray-800">
        <X size={18} />
      </button>
    </div>
  );
};

export default JobCard;
