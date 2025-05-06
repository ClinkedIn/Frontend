import React, { useState, useEffect, useCallback } from "react";
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

// Create API instance outside component to prevent recreation on each render
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const ActivitySection: React.FC<ActivitySectionProps> = ({ userId }) => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Use useCallback to memoize the fetch function
  const fetchActivities = useCallback(
    async (page = 1) => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const response = await api.get<UserActivityResponse>(
          `/user/${userId}/user-activity`,
          {
            params: {
              page,
              limit: 10,
              filter: "posts", // Only fetch posts, no comments
            },
          }
        );

        // Filter out any invalid or incomplete activities
        const validActivities = response.data.posts.filter(
          (activity) =>
            !!activity &&
            !!activity.activityType &&
            (activity.activityType === "post" ||
              activity.activityType === "repost")
        );

        setActivities(validActivities);
        setPagination(response.data.pagination);
      } catch (err) {
        console.error("Error fetching user activities:", err);
        setActivities([]);
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    fetchActivities(currentPage);
  }, [fetchActivities, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
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

  const renderPagination = () => {
    if (!pagination || pagination.pages <= 1) return null;

    // Calculate which page numbers to show
    let pageNumbers: number[] = [];
    const totalPages = pagination.pages;

    if (totalPages <= 5) {
      // If 5 or fewer pages, show all
      pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      // Always include first and last page
      pageNumbers.push(1);

      // Add ellipsis indicator if needed
      if (currentPage > 3) {
        pageNumbers.push(-1); // -1 represents ellipsis
      }

      // Add pages around current page
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pageNumbers.push(i);
      }

      // Add ellipsis indicator if needed
      if (currentPage < totalPages - 2) {
        pageNumbers.push(-2); // -2 represents ellipsis
      }

      // Add last page if not already included
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }

    return (
      <div className="mt-4 flex justify-center">
        <div className="flex items-center space-x-2">
          {pagination.hasPrevPage && (
            <button
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
          )}

          {pageNumbers.map((page, index) =>
            page < 0 ? (
              <span key={`ellipsis-${index}`} className="px-2">
                ...
              </span>
            ) : (
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
            )
          )}

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
    );
  };

  const renderActivityItem = (activity: UserActivity) => {
    // Skip rendering if essential data is missing
    if (
      !activity ||
      !activity.activityType ||
      !["post", "repost"].includes(activity.activityType)
    ) {
      return null;
    }

    return (
      <div
        key={`${activity.activityType}-${activity.postId || ""}`}
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
                <span className="mx-1">•</span>
                {formatDate(activity.activityDate)}
              </span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {activity.headline}
            </div>

            <div className="mt-2">
              {activity.postDescription}
              {activity.attachments && activity.attachments.length > 0 && (
                <div className="mt-2">
                  <img
                    src={activity.attachments[0] || "/api/placeholder/400/300"}
                    alt="Post attachment"
                    className="rounded-md max-w-full h-auto max-h-60 object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-medium">Activity</h2>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="py-8 text-center text-gray-500">
            <p>Loading activities...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <p>No activities found.</p>
          </div>
        ) : (
          <>
            {activities
              .filter((activity) => !!activity)
              .map(renderActivityItem)}
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
};

export default ActivitySection;
