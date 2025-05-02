/**
 * PostedJobCard Component
 *
 * Displays a compact card for a job that has been posted by a user or company.
 * Includes job details, company information, and actions to manage or view applicants.
 *
 * @component
 * @param {Object} props - Props passed to the component
 * @param {Object} props.job - The job object containing details like title, location, and workplace type
 * @param {Object} props.company - The company object, optionally containing the logo and name
 * @param {string} props.state - The current view context (e.g., "ManageJob" or another dashboard tab)
 * @param {Object} props.user - The current user object, passed when navigating to job management
 *
 * @returns {JSX.Element} The rendered posted job card component
 */

import React from 'react';
import { BsThreeDots } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';

function PostedJobCard({ job, company, state, user }) {
  const navigate = useNavigate();

  // Extract job details with fallback logic
  const jobTitle = job?.title || job?.job?.title || 'N/A';
  const companyName = job?.company?.name || company?.name || job?.job?.company?.name || 'company name';
  const companyLocation = job?.jobLocation || job?.job?.jobLocation || 'N/A';
  const workplaceType = job?.workplaceType || job?.job?.workplaceType || 'N/A';
  const status = job?.status || 'N/A';
  const companyLogo = company?.logo || '';

  /**
   * Handles navigation when the user clicks the action button.
   * Navigates either to job details or job management depending on `state`.
   */
  const handleContinue = () => {
    if (state === "ManageJob") {
      navigate('/jobdetails', {
        state: { job, company }
      });
    } else {
      navigate('/managejob', {
        state: { job, company, user }
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6 flex items-center justify-between">
      {/* Left: Logo + Info */}
      <div className="flex items-center flex-grow">
        <img
          src={companyLogo || 'https://placehold.co/40x40/EBF4FD/0A66C2?text=L'}
          alt={`${companyName} logo`}
          className="w-10 h-10 object-contain rounded-full mr-4 flex-shrink-0"
        />
        <div className="flex-grow overflow-hidden">
          <h3 className="text-base font-semibold text-gray-800 truncate">{jobTitle}</h3>
          <p className="text-sm text-gray-600 mt-0.5 truncate">
            {companyName} • {companyLocation} • ({workplaceType})
          </p>
        </div>
      </div>

      {/* Right: Action Buttons */}
      <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
        <button
          onClick={handleContinue}
          className="px-4 py-1.5 border border-gray-400 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors"
        >
          {state === "ManageJob" ? "View Applicants" : "Manage job"}
        </button>
      </div>
    </div>
  );
}

export default PostedJobCard;
