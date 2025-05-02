import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HiringAd from '../HiringAd'; // Import the HiringAd component
import Header from '../UpperNavBar'; // Import the Header component
import { BASE_URL } from "../../constants";
import { handleAccept, handleIgnore } from './HandleInvitations'; // Import handleAccept and handleIgnore

// Define the related user interface
interface RelatedUser {
  _id: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  lastJobTitle: string;
  commonConnectionsCount: number;
  matchScore: number;
}

// Define the pending invitation interface
interface PendingInvitation {
  _id: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  headline: string;
  read: boolean; // Track if the invitation has been viewed
}

// Define the API response interface for pending invitations
interface PendingInvitationsResponse {
  requests: PendingInvitation[];
}

const Network: React.FC = () => {
  const navigate = useNavigate();
  const [relatedUsers, setRelatedUsers] = useState<RelatedUser[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [showAllUsers, setShowAllUsers] = useState(false); // Track if all users should be shown

  // Fetch related users
  useEffect(() => {
    const fetchRelatedUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/connections/related-users`);
        console.log('Related users API response:', response.data);
        if (response.data.message === 'Related users retrieved successfully') {
          setRelatedUsers(response.data.relatedUsers);
        }
      } catch (error) {
        console.error('Error fetching related users:', error);
      } finally {
        setIsLoading(false); // Stop loading
      }
    };
    fetchRelatedUsers();
  }, []);

  // Fetch pending invitations
  const fetchPendingInvitations = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/connections/requests`);
      console.log('Pending invitations API response:', response.data);
      // Initialize `read` as false for all invitations
      setPendingInvitations(
        response.data.pendingRequests.map((invitation: PendingInvitation) => ({
          ...invitation,
          read: false,
        }))
      );
    } catch (error) {
      console.error('Error fetching pending invitations:', error);
    }
  };

  useEffect(() => {
    fetchPendingInvitations();
  }, []);

  return (
    <div className="flex bg-[#F5F3EE] p-6 mt-14">
      {/* Header */}
      <Header notifications={[]} />

      {/* Left Sidebar */}
      <div className="flex flex-col items-start mr-8">
        {/* Left Card */}
        <div className="w-72 h-60 ml-22 bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Manage my network</h2>
          <div className="border-b border-gray-200 mb-4"></div>
          <ul className="space-y-2">
            {/* Connections Button */}
            <li className="flex items-center justify-between">
              <button
                className="flex items-center space-x-2 w-full text-left text-gray-600 hover:text-blue-600"
                onClick={() => navigate("/connections")}
              >
                <img src="/Images/nav-network.svg" alt="Connections" className="w-5 h-5" />
                <span>Connections</span>
              </button>
              <span className="text-gray-500">77</span>
            </li>

            {/* Following & Followers Button */}
            <li className="flex items-center justify-between">
              <button
                className="flex items-center space-x-2 w-full text-left text-gray-600 hover:text-blue-600"
                onClick={() => navigate("/following-followers")}
              >
                <img src="/Images/nav-network.svg" alt="Following" className="w-5 h-5" />
                <span>Following & followers</span>
              </button>
              <span className="text-gray-500">32</span>
            </li>
          </ul>
        </div>

        {/* Hiring Ad */}
        <HiringAd className="w-72 ml-22" />
      </div>

      {/* Main Content */}
      <div className="flex-grow p-4">
        {/* Manage Invitations in a white card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              {pendingInvitations.length > 0 ? (
                <div>
                  <p className="text-gray-600 mb-2">
                    Invitations ({pendingInvitations.length})
                  </p>
                  <ul className="space-y-4">
                    {pendingInvitations.slice(0, 3).map((invitation) => (
                      <li
                        key={invitation._id}
                        className={`flex items-center space-x-2 ${
                          invitation.read ? '' : 'bg-[#E8F5FF]'
                        }`}
                      >
                        <img
                          src={invitation.profilePicture || "/Images/user.svg"}
                          alt={`${invitation.firstName} ${invitation.lastName}`}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="font-medium">{`${invitation.firstName} ${invitation.lastName}`}</p>
                          <p className="text-xs text-gray-500">{invitation.headline}</p>
                        </div>
                        <div className="ml-auto">
                          <button
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-300"
                            onClick={() => handleIgnore(invitation._id)}
                          >
                            Ignore
                          </button>
                          <button
                            className="bg-blue-500 text-white px-2 py-1 ml-2 rounded hover:bg-blue-600 transition duration-300"
                            onClick={() => handleAccept(invitation._id)}
                          >
                            Accept
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-600 mb-2">No pending invitations</p>
              )}
            </div>

            {/* Conditionally Render the "Show all" Button */}
            {pendingInvitations.length > 3 && (
              <button
                className="text-gray-800 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition duration-300 mt-4"
                onClick={() => navigate("invitation-manager")}
              >
                Show all
              </button>
            )}

            {/* Conditionally Render the "Manage" Button */}
            {pendingInvitations.length === 0 && (
              <button
                className="text-gray-800 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition duration-300 mt-4"
                onClick={() => navigate("invitation-manager")}
              >
                Manage
              </button>
            )}
          </div>
        </div>

        {/* People you may know in a card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold mb-2">People you may know from Cairo University</h2>
            <button
              className="text-gray-800 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition duration-300 mt-4"
              onClick={() => setShowAllUsers(!showAllUsers)}
            >
              Show all
            </button>
          </div>
          {isLoading ? (
            <p className="text-gray-600">Loading...</p>
          ) : relatedUsers.length > 0 ? (
            <div className="grid grid-cols-4 gap-4 overflow-x-auto">
              {showAllUsers
                ? relatedUsers.map((user) => (
                    <div
                      key={user._id}
                      className="bg-white rounded-lg shadow-sm p-4 cursor-pointer"
                      onClick={() => navigate(`/profile/${user._id}`)}
                    >
                      <div className="flex flex-col items-center justify-center h-48">
                        <img
                          src={user.profilePicture || "/Images/user.svg"}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="w-16 h-16 rounded-full mb-2"
                        />
                        <p className="text-sm font-medium">{`${user.firstName} ${user.lastName}`}</p>
                        <p
                          className="text-xs text-gray-500 line-clamp-2"
                          style={{ maxHeight: '2rem' }}
                        >
                          {user.lastJobTitle}
                        </p>
                        <p className="text-xs text-gray-500">
                          You have {' '}
                          <span className="text-xs font-normal">
                            {user.commonConnectionsCount} mutual connections
                          </span>
                        </p>
                        <button
                          className="bg-blue-500 text-white px-2 py-1 mt-4 rounded hover:bg-blue-600 transition duration-300"
                        >
                          Connect
                        </button>
                      </div>
                    </div>
                  ))
                : relatedUsers.slice(0, 8).map((user) => (
                    <div
                      key={user._id}
                      className="bg-white rounded-lg shadow-sm p-4 cursor-pointer"
                      onClick={() => navigate(`/profile/${user._id}`)}
                    >
                      <div className="flex flex-col items-center justify-center h-48">
                        <img
                          src={user.profilePicture || "/Images/user.svg"}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="w-16 h-16 rounded-full mb-2"
                        />
                        <p className="text-sm font-medium">{`${user.firstName} ${user.lastName}`}</p>
                        <p
                          className="text-xs text-gray-500 line-clamp-2"
                          style={{ maxHeight: '2rem' }}
                        >
                          {user.lastJobTitle}
                        </p>
                        <p className="text-xs text-gray-500">
                          You have {' '}
                          <span className="text-xs font-normal">
                            {user.commonConnectionsCount} mutual connections
                          </span>
                        </p>
                        <button
                          className="bg-blue-500 text-white px-2 py-1 mt-4 rounded hover:bg-blue-600 transition duration-300"
                        >
                          Connect
                        </button>
                      </div>
                    </div>
                  ))}
            </div>
          ) : (
            <p className="text-gray-600">No people to show based on your recent activity.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Network;