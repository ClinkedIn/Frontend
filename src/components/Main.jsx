import React, { useState, useEffect } from "react";
import axios from "axios";
import PostMenu from "./PostMenu.jsx";
import CreatePostModal from "./PostCreation.jsx";
import PostReactions from "./PostReactions.jsx";
import CommentSection from "./CommentSection.jsx";
import { BASE_URL } from "../constants";
import { useLocation } from 'react-router-dom';
import SinglePostView from './SinglePostView.jsx';

// Set axios defaults to include credentials with all requests
axios.defaults.withCredentials = true;

/**
 * The `Main` component serves as the primary container for displaying posts,
 * handling user interactions such as creating posts, reacting to posts,
 * commenting, and managing post visibility. It integrates with APIs to fetch
 * and update data dynamically, ensuring a responsive and interactive user experience.
 *
 * @component
 * @returns {JSX.Element} The rendered `Main` component.
 *
 * @example
 * // Usage in a React application
 * import Main from './components/Main';
 *
 * function App() {
 *   return (
 *     <div>
 *       <Main />
 *     </div>
 *   );
 * }
 *
 * @description
 * The `Main` component includes the following features:
 * - Fetching and displaying posts from an API.
 * - Allowing users to create new posts with text and attachments.
 * - Reacting to posts with various reaction types (e.g., like, celebrate).
 * - Commenting on posts, including support for replies and attachments.
 * - Managing post visibility (e.g., hiding, saving, reporting).
 * - Displaying and toggling comments for individual posts.
 * - Handling user authentication and notifications.
 *
 * @dependencies
 * - React hooks: `useState`, `useEffect`
 * - Axios for API requests
 * - Custom components: `PostMenu`, `PostReactions`, `CommentSection`, `CreatePostModal`
 *
 * @state
 * - `posts` (Array): List of posts fetched from the API.
 * - `loading` (boolean): Indicates whether posts are being loaded.
 * - `error` (string|null): Error message if fetching posts fails.
 * - `postContent` (string): Content of the post being created.
 * - `isPostModalOpen` (boolean): Controls the visibility of the post creation modal.
 * - `userReactions` (Object): Tracks user reactions to posts.
 * - `expandedComments` (Object): Tracks which posts have their comments expanded.
 * - `comments` (Object): Stores comments for each post.
 * - `loadingComments` (Object): Tracks loading state for comments of each post.
 *
 * @methods
 * - `fetchPosts`: Fetches posts from the API and updates the state.
 * - `fetchComments`: Fetches comments for a specific post.
 * - `toggleComments`: Toggles the visibility of comments for a post.
 * - `handleAddComment`: Adds a new comment to a post.
 * - `handleReact`: Handles reacting to a post (e.g., like, celebrate).
 * - `handleCreatePost`: Handles creating a new post.
 * - `handleHidePost`: Hides a post from the feed.
 * - `handleSavePost`: Saves a post for later viewing.
 * - `handleReportPost`: Reports a post for inappropriate content.
 * - `fetchUser`: Fetches user profile data.
 * - `fetchNotifications`: Fetches user notifications.
 * - `formatDate`: Formats a date string for display.
 */

