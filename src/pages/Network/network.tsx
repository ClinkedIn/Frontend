import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HiringAd from '../../components/HiringAd'; // Import the HiringAd component
import Header from '../../components/UpperNavBar'; // Import the Header component
import { BASE_URL } from "../../constants";
import { handleAccept, handleIgnore } from '../../components/Network/handleInvitations'; // Import handleAccept and handleIgnore
import { getConnectionsCount } from './connections'; // Import getConnectionsCount from Connections
import { getBlockedUsersCount } from './BlockedUsers'; // Import the count function
import { FiUserMinus } from "react-icons/fi";
import { BsFillPeopleFill } from "react-icons/bs";
import ConnectButton from '../../components/Network/ConnectButton'; // <-- Import ConnectButton

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

const Network: React.FC = () => {
  const navigate = useNavigate();
  const [relatedUsers, setRelatedUsers] = useState<RelatedUser[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [showAllUsers, setShowAllUsers] = useState(false); // Track if all users should be shown
  const [connectionsCount, setConnectionsCount] = useState<number>(0); // State for connections count
  const [connectedUserIds, setConnectedUserIds] = useState<string[]>([]); // Store connected user IDs
  const [blockedUsersCount, setBlockedUsersCount] = useState<number>(0); // State for blocked users count

  // Fetch connected users
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/connections`);
        // Assuming response.data.connections is an array of user objects with _id
        setConnectedUserIds(response.data.connections.map((c: { _id: string }) => c._id));
      } catch (error) {
        setConnectedUserIds([]);
      }
    };
    fetchConnections();
  }, []);

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

  // Fetch connections count from Connections file
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const count = await getConnectionsCount();
        setConnectionsCount(count);
      } catch (error) {
        setConnectionsCount(0);
      }
    };
    fetchCount();
  }, []);

  // Fetch blocked users count from BlockedUsers file
  useEffect(() => {
    const fetchBlockedUsersCount = async () => {
      try {
        const count = await getBlockedUsersCount();
        setBlockedUsersCount(count);
      } catch (error) {
        setBlockedUsersCount(0);
      }
    };
    fetchBlockedUsersCount();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row bg-[#F5F3EE] p-2 sm:p-4 md:p-6 mt-14 min-h-screen">
      {/* Header */}
      <Header notifications={[]} />

      {/* Left Sidebar */}
      <div className="w-full lg:w-72 flex flex-col items-start lg:mr-8 mb-6 lg:mb-0">
        {/* Left Card */}
        <div className="w-full lg:w-72 h-60 bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Manage my network</h2>
          <div className="border-b border-gray-200 mb-4"></div>
          <ul className="space-y-2">
            {/* Connections Button */}
            <li className="flex items-center justify-between">
              <button
                className="flex items-center space-x-2 w-full text-left text-gray-600 hover:text-blue-600"
                onClick={() => navigate("connections")}
              >
                <BsFillPeopleFill className='w-5 h-5 mb-1' />
                <span>Connections</span>
              </button>
              <span className="text-gray-500">{connectionsCount}</span>
            </li>

            {/* Blocked Users Button */}
            <li className="flex items-center justify-between">
              <button
                className="flex items-center space-x-2 w-full text-left text-gray-600 hover:text-blue-600"
                onClick={() => navigate("blocked-users")}
              >
                <FiUserMinus className="w-5 h-5" />
                <span>Blocked users</span>
              </button>
              <span className="text-gray-500">{blockedUsersCount}</span>
            </li>
          </ul>
        </div>
        {/* Hiring Ad */}
        <HiringAd className="w-full lg:w-72" />
      </div>

      {/* Main Content */}
      <div className="flex-grow p-2 sm:p-4">
        {/* Manage Invitations in a white card */}
        <div className={`bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6${pendingInvitations.length === 0 ? " h-12" : ""}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
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
                <p className="text-gray-600 mb-2 -mt-3">No pending invitations</p>
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
                className="text-gray-800 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition duration-300 -mt-6"
                onClick={() => navigate("invitation-manager")}
              >
                Manage
              </button>
            )}
          </div>
        </div>

        {/* People you may know in a card */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <h2 className="text-lg font-semibold mb-2">People you may know</h2>
            <button
              className="text-gray-800 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition duration-300 mt-2 sm:mt-4"
              onClick={() => setShowAllUsers(!showAllUsers)}
            >
              Show all
            </button>
          </div>
          {isLoading ? (
            <p className="text-gray-600">Loading...</p>
          ) : relatedUsers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {(showAllUsers ? relatedUsers : relatedUsers.slice(0, 8))
                .filter(user => !connectedUserIds.includes(user._id)) // <-- Filter out connected users
                .map((user) => (
                  <div
                    key={user._id}
                    className="bg-white rounded-lg shadow-sm p-4"
                  >
                    <div className="flex flex-col items-center justify-center h-48">
                      <img
                        src={user.profilePicture || "/Images/user.svg"}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-16 h-16 rounded-full mb-2 cursor-pointer"
                        onClick={() => navigate(`/user/${user._id}`)}
                      />
                      <p
                        className="text-sm font-medium cursor-pointer hover:underline"
                        onClick={() => navigate(`/user/${user._id}`)}
                      >
                        {`${user.firstName} ${user.lastName}`}
                      </p>
                      <p
                        className="text-xs text-gray-500 line-clamp-2 mb-2"
                        style={{ maxHeight: '2rem' }}
                      >
                        {user.lastJobTitle}
                      </p>
                      <p className="text-xs text-gray-500 mb-2">
                        You have{' '}
                        <span className="text-xs font-normal">
                          {user.commonConnectionsCount} mutual connections
                        </span>
                      </p>
                      <ConnectButton userId={user._id} />
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