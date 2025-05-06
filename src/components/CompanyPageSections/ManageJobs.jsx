import { useOutletContext } from 'react-router-dom';
import { use, useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaBriefcase, FaSpinner } from 'react-icons/fa';
import { MdWork, MdLocationOn, MdAccessTime } from 'react-icons/md';

/**
 * @typedef {Object} Job
 * @property {string} _id - Unique identifier for the job
 * @property {string} title - Job title
 * @property {string} description - Job description
 * @property {string} employmentType - Type of employment (e.g., Full-time, Part-time)
 * @property {string} location - Job location
 * @property {string} createdAt - Date when job was created
 * @property {string[]} skills - Array of skills required for the job
 */

/**
 * @typedef {Object} CompanyInfo
 * @property {string} id - Company identifier
 */

/**
 * @typedef {Object} User
 * @property {string} id - User identifier
 */

/**
 * Component that displays and manages company job listings
 * 
 * @returns {JSX.Element} The rendered component
 */
const CompanyManageJobsPage = () => {
    /** @type {CompanyInfo} - Company information from context */
    const { companyInfo } = useOutletContext();
    
    /** @type {[Job[], function]} - State for job listings */
    const [jobs, setJobs] = useState([]);
    
    /** @type {[boolean, function]} - State for job loading status */
    const [loadingJobs, setLoadingJobs] = useState(true);
    
    /** @type {[User|null, function]} - State for user information */
    const [user, setUser] = useState(null);
    
    /** Navigation function for route changes */
    const navigate = useNavigate();

    /**
     * Fetches job listings for the company
     * 
     * @async
     * @function fetchJobs
     */
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/jobs/company/${companyInfo.id}`, {
                    withCredentials: true,
                });
                setJobs(response.data);
                console.log('Jobs data:', response.data);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setLoadingJobs(false);
            }
        };

        fetchJobs();
    }, [companyInfo?.id]);

    /**
     * Fetches user information
     * 
     * @async
     * @function fetchUser
     */
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/user/me`, {
                    withCredentials: true,
                });
                setUser(response.data.user); // important! go into .user
                console.log("User data:", response.data.user);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
        fetchUser();
    }, []);

    // Loading state display
    if (loadingJobs) {
        return (
            <div className="mt-4 bg-white flex justify-center items-center w-full rounded-lg shadow-lg p-8">
                <FaSpinner className="animate-spin text-blue-600 text-3xl" />
                <span className="ml-3 text-xl text-gray-600">Loading Jobs...</span>
            </div>
        );
    }

    // Empty jobs state display
    if (jobs.length === 0) {
        return (
            <div className="mt-4 bg-white w-full rounded-lg shadow-lg p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                    <MdWork className="text-gray-400 text-6xl" />
                    <h1 className="text-2xl text-gray-600">No Jobs Posted Yet</h1>
                </div>
            </div>
        );
    }

    // Main content with job listings
    return (
        <div className="mt-4 bg-white w-full rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Manage Jobs</h1>
                    <p className="text-gray-600 mt-1">{jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} posted</p>
                </div>
            </div>

            <div className="grid gap-4">
                {jobs.map((job) => (
                    <div
                        key={job._id}
                        className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition duration-200"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">{job.title}</h2>
                                <div className="flex flex-wrap gap-4 text-gray-600 text-sm mb-3">
                                    <div className="flex items-center gap-1">
                                        <FaBriefcase className="text-gray-400" />
                                        {job.employmentType || 'Full-time'}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MdLocationOn className="text-gray-400" />
                                        {job.location || 'Remote'}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MdAccessTime className="text-gray-400" />
                                        Posted {new Date(job.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <p className="text-gray-600 line-clamp-2">{job.description}</p>
                            </div>
                            <button
                                onClick={() => navigate("/jobdetails", { state: { job, user } })}
                                className="bg-white text-blue-600 px-4 py-2 rounded-lg border border-blue-600 hover:bg-blue-50 transition duration-200"
                            >
                                Manage Job
                            </button>
                        </div>
                        <div className="mt-4 flex gap-3 flex-wrap">
                            {job.skills?.slice(0, 3).map((skill, index) => (
                                <span
                                    key={index}
                                    className="bg-blue-50 text-blue-600 text-sm px-3 py-1 rounded-full"
                                >
                                    {skill}
                                </span>
                            ))}
                            {job.skills?.length > 3 && (
                                <span className="text-gray-500 text-sm">
                                    +{job.skills.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CompanyManageJobsPage;