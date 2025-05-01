import React, { useState, useRef, useEffect } from "react"; // Import useState, useRef, useEffect
import { BsThreeDots, BsArrowUpRight, BsPerson, BsEnvelope, BsPhone, BsDownload, BsCheckCircleFill, BsXCircleFill } from "react-icons/bs"; // Import necessary icons for dropdown, download, and check/cross
import { formatDistanceToNow } from 'date-fns'; // Assuming date-fns is available for time formatting
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from "axios"; // Import axios for API calls
const ApplicantDetails = ({ applicant, screeningAnswers }) => { // Added screeningAnswers prop
    const navigate = useNavigate(); // Initialize navigate hook

    // State to control dropdown visibility
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    // Ref for the dropdown container to detect clicks outside
    const dropdownRef = useRef(null);

    // State for resume data, loading, and error
    const [resumeContent, setResumeContent] = useState(null);
    const [loadingResume, setLoadingResume] = useState(false);
    const [resumeError, setResumeError] = useState(null);
    const name = applicant ? `${applicant?.applicant.firstName} ${applicant?.applicant.lastName}` : 'N/A';
    const headline = applicant?.headline || 'No Headline';
    const profilePicture = applicant?.applicant.profilePicture;
    const appliedTime = applicant?.createdAt
        ? formatDistanceToNow(new Date(applicant.createdAt), { addSuffix: true })
        : 'Unknown time';

    // Extract data needed for the dropdown and resume fetching
    const userId = applicant?.applicant.userId; 
    console.log("User ID:", userId); // Log the user ID for debugging
    const contactEmail = applicant?.contactEmail; 
    const contactPhone = applicant?.contactPhone; 

    // Handle clicks outside the dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]); // Re-run effect if dropdownRef changes (though it's a static ref)



    useEffect(() => {
        const getUser=async () => {
            try{
                const response = await axios.get(`http://localhost:3000/user/${userId}`,
                    {withCredentials: true} // Include credentials for CORS
                );
                console.log("Fetched user data:", response.data); // Log the fetched user data
            }
            catch (error) {
                console.error("Failed to fetch user data:", error); // Log any errors
            }
        }
        getUser(); // Call the function to fetch user data
    },[userId])

    // useEffect(() => {
    //     const fetchResume = async () => {
    //         if (!userId) {
    //             setResumeContent(null); // Clear resume if no userId
    //             setLoadingResume(false);
    //             setResumeError(null);
    //             return;
    //         }

    //         setLoadingResume(true);
    //         setResumeError(null);
    //         setResumeContent(null); // Clear previous resume data

    //         try {
    //             // Fetch user data which should contain the resume content
    //             const response = await axios.get(`http://localhost:3000/user/${userId}`);
    //             setResumeContent(response.data || "Resume content not available.");
    //             console.log("Fetched resume content:", response.data);
    //         } catch (error) {
    //             console.error("Failed to fetch resume:", error);
    //             setResumeError("Failed to load resume. Please try again.");
    //             setResumeContent(null);
    //         } finally {
    //             setLoadingResume(false);
    //         }
    //     };

    //     fetchResume();

    // }, [userId]); // Re-run effect when userId changes



    
    // Display a message if no application data is provided
    if (!applicant) {
        return (
            <div className="p-6 text-gray-600 text-center">
                Select an applicant from the list to view details.
            </div>
        );
    }

    // Handler for "See full profile" button
    const handleSeeFullProfile = () => {
        if (userId) {
            navigate(`/user/${userId}`); // Navigate to the user's profile page
        } else {
            console.warn("User ID not available for navigation.");
            // Optionally show a user-friendly message
        }
        setIsDropdownOpen(false); // Close dropdown after action
    };

    const handleEmailClick = () => {
        if (contactEmail) {
            window.location.href = `mailto:${contactEmail}`; 
        } else {
            console.warn("Applicant email address not available.");
            // Optionally show a user-friendly message
        }
        setIsDropdownOpen(false); // Close dropdown after action
    };

    // Handler for phone number button (copies to clipboard)
    const handleCopyPhone = async () => {
        if (contactPhone) {
            try {
                await navigator.clipboard.writeText(contactPhone);
                console.log("Phone number copied to clipboard:", contactPhone);
                // Optionally show a success message to the user
                alert("Phone number copied to clipboard!"); // Using alert as a simple confirmation
            } catch (err) {
                console.error("Failed to copy phone number:", err);
                // Optionally show an error message to the user
                alert("Failed to copy phone number.");
            }
        } else {
            console.warn("Applicant phone number not available.");
            // Optionally show a user-friendly message
        }
        setIsDropdownOpen(false); // Close dropdown after action
    };

    // Handler for the Download Resume button
    const handleDownloadResume = () => {
        console.log("Download Resume clicked for user:", userId);
        alert("Download functionality not yet implemented."); // Placeholder alert
         };


    // --- Rendering functions for Experience and Education using passed props ---
    // const renderExperience = () => {
    //      // Use the 'experience' prop instead of mock data
    //      if (!experience || experience.length === 0) {
    //          return <p className="text-gray-600 text-sm italic">Experience details not available.</p>;
    //      }
    //      return (
    //          <div className="space-y-3"> {/* Added space-y for spacing between experience items */}
    //              {experience.map((exp, index) => (
    //                  <div key={index} className="flex items-start"> {/* Use flex for icon alignment */}
    //                      {/* Placeholder icon for experience - replace with actual if available */}
    //                      <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-md mr-3 flex items-center justify-center text-gray-600">
    //                          {/* You could use an icon here, or a placeholder image */}
    //                          💼 {/* Example emoji icon */}
    //                      </div>
    //                      <div className="flex-grow">
    //                          <h5 className="font-semibold text-gray-800 text-sm">{exp.title}</h5>
    //                          <p className="text-gray-700 text-xs">{exp.company}</p>
    //                           <p className="text-gray-500 text-xs">{exp.years}</p>
    //                      </div>
    //                  </div>
    //              ))}
    //          </div>
    //      );
    //  };

    //  const renderEducation = () => {
    //       // Use the 'education' prop instead of mock data
    //       if (!education || education.length === 0) {
    //           return <p className="text-gray-600 text-sm italic">Education details not available.</p>;
    //       }
    //       return (
    //           <div className="space-y-3"> {/* Added space-y for spacing between education items */}
    //               {education.map((edu, index) => (
    //                   <div key={index} className="flex items-start"> {/* Use flex for icon alignment */}
    //                        {/* Placeholder icon for education - replace with actual if available */}
    //                        <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-md mr-3 flex items-center justify-center text-gray-600">
    //                           📚 {/* Example emoji icon */}
    //                       </div>
    //                       <div className="flex-grow">
    //                           <h5 className="font-semibold text-gray-800 text-sm">{edu.degree}</h5>
    //                           <p className="text-gray-700 text-xs">{edu.institution}</p>
    //                            <p className="text-gray-500 text-xs">{edu.years}</p>
    //                       </div>
    //                   </div>
    //               ))}
    //           </div>
    //       );
    //   };

      // --- Rendering function for Screening Answers ---
      const renderScreeningAnswers = () => {
          if (!screeningAnswers || screeningAnswers.length === 0) {
              return <p className="text-gray-600 text-sm italic">Screening question responses not available.</p>;
          }

          const metCriteriaAnswers = screeningAnswers.filter(answer => answer.meetsCriteria);
          const notMetCriteriaAnswers = screeningAnswers.filter(answer => !answer.meetsCriteria);


          return (
              <div className="space-y-4"> {/* Added space-y for spacing between groups */}
                  {/* Display answers that met criteria */}
                  {metCriteriaAnswers.length > 0 && (
                      <div>
                          {/* Using a generic title as 'Must-have'/'Preferred' info isn't in the data */}
                          <h4 className="font-semibold text-gray-800 mb-2">Responses Meeting Criteria ({metCriteriaAnswers.length} out of {screeningAnswers.length} met)</h4>
                          <div className="space-y-3"> {/* Space between individual answers */}
                              {metCriteriaAnswers.map((answer, index) => (
                                  <div key={index} className="flex items-start">
                                      {/* Checkmark icon for met criteria */}
                                      <BsCheckCircleFill className="flex-shrink-0 w-5 h-5 text-green-600 mr-2 mt-0.5" />
                                      <div className="flex-grow">
                                          <p className="text-gray-800 text-sm font-semibold">{answer.question}</p>
                                          {/* Ideal answer is not in the provided data structure, omitting */}
                                          {/* <p className="text-gray-600 text-xs italic">Ideal answer: Yes</p> */}
                                          <p className="text-gray-700 text-sm">{answer.answer}</p>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}

                  {/* Display answers that did not meet criteria */}
                   {notMetCriteriaAnswers.length > 0 && (
                      <div>
                           {/* Using a generic title for not met criteria */}
                          <h4 className="font-semibold text-gray-800 mb-2">Responses Not Meeting Criteria ({notMetCriteriaAnswers.length} out of {screeningAnswers.length} not met)</h4>
                          <div className="space-y-3"> {/* Space between individual answers */}
                              {notMetCriteriaAnswers.map((answer, index) => (
                                  <div key={index} className="flex items-start">
                                      {/* Cross icon for not met criteria */}
                                      <BsXCircleFill className="flex-shrink-0 w-5 h-5 text-red-600 mr-2 mt-0.5" />
                                      <div className="flex-grow">
                                          <p className="text-gray-800 text-sm font-semibold">{answer.question}</p>
                                           {/* Ideal answer is not in the provided data structure, omitting */}
                                          {/* <p className="text-gray-600 text-xs italic">Ideal answer: Yes</p> */}
                                          <p className="text-gray-700 text-sm">{answer.answer}</p>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}

                    {/* Message if all criteria were met or not met */}
                     {metCriteriaAnswers.length === screeningAnswers.length && screeningAnswers.length > 0 && (
                         <p className="text-gray-600 text-sm italic">All screening criteria were met.</p>
                     )}
                     {notMetCriteriaAnswers.length === screeningAnswers.length && screeningAnswers.length > 0 && (
                         <p className="text-gray-600 text-sm italic">No screening criteria were met.</p>
                     )}
              </div>
          );
      };


    // --- End Rendering functions ---


    return (
        // Main container for applicant details, styled to match the right panel in the image
        <div className="bg-white rounded-lg shadow p-6 space-y-6 h-full overflow-y-auto"> {/* Added h-full and overflow-y-auto */}
           <div className="flex justify-between items-start border-b border-gray-200 pb-4">
                <div className="flex-grow overflow-hidden"> {/* Added overflow-hidden */}
                    <div className="flex items-center gap-1">
                        <h2 className="text-lg font-semibold text-gray-800 truncate">{name}'s application</h2> {/* Added truncate */}
                         </div>

                    <div className="text-gray-600 text-sm mt-0.5 truncate">{headline}</div> {/* Added truncate */}

                   <div className="text-gray-500 text-xs mt-1">{appliedTime}</div>
                </div>
                <button className="text-gray-500 hover:text-gray-700 p-1 flex-shrink-0 ml-2" aria-label="View external profile"> {/* Added flex-shrink-0 and ml-2 */}
                     <BsArrowUpRight size={18} />
                 </button>
            </div>
            <div className="flex items-center space-x-3">
                <button className="px-4 py-1.5 border border-blue-600 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center"> {/* Updated styling */}
                    Rate as <span className="ml-1">▾</span> {/* Dropdown indicator */}
                </button>
                <button className="px-4 py-1.5 border border-gray-400 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors">
                    Message
                </button>
                <div className="relative" ref={dropdownRef}> {/* Added relative positioning and ref */}
                    <button
                        className="px-4 py-1.5 border border-gray-400 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown visibility
                        aria-haspopup="true" // ARIA attribute for accessibility
                        aria-expanded={isDropdownOpen} // ARIA attribute for accessibility
                    >
                        More...
                    </button>

                   
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"> {/* Styled dropdown */}
                            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                {/* See full profile button */}
                                <button
                                    onClick={handleSeeFullProfile}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                    role="menuitem" // ARIA attribute
                                >
                                     <BsPerson className="mr-3 h-4 w-4 text-gray-400" /> {/* Profile icon */}
                                    See full profile
                                </button>

                                {/* Email button */}
                                {contactEmail && ( // Only show if email is available
                                    <button
                                        onClick={handleEmailClick}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                        role="menuitem" // ARIA attribute
                                    >
                                         <BsEnvelope className="mr-3 h-4 w-4 text-gray-400" /> {/* Email icon */}
                                        <span className="truncate">{contactEmail}</span> {/* Display email, truncate if long */}
                                    </button>
                                )}

                                {/* Phone number button */}
                                {contactPhone && ( // Only show if phone is available
                                    <button
                                        onClick={handleCopyPhone}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                        role="menuitem" // ARIA attribute
                                    >
                                         <BsPhone className="mr-3 h-4 w-4 text-gray-400" /> {/* Phone icon */}
                                        {contactPhone} {/* Display phone number */}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-4 mt-6 border-b border-gray-200 pb-6"> {/* Added padding and border-bottom */}
                 <h3 className="text-base font-semibold text-gray-800">Screening question responses</h3> {/* Title */}
                 {renderScreeningAnswers()} {/* Render screening answers */}
            </div>

                <div className="space-y-6 mt-6"> {/* Added mt-6 for spacing */}
                 <h3 className="text-base font-semibold text-gray-800">Insights from profile</h3> {/* Title */}

                 {/* <div className="space-y-2">
                     <h4 className="font-semibold text-gray-800">Experience</h4> 
                      {renderExperience()}
                 </div>

                 <div className="space-y-2">
                       <h4 className="font-semibold text-gray-800">Education</h4> 
                        {renderEducation()} 
                   </div>
                 */}
            </div>

            {/* Resume Section */}
            {/* Added mt-6 for spacing between Insights and Resume sections */}
            <div className="space-y-4 mt-6"> {/* Added mt-6 for spacing and space-y-4 for inner spacing */}
                <div className="flex justify-between items-center">
                    <h3 className="text-base font-semibold text-gray-800">Resume</h3> {/* Title */}
                    {/* Download Button */}
                    {resumeContent && ( // Only show download button if resume content is available
                         <button
                             onClick={handleDownloadResume}
                             className="flex items-center text-blue-700 hover:underline font-semibold text-sm"
                         >
                              <BsDownload className="mr-1" /> Download
                         </button>
                    )}
                </div>

                {/* Display Resume Content, Loading, or Error */}
                {loadingResume && (
                    <div className="text-gray-600 text-sm italic">Loading resume...</div>
                )}
                {resumeError && (
                    <div className="text-red-600 text-sm italic">{resumeError}</div>
                )}
                {resumeContent && !loadingResume && !resumeError && (
                    // Display resume content, preserving formatting if it's plain text
                    <div className="bg-gray-100 p-4 rounded-md text-gray-800 text-sm overflow-auto max-h-96"> {/* Added styling and max height with overflow */}
                        <pre className="whitespace-pre-wrap">{resumeContent}</pre> {/* Use pre-wrap to handle line breaks */}
                    </div>
                )}
                {!resumeContent && !loadingResume && !resumeError && (
                     <div className="text-gray-600 text-sm italic">Resume not available.</div>
                )}
            </div>
<div className="flex justify-center pt-4 border-t border-gray-200">
                 <button
                 onClick={handleSeeFullProfile}
                 className="text-blue-700 hover:underline font-semibold text-sm">
                     See full profile
                 </button>
             </div>

        </div>
    );
};

export default ApplicantDetails;
