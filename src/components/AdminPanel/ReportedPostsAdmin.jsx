import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";

const ReportedPosts = () => {
  // Sample data - replace with your actual API call
  const [reportedPosts, setReportedPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "reportedAt",
    direction: "desc",
  });
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Fetch data
  useEffect(() => {
    const fetchReportedPosts = async () => {
      setIsLoading(true);
      try {
        // Simulating API call with timeout
        setTimeout(() => {
          const sampleData = [
            {
              id: "1",
              postId: "post123",
              postContent:
                "This is an inappropriate post with offensive language that violates our community guidelines.",
              postAuthor: {
                id: "user456",
                name: "John Doe",
                avatar: "/api/placeholder/40/40",
                position: "Software Engineer at Tech Co.",
              },
              reporter: {
                id: "user789",
                name: "Sarah Smith",
                avatar: "/api/placeholder/40/40",
              },
              reason: "Hate speech",
              details: "Contains offensive language targeting specific groups",
              reportedAt: "2025-03-19T14:30:00Z",
              status: "pending",
            },
            {
              id: "2",
              postId: "post456",
              postContent:
                "Check out my new website at spamlink.com! Guaranteed income!!!",
              postAuthor: {
                id: "user111",
                name: "Alex Johnson",
                avatar: "/api/placeholder/40/40",
                position: "Freelancer",
              },
              reporter: {
                id: "user222",
                name: "Michael Brown",
                avatar: "/api/placeholder/40/40",
              },
              reason: "Spam",
              details: "Promotional content with suspicious links",
              reportedAt: "2025-03-18T10:15:00Z",
              status: "reviewed",
            },
            {
              id: "3",
              postId: "post789",
              postContent:
                "I am selling counterfeit products at half the price.",
              postAuthor: {
                id: "user333",
                name: "Lisa Williams",
                avatar: "/api/placeholder/40/40",
                position: "Business Owner",
              },
              reporter: {
                id: "user444",
                name: "David Miller",
                avatar: "/api/placeholder/40/40",
              },
              reason: "Illegal activity",
              details: "Promoting sale of counterfeit goods",
              reportedAt: "2025-03-20T09:45:00Z",
              status: "pending",
            },
            {
              id: "4",
              postId: "post012",
              postContent:
                "This is someone else's content that I'm claiming as my own.",
              postAuthor: {
                id: "user555",
                name: "Robert Wilson",
                avatar: "/api/placeholder/40/40",
                position: "Content Creator",
              },
              reporter: {
                id: "user666",
                name: "Emily Taylor",
                avatar: "/api/placeholder/40/40",
              },
              reason: "Copyright infringement",
              details: "Content plagiarized from original creator",
              reportedAt: "2025-03-17T16:20:00Z",
              status: "dismissed",
            },
            {
              id: "5",
              postId: "post345",
              postContent:
                "Personal information including phone number and address of a public figure.",
              postAuthor: {
                id: "user777",
                name: "Thomas Anderson",
                avatar: "/api/placeholder/40/40",
                position: "Blogger",
              },
              reporter: {
                id: "user888",
                name: "Jessica Lee",
                avatar: "/api/placeholder/40/40",
              },
              reason: "Privacy violation",
              details:
                "Sharing personal identifying information without consent",
              reportedAt: "2025-03-19T08:10:00Z",
              status: "actioned",
            },
          ];
          setReportedPosts(sampleData);
          setFilteredPosts(sampleData);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching reported posts:", error);
        setIsLoading(false);
      }
    };

    fetchReportedPosts();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...reportedPosts];

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((post) => post.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        (post) =>
          post.postContent.toLowerCase().includes(search) ||
          post.postAuthor.name.toLowerCase().includes(search) ||
          post.reporter.name.toLowerCase().includes(search) ||
          post.reason.toLowerCase().includes(search) ||
          post.details.toLowerCase().includes(search)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setFilteredPosts(result);
  }, [reportedPosts, statusFilter, searchTerm, sortConfig]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // change status of reported post
  const handleStatusChange = async (postId, newStatus) => {
    try {
      // Simulating API call
      setReportedPosts(
        reportedPosts.map((post) =>
          post.id === postId ? { ...post, status: newStatus } : post
        )
      );
      // Close dropdown after action
      setActiveDropdown(null);
    } catch (error) {
      console.error("Error updating post status:", error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full flex items-center">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </span>
        );
      case "reviewed":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-full flex items-center">
            <CheckCircle className="mr-1 h-3 w-3" /> Reviewed
          </span>
        );
      case "actioned":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded-full flex items-center">
            <CheckCircle className="mr-1 h-3 w-3" /> Actioned
          </span>
        );
      case "dismissed":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200 rounded-full flex items-center">
            <XCircle className="mr-1 h-3 w-3" /> Dismissed
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200 rounded-full">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="bg-gray-50  min-h-screen">
      {/* Header */}
      {/* <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-8 w-8 text-[#0a66c2]"
                  fill="currentColor"
                >
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                </svg>
                <span className="ml-2 text-xl font-semibold text-gray-900">
                  Admin
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  className="h-8 w-8 rounded-full"
                  src="/api/placeholder/32/32"
                  alt="Admin profile"
                />
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Content */}
      <div className="max-w-6xl  mx-auto ">
        <div className="bg-gray-50 ">
          <div className="px-6 py-5 border-b border-gray-200">
            <h1 className="text-xl font-medium text-gray-900">
              Reported Posts
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Review and moderate content that has been flagged by users
            </p>
          </div>

          {/* Filters and search */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="pl-10 block w-full rounded-md border border-gray-300 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-[#0a66c2] focus:border-[#0a66c2]"
                  placeholder="Search reported posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="inline-flex rounded-md shadow-sm">
                <button
                  type="button"
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-l-md border ${
                    statusFilter === "all"
                      ? "bg-[#0a66c2] text-white border-[#0a66c2]"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setStatusFilter("all")}
                >
                  All
                </button>
                <button
                  type="button"
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium border-t border-b border-r ${
                    statusFilter === "pending"
                      ? "bg-[#0a66c2] text-white border-[#0a66c2]"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setStatusFilter("pending")}
                >
                  Pending
                </button>
                <button
                  type="button"
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium border-t border-b border-r ${
                    statusFilter === "reviewed"
                      ? "bg-[#0a66c2] text-white border-[#0a66c2]"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setStatusFilter("reviewed")}
                >
                  Reviewed
                </button>
                <button
                  type="button"
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium border-t border-b border-r ${
                    statusFilter === "actioned"
                      ? "bg-[#0a66c2] text-white border-[#0a66c2]"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setStatusFilter("actioned")}
                >
                  Actioned
                </button>
                <button
                  type="button"
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-r-md border-t border-b border-r ${
                    statusFilter === "dismissed"
                      ? "bg-[#0a66c2] text-white border-[#0a66c2]"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setStatusFilter("dismissed")}
                >
                  Dismissed
                </button>
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0a66c2] bg-white border border-[#0a66c2] rounded-md hover:bg-[#f3f9ff]"
              >
                <Filter className="h-4 w-4" />
                More Filters
              </button>
            </div>

            {/* Results count */}
            <div className="mt-4 text-sm text-gray-500">
              Showing {filteredPosts.length} of {reportedPosts.length} reports
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="py-16 flex justify-center items-center">
              <div className="w-12 h-12 border-4 border-[#0a66c2] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && filteredPosts.length === 0 && (
            <div className="py-16 flex flex-col items-center justify-center">
              <div className="rounded-full bg-gray-100 p-4">
                <AlertTriangle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No reported posts found
              </h3>
              <p className="mt-1 text-sm text-gray-500 max-w-sm text-center">
                Try adjusting your search or filter to find what you're looking
                for.
              </p>
            </div>
          )}

          {/* Reports list */}
          {!isLoading && filteredPosts.length > 0 && (
            <div className="overflow-y-auto">
              <ul className="divide-y divide-gray-200">
                {filteredPosts.map((post) => (
                  <li key={post.id} className="px-6 py-4 hover:bg-[#f3f9ff]">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      {/* Post content */}
                      <div className="flex-1">
                        <div className="flex items-start">
                          <img
                            src={post.postAuthor.avatar}
                            alt=""
                            className="h-12 w-12 rounded-full border border-gray-200"
                          />
                          <div className="ml-3">
                            <div className="flex items-center">
                              <p className="text-sm font-medium text-gray-900">
                                {post.postAuthor.name}
                              </p>
                              <span className="mx-1 text-gray-500">•</span>
                              <p className="text-xs text-gray-500">
                                {formatDate(post.reportedAt)}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500">
                              {post.postAuthor.position}
                            </p>
                            <p className="mt-2 text-sm text-gray-700">
                              {post.postContent}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Report details */}
                      <div className="bg-gray-50 rounded-lg p-4 md:w-64">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xs font-medium text-gray-500 uppercase">
                            Report Details
                          </h4>
                          {getStatusBadge(post.status)}
                        </div>

                        <div className="mb-3">
                          <h5 className="text-xs font-medium text-gray-500">
                            Reported By
                          </h5>
                          <div className="flex items-center mt-1">
                            <img
                              src={post.reporter.avatar}
                              alt=""
                              className="h-6 w-6 rounded-full border border-gray-200"
                            />
                            <span className="ml-2 text-sm font-medium text-gray-900">
                              {post.reporter.name}
                            </span>
                          </div>
                        </div>

                        <div className="mb-3">
                          <h5 className="text-xs font-medium text-gray-500">
                            Reason
                          </h5>
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            {post.reason}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {post.details}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 mt-4">
                          <button
                            onClick={() =>
                              handleStatusChange(post.id, "actioned")
                            }
                            className="w-full px-3 py-1.5 text-sm font-medium text-white bg-[#0a66c2] rounded-full hover:bg-[#084b8a] focus:outline-none"
                          >
                            Take Action
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(post.id, "dismissed")
                            }
                            className="w-full px-3 py-1.5 text-sm font-medium text-[#0a66c2] bg-white border border-[#0a66c2] rounded-full hover:bg-[#f3f9ff] focus:outline-none"
                          >
                            Dismiss
                          </button>
                          <div className="relative">
                            <button
                              onClick={() =>
                                setActiveDropdown(
                                  activeDropdown === post.id ? null : post.id
                                )
                              }
                              className="w-full px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 focus:outline-none flex items-center justify-center"
                            >
                              More Options
                              <ChevronDown className="ml-1 h-4 w-4" />
                            </button>

                            {activeDropdown === post.id && (
                              <div className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <button
                                  onClick={() =>
                                    handleStatusChange(post.id, "reviewed")
                                  }
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                >
                                  <CheckCircle className="mr-2 h-4 w-4 text-blue-500" />
                                  Mark as Reviewed
                                </button>
                                <a
                                  href={`#/post/${post.postId}`}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  View Original Post
                                </a>
                                <a
                                  href={`#/user/${post.postAuthor.id}`}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  View Author Profile
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportedPosts;

// import React, { useState } from 'react';
// import { AlarmClock, Archive, CheckCircle, Edit, EyeOff, Flag, MoreHorizontal, Search, Trash2 } from 'lucide-react';

// const AdminPanel = () => {
//   // Sample data for job listings
//   const [jobs, setJobs] = useState([
//     { id: 1, title: 'Senior Frontend Developer', company: 'TechCorp', location: 'San Francisco, CA', status: 'active', flagged: false, date: '2025-03-25', reason: '' },
//     { id: 2, title: 'UX Designer', company: 'DesignHub', location: 'Remote', status: 'active', flagged: true, date: '2025-03-27', reason: 'Suspicious contact information' },
//     { id: 3, title: 'Project Manager', company: 'ManageCo', location: 'New York, NY', status: 'pending', flagged: false, date: '2025-03-28', reason: '' },
//     { id: 4, title: 'Data Scientist', company: 'DataInsights', location: 'Boston, MA', status: 'active', flagged: true, date: '2025-03-26', reason: 'Discriminatory language' },
//     { id: 5, title: 'Marketing Specialist', company: 'BrandBoost', location: 'Chicago, IL', status: 'inactive', flagged: false, date: '2025-03-20', reason: '' },
//   ]);

//   const [activeTab, setActiveTab] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');

//   // Filter jobs based on active tab and search term
//   const filteredJobs = jobs.filter(job => {
//     const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                           job.company.toLowerCase().includes(searchTerm.toLowerCase());

//     if (activeTab === 'all') return matchesSearch;
//     if (activeTab === 'active') return job.status === 'active' && matchesSearch;
//     if (activeTab === 'pending') return job.status === 'pending' && matchesSearch;
//     if (activeTab === 'inactive') return job.status === 'inactive' && matchesSearch;
//     if (activeTab === 'flagged') return job.flagged && matchesSearch;

//     return matchesSearch;
//   });

//   // Handler functions
//   const handleApprove = (id) => {
//     setJobs(jobs.map(job =>
//       job.id === id ? {...job, status: 'active', flagged: false} : job
//     ));
//   };

//   const handleReject = (id) => {
//     setJobs(jobs.map(job =>
//       job.id === id ? {...job, status: 'inactive'} : job
//     ));
//   };

//   const handleDelete = (id) => {
//     setJobs(jobs.filter(job => job.id !== id));
//   };

//   const handleResolveFlag = (id) => {
//     setJobs(jobs.map(job =>
//       job.id === id ? {...job, flagged: false} : job
//     ));
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <div className="max-w-7xl mx-auto p-4">
//         <header className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
//           <p className="text-gray-600">Manage job postings and flagged listings</p>
//         </header>

//         {/* Navigation Tabs */}
//         <div className="mb-6 border-b border-gray-200">
//           <nav className="flex space-x-8">
//             <button
//               onClick={() => setActiveTab('all')}
//               className={`py-4 px-1 font-medium text-sm ${activeTab === 'all' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
//             >
//               All Listings
//             </button>
//             <button
//               onClick={() => setActiveTab('active')}
//               className={`py-4 px-1 font-medium text-sm ${activeTab === 'active' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
//             >
//               Active
//             </button>
//             <button
//               onClick={() => setActiveTab('pending')}
//               className={`py-4 px-1 font-medium text-sm ${activeTab === 'pending' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
//             >
//               Pending Review
//             </button>
//             <button
//               onClick={() => setActiveTab('inactive')}
//               className={`py-4 px-1 font-medium text-sm ${activeTab === 'inactive' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
//             >
//               Inactive
//             </button>
//             <button
//               onClick={() => setActiveTab('flagged')}
//               className={`py-4 px-1 font-medium text-sm ${activeTab === 'flagged' ? 'border-b-2 border-red-500 text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
//             >
//               Flagged <span className="ml-1 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-600">{jobs.filter(job => job.flagged).length}</span>
//             </button>
//           </nav>
//         </div>

//         {/* Search and Controls */}
//         <div className="mb-6 flex justify-between">
//           <div className="relative w-64">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <Search className="h-4 w-4 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Search jobs..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//             + Add New Job
//           </button>
//         </div>

//         {/* Jobs Table */}
//         <div className="bg-white shadow overflow-hidden border-b border-gray-200 rounded-lg mb-6">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Details</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Posted</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredJobs.map((job) => (
//                 <tr key={job.id} className={job.flagged ? 'bg-red-50' : ''}>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-start">
//                       <div>
//                         <div className="text-sm font-medium text-gray-900 flex items-center">
//                           {job.title}
//                           {job.flagged && (
//                             <Flag className="h-4 w-4 ml-2 text-red-500" />
//                           )}
//                         </div>
//                         <div className="text-sm text-gray-500">{job.company} • {job.location}</div>
//                         {job.flagged && (
//                           <div className="mt-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
//                             Flagged: {job.reason}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
//                       ${job.status === 'active' ? 'bg-green-100 text-green-800' :
//                         job.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                         'bg-gray-100 text-gray-800'}`}>
//                       {job.status === 'active' ? 'Active' :
//                        job.status === 'pending' ? 'Pending Review' :
//                        'Inactive'}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     <div className="flex items-center">
//                       <AlarmClock className="h-4 w-4 mr-1 text-gray-400" />
//                       {job.date}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <div className="flex space-x-3">
//                       {job.status === 'pending' && (
//                         <button
//                           onClick={() => handleApprove(job.id)}
//                           className="text-green-600 hover:text-green-900"
//                           title="Approve"
//                         >
//                           <CheckCircle className="h-5 w-5" />
//                         </button>
//                       )}

//                       {job.status === 'active' && (
//                         <button
//                           onClick={() => handleReject(job.id)}
//                           className="text-gray-600 hover:text-gray-900"
//                           title="Deactivate"
//                         >
//                           <EyeOff className="h-5 w-5" />
//                         </button>
//                       )}

//                       {job.flagged && (
//                         <button
//                           onClick={() => handleResolveFlag(job.id)}
//                           className="text-blue-600 hover:text-blue-900"
//                           title="Resolve Flag"
//                         >
//                           <CheckCircle className="h-5 w-5" />
//                         </button>
//                       )}

//                       <button
//                         className="text-indigo-600 hover:text-indigo-900"
//                         title="Edit"
//                       >
//                         <Edit className="h-5 w-5" />
//                       </button>

//                       <button
//                         onClick={() => handleDelete(job.id)}
//                         className="text-red-600 hover:text-red-900"
//                         title="Delete"
//                       >
//                         <Trash2 className="h-5 w-5" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           <div className="bg-white p-4 rounded-lg shadow">
//             <div className="flex items-center">
//               <div className="bg-green-100 p-3 rounded-full">
//                 <CheckCircle className="h-6 w-6 text-green-600" />
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm font-medium text-gray-500">Active Jobs</p>
//                 <p className="text-lg font-semibold text-gray-900">{jobs.filter(job => job.status === 'active').length}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow">
//             <div className="flex items-center">
//               <div className="bg-yellow-100 p-3 rounded-full">
//                 <AlarmClock className="h-6 w-6 text-yellow-600" />
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm font-medium text-gray-500">Pending Review</p>
//                 <p className="text-lg font-semibold text-gray-900">{jobs.filter(job => job.status === 'pending').length}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow">
//             <div className="flex items-center">
//               <div className="bg-gray-100 p-3 rounded-full">
//                 <Archive className="h-6 w-6 text-gray-600" />
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm font-medium text-gray-500">Inactive Jobs</p>
//                 <p className="text-lg font-semibold text-gray-900">{jobs.filter(job => job.status === 'inactive').length}</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow">
//             <div className="flex items-center">
//               <div className="bg-red-100 p-3 rounded-full">
//                 <Flag className="h-6 w-6 text-red-600" />
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm font-medium text-gray-500">Flagged Jobs</p>
//                 <p className="text-lg font-semibold text-gray-900">{jobs.filter(job => job.flagged).length}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminPanel;

// import React, { useState } from 'react';
// import { BarChart, LineChart, PieChart, Calendar, Users, Activity, TrendingUp, Database } from 'lucide-react';

// const AdminAnalyticsDashboard = () => {
//   const [activeTab, setActiveTab] = useState('overview');

//   // Sample analytics data
//   const overviewStats = [
//     { title: 'Total Users', value: '24,532', change: '+12%', icon: <Users className="text-blue-500" /> },
//     { title: 'Active Users', value: '18,201', change: '+8%', icon: <Activity className="text-green-500" /> },
//     { title: 'New Signups', value: '1,204', change: '+23%', icon: <TrendingUp className="text-purple-500" /> },
//     { title: 'Posts Created', value: '8,392', change: '+15%', icon: <Database className="text-amber-500" /> }
//   ];

//   const engagementData = [
//     { name: 'Jan', posts: 4000, connections: 2400, messages: 2400 },
//     { name: 'Feb', posts: 3000, connections: 1398, messages: 2210 },
//     { name: 'Mar', posts: 2000, connections: 9800, messages: 2290 },
//     { name: 'Apr', posts: 2780, connections: 3908, messages: 2000 },
//     { name: 'May', posts: 1890, connections: 4800, messages: 2181 },
//     { name: 'Jun', posts: 2390, connections: 3800, messages: 2500 }
//   ];

//   const tabs = [
//     { id: 'overview', label: 'Overview', icon: <BarChart className="mr-2 h-4 w-4" /> },
//     { id: 'users', label: 'User Analytics', icon: <Users className="mr-2 h-4 w-4" /> },
//     { id: 'engagement', label: 'Engagement', icon: <Activity className="mr-2 h-4 w-4" /> },
//     { id: 'content', label: 'Content', icon: <Database className="mr-2 h-4 w-4" /> },
//     { id: 'reports', label: 'Reports', icon: <LineChart className="mr-2 h-4 w-4" /> }
//   ];

//   return (
//     <div className="bg-gray-50 min-h-screen p-6">
//       <header className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
//         <p className="text-gray-500 mt-2">Monitor your platform's performance and user engagement</p>
//       </header>

//       {/* Tabs */}
//       <div className="bg-white rounded-lg shadow mb-6">
//         <div className="flex overflow-x-auto">
//           {tabs.map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`flex items-center px-4 py-3 font-medium border-b-2 whitespace-nowrap ${
//                 activeTab === tab.id
//                   ? 'border-blue-500 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               {tab.icon}
//               {tab.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Overview Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {overviewStats.map((stat, index) => (
//           <div key={index} className="bg-white rounded-lg shadow p-6">
//             <div className="flex justify-between items-start">
//               <div>
//                 <p className="text-gray-500 text-sm">{stat.title}</p>
//                 <p className="text-2xl font-bold mt-1">{stat.value}</p>
//                 <div className="flex items-center mt-2">
//                   <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
//                     {stat.change}
//                   </span>
//                   <span className="text-gray-500 text-sm ml-1">vs last month</span>
//                 </div>
//               </div>
//               <div className="p-3 bg-gray-50 rounded-lg">{stat.icon}</div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         {/* User Acquisition Chart */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-semibold">User Acquisition</h2>
//             <select className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-sm">
//               <option>Last 7 days</option>
//               <option>Last 30 days</option>
//               <option>Last 90 days</option>
//             </select>
//           </div>
//           <div className="h-64 flex items-center justify-center text-gray-400">
//             {/* Placeholder for actual chart component */}
//             <div className="text-center">
//               <BarChart className="mx-auto h-12 w-12 opacity-50" />
//               <p className="mt-2">User acquisition trend visualization</p>
//             </div>
//           </div>
//         </div>

//         {/* Engagement Chart */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-semibold">Engagement Metrics</h2>
//             <select className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-sm">
//               <option>Last 7 days</option>
//               <option>Last 30 days</option>
//               <option>Last 90 days</option>
//             </select>
//           </div>
//           <div className="h-64 flex items-center justify-center text-gray-400">
//             {/* Placeholder for actual chart component */}
//             <div className="text-center">
//               <LineChart className="mx-auto h-12 w-12 opacity-50" />
//               <p className="mt-2">Engagement metrics visualization</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Additional Metrics */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Active Users by Industry */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-lg font-semibold mb-4">Users by Industry</h2>
//           <div className="h-64 flex items-center justify-center text-gray-400">
//             <div className="text-center">
//               <PieChart className="mx-auto h-12 w-12 opacity-50" />
//               <p className="mt-2">Industry distribution chart</p>
//             </div>
//           </div>
//         </div>

//         {/* Activity Timeline */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-lg font-semibold mb-4">Activity Timeline</h2>
//           <div className="h-64 overflow-auto">
//             <div className="space-y-4">
//               {[1, 2, 3, 4, 5].map((item) => (
//                 <div key={item} className="flex">
//                   <div className="mr-3 flex-shrink-0">
//                     <div className="w-2 h-2 mt-1 rounded-full bg-blue-500"></div>
//                     <div className="w-0.5 h-full ml-0.5 bg-gray-200"></div>
//                   </div>
//                   <div className="pb-4">
//                     <p className="text-sm font-medium">New feature launched</p>
//                     <p className="text-xs text-gray-500 mt-1">April 1, 2025 · 08:30 AM</p>
//                     <p className="text-sm text-gray-600 mt-1">Profile enhancement feature was released to all users</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Real-time Metrics */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h2 className="text-lg font-semibold mb-4">Real-time Activity</h2>
//           <div className="space-y-4">
//             <div>
//               <div className="flex justify-between items-center mb-1">
//                 <span className="text-sm text-gray-600">Active Users Now</span>
//                 <span className="text-sm font-medium">4,256</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70%' }}></div>
//               </div>
//             </div>
//             <div>
//               <div className="flex justify-between items-center mb-1">
//                 <span className="text-sm text-gray-600">Messages/min</span>
//                 <span className="text-sm font-medium">386</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
//               </div>
//             </div>
//             <div>
//               <div className="flex justify-between items-center mb-1">
//                 <span className="text-sm text-gray-600">Posts/min</span>
//                 <span className="text-sm font-medium">124</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-purple-500 h-2 rounded-full" style={{ width: '30%' }}></div>
//               </div>
//             </div>
//             <div>
//               <div className="flex justify-between items-center mb-1">
//                 <span className="text-sm text-gray-600">New Connections/min</span>
//                 <span className="text-sm font-medium">215</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-amber-500 h-2 rounded-full" style={{ width: '50%' }}></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminAnalyticsDashboard;