// Place savePost here, outside the Main component
export async function savePost(postId, token) {
  const response = await fetch(`/api/posts/${postId}/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to save post");
  }
  return data;
}

const fetchSavedPosts = async (page = 1, limit = 10) => {
  setSavedPostsLoading(true);
  try {
    const response = await axios.get(
      `${BASE_URL}/user/saved-posts?page=${page}&limit=${limit}`,
      { withCredentials: true }
    );
    setSavedPosts(response.data.posts || []);
  } catch (err) {
    console.error("Error fetching saved posts:", err);
    setSavedPosts([]);
  } finally {
    setSavedPostsLoading(false);
  }
};

const Main = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postContent, setPostContent] = useState("");
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [userReactions, setUserReactions] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [comments, setComments] = useState({});
  const [loadingComments, setLoadingComments] = useState({});
  const [authorInfo, setAuthorInfo] = useState(null);
  const [expandedReplies, setExpandedReplies] = useState({});
  const [replies, setReplies] = useState({});

  //saved posts
  const [showSavedPosts, setShowSavedPosts] = useState(false);
  const [savedPosts, setSavedPosts] = useState([]);
  const [savedPostsLoading, setSavedPostsLoading] = useState(false);
  
  const location = useLocation();
  const resourceId = location.state?.resourceId;
  console.log('Resource ID from location state:', resourceId);

  // Use exact API endpoint as specified
  const API_ENDPOINT = `${BASE_URL}/posts`;
  const COMMENTS_ENDPOINT = `${BASE_URL}/comments`;

  // Available reaction types
  /**
   * An array of reaction types, each represented as an object containing:
   * - `type`: A string representing the unique identifier for the reaction type.
   * - `emoji`: A string representing the emoji associated with the reaction.
   * - `label`: A string representing the human-readable label for the reaction.
   *
   * Example usage:
   * ```javascript
   * reactionTypes.map(reaction => console.log(reaction.label));
   * ```
   */
  const reactionTypes = [
    { type: "like", emoji: "👍", label: "Like" },
    { type: "celebrate", emoji: "👏", label: "Celebrate" },
    { type: "support", emoji: "❤️", label: "Support" },
    { type: "insightful", emoji: "💡", label: "Insightful" },
    { type: "funny", emoji: "😄", label: "Funny" },
  ];

  useEffect(() => {
    const fetchAndSetUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/me`, {
          withCredentials: true,
        });
        setAuthorInfo(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchAndSetUser();
  }, []);

  // Define fetchUser and fetchNotifications functions
  /**
   * Fetches the user profile data from the server.
   * Sends a GET request to the endpoint 'http://localhost:3000/user/profile' with credentials included.
   * Logs the user data to the console if the request is successful.
   * Logs an error message to the console if the request fails.
   *
   * @async
   * @function fetchUser
   * @returns {Promise<void>} A promise that resolves when the user data is fetched and logged, or rejects if an error occurs.
   */
  const fetchUser = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/me`, {
        withCredentials: true,
      });
      console.log("User data:", response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  /**
   * Fetches notifications from the server.
   *
   * This function sends a GET request to the `/notifications` endpoint
   * on the server running at `http://localhost:3000`. It includes credentials
   * in the request for authentication purposes. The fetched notifications
   * are logged to the console. If an error occurs during the request, it is
   * caught and logged to the console.
   *
   * @async
   * @function fetchNotifications
   * @returns {Promise<void>} A promise that resolves when the notifications
   * are successfully fetched and logged, or rejects if an error occurs.
   */
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/notifications`, {
        withCredentials: true,
      });
      console.log("Notifications:", response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Fetch posts function
  /**
   * Fetches posts from the API and updates the state with the retrieved data.
   *
   * This function makes an asynchronous request to fetch posts from the specified API endpoint.
   * It processes the response to extract posts data and pagination information, updates the
   * `posts` state with the retrieved posts, and initializes user reactions based on the posts data.
   *
   * In case of an error during the fetch operation, it logs the error and updates the `error` state
   * with an appropriate message. The `loading` state is set to `false` once the operation is complete.
   *
   * @async
   * @function fetchPosts
   * @throws Will log an error and set an error message in the state if the API request fails.
   */
  const fetchPosts = async () => {
    try {
      console.log("Attempting to fetch posts...");
      const response = await axios.get(API_ENDPOINT, { withCredentials: true });
      console.log("Response received:", response);

      // Handle the data based on structure
      let postsData = response.data;

      // Check if response has posts property (from the JSON example you provided)
      if (response.data && response.data.posts) {
        postsData = response.data.posts;
        console.log("Pagination info:", response.data.pagination);
      }

      console.log("Posts data:", postsData);
      setPosts(postsData);

      // Initialize user reactions from posts data
      const initialReactions = {};
      postsData.forEach((post) => {
        const postId = post.id || post.postId;
        if (post.userReaction) {
          initialReactions[postId] = post.userReaction.type;
        } else if (post.isLiked) {
          initialReactions[postId] = post.isLiked.type;
          console.log(post.isLiked.type);
        }
      });
      setUserReactions(initialReactions);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch comments for a specific post
  /**
   * Fetches comments for a specific post by its ID.
   *
   * This function makes an asynchronous request to retrieve comments for a given post.
   * It updates the loading state and stores the fetched comments in the component's state.
   * If an error occurs during the request, it logs the error details to the console.
   *
   * @async
   * @function fetchComments
   * @param {string} postId - The ID of the post for which to fetch comments.
   * @returns {Promise<void>} A promise that resolves when the comments are fetched and state is updated.
   */
  // Update fetchComments to sync comment counts
  const fetchComments = async (postId) => {
    try {
      setLoadingComments((prev) => ({ ...prev, [postId]: true }));

      const endpoint = `${COMMENTS_ENDPOINT}/${postId}/post`;
      console.log(`Fetching comments for post ${postId} from ${endpoint}`);

      const response = await axios.get(endpoint);
      console.log(`Comments response for post ${postId}:`, response.data);

      if (response.data && response.data.comments) {
        // Store the comments
        setComments((prev) => ({
          ...prev,
          [postId]: response.data.comments,
        }));

        // Update the post's comment count to match
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId || post.postId === postId
              ? {
                  ...post,
                  commentCount: response.data.comments.length,
                  metrics: post.metrics
                    ? {
                        ...post.metrics,
                        comments: response.data.comments.length,
                      }
                    : undefined,
                }
              : post
          )
        );
      }
    } catch (err) {
      console.error(`Error fetching comments for post ${postId}:`, err);

      if (err.response) {
        console.error("Comments error response:", err.response.data);
        console.error("Status code:", err.response.status);
      }
    } finally {
      setLoadingComments((prev) => ({ ...prev, [postId]: false }));
    }
  };

  // Toggle comments display for a post
  /**
   * Toggles the visibility of comments for a specific post.
   * If the comments are being expanded and have not been fetched yet,
   * it fetches the comments for the given post ID.
   *
   * @async
   * @function toggleComments
   * @param {string} postId - The unique identifier of the post whose comments are being toggled.
   * @returns {Promise<void>} A promise that resolves when the comments are fetched (if needed).
   */
  const toggleComments = async (postId) => {
    const isExpanded = expandedComments[postId];

    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !isExpanded,
    }));

    // If expanding comments and we don't have them yet, fetch them
    if (!isExpanded) {
      await fetchComments(postId);
    }
  };

  /**
   * Deletes a post by sending a DELETE request to the API.
   *
   * @async
   * @function handleDeletePost
   * @param {string} postId - The ID of the post to delete.
   * @returns {Promise<boolean>} - Returns true if deletion was successful, false otherwise.
   */
  const handleDeletePost = async (postId) => {
    try {
      // Confirm deletion with the user
      if (
        !window.confirm(
          "Are you sure you want to delete this post? This action cannot be undone."
        )
      ) {
        return false;
      }

      // Send DELETE request to the API endpoint
      const response = await axios.delete(`${API_ENDPOINT}/${postId}`);
      console.log("Post deletion response:", response.data);

      // If successful, remove the post from the UI
      setPosts(
        posts.filter((post) => post.id !== postId && post.postId !== postId)
      );

      // Show success message
      alert("Post deleted successfully.");
      return true;
    } catch (err) {
      console.error("Error deleting post:", err);

      if (err.response) {
        const status = err.response.status;
        const errorMsg = err.response.data.message || "Error deleting post";

        console.error(`Server responded with: ${status} - ${errorMsg}`);

        // Handle specific error cases
        if (status === 400) {
          alert("Error: Post ID is missing or invalid.");
        } else if (status === 403) {
          alert("Error: You can only delete your own posts.");
        } else if (status === 404) {
          alert("Error: Post not found or already deleted.");
          // Remove from UI anyway since it doesn't exist
          setPosts(
            posts.filter((post) => post.id !== postId && post.postId !== postId)
          );
        } else {
          alert(`Failed to delete post: ${errorMsg}`);
        }
      } else {
        alert(
          "Failed to delete post. Please check your connection and try again."
        );
      }
      return false;
    }
  };

  // Add a new comment to a post with all API parameters
  /**
   * Handles adding a comment to a post, including support for attachments, tagged users, and replies.
   *
   * @async
   * @function handleAddComment
   * @param {string} postId - The ID of the post to which the comment is being added.
   * @param {string} commentText - The content of the comment.
   * @param {File|null} [attachment=null] - An optional file attachment for the comment.
   * @param {Array<string>} [taggedUsers=[]] - An optional array of user IDs to tag in the comment.
   * @param {string|null} [parentComment=null] - The ID of the parent comment if this is a reply.
   * @param {string|null} [attachmentUrl=null] - An optional URL for an attachment.
   * @returns {Promise<Object>} The response data from the API, including the posted comment.
   * @throws {Error} Throws an error if the comment could not be posted.
   *
   * @example
   * // Add a top-level comment
   * await handleAddComment('postId123', 'This is a comment');
   *
   * @example
   * // Add a comment with an attachment
   * const file = new File(['content'], 'example.txt', { type: 'text/plain' });
   * await handleAddComment('postId123', 'This is a comment with a file', file);
   *
   * @example
   * // Add a reply to a comment
   * await handleAddComment('postId123', 'This is a reply', null, [], 'parentCommentId456');
   */
  const handleAddComment = async (
    postId,
    commentText,
    attachment = null,
    taggedUsers = [],
    parentComment = null,
    attachmentUrl = null
  ) => {
    try {
      const endpoint = `${COMMENTS_ENDPOINT}`;
      console.log(`Posting comment to ${endpoint}:`, commentText);

      // Use FormData to support file uploads
      const formData = new FormData();

      // Required parameters
      formData.append("postId", postId);
      formData.append("commentContent", commentText);

      // Add attachment file if provided (using 'file' as the field name per API spec)
      if (attachment) {
        formData.append("file", attachment);
      }

      // Add attachment URL if provided
      if (attachmentUrl) {
        formData.append("commentAttachment", attachmentUrl);
      }

      // Add tagged users if any
      if (taggedUsers && taggedUsers.length > 0) {
        formData.append("taggedUsers", JSON.stringify(taggedUsers));
      }

      // Add parent comment ID for replies
      if (parentComment) {
        formData.append("parentComment", parentComment);
      }

      // Log what we're sending
      console.log("Sending comment:");
      console.log("- Post ID:", postId);
      console.log("- Content:", commentText);
      console.log("- File attachment:", attachment ? "Yes" : "No");
      console.log("- URL attachment:", attachmentUrl);
      console.log(
        "- Tagged users:",
        taggedUsers.length > 0 ? taggedUsers : "None"
      );
      console.log(
        "- Parent comment:",
        parentComment || "None (top-level comment)"
      );

      const response = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(`Comment posted successfully:`, response.data);

      // If we receive the comment in the response, add it to our comment list
      if (response.data && response.data.comment) {
        setComments((prev) => {
          const existingComments = prev[postId] || [];

          // If it's a reply and we're showing replies, handle accordingly
          if (parentComment) {
            // Find parent comment and increment its reply count
            return {
              ...prev,
              [postId]: existingComments.map((comment) =>
                comment._id === parentComment
                  ? {
                      ...comment,
                      replyCount: (comment.replyCount || 0) + 1,
                      // If we're tracking replies in-memory, could add to replies array too
                      replies: [
                        ...(comment.replies || []),
                        response.data.comment,
                      ],
                    }
                  : comment
              ),
            };
          }

          // For top-level comments, add to the beginning of the array
          return {
            ...prev,
            [postId]: [response.data.comment, ...existingComments],
          };
        });
      } else {
        // If API doesn't return the comment object, just refresh comments
        await fetchComments(postId);
      }

      // Update comment count in posts
      setPosts(
        posts.map((post) => {
          if (post.id === postId || post.postId === postId) {
            return {
              ...post,
              commentCount: (post.commentCount || 0) + 1,
              metrics: post.metrics
                ? {
                    ...post.metrics,
                    comments: (post.metrics.comments || 0) + 1,
                  }
                : undefined,
            };
          }
          return post;
        })
      );

      return response.data;
    } catch (err) {
      console.error(`Error posting comment:`, err);

      //error handling
      if (err.response) {
        console.error("Comment error response:", err.response.data);
        console.error("Status code:", err.response.status);
        alert(
          `Failed to post comment: ${
            err.response.data.message || "Server error"
          }`
        );
      } else if (err.request) {
        console.error("No response received:", err.request);
        alert("Failed to post comment: No response from server");
      } else {
        console.error("Error setting up request:", err.message);
        alert(`Failed to post comment: ${err.message}`);
      }
      throw err;
    }
  };

  /**
   * Handles the deletion of a comment, ensuring UI and count are always in sync with backend.
   *
   * @async
   * @function handleDeleteComment
   * @param {string} postId - The ID of the post containing the comment.
   * @param {string} commentId - The ID of the comment to delete.
   * @returns {Promise<boolean>} - Returns true if deletion was successful, false otherwise.
   */
  const handleDeleteComment = async (postId, commentId) => {
    try {
      // API call to delete the comment
      await axios.delete(`${COMMENTS_ENDPOINT}/${commentId}`);

      // Always re-fetch comments to ensure state matches backend (handles soft deletes)
      await fetchComments(postId);

      return true;
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Failed to delete comment. Please try again.");
      return false;
    }
  };

  // Handle reacting to a comment
  /**
   * Handles reacting to a comment by sending or removing a reaction.
   *
   * @async
   * @function handleReactToComment
   * @param {string} postId - The ID of the post containing the comment.
   * @param {string} commentId - The ID of the comment to react to.
   * @param {string} [reactionType='like'] - The type of reaction.
   * @param {boolean} [isRemove=false] - Whether the reaction is being removed (true) or added (false).
   * @returns {Promise<void>} - A promise that resolves when the state is updated.
   */
  const handleReactToComment = async (
    postId,
    commentId,
    reactionType = "like",
    isRemove = false
  ) => {
    try {
      // No API calls here - CommentSection.jsx already handles them

      // Update local state immediately for responsive UI
      setComments((prevComments) => {
        // Get the array of comments for this post (or empty array if none)
        const postComments = [...(prevComments[postId] || [])];

        // Find and update the specific comment
        const updatedPostComments = postComments.map((comment) => {
          if (comment._id === commentId) {
            // Get current counts or initialize if they don't exist
            const impressionCounts = comment.impressionCounts || { total: 0 };
            const currentTypeCount = impressionCounts[reactionType] || 0;
            const currentTotal = impressionCounts.total || 0;

            // Calculate new counts
            const newTypeCount = isRemove
              ? Math.max(0, currentTypeCount - 1)
              : currentTypeCount + 1;

            const newTotal = isRemove
              ? Math.max(0, currentTotal - 1)
              : currentTotal + 1;

            // Return updated comment with new reaction state
            return {
              ...comment,
              isLiked: {
                like: !isRemove,
                type: !isRemove ? reactionType : null,
              },
              impressionCounts: {
                ...impressionCounts,
                [reactionType]: newTypeCount,
                total: newTotal,
              },
            };
          }
          return comment; // Return unchanged comment if it's not the one we're updating
        });

        // Return updated comments state
        return {
          ...prevComments,
          [postId]: updatedPostComments,
        };
      });
    } catch (err) {
      console.error("Error updating comment reaction state:", err);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Then fetch other data
        await Promise.all([fetchUser(), fetchNotifications(), fetchPosts()]);
      } catch (error) {
        console.error("Error during initialization:", error);
        setError("Authentication failed. Please try again later.");
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Fetch replies for a comment
  const fetchReplies = async (commentId) => {
    try {
      const endpoint = `${BASE_URL}/comments/${commentId}/replies`;
      const response = await axios.get(endpoint);
      setReplies((prev) => ({
        ...prev,
        [commentId]: response.data.replies || [],
      }));
    } catch (err) {
      console.error("Error fetching replies:", err);
    }
  };

  // Handle creating a new post
  /**
   * Handles the creation of a new post by sending the provided post data to the server.
   *
   * @async
   * @function handleCreatePost
   * @param {Object} postData - The data for the post to be created.
   * @param {string} postData.text - The description or text content of the post (required).
   * @param {File[]} [postData.files] - An optional array of file attachments for the post.
   *
   * @throws Will display an alert and log errors if the post creation fails.
   *
   * @example
   * const postData = {
   *   text: "This is a new post",
   *   files: [file1, file2]
   * };
   * handleCreatePost(postData);
   */
  const handleCreatePost = async (postData) => {
    try {
      console.log("Creating post with data:", postData);

      // Create FormData for proper multipart/form-data encoding
      const formData = new FormData();

      // Add description (required)
      formData.append("description", postData.text);

      // Add attachments if any
      if (postData.files && postData.files.length > 0) {
        for (let i = 0; i < postData.files.length; i++) {
          formData.append("files", postData.files[i]);
        }
      }

      // Add privacy settings
      formData.append("whoCanSee", "anyone");
      formData.append("whoCanComment", "anyone");

      // Log form data for debugging
      console.log("Sending post with description:", postData.text);
      console.log(
        "Number of files:",
        postData.files ? postData.files.length : 0
      );

      const response = await axios.post(API_ENDPOINT, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Post creation successful:", response.data);

      // Check response structure
      const newPost = response.data.post || response.data;
      setPosts([newPost, ...posts]);
    } catch (err) {
      console.error("Error creating post:", err);

      if (err.response) {
        // The request was made but server responded with error
        console.error("Server response:", err.response.data);
        console.error("Status code:", err.response.status);
        alert(
          `Failed to create post: ${
            err.response.data.message || "Server error"
          }`
        );
      } else if (err.request) {
        // Request was made but no response received
        console.error("No response received:", err.request);
        alert("Failed to create post: No response from server");
      } else {
        // Error setting up request
        alert(`Failed to create post: ${err.message}`);
      }
    }
  };

  // Handle reacting to a post - Updated to handle both liking and unliking with reaction types
  /**
   * Handles adding or removing a reaction (like, love, etc.) to a post.
   *
   * @async
   * @function handleReact
   * @param {string|number} postId - The ID of the post to react to.
   * @param {string} [reactionType='like'] - The type of reaction to add (e.g., 'like', 'love').
   * @param {boolean} [isRemove=false] - Whether to remove the reaction instead of adding it.
   * @returns {Promise<void>} - A promise that resolves when the reaction is processed.
   *
   * @description
   * This function sends a reaction to the server using either a POST (to add) or DELETE (to remove) request.
   * It updates the local state of user reactions and posts based on the server response or local logic.
   *
   * @throws {Error} Throws an error if the API request fails.
   *
   * @example
   * // Add a like reaction to a post
   * handleReact(123, 'like');
   *
   * @example
   * // Remove a like reaction from a post
   * handleReact(123, 'like', true);
   */
  const handleReact = async (
    postId,
    reactionType = "like",
    isRemove = false
  ) => {
    try {
      const postIdToUse = postId.toString();
      const endpoint = `${API_ENDPOINT}/${postIdToUse}/Like`;
      console.log(
        `${
          isRemove ? "Removing" : "Sending"
        } ${reactionType} reaction to: ${endpoint}`
      );

      let response;

      if (isRemove) {
        // Remove the reaction using DELETE method
        response = await axios.delete(endpoint);
        console.log(`Reaction removed response:`, response.data);

        // Update user reactions state to remove the reaction
        setUserReactions((prev) => {
          const updated = { ...prev };
          delete updated[postIdToUse];
          return updated;
        });
      } else {
        // Add the reaction using POST method
        response = await axios.post(endpoint, {
          impressionType: reactionType.toLowerCase(),
        });
        console.log(`Reaction added response:`, response.data);

        // Update user reactions state to track the reaction type
        setUserReactions((prev) => ({
          ...prev,
          [postIdToUse]: reactionType,
        }));
      }

      // Update the post in the UI
      if (response.data) {
        // If the API returns the updated post
        if (response.data.post) {
          setPosts(
            posts.map((post) =>
              post.id === postId || post.postId === postId
                ? response.data.post
                : post
            )
          );
        } else {
          // If API just returns success but not the updated post, update locally
          setPosts(
            posts.map((post) => {
              if (post.id === postId || post.postId === postId) {
                // Simple if-check for metrics update
                let likeDelta = 0;
                if (!isRemove && !post.isLiked) {
                  likeDelta = 1; // Add a like if not already liked
                } else if (isRemove && post.isLiked) {
                  likeDelta = -1; // Remove a like if already liked
                }

                return {
                  ...post,
                  isLiked: !isRemove,
                  userReaction: isRemove ? null : { type: reactionType },
                  // Use the delta only if needed
                  metrics: post.metrics
                    ? {
                        ...post.metrics,
                        likes: post.metrics.likes + likeDelta,
                      }
                    : undefined,
                  impressionCounts: post.impressionCounts
                    ? {
                        ...post.impressionCounts,
                        total: post.impressionCounts.total + likeDelta,
                        [reactionType.toLowerCase()]:
                          (post.impressionCounts[reactionType.toLowerCase()] ||
                            0) + likeDelta,
                      }
                    : undefined,
                };
              }
              return post;
            })
          );
        }
      }
    } catch (err) {
      console.error(
        `Error ${isRemove ? "removing" : "adding"} ${reactionType} reaction:`,
        err
      );

      if (err.response) {
        console.error("Reaction error response:", err.response.data);
        console.error("Status code:", err.response.status);
      }
    }
  };

  // Handle PostMenu actions
  /**
   * Handles the hiding of a post by removing it from the current list of posts.
   *
   * @param {string|number} postId - The unique identifier of the post to be hidden.
   */
  const handleHidePost = (postId) => {
    setPosts(
      posts.filter((post) => post.id !== postId && post.postId !== postId)
    );
  };

  /**
   * Handles saving a post by sending a POST request to the API endpoint.
   *
   * @async
   * @function handleSavePost
   * @param {string} postId - The unique identifier of the post to be saved.
   * @returns {Promise<void>} - A promise that resolves when the post is successfully saved.
   * @throws Will display an alert and log an error if the save operation fails.
   */
  const handleSavePost = async (postId) => {
    try {
      console.log(`Saving post: ${postId}`);
      const response = await axios.post(`${API_ENDPOINT}/${postId}/save`);
      console.log("Save post response:", response); // Log the full response
      alert(`Post saved successfully!`);
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Failed to save post. Please try again.");
    }
  };

  /**
   * Reports a post by sending a request to the server with a specified reason.
   *
   * @async
   * @function handleReportPost
   * @param {string} postId - The unique identifier of the post to be reported.
   * @returns {Promise<void>} Resolves when the report request is successfully sent.
   * @throws Will log an error and display an alert if the report request fails.
   */
  const handleReportPost = async (postId) => {
    try {
      await axios.post(`${API_ENDPOINT}/${postId}/report`, {
        reason: "inappropriate",
      });
      console.log(`Post ${postId} reported`);
      alert(`Post reported. Thank you for helping keep LinkedIn safe.`);
    } catch (error) {
      console.error("Error reporting post:", error);
      alert("Failed to report post. Please try again.");
    }
  };

  //saved posts handlers
  const handleShowSavedPosts = () => {
    setShowSavedPosts(true);
    fetchSavedPosts();
  };

  const handleShowAllPosts = () => {
    setShowSavedPosts(false);
  };

  // Format date for display
  /**
   * Formats a given date string into a human-readable relative time format.
   *
   * - If the date is less than 60 seconds ago, it returns "Just now".
   * - If the date is less than an hour ago, it returns the number of minutes followed by "m ago".
   * - If the date is less than a day ago, it returns the number of hours followed by "h ago".
   * - Otherwise, it returns the date in the local date format.
   *
   * @param {string} dateString - The date string to format.
   * @returns {string} A formatted string representing the relative time or the local date.
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading)
    return (
      <div className="bg-[#f3f2ef] min-h-screen">
        <div className="grid-area-main">Loading posts...</div>
      </div>
    );

  if (error)
    return (
      <div className="bg-[#f3f2ef] min-h-screen">
        <div className="grid-area-main">{error}</div>
      </div>
    );

  return (
    <div className="bg-[#f3f2ef] min-h-screen pb-8">
      <div className="grid-area-main">
        {/* Create Post Form */}
        <div className="overflow-hidden text-center mb-2 bg-white rounded-md border-none shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_0_0_rgba(0,0,0,0.20)]">
          <div className="flex flex-col text-[#958b7b] mb-2 bg-white">
            <div className="flex items-center p-2 pl-4 pr-4">
              <img
                src={
                  authorInfo?.profilePicture || "/Images/default-profile.svg"
                }
                alt="user"
                className="w-12 h-12 rounded-full mr-2"
              />
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="text-[rgba(0,0,0,0.6)] outline-none min-h-[48px] leading-1.5 text-sm font-semibold flex items-center p-2 pl-4 flex-grow border border-[rgba(0,0,0,0.15)] rounded-[35px] cursor-pointer hover:bg-[rgba(0,0,0,0.08)] text-left"
              >
                Start a post
              </button>
            </div>

            <div className="flex justify-around flex-wrap p-1 pb-1">
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="text-[rgba(0,0,0,0.6)] outline-none border-none bg-transparent min-h-[48px] leading-1.5 text-sm font-semibold flex items-center transition duration-200 p-2 hover:bg-[rgba(0,0,0,0.08)] rounded-md"
              >
                <img
                  src="/Images/photo-icon.svg"
                  alt="pic"
                  className="mr-2.5 ml-[-0.5rem]"
                />
                <span>Photo</span>
              </button>
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="text-[rgba(0,0,0,0.6)] outline-none border-none bg-transparent min-h-[48px] leading-1.5 text-sm font-semibold flex items-center transition duration-200 p-2 hover:bg-[rgba(0,0,0,0.08)] rounded-md"
              >
                <img
                  src="/Images/vedio-icon.svg"
                  alt="vedio"
                  className="mr-2.5 ml-[-0.5rem]"
                />
                <span>Video</span>
              </button>
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="text-[rgba(0,0,0,0.6)] outline-none border-none bg-transparent min-h-[48px] leading-1.5 text-sm font-semibold flex items-center transition duration-200 p-2 hover:bg-[rgba(0,0,0,0.08)] rounded-md"
              >
                <img
                  src="/Images/job-icon.svg"
                  alt="job"
                  className="mr-2.5 ml-[-0.5rem]"
                />
                <span>Job</span>
              </button>
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="text-[rgba(0,0,0,0.6)] outline-none border-none bg-transparent min-h-[48px] leading-1.5 text-sm font-semibold flex items-center transition duration-200 p-2 hover:bg-[rgba(0,0,0,0.08)] rounded-md"
              >
                <img
                  src="/Images/article-icon.svg"
                  alt="article"
                  className="mr-2.5 ml-[-0.5rem]"
                />
                <span>Write article</span>
              </button>
            </div>
          </div>
        </div>

        {resourceId && (
          <SinglePostView 
            postId={resourceId}
          />
        )}

        {/* Post List */}
        {posts.map((post) => (
          <article
            key={post.id || post.postId}
            className="overflow-visible p-0 mb-2 bg-white rounded-md border-none shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_0_0_rgba(0,0,0,0.20)]"
          >
            <div className="p-3 pr-10 pb-0 flex justify-between items-start relative">
              <a href="/feed" className="overflow-hidden flex">
                <img
                  src={post.author?.profileImage || post.profilePicture}
                  alt="user"
                  className="w-12 h-12 rounded-full mr-2.5"
                />
                <div className="text-start">
                  <h6 className="text-base text-black font-semibold">
                    {post.author?.name || `${post.firstName} ${post.lastName}`}
                  </h6>
                  <span className="text-sm text-[rgba(0,0,0,0.6)] block">
                    {post.author?.headline || post.headline}
                  </span>
                  <span className="text-sm text-[rgba(0,0,0,0.6)] block">
                    {formatDate(post.timestamp || post.createdAt)}
                  </span>
                </div>
              </a>

              <PostMenu
                postId={post.id || post.postId}
                onHide={handleHidePost}
                onSave={handleSavePost}
                onReport={handleReportPost}
                onDelete={handleDeletePost} // New prop
                isPostOwner={true} // Set this based on user authentication
                isSaved={post.isSaved}
              />
            </div>
            <div className="text-base text-start p-0 pl-4 pr-4 text-[rgba(0,0,0,0.9)] overflow-hidden">
              {post.content?.text || post.postDescription}
            </div>

            {/* Handle different media formats */}
            {post.content?.files && post.content.files.length > 0 && (
              <div className="w-full relative bg-[#f9fafb] mt-2">
                <div className="aspect-[16/9] relative overflow-hidden">
                  {post.content.files[0].url.match(/\.(mp4|webm|ogg)$/i) ? (
                    <video
                      src={post.content.files[0].url}
                      className="absolute inset-0 w-full h-full object-contain"
                      controls
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={post.content.files[0].url}
                      alt={post.content.files[0].alt || "Post image"}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>
              </div>
            )}

            {post.attachments && post.attachments.length > 0 && (
              <div className="w-full relative bg-[#f9fafb] mt-2">
                <div className="aspect-[16/9] relative overflow-hidden">
                  {typeof post.attachments[0] === "string" &&
                  post.attachments[0].match(/\.(mp4|webm|ogg)$/i) ? (
                    <video
                      src={post.attachments[0]}
                      className="absolute inset-0 w-full h-full object-contain"
                      controls
                      preload="metadata"
                    />
                  ) : (
                    <img
                      src={post.attachments[0]}
                      alt="Post attachment"
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Updated metrics section with reaction emojis */}
            <ul className="flex justify-between mx-4 p-2 border-b border-[#e9e5df] text-sm overflow-auto">
              <li className="flex items-center cursor-pointer hover:text-[#0a66c2] hover:underline">
                <div className="flex items-center">
                  {/* Handle different reaction formats */}
                  {post.reactions && post.reactions.length > 0 && (
                    <div className="flex -space-x-1 mr-1">
                      {post.reactions.slice(0, 3).map((reaction, index) => (
                        <span
                          key={index}
                          className="inline-block w-4 h-4 text-xs"
                        >
                          {reaction.type === "like" && "👍"}
                          {reaction.type === "celebrate" && "👏"}
                          {reaction.type === "support" && "❤️"}
                          {reaction.type === "insightful" && "💡"}
                          {reaction.type === "funny" && "😄"}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Handle impression counts format */}
                  {post.impressionCounts && (
                    <div className="flex -space-x-1 mr-1">
                      {post.impressionCounts.like > 0 && (
                        <span className="inline-block w-4 h-4 text-xs">👍</span>
                      )}
                      {post.impressionCounts.celebrate > 0 && (
                        <span className="inline-block w-4 h-4 text-xs">👏</span>
                      )}
                      {post.impressionCounts.support > 0 && (
                        <span className="inline-block w-4 h-4 text-xs">❤️</span>
                      )}
                      {post.impressionCounts.insightful > 0 && (
                        <span className="inline-block w-4 h-4 text-xs">💡</span>
                      )}
                      {post.impressionCounts.funny > 0 && (
                        <span className="inline-block w-4 h-4 text-xs">😄</span>
                      )}
                    </div>
                  )}

                  {/* Display count based on available data */}
                  <span>
                    {post.metrics?.likes || post.impressionCounts?.total || 0}
                  </span>
                </div>
              </li>
              <li
                className="flex items-center cursor-pointer hover:text-[#0a66c2] hover:underline"
                onClick={() => toggleComments(post.id || post.postId)}
              >
                <p>
                  {comments[post.id || post.postId]
                    ? comments[post.id || post.postId].length
                    : post.metrics?.comments || post.commentCount || 0}{" "}
                  comments
                </p>
              </li>

              {/* Show reposts if available */}
              {post.repostCount > 0 && (
                <li className="flex items-center cursor-pointer hover:text-[#0a66c2] hover:underline">
                  <p>{post.repostCount} reposts</p>
                </li>
              )}
            </ul>

            {/* Updated post action buttons with PostReactions component */}
            <div className="p-0 px-4 flex justify-between min-h-[40px] overflow-hidden">
              <PostReactions
                postId={post.id || post.postId}
                onReact={handleReact}
                reactionTypes={reactionTypes}
                isLiked={post.isLiked ? true : false}
                currentReaction={
                  userReactions[post.id || post.postId] ||
                  (post.userReaction ? post.userReaction.type : "like")
                }
              />

              <button
                onClick={() => toggleComments(post.id || post.postId)}
                className="outline-none text-[rgba(0,0,0,0.6)] p-3 px-6 bg-transparent flex items-center cursor-pointer gap-1.25 rounded-md transition duration-200 hover:bg-[rgba(0,0,0,0.08)] font-semibold"
              >
                <img src="/Images/comment.svg" alt="comment" />
                <span>Comment</span>
              </button>
              <button className="outline-none text-[rgba(0,0,0,0.6)] p-3 px-6 bg-transparent flex items-center cursor-pointer gap-1.25 rounded-md transition duration-200 hover:bg-[rgba(0,0,0,0.08)] font-semibold">
                <img src="/Images/share.svg" alt="share" />
                <span>Share</span>
              </button>
              <button className="outline-none text-[rgba(0,0,0,0.6)] p-3 px-6 bg-transparent flex items-center cursor-pointer gap-1.25 rounded-md transition duration-200 hover:bg-[rgba(0,0,0,0.08)] font-semibold">
                <img src="/Images/send.svg" alt="send" />
                <span>Send</span>
              </button>
            </div>

            {/* Comment Section - Only show when expanded */}
            {expandedComments[post.id || post.postId] && (
              <div className="border-t border-[#e9e5df] p-4">
                {loadingComments[post.id || post.postId] ? (
                  <div className="text-center py-4">Loading comments...</div>
                ) : (
                  <CommentSection
                    postId={post.id || post.postId}
                    comments={comments[post.id || post.postId] || []}
                    authorInfo={authorInfo}
                    onAddComment={handleAddComment}
                    onDeleteComment={handleDeleteComment} // Add this prop
                    onReactToComment={(commentId, reactionType, isRemove) =>
                      handleReactToComment(
                        post.id || post.postId,
                        commentId,
                        reactionType,
                        isRemove
                      )
                    }
                    reactionTypes={reactionTypes}
                    formatDate={formatDate}
                  />
                )}
              </div>
            )}
          </article>
        ))}
      </div>

      {/* Post Creation Modal */}
      <CreatePostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onSubmit={handleCreatePost}
        authorInfo={authorInfo}
      />
    </div>
  );
};

export default Main;
