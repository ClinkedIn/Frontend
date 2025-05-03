/**
 * ApplicantDetails component displays detailed information about a job applicant,
 * including contact information, resume, work experience, education, and responses
 * to screening questions.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.applicant - Applicant data object containing user info, contact, resume, etc.
 * @param {Array<Object>} props.screeningAnswers - List of screening question responses with criteria info.
 */
import React, { useState, useRef, useEffect } from "react";
import {
  BsThreeDots, BsArrowUpRight, BsPerson, BsEnvelope, BsPhone, BsDownload,
  BsCheckCircleFill, BsXCircleFill
} from "react-icons/bs";
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { BASE_URL } from "../../constants";
import { BsCheckLg, BsX } from 'react-icons/bs';
import toast from 'react-hot-toast';
const ApplicantDetails = ({ applicant, screeningAnswers,jobId }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Extract basic applicant information
  const name = applicant ? `${applicant?.applicant.firstName} ${applicant?.applicant.lastName}` : 'N/A';
  const headline = applicant?.headline || 'No Headline';
  const profilePicture = applicant?.applicant.profilePicture;
  const appliedTime = applicant?.createdAt
    ? formatDistanceToNow(new Date(applicant.createdAt), { addSuffix: true })
    : 'Unknown time';

  const userId = applicant?.applicant.userId;
  const contactEmail = applicant?.contactEmail;
  const contactPhone = applicant?.contactPhone;
  const resumeUrl = applicant?.applicant.resume;

  const [isProcessing, setIsProcessing] = useState(false);
  const [showbuttons , setShowButtons] = useState(true);

  /**
   * Close dropdown menu if clicked outside of it.
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /**
   * Fetch additional user data when userId is available.
   */
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/${userId}`, {
          withCredentials: true
        });
        console.log("Fetched user data:", response.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    if (userId) getUser();
  }, [userId]);

  if (!applicant) {
    return (
      <div className="p-6 text-gray-600 text-center">
        Select an applicant from the list to view details.
      </div>
    );
  }
  const handleAccept = async () => {
      setIsProcessing(true);
      try {
        console.log("Accepting application :", applicant);
          await axios.put(
              `${BASE_URL}/jobs/${jobId}/applications/${applicant.userId}/accept`,
              { withCredentials: true }
          );
          toast.success('Application accepted successfully');
          setShowButtons(false);
      } catch (error) {
          console.error('Error accepting application:', error);
          toast.error(error.response?.data?.message || 'Failed to accept application');
      } finally {
          setIsProcessing(false);
      }
  };
  const handleReject = async () => {
    setIsProcessing(true);
    try {
        await axios.put(
            `${BASE_URL}/jobs/${jobId}/applications/${applicant.userId}/reject`,
            { withCredentials: true }
        );
        toast.success('Application rejected');
        setShowButtons(false);
    } catch (error) {
        console.error('Error rejecting application:', error);
        toast.error(error.response?.data?.message || 'Failed to reject application');
    } finally {
        setIsProcessing(false);
    }
  };

  /**
   * Navigate to the user's full profile.
   */
  const handleSeeFullProfile = () => {
    if (userId) {
      navigate(`/user/${userId}`);
    } else {
      console.warn("User ID not available for navigation.");
    }
    setIsDropdownOpen(false);
  };

  /**
   * Navigate to the messaging page with the applicant's info.
   */
  const handleMessageApplicant = () => {
    navigate("/messaging", {
      state: { _id: userId, fullName: name, profilePicture },
    });
  };

  /**
   * Open the default email client to email the applicant.
   */
  const handleEmailClick = () => {
    if (contactEmail) {
      window.location.href = `mailto:${contactEmail}`;
    } else {
      console.warn("Applicant email address not available.");
    }
    setIsDropdownOpen(false);
  };

  /**
   * Copy the applicant's phone number to clipboard.
   */
  const handleCopyPhone = async () => {
    if (contactPhone) {
      try {
        await navigator.clipboard.writeText(contactPhone);
        alert("Phone number copied to clipboard!");
      } catch (err) {
        alert("Failed to copy phone number.");
      }
    } else {
      console.warn("Applicant phone number not available.");
    }
    setIsDropdownOpen(false);
  };

  /**
   * Open the applicant's resume in a new tab.
   */
  const handleViewResume = () => {
    if (resumeUrl) {
      window.open(resumeUrl, '_blank');
    } else {
      alert("Resume URL not available");
    }
  };

  /**
   * Render the work experience section of the applicant.
   *
   * @returns {JSX.Element} Work experience list or fallback message
   */
  const renderExperience = () => {
    const workExperience = applicant?.applicant?.workExperience || [];
    if (workExperience.length === 0) {
      return <p className="text-gray-600 text-sm italic">No work experience details available.</p>;
    }
    return (
      <div className="space-y-3">
        {workExperience.map((exp, index) => (
          <div key={index} className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-md mr-3 flex items-center justify-center text-gray-600">
              💼
            </div>
            <div className="flex-grow">
              <h5 className="font-semibold text-gray-800 text-sm">{exp.jobTitle}</h5>
              <p className="text-gray-700 text-xs">{exp.companyName}</p>
              <p className="text-gray-500 text-xs">
                {new Date(exp.fromDate).toLocaleDateString()} -{' '}
                {exp.currentlyWorking ? 'Present' : new Date(exp.toDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600 text-xs mt-1">{exp.description}</p>
              {exp.skills?.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {exp.skills.map((skill, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  /**
   * Render the education section of the applicant.
   *
   * @returns {JSX.Element} Education list or fallback message
   */
  const renderEducation = () => {
    const education = applicant?.applicant?.education || [];
    if (education.length === 0) {
      return <p className="text-gray-600 text-sm italic">No education details available.</p>;
    }
    return (
      <div className="space-y-3">
        {education.map((edu, index) => (
          <div key={index} className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-md mr-3 flex items-center justify-center text-gray-600">
              📚
            </div>
            <div className="flex-grow">
              <h5 className="font-semibold text-gray-800 text-sm">{edu.degree} in {edu.fieldOfStudy}</h5>
              <p className="text-gray-700 text-xs">{edu.school}</p>
              <p className="text-gray-500 text-xs">
                {new Date(edu.startDate).toLocaleDateString()} -{' '}
                {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'Present'}
              </p>
              {edu.skills?.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {edu.skills.map((skill, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  /**
   * Render the screening answers with indicators for whether they met the criteria.
   *
   * @returns {JSX.Element} Screening answers grouped by criteria
   */
  const renderScreeningAnswers = () => {
    if (!screeningAnswers || screeningAnswers.length === 0) {
      return <p className="text-gray-600 text-sm italic">Screening question responses not available.</p>;
    }

    const metCriteriaAnswers = screeningAnswers.filter(answer => answer.meetsCriteria);
    const notMetCriteriaAnswers = screeningAnswers.filter(answer => !answer.meetsCriteria);

    return (
      <div className="space-y-4">
        {metCriteriaAnswers.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">
              Responses Meeting Criteria ({metCriteriaAnswers.length} out of {screeningAnswers.length} met)
            </h4>
            <div className="space-y-3">
              {metCriteriaAnswers.map((answer, index) => (
                <div key={index} className="flex items-start">
                  <BsCheckCircleFill className="flex-shrink-0 w-5 h-5 text-green-600 mr-2 mt-0.5" />
                  <div className="flex-grow">
                    <p className="text-gray-800 text-sm font-semibold">{answer.question}</p>
                    <p className="text-gray-700 text-sm">{answer.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {notMetCriteriaAnswers.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">
              Responses Not Meeting Criteria ({notMetCriteriaAnswers.length} out of {screeningAnswers.length} not met)
            </h4>
            <div className="space-y-3">
              {notMetCriteriaAnswers.map((answer, index) => (
                <div key={index} className="flex items-start">
                  <BsXCircleFill className="flex-shrink-0 w-5 h-5 text-red-600 mr-2 mt-0.5" />
                  <div className="flex-grow">
                    <p className="text-gray-800 text-sm font-semibold">{answer.question}</p>
                    <p className="text-gray-700 text-sm">{answer.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {metCriteriaAnswers.length === screeningAnswers.length && screeningAnswers.length > 0 && (
          <p className="text-gray-600 text-sm italic">All screening criteria were met.</p>
        )}
        {notMetCriteriaAnswers.length === screeningAnswers.length && screeningAnswers.length > 0 && (
          <p className="text-gray-600 text-sm italic">No screening criteria were met.</p>
        )}
      </div>
    );
  };


    return (
        // Main container for applicant details, styled to match the right panel in the image
        <div className="bg-white rounded-lg shadow p-6 space-y-6 "> 
           <div className="flex justify-between items-start border-b border-gray-200 pb-4">
                <div className="flex-grow overflow-hidden"> {/* Added overflow-hidden */}
                    <div className="flex items-center gap-1">
                        <h2 className="text-lg font-semibold text-gray-800 truncate">{name}'s application</h2> {/* Added truncate */}
                         </div>

                    <div className="text-gray-600 text-sm mt-0.5 truncate">{headline}</div> {/* Added truncate */}

                   <div className="text-gray-500 text-xs mt-1">{appliedTime}</div>
                </div>
                
            </div>
            <div className="flex items-center space-x-3">
                {applicant?.status ==="pending" && showbuttons && <><button
                    onClick={handleAccept}
                    disabled={isProcessing}
                    className="flex items-center px-4 py-1.5 bg-green-600 text-white rounded-full text-sm font-semibold hover:bg-green-700 transition-colors disabled:bg-green-300"
                >
                    <BsCheckLg className="mr-1" />
                    Accept
                </button>
                <button
                    onClick={handleReject}
                    disabled={isProcessing}
                    className="flex items-center px-4 py-1.5 bg-red-600 text-white rounded-full text-sm font-semibold hover:bg-red-700 transition-colors disabled:bg-red-300"
                >
                    <BsX className="mr-1" />
                    Reject
                </button>
                </>}
               
                <button 
                onClick={handleMessageApplicant} 
                className="px-4 py-1.5 border border-gray-400 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors">
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
                 <h2 className="text-base font-bold text-gray-800">Insights from profile</h2> {/* Title */}
                     {/* Resume Section */}
    <div className="space-y-4 mt-6">
        <div className="flex justify-between items-center">
            <h3 className="text-base font-semibold text-gray-800">Resume</h3>
            {resumeUrl && (
                <button
                    onClick={handleViewResume}
                    className="flex items-center text-blue-700 hover:underline font-semibold text-sm"
                >
                    <BsDownload className="mr-1" /> Click to view resume
                </button>
            )}
        </div>
        {!resumeUrl && (
            <div className="text-gray-600 text-sm italic">Resume not available.</div>
        )}
    </div>
    <div className="border w-full border-gray-300"></div>
                 <div className="space-y-2">
                     <h4 className="font-semibold text-gray-800">Experience</h4> 
                      {renderExperience()}
                 </div>
        <div className="border w-full border-gray-300"></div>
                 <div className="space-y-2">
                       <h4 className="font-semibold text-gray-800">Education</h4> 
                        {renderEducation()} 
                   </div>
                
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
