import React, {useState, useEffect} from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../constants";

/**
 * The JobCard component displays the details of a job listing, including the company logo, job title,
 * job location, and the time since the job was posted. It also includes a clickable job title that 
 * navigates to a detailed job board page and a button to close the card.
 * 
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.job - The job object to display.
 * @param {Array} props.jobs - A list of jobs, used for passing job data to the job board page.
 * @param {Object} props.state - The current state of the application, used when navigating to the job board page.
 * 
 * @example
 * // Usage
 * <JobCard job={jobData} jobs={jobsList} state={locationState} />
 */
const JobCard = ({ job, jobs, state}) => {
  const [selectedJob, setSelectedJob]=useState()
/**
   * Handles the click event on the job title. It sets the selected job and navigates to the job board page.
   * 
   * @function handleJobClick
   * @param {Object} job - The job object that was clicked.
   */
  const handleJobClick = (job) => {
    setSelectedJob(job);
    navigate("/job-board", {
      state: {
        jobs,
        selectedJob: job,
      },
    });
  };

  const navigate = useNavigate();
  return (
    <div className="flex items-start justify-between bg-white p-4 border-b-2 border-gray-200">
      {/* Company Logo */}
      <img
        src={job.companyId?.logo?? job.company?.logo?? job.job?.company.logo}
        alt="Company Logo"
        className="w-12 h-12 object-contain"
      />

      {/* Job Details */}
      <div className="flex-1 ml-3">
        <p 
       onClick={() => handleJobClick(job)} className="cursor-pointer"
        className="text-blue-600 font-semibold hover:underline">
          {job.title?? job.job?.title}
        </p>
        <p className="text-gray-700 text-sm">
        {(job.company?.name ?? job.job?.company?.name ?? "Unknown Company")} · {job.jobLocation}
        </p>
      </div>

      {/* Close Button */}
      <button className="text-gray-500 hover:text-gray-800">
        <X size={18} />
        </button>

    </div>
  );
};
export default JobCard