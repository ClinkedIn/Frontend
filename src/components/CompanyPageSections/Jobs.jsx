import { useOutletContext } from 'react-router-dom';
import { useEffect,useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants';


const CompanyJobsPage = ()=> {
const {companyInfo}  = useOutletContext();
    const [jobs, setJobs] = useState([]);
    const [loadingJobs, setLoadingJobs] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/jobs/company/${companyInfo.id}`,{
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
    if(loadingJobs){
        return(
            <div className="mt-4 bg-white justify-center flex   w-full rounded-lg shadow-lg p-4 ">
                <h1 className="text-2xl  ">Loading Jobs....</h1>
            </div>
        )
    }
    if(jobs.length===0){
        return(
            <div className="mt-4 bg-white flex justify-center   w-full rounded-lg shadow-lg p-4 ">
                <h1 className="text-2xl  ">No Jobs Found</h1>
            </div>
        )
    }
    return(
    <div className="mt-4 bg-white   w-full rounded-lg shadow-lg p-4 ">
        <h1 className="text-2xl  ">Jobs</h1>
        <div className="flex flex-col gap-4 mt-4">
            {jobs.map((job) => (
                <div key={job._id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold">{job.title}</h2>
                    <p className="text-gray-600">{job.description}</p>
                    <a href={job.link} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">Apply Now</a>
                </div>
            ))}
        </div>

    </div>
    )
 
 
 
 }
 export default CompanyJobsPage;