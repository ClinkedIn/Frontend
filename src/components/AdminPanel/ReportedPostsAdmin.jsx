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

            postAuthor: {
              id: dataitem.report?.reportedId || "unknown",
              // Add proper null checks for all nested properties
              name: dataitem.reportedUser
                ? `${dataitem.reportedUser.firstName || ""} ${
                    dataitem.reportedUser.lastName || ""
                  }`.trim() || "Unknown User"
                : dataitem.reportedPost && dataitem.reportedPost.userId
                  ? `${dataitem.reportedPost.userId.firstName || ""} ${
                      dataitem.reportedPost.userId.lastName || ""
                    }`.trim() || "Unknown User"
                  : "Unknown User",
              avatar: dataitem.reportedPost && dataitem.reportedPost.userId
                ? dataitem.reportedPost.userId.profilePicture || "/api/placeholder/40/40"
                : dataitem.reportedUser
                  ? dataitem.reportedUser.profilePicture || "/api/placeholder/40/40"
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

        alert("Failed to load reported posts. Please try again later.");
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
    // result.sort((a, b) => {
    //   if (a[sortConfig.key] < b[sortConfig.key]) {
    //     return sortConfig.direction === "asc" ? -1 : 1;
    //   }
    //   if (a[sortConfig.key] > b[sortConfig.key]) {
    //     return sortConfig.direction === "asc" ? 1 : -1;
    //   }
    //   return 0;
    // });

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
