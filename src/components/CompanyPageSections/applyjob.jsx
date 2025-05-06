import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants';
import { FiUser, FiMail, FiPhone, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
/**
 * A modal component for applying to a job with multi-step form functionality.
 * Handles user contact information and job screening questions.
 *
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Controls the visibility of the modal
 * @param {function} props.onClose - Callback to close the modal
 * @param {Object} props.job - Job object containing details and screening questions
 * @param {string} props.jobId - ID of the job being applied to
 * @param {function} props.onApplicationSuccess - Callback triggered after successful application
 * @returns {JSX.Element} The rendered Applyjob modal component
 *
 * @example
 * <Applyjob
 *   isOpen={isModalOpen}
 *   onClose={closeModal}
 *   job={selectedJob}
 *   jobId={selectedJobId}
 *   onApplicationSuccess={refreshJobs}
 * />
 *
 * @property {number} step - Current form step (1 for contact info, 2 for questions)
 * @property {string} email - Applicant's email address
 * @property {string} countryCode - Country code for phone number
 * @property {string} phoneNumber - Applicant's phone number
 * @property {Object|null} user - Current user data
 * @property {Object} answers - Answers to screening questions
 * @property {boolean} isSubmitting - Form submission state
 *
 * @method fetchUser
 * Fetches current user data from API
 * @async
 * @returns {Promise<void>}
 *
 * @method handleAnswerChange
 * Updates answers state when screening questions are answered
 * @param {number} index - Question index
 * @param {string} value - Answer value
 * @returns {void}
 *
 * @method validateForm
 * Validates email and phone number format
 * @returns {boolean} True if form is valid, false otherwise
 *
 * @method handleSubmit
 * Submits the job application with all collected data
 * @async
 * @returns {Promise<void>}
 */

const Applyjob = ({ isOpen, onClose, job, jobId, onApplicationSuccess }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+20');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [user, setUser] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log('Applyjob job prop:', job);
    if (isOpen) {
      fetchUser();
      setStep(1);
      setAnswers({});
    }
  }, [isOpen]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/me`, {
        withCredentials: true,
      });
      setUser(response.data.user);
      setEmail(response.data.user.email || '');
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to load user data');
    }
  };

  const handleAnswerChange = (index, value) => {
    setAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/; 

        if (!email || !phoneNumber) {
        toast.error('Please fill in all required fields');
        return false;
        } else if (!emailRegex.test(email)) {
        toast.error('Please enter a valid email address');
        return false;
        } else if (!phoneRegex.test(phoneNumber)) {
        toast.error('Please enter a valid 10-digit phone number');
        return false;
        }

        return true;
    };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    const applicationData = {
      contactEmail: email,
      contactPhone: `${countryCode} ${phoneNumber}`,
      answers: job?.screeningQuestions?.map((q, index) => ({
        question: q.question,
        answer: answers[index] || '',
      })) || [],
    };

    try {
      await axios.post(`${BASE_URL}/jobs/${jobId}/apply`, applicationData, {
        withCredentials: true,
      });
      toast.success('Application submitted successfully!');
      onApplicationSuccess(); // Call the callback to re-fetch jobs
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Apply for {job?.title || 'Job'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <FiX className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-auto">
          {step === 1 ? (
            <div className="space-y-6">
              <div className="flex items-center space-x-4 rounded-lg bg-gray-50 p-4">
                <div className="h-16 w-16 overflow-hidden rounded-full bg-gray-200">
                  <img
                    src={user?.profilePicture || '/Images/user.svg'}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">{user?.headline}</p>
                  <p className="text-sm text-gray-500">{user?.location}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address *
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3">
                      <FiMail className="text-gray-400" />
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number *
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3"
                    >
                      <option value="+20">+20</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+91">+91</option>
                    </select>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="block w-full flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Phone number"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {job?.screeningQuestions?.map((question, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700">
                    {question.question}
                  </label>
                  <textarea
                    value={answers[index] || ''}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t bg-gray-50 p-6">
          {step === 1 && job?.screeningQuestions?.length > 0 ? (
            <>
              <button
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep(2)}
                className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
              >
                Next
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep(1)}
                className="rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:bg-blue-400"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Applyjob;