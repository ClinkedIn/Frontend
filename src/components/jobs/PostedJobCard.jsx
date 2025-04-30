// PostedJobCard.jsx
import React from 'react';
import { BsThreeDots } from "react-icons/bs"; // Three-dots icon for more options
import { useNavigate } from 'react-router-dom'; // Hook for navigation

// Updated component to take a single 'job' prop
function PostedJobCard({
    job, company, state, user
    
}) {
    // Extract details from the job object
    const jobTitle = job?.title || 'N/A';
    const companyName = job?.company?.name || company?.name||'company name'; // Assuming company name is nested
    const companyLocation = job?.jobLocation    || 'N/A';
    const workplaceType = job?.workplaceType || 'N/A'; 
    const status = job?.status || 'N/A';
    const companyLogo = company?.logo || ''; // Assuming company logo is nested
const navigate = useNavigate(); // Hook for navigation
console.log("user from postedJobCard", user)
    const handleContinue = () => {
        if (state === "ManageJob") {navigate('/jobdetails', {
            state: {job, company} // Pass the job and company objects to the next page
        })}
        else{
        navigate('/managejob', {
            state: {
                job,company ,user
            },
        })}
    };
    return (
        // Adjusted padding to match the image's spacing relative to content
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 flex items-center justify-between">
            {/* Left Section: Job Info */}
            <div className="flex items-center flex-grow"> {/* Added flex-grow */}
                {/* Company Logo */}
                <img
                    src={companyLogo || 'https://placehold.co/40x40/EBF4FD/0A66C2?text=L'} // Placeholder logo
                    alt={`${companyName} logo`}
                    className="w-10 h-10 object-contain rounded-full mr-4 flex-shrink-0"
/>
                {/* Job Details */}
                <div className="flex-grow overflow-hidden"> {/* Added overflow-hidden */}
                    <h3 className="text-base font-semibold text-gray-800 truncate">{jobTitle}</h3> {/* Added truncate */}
                    <p className="text-sm text-gray-600 mt-0.5 truncate"> {/* Added truncate */}
                        {companyName} • {companyLocation} • ({workplaceType})
                    </p>
                    
                </div>
            </div>

            {/* Right Section: Actions */}
            <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
              
                  <button
                     onClick={handleContinue}
                     className="px-4 py-1.5 border border-gray-400 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors"
                  >
                     {state === "ManageJob" ? "View Applicants" : "Manage job"}
                  </button>
                {/* More Options Button */}
                <button
                    className="p-2 rounded-full hover:bg-gray-200 text-gray-700"
                    aria-label="More options"
                >
                    <BsThreeDots size={20} />
                </button>
            </div>
        </div>
    );
}

export default PostedJobCard;