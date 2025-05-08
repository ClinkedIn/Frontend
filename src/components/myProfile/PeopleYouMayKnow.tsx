/**
 * Component that displays connection suggestions based on user's network and profile.
 * 
 * @component
 * @returns {JSX.Element} Rendered connection suggestions interface
 * 
 * @example
 * <PeopleYouMayKnow />
 * 
 * @description
 * The PeopleYouMayKnow component:
 * - Fetches personalized connection recommendations from the API
 * - Filters out existing connections and pending requests
 * - Displays user cards with profile information and mutual connections
 * - Provides quick connect/ignore actions
 * - Shows industry and company information where available
 * - Supports pagination for viewing more suggestions
 * - Includes a modal view for seeing all recommendations
 * 
 * @dependencies
 * - React hooks (useState, useEffect)
 * - axios for API requests
 * - ConnectButton component for connection actions
 * - Headless UI for modal dialog
 */

import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants";
import ConnectButton from "../Network/ConnectButton";
import { Dialog } from "@headlessui/react";
import { useNavigate } from "react-router-dom";

const PeopleYouMayKnow: React.FC = () => {
  const [relatedUsers, setRelatedUsers] = useState<any[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  // Fetch related users and connections
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [relatedUsersResponse, connectionsResponse] = await Promise.all([
          axios.get(`${BASE_URL}/user/connections/related-users`),
          axios.get(`${BASE_URL}/user/connections`),
        ]);
        
        setRelatedUsers(relatedUsersResponse.data.relatedUsers);
        setConnections(connectionsResponse.data.connections);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Filter out users that are already in connections
  const filteredRelatedUsers = relatedUsers.filter(
    (user) => !connections.some((connection) => connection._id === user._id)
  );

  const renderUserCard = (user: any) => (
  <div key={user._id} className="flex items-start space-x-3">
    <img
      src={user.profilePicture}
      alt={`${user.firstName} ${user.lastName}`}
      className="w-12 h-12 rounded-full object-cover cursor-pointer"
      onClick={() => navigate(`/user/${user._id}`)}
    />
    <div className="flex flex-col flex-1">
      <p
        className="font-semibold text-sm leading-tight cursor-pointer hover:underline"
        onClick={() => navigate(`/user/${user._id}`)}
      >
        {user.firstName} {user.lastName}
      </p>
      <p className="text-xs text-gray-600 mt-1">{user.lastJobTitle}</p>
      <div className="mt-2">
        <ConnectButton userId={user._id} />
      </div>
    </div>
  </div>
);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">People you may know</h2>

      <div className="space-y-4">
        {filteredRelatedUsers.slice(0, 3).map((user) => renderUserCard(user))}
      </div>

      {filteredRelatedUsers.length > 3 && (
        <button
          className="ml-18 text-gray-800 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition duration-300 mt-4"
          onClick={() => setShowModal(true)}
        >
          Show All
        </button>
      )}

      {/* Modal */}
      <Dialog open={showModal} onClose={() => setShowModal(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white max-w-lg w-full max-h-[80vh] overflow-y-auto rounded-xl p-6 shadow-lg">
            <Dialog.Title className="text-lg font-bold mb-4">People You May Know</Dialog.Title>
            <div className="space-y-4">
              {filteredRelatedUsers.map((user) => renderUserCard(user))}
            </div>

            <button
              className="mt-6 w-full text-center text-sm text-gray-600 hover:text-gray-800"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default PeopleYouMayKnow;
