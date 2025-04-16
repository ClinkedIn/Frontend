import React, { useState, useEffect } from "react";
import {
  AlarmClock,
  Archive,
  CheckCircle,
  Edit,
  EyeOff,
  Flag,
  MoreHorizontal,
  Search,
  Trash2,
} from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../../constants";

const API_BASE_URL = BASE_URL;

const JobListing = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);

        /*
              login using :
              send this body :
              {
      "email": "Porter.Hodkiewicz@hotmail.com",
      "password": "Aa12345678",
        "fcmToken": "fcm123abc456"

    }
              */

        const response = await fetch(`${BASE_URL}/jobs`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        // Transform API data to match the component's expected structure
        const transformedJobs = data
          .map((job) => ({
            id: job._id,
            title: job.title,
            company: job.companyId, // You might want to fetch company names separately
            location: job.jobLocation,
            status:
              job.applicants.length > 0 &&
              job.accepted.length === 0 &&
              job.rejected.length === 0
                ? "pending"
                : job.accepted.length > 0
                ? "active"
                : job.rejected.length > 0
                ? "inactive"
                : "pending",
            flagged: job.screeningQuestions.some(
              (q) => q.mustHave && job.autoRejectMustHave
            ),
            date: new Date(job.createdAt).toISOString().split("T")[0],
            reason: job.screeningQuestions.some(
              (q) => q.mustHave && job.autoRejectMustHave
            )
              ? "Must-have screening questions with auto-reject"
              : "",
            applicantCount: job.applicants.length,
            acceptedCount: job.accepted.length,
            rejectedCount: job.rejected.length,
            workplaceType: job.workplaceType,
            jobType: job.jobType,
            industry: job.industry,
            isActive: job.isActive,
          }))
          .filter((job) => job.isActive === true);

        setJobs(transformedJobs);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching jobs:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // use axios to fetch the data
    // const fetchJobs = async () => {
    //   try {
    //     setIsLoading(true);
    //     const response = await axios.get(`${BASE_URL}/jobs`, {
    //       withCredentials: true,
    //     });
    //     if (response.status !== 200) {
    //       throw new Error(`API error: ${response.status}`);
    //     }
    //     const data = response.data;
    //     // Transform API data to match the component's expected structure
    //     const transformedJobs = data
    //       .map((job) => ({
    //         id: job._id,
    //         title: job.title,
    //         company: job.companyId, // You might want to fetch company names separately
    //         location: job.jobLocation,
    //         status:
    //           job.applicants.length > 0 &&
    //           job.accepted.length === 0 &&
    //           job.rejected.length === 0
    //             ? "pending"
    //             : job.accepted.length > 0
    //             ? "active"
    //             : job.rejected.length > 0
    //             ? "inactive"
    //             : "pending",
    //         flagged: job.screeningQuestions.some(
    //           (q) => q.mustHave && job.autoRejectMustHave
    //         ),
    //         date: new Date(job.createdAt).toISOString().split("T")[0],
    //         reason: job.screeningQuestions.some(
    //           (q) => q.mustHave && job.autoRejectMustHave
    //         )
    //           ? "Must-have screening questions with auto-reject"
    //           : "",
    //         applicantCount: job.applicants.length,
    //         acceptedCount: job.accepted.length,
    //         rejectedCount: job.rejected.length,
    //         workplaceType: job.workplaceType,
    //         jobType: job.jobType,
    //         industry: job.industry,
    //         isActive: job.isActive,
    //       }))
    //       .filter((job) => job.isActive === true);

    //     setJobs(transformedJobs);
    //     setError(null);
    //   } catch (err) {
    //     setError(err.message);
    //     console.error("Error fetching jobs:", err);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };

    fetchJobs();
  }, []);

  // Filter jobs based on active tab and search term
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase().trimEnd()) ||
      (job.industry &&
        job.industry
          .toLowerCase()
          .includes(searchTerm.toLowerCase().trimEnd())) ||
      (job.location &&
        job.location
          .toLowerCase()
          .includes(searchTerm.toLowerCase().trimEnd()));

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active") return job.status === "active" && matchesSearch;
    if (activeTab === "pending")
      return job.status === "pending" && matchesSearch;
    if (activeTab === "inactive")
      return job.status === "inactive" && matchesSearch;
    if (activeTab === "flagged") return job.flagged && matchesSearch;

    return matchesSearch;
  });

  // Handler functions that will make API calls
  const handleApprove = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/jobs/${id}/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // Update local state to reflect the change
      setJobs(
        jobs.map((job) =>
          job.id === id ? { ...job, status: "active", flagged: false } : job
        )
      );
    } catch (err) {
      console.error("Error approving job:", err);
      // Optionally show an error message to the user
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/jobs/${id}/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // Update local state
      setJobs(
        jobs.map((job) =>
          job.id === id ? { ...job, status: "inactive" } : job
        )
      );
    } catch (err) {
      console.error("Error rejecting job:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/jobs/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // Remove from local state
      setJobs(jobs.filter((job) => job.id !== id));
    } catch (err) {
      console.error("Error deleting job:", err);
      console.log("Failed to delete job:", id);
      console.log("response:", response);
    }
  };

  const handleResolveFlag = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/jobs/${id}/resolve-flag`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // Update local state
      setJobs(
        jobs.map((job) => (job.id === id ? { ...job, flagged: false } : job))
      );
    } catch (err) {
      console.error("Error resolving flag:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4"
        role="alert"
      >
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">Failed to load jobs: {error}</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-4">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">
            Manage job postings and flagged listings
          </p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Active Jobs</p>
                <p className="text-lg font-semibold text-gray-900">
                  {jobs.filter((job) => job.status === "active").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full">
                <AlarmClock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">
                  Pending Review
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {jobs.filter((job) => job.status === "pending").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="bg-gray-100 p-3 rounded-full">
                <Archive className="h-6 w-6 text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">
                  Inactive Jobs
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {jobs.filter((job) => job.status === "inactive").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-full">
                <Flag className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">
                  Flagged Jobs
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {jobs.filter((job) => job.flagged).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("all")}
              className={`py-4 px-1 font-medium text-sm ${
                activeTab === "all"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              All Listings
            </button>
            <button
              onClick={() => setActiveTab("active")}
              className={`py-4 px-1 font-medium text-sm ${
                activeTab === "active"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`py-4 px-1 font-medium text-sm ${
                activeTab === "pending"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Pending Review
            </button>
            <button
              onClick={() => setActiveTab("inactive")}
              className={`py-4 px-1 font-medium text-sm ${
                activeTab === "inactive"
                  ? "border-b-2 border-blue-500 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Inactive
            </button>
            <button
              onClick={() => setActiveTab("flagged")}
              className={`py-4 px-1 font-medium text-sm ${
                activeTab === "flagged"
                  ? "border-b-2 border-red-500 text-red-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Flagged{" "}
              <span className="ml-1 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-600">
                {jobs.filter((job) => job.flagged).length}
              </span>
            </button>
          </nav>
        </div>

        {/* Search and Controls */}
        <div className="mb-6 flex justify-between">
          <div className="relative w-1/2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {/* <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            + Add New Job
          </button> */}
        </div>

        {/* Jobs Table */}
        <div className="bg-white shadow overflow-hidden border-b border-gray-200 rounded-lg mb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Job Details
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date Posted
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <tr key={job.id} className={job.flagged ? "bg-red-50" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-start">
                        <div>
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            {job.title}
                            {job.flagged && (
                              <Flag className="h-4 w-4 ml-2 text-red-500" />
                            )}
                          </div>
                          <div className="text-sm font-medium text-gray-500">
                            {job.company.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {job.industry} • {job.location} •{" "}
                            {job.workplaceType} • {job.jobType}
                          </div>
                          {job.flagged && (
                            <div className="mt-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                              Flagged: {job.reason}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          job.status === "active"
                            ? "bg-green-100 text-green-800"
                            : job.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {job.status === "active"
                          ? "Active"
                          : job.status === "pending"
                          ? "Pending Review"
                          : "Inactive"}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        {job.applicantCount} applicants • {job.acceptedCount}{" "}
                        accepted • {job.rejectedCount} rejected
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <AlarmClock className="h-4 w-4 mr-1 text-gray-400" />
                        {job.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        {/* {job.status === "pending" && (
                          <button
                            onClick={() => handleApprove(job.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Approve"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                        )}

                        {job.status === "active" && (
                          <button
                            onClick={() => handleReject(job.id)}
                            className="text-gray-600 hover:text-gray-900"
                            title="Deactivate"
                          >
                            <EyeOff className="h-5 w-5" />
                          </button>
                        )}

                        {job.flagged && (
                          <button
                            onClick={() => handleResolveFlag(job.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Resolve Flag"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                        )}

                        <button
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <Edit className="h-5 w-5" />
                        </button> */}

                        <button
                          onClick={() => handleDelete(job.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No jobs found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JobListing;
