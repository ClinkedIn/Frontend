// import React, { useState, useEffect } from "react";
// import {
//   ChevronDown,
//   ChevronUp,
//   Filter,
//   Search,
//   MoreVertical,
//   CheckCircle,
//   XCircle,
//   AlertTriangle,
//   Clock,
// } from "lucide-react";

// const ReportedPosts = () => {
//   // Sample data - replace with your actual API call
//   const [reportedPosts, setReportedPosts] = useState([]);
//   const [filteredPosts, setFilteredPosts] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [sortConfig, setSortConfig] = useState({
//     key: "reportedAt",
//     direction: "desc",
//   });
//   const [activeDropdown, setActiveDropdown] = useState(null);

//   // Fetch data
//   useEffect(() => {
//     const fetchReportedPosts = async () => {
//       setIsLoading(true);
//       try {
//         // Simulating API call with timeout
//         setTimeout(() => {
//           const sampleData = [
//             {
//               id: "1",
//               postId: "post123",
//               postContent:
//                 "This is an inappropriate post with offensive language that violates our community guidelines.",
//               postAuthor: {
//                 id: "user456",
//                 name: "John Doe",
//                 avatar: "/api/placeholder/40/40",
//                 position: "Software Engineer at Tech Co.",
//               },
//               reporter: {
//                 id: "user789",
//                 name: "Sarah Smith",
//                 avatar: "/api/placeholder/40/40",
//               },
//               reason: "Hate speech",
//               details: "Contains offensive language targeting specific groups",
//               reportedAt: "2025-03-19T14:30:00Z",
//               status: "pending",
//             },
//             {
//               id: "2",
//               postId: "post456",
//               postContent:
//                 "Check out my new website at spamlink.com! Guaranteed income!!!",
//               postAuthor: {
//                 id: "user111",
//                 name: "Alex Johnson",
//                 avatar: "/api/placeholder/40/40",
//                 position: "Freelancer",
//               },
//               reporter: {
//                 id: "user222",
//                 name: "Michael Brown",
//                 avatar: "/api/placeholder/40/40",
//               },
//               reason: "Spam",
//               details: "Promotional content with suspicious links",
//               reportedAt: "2025-03-18T10:15:00Z",
//               status: "reviewed",
//             },
//             {
//               id: "3",
//               postId: "post789",
//               postContent:
//                 "I am selling counterfeit products at half the price.",
//               postAuthor: {
//                 id: "user333",
//                 name: "Lisa Williams",
//                 avatar: "/api/placeholder/40/40",
//                 position: "Business Owner",
//               },
//               reporter: {
//                 id: "user444",
//                 name: "David Miller",
//                 avatar: "/api/placeholder/40/40",
//               },
//               reason: "Illegal activity",
//               details: "Promoting sale of counterfeit goods",
//               reportedAt: "2025-03-20T09:45:00Z",
//               status: "pending",
//             },
//             {
//               id: "4",
//               postId: "post012",
//               postContent:
//                 "This is someone else's content that I'm claiming as my own.",
//               postAuthor: {
//                 id: "user555",
//                 name: "Robert Wilson",
//                 avatar: "/api/placeholder/40/40",
//                 position: "Content Creator",
//               },
//               reporter: {
//                 id: "user666",
//                 name: "Emily Taylor",
//                 avatar: "/api/placeholder/40/40",
//               },
//               reason: "Copyright infringement",
//               details: "Content plagiarized from original creator",
//               reportedAt: "2025-03-17T16:20:00Z",
//               status: "dismissed",
//             },
//             {
//               id: "5",
//               postId: "post345",
//               postContent:
//                 "Personal information including phone number and address of a public figure.",
//               postAuthor: {
//                 id: "user777",
//                 name: "Thomas Anderson",
//                 avatar: "/api/placeholder/40/40",
//                 position: "Blogger",
//               },
//               reporter: {
//                 id: "user888",
//                 name: "Jessica Lee",
//                 avatar: "/api/placeholder/40/40",
//               },
//               reason: "Privacy violation",
//               details:
//                 "Sharing personal identifying information without consent",
//               reportedAt: "2025-03-19T08:10:00Z",
//               status: "actioned",
//             },
//           ];
//           setReportedPosts(sampleData);
//           setFilteredPosts(sampleData);
//           setIsLoading(false);
//         }, 1000);
//       } catch (error) {
//         console.error("Error fetching reported posts:", error);
//         setIsLoading(false);
//       }
//     };

