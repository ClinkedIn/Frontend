import { useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants';
import { FaSpinner, FaBriefcase, FaMapMarkerAlt, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import { MdWork } from 'react-icons/md';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';
import Applyjob from '../../components/CompanyPageSections/applyjob';

const CompanyJobsPage = () => {
  const { companyInfo } = useOutletContext();
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [user, setUser] = useState(null);
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const openModal = (job) => {
    console.log('Opening modal for job:', job); // Debug log
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const toggleJobDetails = (jobId) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/jobs/company/${companyInfo.id}`, {
          withCredentials: true,
        });
        setJobs(response.data);
        console.log('Fetched jobs:', response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, [companyInfo?.id]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/me`, {
          withCredentials: true,
        });
        setUser(response.data.user);
        console.log('Fetched user:', response.data.user);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  if (loadingJobs) {
    return (
      <div className="mt-4 bg-white flex justify-center items-center w-full rounded-lg shadow-lg p-8">
        <FaSpinner className="animate-spin text-blue-600 text-3xl" />
        <span className="ml-3 text-xl text-gray-600">Loading Jobs...</span>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="mt-4 bg-white w-full rounded-lg shadow-lg p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <MdWork className="text-gray-400 text-6xl" />
          <h1 className="text-2xl text-gray-600">No Jobs Available</h1>
          <p className="text-gray-500">Check back later for new opportunities</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 bg-white w-full rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Available Positions</h1>
          <p className="text-gray-600 mt-1">
            {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} available
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
          >
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">{job.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaBriefcase className="text-blue-500" />
                    <span>{job.employmentType || 'Full-time'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaMapMarkerAlt className="text-blue-500" />
                    <span>{job.location || 'Remote'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaClock className="text-blue-500" />
                    <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                  {job.salary && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaMoneyBillWave className="text-blue-500" />
                      <span>{job.salary}</span>
                    </div>
                  )}
                </div>
                <p
                  className={`text-gray-600 mb-4 ${
                    expandedJobId === job._id ? '' : 'line-clamp-2'
                  }`}
                >
                  {job.description}
                </p>
                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {expandedJobId === job._id
                      ? job.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))
                      : job.skills.slice(0, 4).map((skill, index) => (
                          <span
                            key={index}
                            className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                    {!expandedJobId && job.skills.length > 4 && (
                      <span className="text-gray-500 text-sm">
                        +{job.skills.length - 4} more
                      </span>
                    )}
                  </div>
                )}
                {expandedJobId === job._id && (
                  <div className="mt-4 space-y-4 pt-4">
                    {job?.requirements && (
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Requirements</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          {job.requirements?.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {job.benefits && (
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-2">Benefits</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          {job.benefits.map((benefit, index) => (
                            <li key={index}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 min-w-[150px]">
                <button
                  onClick={() => openModal(job)}
                  className="w-full bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2"
                >
                  Apply Now
                </button>
                <button
                  onClick={() => toggleJobDetails(job._id)}
                  className="w-full bg-white text-gray-700 px-6 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition duration-200 flex items-center justify-center gap-2"
                >
                  {expandedJobId === job._id ? (
                    <>
                      <FaChevronUp className="text-gray-500" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <FaChevronDown className="text-gray-500" />
                      View Details
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedJob && (
        <Applyjob
          isOpen={isModalOpen}
          onClose={closeModal}
          job={selectedJob}
          jobId={selectedJob._id}
        />
      )}
    </div>
  );
};

export default CompanyJobsPage;