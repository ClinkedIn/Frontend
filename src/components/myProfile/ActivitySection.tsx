import React, { useState, useEffect } from "react";
import axios from "axios";

interface UserActivity {
  postId: string;
  userId: string;
  firstName: string;
  lastName: string;
  headline: string | null;
  profilePicture: string | null;
  postDescription: string;
  attachments: string[];
  impressionCounts: {
    like: number;
    support: number;
    celebrate: number;
    love: number;
    insightful: number;
    funny: number;
    total: number;
  };
  commentCount: number;
  repostCount: number;
  createdAt: string;
  updatedAt: string;
  taggedUsers: {
    userId: string;
    userType: string;
    firstName: string;
    lastName: string;
    companyName: string | null;
  }[];
  whoCanSee: string;
  whoCanComment: string;
  isRepost: boolean;
  isSaved: boolean;
  activityType: string;
  activityDate: string;
  repostId?: string;
  reposterId?: string;
  reposterFirstName?: string;
  reposterLastName?: string;
  reposterProfilePicture?: string;
  reposterHeadline?: string;
  repostDescription?: string;
  repostDate?: string;
  commentId?: string;
  commentText?: string;
  commentDate?: string;
  commenterId?: string;
  commenterFirstName?: string;
  commenterLastName?: string;
  commenterProfilePicture?: string;
  commenterHeadline?: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface UserActivityResponse {
  posts: UserActivity[];
  pagination: Pagination;
}

interface ActivitySectionProps {
  userId: string | undefined;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const ActivitySection: React.FC<ActivitySectionProps> = ({ userId }) => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("all");

  const fetchActivities = async (page = 1, activityFilter = "all") => {
    if (!userId) {
      setError("User ID is missing");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get<UserActivityResponse>(
        `/user/${userId}/user-activity`,
        {
          params: {
            page,
            limit: 10,
            filter: activityFilter,
          },
        }
      );
      setActivities(response.data.posts);
      setPagination(response.data.pagination);
      setIsLoading(false);
    } catch (err: any) {
      console.error("Error fetching user activities:", err);
      setError(err.response?.data?.message || "Failed to load user activities");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities(currentPage, filter);
  }, [userId, currentPage, filter]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    setCurrentPage(1); // Reset to first page when changing filters
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays}d`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)}w`;
    } else if (diffDays < 365) {
      return `${Math.floor(diffDays / 30)}mo`;
    } else {
      return `${Math.floor(diffDays / 365)}y`;
    }
  };

  const renderActivityItem = (activity: UserActivity) => {
    return (
      <div
        key={`${activity.activityType}-${activity.postId}-${
          activity.commentId || ""
        }`}
        className="border-b border-gray-200 py-4"
      >
        <div className="flex items-start">
          <div className="mr-2">
            <img
              src={activity.profilePicture || "/api/placeholder/40/40"}
              alt={`${activity.firstName} ${activity.lastName}`}
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center">
              <span className="font-medium">
                {activity.firstName} {activity.lastName}
              </span>
              <span className="text-gray-500 text-sm ml-2">
                {activity.activityType === "post" && "posted"}
                {activity.activityType === "repost" && "reposted"}
                {activity.activityType === "comment" && "commented on a post"}
                <span className="mx-1">•</span>
                {formatDate(activity.activityDate)}
              </span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {activity.headline}
            </div>

            {activity.activityType === "comment" && activity.commentText && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md">
                {activity.commentText}
              </div>
            )}

            {(activity.activityType === "post" ||
              activity.activityType === "repost") && (
              <div className="mt-2">
                {activity.postDescription}
                {activity.attachments && activity.attachments.length > 0 && (
                  <div className="mt-2">
                    <img
                      src={
                        activity.attachments[0] || "/api/placeholder/400/300"
                      }
                      alt="Post attachment"
                      className="rounded-md max-w-full h-auto max-h-60 object-contain"
                    />
                  </div>
                )}
              </div>
            )}

            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span className="mr-4">
                <i className="far fa-thumbs-up mr-1"></i>
                {activity.impressionCounts.total}
              </span>
              <span className="mr-4">
                <i className="far fa-comment mr-1"></i>
                {activity.commentCount}
              </span>
              <span>
                <i className="fas fa-retweet mr-1"></i>
                {activity.repostCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium">Activity</h2>
          <div className="flex gap-2 text-sm">
            <button
              className={`px-3 py-1 rounded-full ${
                filter === "all"
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleFilterChange("all")}
            >
              All
            </button>
            <button
              className={`px-3 py-1 rounded-full ${
                filter === "posts"
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleFilterChange("posts")}
            >
              Posts
            </button>
            <button
              className={`px-3 py-1 rounded-full ${
                filter === "comments"
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleFilterChange("comments")}
            >
              Comments
            </button>
            <button
              className={`px-3 py-1 rounded-full ${
                filter === "reposts"
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleFilterChange("reposts")}
            >
              Reposts
            </button>
          </div>
        </div>
        {pagination && (
          <div className="text-sm text-gray-500 mt-1">
            {pagination.total}{" "}
            {pagination.total === 1 ? "follower" : "followers"}
          </div>
        )}
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="py-8 text-center text-gray-500">
            <p>Loading activities...</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">
            <p>{error}</p>
            <button
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => fetchActivities(currentPage, filter)}
            >
              Try Again
            </button>
          </div>
        ) : activities.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <p>No activities found.</p>
          </div>
        ) : (
          <div>
            {activities.map(renderActivityItem)}

            {pagination && pagination.pages > 1 && (
              <div className="mt-4 flex justify-center">
                <div className="flex space-x-2">
                  {pagination.hasPrevPage && (
                    <button
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </button>
                  )}

                  {Array.from(
                    { length: pagination.pages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      className={`px-3 py-1 rounded ${
                        page === currentPage
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}

                  {pagination.hasNextPage && (
                    <button
                      className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivitySection;
