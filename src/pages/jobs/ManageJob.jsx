/**
 * ManageJob Component
 * 
 * This component allows the management of a job posting, including the ability to view and update job details,
 * view the screening questions for the job, and navigate to other related pages.
 * It utilizes React hooks like `useState` and `useEffect` to manage state and side effects.
 * It interacts with an API to fetch companies and job-specific data.
 * 
 * @component
 * @example
 * return <ManageJob />
 */
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/UpperNavBar';
import PostedJobCard from '../../components/jobs/PostedJobCard'; // Assuming this is the correct path
import { IoBagRemove } from "react-icons/io5";
import { FiEdit2 } from "react-icons/fi";
import { BASE_URL } from '../../constants';
import axios from 'axios';

/**
 * ManageJob component for handling job-related tasks such as viewing and updating job details.
 * 
 * @returns {JSX.Element} JSX code for rendering the ManageJob component.
 */
const ManageJob = () => {
    // Location hook to get the job details and other state passed from previous pages
    const location = useLocation();
    const { job, company, user } = location.state || {}; // Extract job, company, and user from location state
    const [allCompanies, setAllCompanies] = useState([]); // Stores list of companies
    const [isLoading, setIsLoading] = useState(false); // Loading state for fetching companies
    const [error, setError] = useState(null); // Error state for fetching companies
    const [screeningQuestions, setScreeningQuestions] = useState([]); // Stores screening questions for the job
    const navigate = useNavigate(); // Navigation hook for programmatically navigating to different pages
    const pageState = "ManageJob"; // Page state for indicating current page context
    
    /**
     * Effect hook for fetching company data when the component mounts.
     * Makes an API call to retrieve all companies.
     */
    useEffect(() => {
        const fetchCompanies = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${BASE_URL}/companies`);
                setAllCompanies(response.data || []);
            } catch (err) {
                console.error('Error fetching companies:', err);
                setError('Failed to load company suggestions.');
                setAllCompanies([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCompanies();
    }, []);
    
    // Extract job ID to fetch screening questions if not provided in the passed job object
    const jobId = job?._id || job?.job?.id;
    
    /**
     * Effect hook to load screening questions if not available in the passed job object.
     * Makes an API call to fetch job details if necessary.
     */
    useEffect(() => {
        const loadScreeningQuestions = async () => {
            const initialQuestions = job?.screeningQuestions || job?.job?.screeningQuestions || [];

            if (initialQuestions.length > 0) {
                setScreeningQuestions(initialQuestions);
            } else if (jobId) {
                try {
                    const response = await axios.get(`${BASE_URL}/jobs/${jobId}`);
                    const updatedJob = response.data;
                    if (updatedJob?.screeningQuestions?.length > 0) {
                        setScreeningQuestions(updatedJob.screeningQuestions);
                    }
                } catch (err) {
                    console.error("Failed to fetch job details for screening questions", err);
                }
            }
        };

        loadScreeningQuestions();
    }, [jobId, job]);

    /**
     * If no job is available, renders a message indicating that job details are not found.
     */
    if (!job) {
        return (
            <>
                <Header />
                <div className="min-h-screen bg-[#f4f2ee] py-12 md:py-20 flex justify-center items-center">
                    <p className="text-gray-600">Job details not found.</p>
                </div>
            </>
        );
    }

    // Extract job description with fallback text if not available
    const jobDescription = job?.description || job?.job?.description || 'No job description available.';
    
    /**
     * Data object for updating the job, including job, company, user, and other related state.
     */
    const UpdateJobData = {
        job,
        company,
        user,
        allCompanies,
        pageState: "UpdateJob",
        existingJobData: job
    };

    /**
     * Navigate to the job update page with the current job details.
     */
    const handleUpdateJob = () => {
        navigate("/jobdescription", {
            state: { UpdateJobData }
        });
    }

    /**
     * Renders the screening questions for the job.
     * 
     * @returns {JSX.Element} JSX code for displaying the list of screening questions.
     */
    const renderScreeningQuestions = () => {
        if (!screeningQuestions || screeningQuestions.length === 0) {
            return <p>No screening questions</p>;
        }

        return screeningQuestions.map((q, index) => (
            <div key={index} className="mb-4 p-3 bg-gray-50 rounded">
                <h4 className="font-semibold">{q.question}</h4>
                <p className="text-sm">Ideal Answer: {q.idealAnswer}</p>
                <p className="text-xs text-gray-500">
                    {q.mustHave ? "Must-have" : "Preferred"}
                </p>
            </div>
        ));
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-[#f4f2ee] w-full mt-12">
                <div className="w-full">
                    <PostedJobCard job={job} company={company} state={pageState} />
                </div>

                <div className="border-t border-gray-300 w-full"></div>

                <div className="w-full bg-white px-4 sm:px-6 lg:px-8 py-4">
                    <div className="max-w-6xl mx-auto flex space-x-6 text-sm font-semibold text-gray-600">
                        <div className="border-b-2 border-blue-600 text-gray-800 pb-3 cursor-pointer">
                            Job Info
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto py-6 md:py-8 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-2 space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Job description</h3>
                                            <div className="text-gray-700 text-sm whitespace-pre-line">
                                                {jobDescription}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-md font-semibold text-gray-800 mb-1">Industry</h4>
                                            <button onClick={handleUpdateJob}><FiEdit2 /></button>
                                        </div>
                                        <div className="text-gray-700 text-sm">{job?.industry || job?.job?.industry || 'N/A'}</div>

                                        <div>
                                            <h4 className="text-md font-semibold text-gray-800 mb-1">Employment Type</h4>
                                            <div className="text-gray-700 text-sm">{job?.jobType || job?.job?.jobType || 'N/A'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    Screening Questions ({screeningQuestions.length})
                                </h3>
                                {renderScreeningQuestions()}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white rounded-lg shadow-sm p-6 text-center space-y-4">
                                <h4 className="font-semibold text-gray-800">Hiring for more roles?</h4>
                                <button 
                                    onClick={() => navigate('/starthiring')}
                                    className="px-4 py-2 border-black border-2 rounded-full text-sm font-semibold hover:bg-gray-400 transition-colors">
                                    Post new job
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ManageJob;