//     fetchReportedPosts();
//   }, []);

//   // Apply filters and search
//   useEffect(() => {
//     let result = [...reportedPosts];

//     // Apply status filter
//     if (statusFilter !== "all") {
//       result = result.filter((post) => post.status === statusFilter);
//     }

//     // Apply search filter
//     if (searchTerm) {
//       const search = searchTerm.toLowerCase();
//       result = result.filter(
//         (post) =>
//           post.postContent.toLowerCase().includes(search) ||
//           post.postAuthor.name.toLowerCase().includes(search) ||
//           post.reporter.name.toLowerCase().includes(search) ||
//           post.reason.toLowerCase().includes(search) ||
//           post.details.toLowerCase().includes(search)
//       );
//     }

//     // Apply sorting
//     result.sort((a, b) => {
//       if (a[sortConfig.key] < b[sortConfig.key]) {
//         return sortConfig.direction === "asc" ? -1 : 1;
//       }
//       if (a[sortConfig.key] > b[sortConfig.key]) {
//         return sortConfig.direction === "asc" ? 1 : -1;
//       }
//       return 0;
//     });

//     setFilteredPosts(result);
//   }, [reportedPosts, statusFilter, searchTerm, sortConfig]);

//   const handleSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") {
//       direction = "desc";
//     }
//     setSortConfig({ key, direction });
//   };

//   // change status of reported post
//   const handleStatusChange = async (postId, newStatus) => {
//     try {
//       // Simulating API call
//       setReportedPosts(
//         reportedPosts.map((post) =>
//           post.id === postId ? { ...post, status: newStatus } : post
//         )
//       );
//       // Close dropdown after action
//       setActiveDropdown(null);
//     } catch (error) {
//       console.error("Error updating post status:", error);
//     }
//   };

