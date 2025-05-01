import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation  } from "react-router-dom";
import Header from "../../components/UpperNavBar"; 
import PostedJobCard from "../../components/jobs/PostedJobCard"; 
import ApplicantCard from "../../components/jobs/ApplicantCard"; 
import ApplicantDetails from "../../components/jobs/ApplicantDetails"; // Import the ApplicantDetails component
import { BASE_URL } from "../../constants"; // Import the base URL for API requests

const JobDetails = () => {
    const location = useLocation();
    // Assuming the full job object is passed in state
    const { job , user} = location.state || {};
    console.log("job in Job details:", job); 
    console.log("user in jobdetails", user)

    const [applicants, setApplicants] = useState([]);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [loadingApplicants, setLoadingApplicants] = useState(true);
    const [applicantError, setApplicantError] = useState(null);
    const [company, setCompany] = useState(null); // State to hold company data

    let companyid=job?.company?.id || job?.job?.company?.id;

    if(!companyid){
        companyid=job?.companyId;
    }
useEffect(() => {
    const fetchCompany=async () => {
       
        try{
            const response = await axios.get(`${BASE_URL}/api/companies/${companyid}`);
            console.log("Company data:", response.data);
            setCompany(response.data);
        }

        catch (error) {
            console.error("Error fetching company data:", error);
        }
    }
    fetchCompany();
},[])
    // Fetch applicants when the component mounts or job.id changes
    let jobid=job?.id;
    if(!jobid){
        jobid=job?._id;
    }
    else if(!jobid){jobid=job?.job?.id}
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
                // Fetch pending applicants for the specific job
                const response = await axios.get(`${BASE_URL}/api/jobs/${jobid}/apply`);
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

    }, [jobid]); // Re-run effect if job ID changes

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
            {/* Main content container - removed vertical padding and ensured full width */}
            <div className="min-h-screen bg-[#f4f2ee] w-full mt-12">

                {/* Posted Job Card Section - Full width, no top padding relative to header */}
                {/* The PostedJobCard itself has padding, providing inner spacing */}
                <div className="w-full">
                    <PostedJobCard job={job} company={company} state={"ViewApplicants"} user={user}/> {/* Pass the entire job object */}
                </div>

                {/* Horizontal Divider */}
                <div className="border-t border-gray-300 w-full"></div>

                {/* Tabs Section - Full width container for Applicants/Invite tabs */}
                {/* Added px-4/sm:px-6/lg:px-8 for inner padding aligned with main content */}
                <div className="w-full bg-white px-4 sm:px-6 lg:px-8 py-4">
                    <div className="max-w-6xl mx-auto flex space-x-6 text-sm font-semibold text-gray-600">
                        {/* Applicants Tab - Styled as active */}
                        <div className="border-b-2 border-blue-600 text-gray-800 pb-3 cursor-pointer">
                            Applicants ({applicants.length}) {/* Display applicant count */}
                        </div>
                        {/* Removed "Invite to apply" tab as requested */}
                    </div>
                </div>

                {/* Main Content Area below tabs - grid layout for applicants list and details */}
                <div className="max-w-6xl mx-auto py-6 md:py-8 px-4 sm:px-6 lg:px-8"> {/* Added padding back here */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> {/* Grid with 1 col for list, 2 for details */}

                        {/* Left Column: Applicants List */}
                        <div className="md:col-span-1 bg-white rounded-lg shadow-sm overflow-hidden"> {/* Added styling and overflow */}
                            <div className="p-4 border-b border-gray-200"> {/* Padding for the header */}
                                 <h3 className="text-lg font-semibold text-gray-800">{applicants.length} applicants</h3> {/* Applicants count header */}
                            </div>
                            <div className="divide-y divide-gray-200"> {/* Add dividers between applicant cards */}
                                {/* Loading/Error/No Applicants messages */}
                                {loadingApplicants && (
                                    <div className="p-4 text-center text-gray-600">Loading applicants...</div>
                                )}
                                {applicantError && (
                                    <div className="p-4 text-center text-red-600">{applicantError}</div>
                                )}
                                {!loadingApplicants && !applicantError && applicants.length === 0 && (
                                    <div className="p-4 text-center text-gray-600">No pending applicants found.</div>
                                )}

                                {/* Render Applicant Cards */}
                                {!loadingApplicants && !applicantError && applicants.length > 0 && (
                                     applicants.map((applicant) => (
                                         <ApplicantCard
                                             key={applicant.applicationId} // Use application ID as key
                                             applicant={applicant}
                                             onSelect={() => setSelectedApplicant(applicant)} // Set selected applicant on click
                                             isSelected={selectedApplicant?.applicationId === applicant.applicationId} // Check if this card is selected
                                               
                                             />
                                     ))
                                )}
                            </div>
                        </div>

                        {/* Right Column: Applicant Details */}
                        <div className="md:col-span-2"> {/* This column takes the remaining space */}
                             <ApplicantDetails applicant={selectedApplicant}  
                             screeningAnswers={selectedApplicant?.screeningAnswers} 
                             /> 
                        </div>

                    </div>
                </div>

            </div>
        </>
    );
};

export default JobDetails;
