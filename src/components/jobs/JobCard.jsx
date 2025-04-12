import React, {useState, useEffect} from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const JobCard = ({ job, jobs, state}) => {
  const [selectedJob, setSelectedJob]=useState()

  // Function to calculate weeks ago
  const getWeeksAgo = (monthsAgo) => {
    return Math.round(monthsAgo * 4.33);
  };

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
        <p className="text-gray-500 text-xs">
          {getWeeksAgo(job.createdAt)} weeks ago
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