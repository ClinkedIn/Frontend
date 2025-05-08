/**
 * Modal component that displays users who have reacted to a post.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Controls visibility of the modal
 * @param {Function} props.onClose - Callback function to close the modal
 * @param {string} props.postId - ID of the post to fetch reactions for
 * @param {string|null} props.reactionType - Optional filter for specific reaction types
 * 
 * @returns {JSX.Element|null} Rendered modal showing users who reacted or null if closed
 * 
 * @example
 * <ReactedUsersModal
 *   isOpen={showReactionsModal}
 *   onClose={() => setShowReactionsModal(false)}
 *   postId="12345"
 *   reactionType="like"
 * />
 * 
 * @description
 * This modal component:
 * - Fetches users who reacted to a specific post from the API
 * - Can filter reactions by type (like, celebrate, support, etc.)
 * - Displays user profile pictures, names, and headlines
 * - Shows loading states while fetching data
 * - Handles error states if the API request fails
 */


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from "../constants";

const ReactedUsersModal = ({ isOpen, onClose, postId, reactionType }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && postId) {
      fetchReactedUsers();
    }
  }, [isOpen, postId, reactionType]);

  const fetchReactedUsers = async () => {
    try {
      setLoading(true);
      const endpoint = `${BASE_URL}/posts/${postId}/like`;
      console.log(`Fetching users who reacted to post ${postId} from ${endpoint}`);
      const response = await axios.get(endpoint, { withCredentials: true });
      console.log(response);
      setUsers(response.data.impressions || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users who reacted:', err);
      setError('Failed to load users. Please try again.');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="border-b border-gray-200 p-4 flex justify-between items-center">
          <h3 className="font-semibold text-lg">
            {reactionType ? `${reactionType.charAt(0).toUpperCase() + reactionType.slice(1)}s` : 'Reactions'}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="text-center py-4">Loading users...</div>
          ) : error ? (
            <div className="text-center text-red-600 py-4">{error}</div>
          ) : users.length === 0 ? (
            <div className="text-center py-4">No users reacted yet</div>
          ) : (
            <ul>
              {users.map((user) => (
                <li key={user._id || user.userId} className="flex items-center py-2 border-b border-gray-100 last:border-b-0">
                  <img 
                    src={user.profilePicture || "/Images/default-profile.svg"} 
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-medium">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-gray-600">{user.headline || ""}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReactedUsersModal;