/**
 * JobDetails Component
 *
 * Displays detailed information about a specific job, including job details, the company offering the job,
 * and a list of applicants who have applied for the job. It allows viewing applicant details and managing the
 * application data.
 * 
 * @component
 * @example
 * return (
 *   <JobDetails />
 * )
 */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Header from "../../components/UpperNavBar"; 
import PostedJobCard from "../../components/jobs/PostedJobCard"; 
import ApplicantCard from "../../components/jobs/ApplicantCard"; 
import ApplicantDetails from "../../components/jobs/ApplicantDetails"; // Import the ApplicantDetails component
import { BASE_URL } from "../../constants"; // Import the base URL for API requests

/**
 * JobDetails component that fetches and displays job details, company data, and applicants for the job.
 * 
 * It handles:
 * 1. Fetching the job details and company information using the job ID.
 * 2. Fetching applicants for the job and handling loading states, errors, and applicant selection.
 * 3. Displaying applicants and their details in a tabbed interface.
 * 
 * @function
 * @returns {JSX.Element} Job details page with applicants and selected applicant information.
 */
const JobDetails = () => {
    const location = useLocation();
    // Assuming the full job object is passed in state
    const { job , user} = location.state || {};
    console.log("job in Job details:", job); 
    console.log("user in jobdetails", user)

    // States for managing applicants, loading state, and errors
    const [applicants, setApplicants] = useState([]);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [loadingApplicants, setLoadingApplicants] = useState(true);
    const [applicantError, setApplicantError] = useState(null);
    const [company, setCompany] = useState(null); // State to hold company data

    // Retrieve company ID from the job object
    let companyid = job?.company?.id || job?.job?.company?.id;

    // If no company ID found, fallback to companyId
    if(!companyid){
        companyid = job?.companyId;
    }

    // Fetch company details using the company ID
    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/companies/${companyid}`);
                console.log("Company data:", response.data);
                setCompany(response.data);
            } catch (error) {
                console.error("Error fetching company data:", error);
            }
        };
        fetchCompany();
    }, [companyid]);

    // Retrieve job ID from job object
    let jobid = job?.id;
    if(!jobid){
        jobid = job?._id;
    }
    else if(!jobid) { jobid = job?.job?.id }

    // Fetch applicants when the component mounts or job.id changes
    useEffect(() => {
        const fetchApplicants = async () => {
            if (!jobid) {
                setApplicantError("Job ID is missing. Cannot fetch applicants.");
                setLoadingApplicants(false);
                return;
            }

            setLoadingApplicants(true);
            setApplicantError(null);
        
            try {
                const response = await axios.get(`${BASE_URL}/jobs/${jobid}/apply`);
                const fetchedApplicants = response?.data.applications;
                setApplicants(fetchedApplicants);
                console.log("Fetched applicants:", fetchedApplicants); // Log the fetched applicants
            } catch (error) {
                console.error("Failed to fetch applicants:", error);
                setApplicantError("Failed to load applicants. Please try again.");
                setApplicants([]); // Clear applicants on error
                setSelectedApplicant(null); // Clear selected applicant on error
            } finally {
                setLoadingApplicants(false);
            }
        };

        if (jobid) { 
            fetchApplicants();
        } else {
            setApplicants([]);
            setLoadingApplicants(false);
            setApplicantError("Job data not available to fetch applicants.");
        }
    }, [jobid]);

    // If job data is not available initially, display a message
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

    return (
        <>
            <Header />
            <div className="min-h-screen bg-[#f4f2ee] w-full mt-12">
                <div className="w-full">
                    <PostedJobCard job={job} company={company} state={"ViewApplicants"} user={user}/>
                </div>

                <div className="border-t border-gray-300 w-full"></div>

                <div className="w-full bg-white px-4 sm:px-6 lg:px-8 py-4">
                    <div className="max-w-6xl mx-auto flex space-x-6 text-sm font-semibold text-gray-600">
                        <div className="border-b-2 border-blue-600 text-gray-800 pb-3 cursor-pointer">
                            Applicants ({applicants.length})
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto py-6 md:py-8 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1 bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="p-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800">{applicants.length} applicants</h3>
                            </div>
                            <div className="divide-y divide-gray-200">
                                {loadingApplicants && (
                                    <div className="p-4 text-center text-gray-600">Loading applicants...</div>
                                )}
                                {applicantError && (
                                    <div className="p-4 text-center text-red-600">{applicantError}</div>
                                )}
                                {!loadingApplicants && !applicantError && applicants.length === 0 && (
                                    <div className="p-4 text-center text-gray-600">No pending applicants found.</div>
                                )}
                                {!loadingApplicants && !applicantError && applicants.length > 0 && (
                                    applicants.map((applicant) => (
                                        <ApplicantCard
                                            key={applicant.applicationId}
                                            applicant={applicant}
                                            onSelect={() => setSelectedApplicant(applicant)}
                                            isSelected={selectedApplicant?.applicationId === applicant.applicationId}
                                        />
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <ApplicantDetails applicant={selectedApplicant} screeningAnswers={selectedApplicant?.screeningAnswers} />
                        </div>

                    </div>
                </div>

            </div>
        </>
    );
};

export default JobDetails;
