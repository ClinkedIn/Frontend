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
import { motion, AnimatePresence } from "framer-motion";
import { Dialog } from "@headlessui/react";

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

  // Animated remove for invitations
  const handleAcceptAnimated = async (invitationId: string) => {
    await handleAccept(invitationId);
    setPendingInvitations((prev) => prev.filter((inv) => inv._id !== invitationId));
  };
  const handleIgnoreAnimated = async (invitationId: string) => {
    await handleIgnore(invitationId);
    setPendingInvitations((prev) => prev.filter((inv) => inv._id !== invitationId));
  };

  return (
    <div className="flex flex-col lg:flex-row bg-[#F5F3EE] p-2 sm:p-4 md:p-6 mt-14 min-h-screen">
      {/* Header */}
      <Header notifications={[]} pendingInvitationsCount={pendingInvitations.length} />

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
        {/* Invitations Card */}
        <div className={`bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6${pendingInvitations.length === 0 ? " h-12" : ""}`}>
          <div className="relative mb-4">
            {/* Title and Show All/Manage Button */}
            <div className="flex items-center">
              {pendingInvitations.length > 0 ? (
                <>
                  <p className="text-gray-600 mb-2">
                    Invitations ({pendingInvitations.length})
                  </p>
                  <button
                    className="absolute right-0 top-0 text-gray-800 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition duration-300"
                    onClick={() => navigate("invitation-manager")}
                  >
                    Show all
                  </button>
                </>
              ) : (
                <>
                  <p className="text-gray-600 mb-2 -mt-4 flex-1">No pending invitations</p>
                  <button
                    className="ml-auto text-gray-800 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition duration-300 -mt-5"
                    onClick={() => navigate("invitation-manager")}
                  >
                    Manage
                  </button>
                </>
              )}
            </div>
          </div>
          <AnimatePresence>
            {pendingInvitations.length > 0 && (
              <ul className="space-y-2">
                {pendingInvitations.slice(0, 3).map((invitation) => (
                  <motion.li
                    key={invitation._id}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40, transition: { duration: 0.25 } }}
                    layout
                    className={`flex items-center px-2 py-2 rounded-lg relative ${
                      invitation.read ? '' : 'bg-[#E8F5FF]'
                    }`}
                  >
                    <img
                      src={invitation.profilePicture || "/Images/user.svg"}
                      alt={`${invitation.firstName} ${invitation.lastName}`}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex flex-col flex-1 min-w-0 ml-3">
                      <p className="font-medium truncate">{`${invitation.firstName} ${invitation.lastName}`}</p>
                      <p className="text-xs text-gray-500 truncate">{invitation.headline}</p>
                    </div>
                    {/* Accept/Ignore buttons absolutely positioned on the right, stacked horizontally */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-row space-x-2">
                      <motion.button
                        whileTap={{ scale: 0.92, rotate: -4 }}
                        whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
                        className="w-20 text-gray-700 py-1 rounded-full text-sm font-semibold border border-gray-400 hover:bg-gray-100 transition"
                        onClick={() => handleIgnoreAnimated(invitation._id)}
                      >
                        Ignore
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.92, rotate: 4 }}
                        whileHover={{ scale: 1.05, backgroundColor: "#e0f2fe" }}
                        className="w-20 border border-blue-700 text-blue-700 py-1 rounded-full text-sm font-semibold hover:bg-blue-50 transition"
                        onClick={() => handleAcceptAnimated(invitation._id)}
                      >
                        Accept
                      </motion.button>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </AnimatePresence>
        </div>

        {/* People you may know in a card */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
        <h2 className="text-lg font-semibold mb-2">People you may know</h2>
        <button
          className="text-gray-800 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition duration-300 mt-2 sm:mt-4"
          onClick={() => setShowAllUsers(true)} // Show modal on click
        >
          Show all
        </button>
      </div>

      {isLoading ? (
        <p className="text-gray-600">Loading...</p>
      ) : relatedUsers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Filter out connected users, and limit to the first 8 users */}
          {relatedUsers
            .filter(user => !connectedUserIds.includes(user._id))
            .slice(0, 8)
            .map((user) => (
              <div key={user._id} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex flex-col items-center justify-center h-48">
                  <img
                    src={user.profilePicture || '/Images/user.svg'}
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
                  <p className="text-xs text-gray-500 line-clamp-2 mb-2" style={{ maxHeight: '2rem' }}>
                    {user.lastJobTitle}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    You have{' '}
                    <span className="text-xs font-normal">{user.commonConnectionsCount} mutual connections</span>
                  </p>
                  <ConnectButton userId={user._id} />
                </div>
              </div>
            ))}
        </div>
      ) : (
        <p className="text-gray-600">No people to show based on your recent activity.</p>
      )}

      {/* Modal for showing all users using Dialog */}
      <Dialog open={showAllUsers} onClose={() => setShowAllUsers(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" /> {/* Overlay with light black background */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white max-w-5xl w-full max-h-[80vh] overflow-y-auto rounded-xl p-6 shadow-lg">
          <Dialog.Title className="text-lg font-bold mb-4">People You May Know</Dialog.Title>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedUsers
              .filter(user => !connectedUserIds.includes(user._id))
              .map((user) => (
                <div key={user._id} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex flex-col items-center justify-center h-48">
                    <img
                      src={user.profilePicture || '/Images/user.svg'}
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
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2" style={{ maxHeight: '2rem' }}>
                      {user.lastJobTitle}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      You have{' '}
                      <span className="text-xs font-normal">{user.commonConnectionsCount} mutual connections</span>
                    </p>
                    <ConnectButton userId={user._id} />
                  </div>
                </div>
              ))}
          </div>

          <button
            className="mt-6 w-full text-center text-sm text-gray-600 hover:text-gray-800"
            onClick={() => setShowAllUsers(false)}
          >
            Close
          </button>
        </Dialog.Panel>
        </div>
      </Dialog>
    </div>
    </div>
    </div>
  );
};

export default Network;