//   const getStatusBadge = (status) => {
//     switch (status) {
//       case "pending":
//         return (
//           <span className="px-2 py-1 text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full flex items-center">
//             <Clock className="mr-1 h-3 w-3" /> Pending
//           </span>
//         );
//       case "reviewed":
//         return (
//           <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-full flex items-center">
//             <CheckCircle className="mr-1 h-3 w-3" /> Reviewed
//           </span>
//         );
//       case "actioned":
//         return (
//           <span className="px-2 py-1 text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded-full flex items-center">
//             <CheckCircle className="mr-1 h-3 w-3" /> Actioned
//           </span>
//         );
//       case "dismissed":
//         return (
//           <span className="px-2 py-1 text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200 rounded-full flex items-center">
//             <XCircle className="mr-1 h-3 w-3" /> Dismissed
//           </span>
//         );
//       default:
//         return (
//           <span className="px-2 py-1 text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200 rounded-full">
//             {status}
//           </span>
//         );
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return new Intl.DateTimeFormat("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     }).format(date);
//   };

//   return (
//     <div className="bg-gray-50  min-h-screen">
//       {/* Header */}
//       {/* <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16">
//             <div className="flex">
//               <div className="flex-shrink-0 flex items-center">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 24 24"
//                   className="h-8 w-8 text-[#0a66c2]"
//                   fill="currentColor"
//                 >
//                   <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
//                 </svg>
//                 <span className="ml-2 text-xl font-semibold text-gray-900">
//                   Admin
//                 </span>
//               </div>
//             </div>
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <img
//                   className="h-8 w-8 rounded-full"
//                   src="/api/placeholder/32/32"
//                   alt="Admin profile"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div> */}

//       {/* Content */}
//       <div className="max-w-6xl  mx-auto ">
//         <div className="bg-gray-50 ">
//           <div className="px-6 py-5 border-b border-gray-200">
//             <h1 className="text-xl font-medium text-gray-900">
//               Reported Posts
//             </h1>
//             <p className="mt-1 text-sm text-gray-500">
//               Review and moderate content that has been flagged by users
//             </p>
//           </div>

//           {/* Filters and search */}
//           <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="relative flex-1">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Search className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   type="text"
//                   className="pl-10 block w-full rounded-md border border-gray-300 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-[#0a66c2] focus:border-[#0a66c2]"
//                   placeholder="Search reported posts..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>

//               <div className="inline-flex rounded-md shadow-sm">
//                 <button
//                   type="button"
//                   className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-l-md border ${
//                     statusFilter === "all"
//                       ? "bg-[#0a66c2] text-white border-[#0a66c2]"
//                       : "bg-white text-gray-700 hover:bg-gray-50"
//                   }`}
//                   onClick={() => setStatusFilter("all")}
//                 >
//                   All
//                 </button>
//                 <button
//                   type="button"
//                   className={`inline-flex items-center px-4 py-2 text-sm font-medium border-t border-b border-r ${
//                     statusFilter === "pending"
//                       ? "bg-[#0a66c2] text-white border-[#0a66c2]"
//                       : "bg-white text-gray-700 hover:bg-gray-50"
//                   }`}
//                   onClick={() => setStatusFilter("pending")}
//                 >
//                   Pending
//                 </button>
//                 <button
//                   type="button"
//                   className={`inline-flex items-center px-4 py-2 text-sm font-medium border-t border-b border-r ${
//                     statusFilter === "reviewed"
//                       ? "bg-[#0a66c2] text-white border-[#0a66c2]"
//                       : "bg-white text-gray-700 hover:bg-gray-50"
//                   }`}
//                   onClick={() => setStatusFilter("reviewed")}
//                 >
//                   Reviewed
//                 </button>
//                 <button
//                   type="button"
//                   className={`inline-flex items-center px-4 py-2 text-sm font-medium border-t border-b border-r ${
//                     statusFilter === "actioned"
//                       ? "bg-[#0a66c2] text-white border-[#0a66c2]"
//                       : "bg-white text-gray-700 hover:bg-gray-50"
//                   }`}
//                   onClick={() => setStatusFilter("actioned")}
//                 >
//                   Actioned
//                 </button>
//                 <button
//                   type="button"
//                   className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-r-md border-t border-b border-r ${
//                     statusFilter === "dismissed"
//                       ? "bg-[#0a66c2] text-white border-[#0a66c2]"
//                       : "bg-white text-gray-700 hover:bg-gray-50"
//                   }`}
//                   onClick={() => setStatusFilter("dismissed")}
//                 >
//                   Dismissed
//                 </button>
//               </div>

//               <button
//                 type="button"
//                 className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0a66c2] bg-white border border-[#0a66c2] rounded-md hover:bg-[#f3f9ff]"
//               >
//                 <Filter className="h-4 w-4" />
//                 More Filters
//               </button>
//             </div>

//             {/* Results count */}
//             <div className="mt-4 text-sm text-gray-500">
//               Showing {filteredPosts.length} of {reportedPosts.length} reports
//             </div>
//           </div>

//           {/* Loading state */}
//           {isLoading && (
//             <div className="py-16 flex justify-center items-center">
//               <div className="w-12 h-12 border-4 border-[#0a66c2] border-t-transparent rounded-full animate-spin"></div>
//             </div>
//           )}

//           {/* Empty state */}
//           {!isLoading && filteredPosts.length === 0 && (
//             <div className="py-16 flex flex-col items-center justify-center">
//               <div className="rounded-full bg-gray-100 p-4">
//                 <AlertTriangle className="h-8 w-8 text-gray-400" />
//               </div>
//               <h3 className="mt-4 text-lg font-medium text-gray-900">
//                 No reported posts found
//               </h3>
//               <p className="mt-1 text-sm text-gray-500 max-w-sm text-center">
//                 Try adjusting your search or filter to find what you're looking
//                 for.
//               </p>
//             </div>
//           )}

//           {/* Reports list */}
//           {!isLoading && filteredPosts.length > 0 && (
//             <div className="overflow-y-auto">
//               <ul className="divide-y divide-gray-200">
//                 {filteredPosts.map((post) => (
//                   <li key={post.id} className="px-6 py-4 hover:bg-[#f3f9ff]">
//                     <div className="flex flex-col md:flex-row md:items-start gap-4">
//                       {/* Post content */}
//                       <div className="flex-1">
//                         <div className="flex items-start">
//                           <img
//                             src={post.postAuthor.avatar}
//                             alt=""
//                             className="h-12 w-12 rounded-full border border-gray-200"
//                           />
//                           <div className="ml-3">
//                             <div className="flex items-center">
//                               <p className="text-sm font-medium text-gray-900">
//                                 {post.postAuthor.name}
//                               </p>
//                               <span className="mx-1 text-gray-500">•</span>
//                               <p className="text-xs text-gray-500">
//                                 {formatDate(post.reportedAt)}
//                               </p>
//                             </div>
//                             <p className="text-xs text-gray-500">
//                               {post.postAuthor.position}
//                             </p>
//                             <p className="mt-2 text-sm text-gray-700">
//                               {post.postContent}
//                             </p>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Report details */}
//                       <div className="bg-gray-50 rounded-lg p-4 md:w-64">
//                         <div className="flex items-center justify-between mb-3">
//                           <h4 className="text-xs font-medium text-gray-500 uppercase">
//                             Report Details
//                           </h4>
//                           {getStatusBadge(post.status)}
//                         </div>

//                         <div className="mb-3">
//                           <h5 className="text-xs font-medium text-gray-500">
//                             Reported By
//                           </h5>
//                           <div className="flex items-center mt-1">
//                             <img
//                               src={post.reporter.avatar}
//                               alt=""
//                               className="h-6 w-6 rounded-full border border-gray-200"
//                             />
//                             <span className="ml-2 text-sm font-medium text-gray-900">
//                               {post.reporter.name}
//                             </span>
//                           </div>
//                         </div>

//                         <div className="mb-3">
//                           <h5 className="text-xs font-medium text-gray-500">
//                             Reason
//                           </h5>
//                           <p className="text-sm font-medium text-gray-900 mt-1">
//                             {post.reason}
//                           </p>
//                           <p className="text-xs text-gray-500 mt-1">
//                             {post.details}
//                           </p>
//                         </div>

//                         <div className="flex flex-col gap-2 mt-4">
//                           <button
//                             onClick={() =>
//                               handleStatusChange(post.id, "actioned")
//                             }
//                             className="w-full px-3 py-1.5 text-sm font-medium text-white bg-[#0a66c2] rounded-full hover:bg-[#084b8a] focus:outline-none"
//                           >
//                             Take Action
//                           </button>
//                           <button
//                             onClick={() =>
//                               handleStatusChange(post.id, "dismissed")
//                             }
//                             className="w-full px-3 py-1.5 text-sm font-medium text-[#0a66c2] bg-white border border-[#0a66c2] rounded-full hover:bg-[#f3f9ff] focus:outline-none"
//                           >
//                             Dismiss
//                           </button>
//                           <div className="relative">
//                             <button
//                               onClick={() =>
//                                 setActiveDropdown(
//                                   activeDropdown === post.id ? null : post.id
//                                 )
//                               }
//                               className="w-full px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 focus:outline-none flex items-center justify-center"
//                             >
//                               More Options
//                               <ChevronDown className="ml-1 h-4 w-4" />
//                             </button>

//                             {activeDropdown === post.id && (
//                               <div className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//                                 <button
//                                   onClick={() =>
//                                     handleStatusChange(post.id, "reviewed")
//                                   }
//                                   className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
//                                 >
//                                   <CheckCircle className="mr-2 h-4 w-4 text-blue-500" />
//                                   Mark as Reviewed
//                                 </button>
//                                 <a
//                                   href={`#/post/${post.postId}`}
//                                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                                 >
//                                   View Original Post
//                                 </a>
//                                 <a
//                                   href={`#/user/${post.postAuthor.id}`}
//                                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                                 >
//                                   View Author Profile
//                                 </a>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReportedPosts;

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
import { data } from "react-router-dom";
import { BASE_URL } from "../../constants";

// Base URL configuration - adjust as needed for your environment
//const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const ReportedPosts = () => {
  const [reportedPosts, setReportedPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Fetch data from the API
  useEffect(() => {
    const fetchReportedPosts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${BASE_URL}/admin/reports`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const result = await response.json();

        if (result.status === "success" && Array.isArray(result.data)) {
          // Transform the API data to match our component's expected format
          const transformedData = result.data.map((dataitem) => ({
            id: dataitem.report._id,
            postId: dataitem.report.reportedId,
            postContent: dataitem.report.policy, // Using policy as content placeholder
            // postAuthor: {
            //   id: dataitem.report.reportedId,
            //   name: dataitem.reportedUser.firstName,
            //     // dataitem.report.reportedType === "User"
            //     //   ? `${dataitem.report.reportedType} Profile`
            //     //   : `${dataitem.report.reportedType} Content`,
            //   avatar: "/api/placeholder/40/40",
            //   position: dataitem.report.reportedType,
            // }
            postAuthor: {
              id: dataitem.report?.reportedId || "unknown",
              // Add null check here
              name: dataitem.reportedUser
                ? `${dataitem.reportedUser.firstName || ""} ${
                    dataitem.reportedUser.lastName || ""
                  }`.trim() || "Unknown User"
                : dataitem.reportedPost
                ? `${dataitem.reportedPost.userId.firstName || ""} ${
                    dataitem.reportedPost.userId.lastName || ""
                  }`.trim() || "Unknown User"
                : "Unknown User",
              avatar: dataitem.reportedPost
                ? dataitem.reportedPost.userId.profilePicture
                : dataitem.reportedUser
                ? dataitem.reportedUser.profilePicture
                : "/api/placeholder/40/40",
              position: dataitem.report?.reportedType || "Unknown",
            },
            reporter: {
              id: dataitem.report.userId._id,
              name: `${dataitem.report.userId.firstName} ${dataitem.report.userId.lastName}`,
              avatar:
                dataitem.report.userId.profilePicture ||
                "/api/placeholder/40/40",
            },
            reason: dataitem.report.policy,
            details:
              dataitem.report.dontWantToSee ||
              dataitem.report.moderationReason ||
              "No additional details provided",
            reportedAt: dataitem.report.createdAt,
            status: mapStatusValue(dataitem.report.status),
            moderatedAt: dataitem.report.moderatedAt,
          }));

          setReportedPosts(transformedData);
          setFilteredPosts(transformedData);
        } else {
          throw new Error("Invalid response format from API");
        }
      } catch (error) {
        console.error("Error fetching reported posts:", error);
        setError(error.message);

        // Fallback to sample data in case of error
        useSampleData();
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportedPosts();
  }, []);

  // Map API status values to our component's status values
  const mapStatusValue = (apiStatus) => {
    switch (apiStatus) {
      case "pending":
        return "pending";
      case "approved":
        return "actioned";
      case "rejected":
        return "dismissed";
      default:
        return "reviewed";
    }
  };

  // Fallback to sample data if API fails
  // const useSampleData = () => {
  //   const sampleData = [
  //     {
  //       id: "1",
  //       postId: "post123",
  //       postContent:
  //         "This is an inappropriate post with offensive language that violates our community guidelines.",
  //       postAuthor: {
  //         id: "user456",
  //         name: "John Doe",
  //         avatar: "/api/placeholder/40/40",
  //         position: "Software Engineer at Tech Co.",
  //       },
  //       reporter: {
  //         id: "user789",
  //         name: "Sarah Smith",
  //         avatar: "/api/placeholder/40/40",
  //       },
  //       reason: "Hate speech",
  //       details: "Contains offensive language targeting specific groups",
  //       reportedAt: "2025-03-19T14:30:00Z",
  //       status: "pending",
  //     },
  //     // Additional sample items...
  //     {
  //       id: "2",
  //       postId: "post456",
  //       postContent:
  //         "Check out my new website at spamlink.com! Guaranteed income!!!",
  //       postAuthor: {
  //         id: "user111",
  //         name: "Alex Johnson",
  //         avatar: "/api/placeholder/40/40",
  //         position: "Freelancer",
  //       },
  //       reporter: {
  //         id: "user222",
  //         name: "Michael Brown",
  //         avatar: "/api/placeholder/40/40",
  //       },
  //       reason: "Spam",
  //       details: "Promotional content with suspicious links",
  //       reportedAt: "2025-03-18T10:15:00Z",
  //       status: "reviewed",
  //     },
  //   ];

  //   setReportedPosts(sampleData);
  //   setFilteredPosts(sampleData);
  // };

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
          (post.postContent &&
            post.postContent.toLowerCase().includes(search)) ||
          (post.postAuthor.name &&
            post.postAuthor.name.toLowerCase().includes(search)) ||
          (post.reporter.name &&
            post.reporter.name.toLowerCase().includes(search)) ||
          (post.reason && post.reason.toLowerCase().includes(search)) ||
          (post.details && post.details.toLowerCase().includes(search))
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

  // Update status of reported post
  const handleStatusChange = async (postId, newStatus) => {
    setIsLoading(true);

    try {
      // Map our component status values back to API status values
      const apiStatus =
        newStatus === "actioned"
          ? "approved"
          : newStatus === "dismissed"
          ? "rejected"
          : // : newStatus === "reviewed"
            // ? "reviewed"
            "pending";

      // API call to update status
      const response = await fetch(`${BASE_URL}/admin/reports/${postId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          action: apiStatus,
          reason:
            apiStatus === "rejected"
              ? "Content reviewed and rejected"
              : apiStatus === "approved"
              ? "Violation confirmed and action taken"
              : apiStatus === "reviewed"
              ? "Content reviewed and approved"
              : "Content under review",
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.statusText}`);
      }

      // Update local state
      setReportedPosts(
        reportedPosts.map((post) =>
          post.id === postId ? { ...post, status: newStatus } : post
        )
      );
    } catch (error) {
      console.error("Error updating post status:", error);
      alert("Failed to update status. Please try again.");
    } finally {
      setIsLoading(false);
      // Close dropdown after action
      setActiveDropdown(null);
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
    if (!dateString) return "Unknown date";

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
    <div className="bg-gray-50 min-h-screen">
      {/* Content */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-50">
          <div className="px-6 py-5 border-b border-gray-200">
            <h1 className="text-xl font-medium text-gray-900">
              Reported Content
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
                  placeholder="Search reported content..."
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
                {/* <button
                  type="button"
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium border-t border-b border-r ${
                    statusFilter === "reviewed"
                      ? "bg-[#0a66c2] text-white border-[#0a66c2]"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setStatusFilter("reviewed")}
                >
                  Reviewed
                </button> */}
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

              {/* <button
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0a66c2] bg-white border border-[#0a66c2] rounded-md hover:bg-[#f3f9ff]"
              >
                <Filter className="h-4 w-4" />
                More Filters
              </button> */}
            </div>

            {/* Results count */}
            <div className="mt-4 text-sm text-gray-500">
              Showing {filteredPosts.length} of {reportedPosts.length} reports
            </div>
          </div>

          {/* Error state */}
          {error && !isLoading && (
            <div className="py-16 flex flex-col items-center justify-center">
              <div className="rounded-full bg-red-100 p-4">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Error loading reports
              </h3>
              <p className="mt-1 text-sm text-gray-500 max-w-sm text-center">
                {error}
              </p>
              <button
                className="mt-4 px-4 py-2 bg-[#0a66c2] text-white rounded-md"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="py-16 flex justify-center items-center">
              <div className="w-12 h-12 border-4 border-[#0a66c2] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && filteredPosts.length === 0 && (
            <div className="py-16 flex flex-col items-center justify-center">
              <div className="rounded-full bg-gray-100 p-4">
                <AlertTriangle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No reported content found
              </h3>
              <p className="mt-1 text-sm text-gray-500 max-w-sm text-center">
                Try adjusting your search or filter to find what you're looking
                for.
              </p>
            </div>
          )}

          {/* Reports list */}
          {!isLoading && !error && filteredPosts.length > 0 && (
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
                              {post.postContent ||
                                "No content preview available"}
                            </p>
                            {post.moderatedAt && (
                              <p className="mt-1 text-xs text-gray-500">
                                Last moderated: {formatDate(post.moderatedAt)}
                              </p>
                            )}
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
                            disabled={isLoading}
                          >
                            Take Action
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(post.id, "dismissed")
                            }
                            className="w-full px-3 py-1.5 text-sm font-medium text-[#0a66c2] bg-white border border-[#0a66c2] rounded-full hover:bg-[#f3f9ff] focus:outline-none"
                            disabled={isLoading}
                          >
                            Dismiss
                          </button>

                          {/* <div className="relative">
                            <button
                              onClick={() =>
                                setActiveDropdown(
                                  activeDropdown === post.id ? null : post.id
                                )
                              }
                              className="w-full px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 focus:outline-none flex items-center justify-center"
                              disabled={isLoading}
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
                                  href={`#/content/${post.postId}`}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  View Original Content
                                </a>
                                <a
                                  href={`#/user/${post.postAuthor.id}`}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  View Author Profile
                                </a>
                              </div>
                            )}
                          </div> */}
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
