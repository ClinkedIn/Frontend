import React, { useState,useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/UpperNavBar';
import PostedJobCard from '../../components/jobs/PostedJobCard'; // Assuming this is the correct path
import { IoBagRemove } from "react-icons/io5";
import { FiEdit2 } from "react-icons/fi";

const ManageJob = () => {
    const location = useLocation();
    // Assuming the full job object is passed in state
    const { job, company, user } = location.state || {};
    console.log("user in manage job", user)
    const [allCompanies,setAllCompanies]=useState([])
    const [isLoading, setIsLoading]=useState()
    const [error,setError]=useState()
    const navigate =useNavigate()
    console.log("job in ManageJob:", job);
    const pageState = "ManageJob"; // Using a more descriptive name than 'state'
      // Fetch companies on mount
      useEffect(() => {
        const fetchCompanies = async () => {
          setIsLoading(true);
          try {
            const { data } = await axios.get('http://localhost:3000/companies');
            setAllCompanies(data || []);
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

    const jobDescription = job?.description || 'No job description available.';

    const UpdateJobData = {
        job,
        company,
        user,
        allCompanies,
        pageState:"UpdateJob",
        existingJobData: job // Add this
      };
    const handleUpdateJob = () => {
        navigate("/jobdescription",{
            state: {UpdateJobData }
        })
    }
    const renderScreeningQuestions = () => {
        if (!job?.screeningQuestions?.length) return <p>No screening questions</p>;
        
        return job.screeningQuestions.map((q, index) => (
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
                                    {job?.description}
                                </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-md font-semibold text-gray-800 mb-1">Industry</h4>
                                <button onClick={handleUpdateJob}><FiEdit2  /></button>
                                </div>
                                <div className="text-gray-700 text-sm">{job?.industry || 'N/A'}</div>

                                <div>
                                    <h4 className="text-md font-semibold text-gray-800 mb-1">Employment Type</h4>
                                    <div className="text-gray-700 text-sm">{job?.jobType || 'N/A'}</div>
                                </div>
                                </div>

                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Screening Questions ({job.screeningQuestions?.length || 0})
            </h3>
            {renderScreeningQuestions()}
        </div>


                        </div>

                        <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm p-6 text-center space-y-4">
                            <h4 className="font-semibold text-gray-800">Hiring for more roles?</h4>
                            <button className="px-4 py-2 border-black border-2 rounded-full text-sm font-semibold hover:bg-gray-400 transition-colors">
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
