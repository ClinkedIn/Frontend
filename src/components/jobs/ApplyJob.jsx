import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BASE_URL } from "../../constants";



/**
 * Component for applying to a job with multiple steps, including contact information and screening questions.
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {boolean} props.isOpen - Whether the modal is open or not
 * @param {Function} props.onClose - Function to close the modal
 * @param {Object} props.job - The job data that the user is applying to
 * @param {string} props.jobId - The ID of the job being applied to
 * @returns {JSX.Element|null} The ApplyJob component or null if the modal is not open
 */
const ApplyJob = ({ isOpen, onClose, job , jobId}) => {
  /**
   * Current step of the application process (1 for contact info, 3 for screening questions).
   * @type {number}
   */
  const [step, setStep] = useState(1); 

  /**
   * The user's email address.
   * @type {string}
   */
  const [email, setEmail] = useState('');

  /**
   * The user's phone country code.
   * @type {string}
   */
  const [countryCode, setCountryCode] = useState('+20'); 

  /**
   * The user's phone number.
   * @type {string}
   */
  const [phoneNumber, setPhoneNumber] = useState('');

  /**
   * The user data fetched after login.
   * @type {Object}
   */
  const [user, setUser] = useState();

  /**
   * The answers to screening questions.
   * @type {Object}
   */
  const [step3Answers, setStep3Answers] = useState({});

  /**
   * The job ID to apply for.
   * @type {string}
   */
  const [id, setId] = useState();


 /**
   * Fetches the current user's data.
   * 
   * @async
   * @returns {Promise<void>} A promise indicating fetch completion
   */
  const fetchUser = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/user/me`, {
    
        withCredentials:true
      });
  
      setUser(response.data);
      console.log("User data:", response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  useEffect(() => {
    // const loginAndFetchData = async () => {
      // await testLogin(); // Ensure login is completed first
    fetchUser();
    // };
  
    // loginAndFetchData();
  }, []);
    /**
   * Handles the job application submission.
   * 
   * @async
   * @returns {Promise<void>} A promise indicating application submission completion
   */
  const handleApply = async () => {
    const id= jobId?? job._id??"" 
    console.log("id inside submit func:", id)
    const contactEmail = email;
    const contactPhone = `${countryCode} ${phoneNumber}`;
  
    let applicationData = {
      contactEmail,
      contactPhone,
      answers: job?.screeningQuestions?.length > 0
        ? job.screeningQuestions.map((q, index) => ({
            question: q.question,
            answer: step3Answers[index] || "",
          }))
        : []
    };
  
    console.log("application data", applicationData);
  
    try {
      const response = await axios.post(
        `${BASE_URL}/api/jobs/${id}/apply`,
        applicationData,
        { withCredentials: true }
      );
      console.log("Application Submitted:", response.data);
      alert("Application submitted!");
      onClose();
    } catch (error) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
        alert (error.response.data.message)
      } else {
        console.error("Error submitting application:", error);
      }
    }
  };
   /**
   * Handles changes to the answers of the screening questions.
   * 
   * @param {number} index - The index of the question in the screening questions list
   * @param {string} value - The value of the answer provided
   */
  const handleStep3Change = (index, value) => {
    setStep3Answers((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-xl rounded-lg bg-white p-7 shadow-lg">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Apply to {job.companyId.name } Business</h2>
          <button
            onClick={onClose}
            className="-mt-1 pl-4 text-2xl font-light text-gray-400 hover:text-gray-600"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Step 1: Contact Info */}
        {step === 1 && (
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-600">Contact Info</h3>
            <div className="mb-5 flex items-center">
              <img
                src={user?.user.profilePicture
                  ||" "}
                alt="User picture"
                className="mr-4 h-12 w-12 rounded-full object-cover ring-1 ring-gray-200"
              />
              <div>
                <p className="font-medium text-gray-800">{user?.user.firstName|| "john doe"}</p>
                <p className="text-sm text-gray-500">{user?.user.location||"unknown location"}</p>
              </div>
            </div>
             <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                    Email Address<span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  >
                  </input>
                </div>

                <div>
                  <label htmlFor="countryCode" className="mb-1 block text-sm font-medium text-gray-700">
                    Phone country code<span className="text-red-500">*</span>
                  </label>
                  <select
                     id="countryCode"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                  >
                    <option value="+20">Egypt (+20)</option>
                    <option value="+1">United States (+1)</option>
                    <option value="+44">United Kingdom (+44)</option>
                    <option value="+91">India (+91)</option>
                  </select>
                </div>

                <div className="mb-5">
                  <label htmlFor="mobile" className="mb-1 block text-sm font-medium text-gray-700">
                    Mobile phone number<span className="text-red-500">*</span>
                  </label>
                  <input
                    id="mobile"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
             </div>
             <p className="mb-6 mt-4 text-xs text-gray-500">
                Submitting this application won't change your LinkedIn profile.
                <br />
                Application powered by LinkedIn.
            </p>

            {/* Navigation */}
            <div className="mt-6 flex justify-end border-t border-gray-200 pt-4">
            <button
                onClick={() => {
                  if (job?.screeningQuestions?.length > 0) {
                    setStep(3);
                  } else {
                    handleApply();
                  }
                }}
                className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                {job?.screeningQuestions?.length > 0 ? "Next" : "Apply"}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="mb-1 text-lg font-semibold text-gray-800">Screening Questions</h3>
            <p className="mb-4 text-sm text-gray-600">Please answer the following questions:</p>

            <div className="space-y-4">
            {job.screeningQuestions.map((q, index) => (
              <div key={q._id} className="mb-4">
                <label className="block mb-1 font-medium text-gray-700">
                  {index + 1}. {q.question}
                </label>
                <input
                  type="text"
                  name={`question-${q._id}`}
                  placeholder="Your answer"
                  value={step3Answers[index] || ""}
                  onChange={(e) => handleStep3Change(index, e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            ))}
            </div>

            <div className="mt-6 flex justify-between border-t border-gray-200 pt-4">
              <button
                onClick={() => setStep(1)}
                className="text-sm font-medium text-gray-600 hover:text-gray-800"
              >
                Back
              </button>
              <button
                onClick={handleApply}
                className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplyJob;