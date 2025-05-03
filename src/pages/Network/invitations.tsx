import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants';
import { handleAccept as acceptInvitation, handleIgnore as ignoreInvitation } from '../../components/Network/handleInvitations';
import Header from '../../components/UpperNavBar'; 
import HiringAd from '../../components/HiringAd';

// Define the invitation interface
interface Invitation {
  _id: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  headline: string;
}

const InvitationManager: React.FC = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [selectedTab, setSelectedTab] = useState('received'); // Default to "Received"
  const [isLoading, setIsLoading] = useState(true);

  // Fetch received invitations
  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/connections/requests`);
        console.log('Invitations API response:', response.data);
        if (response.data.requests) {
          setInvitations(response.data.requests);
        }
      } catch (error) {
        console.error('Error fetching invitations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvitations();
  }, []);;

  // Placeholder for Sent Invitations
  const handleWithdraw = (invitationId: string) => {
    console.log(`Withdraw invitation with ID: ${invitationId}`);
    // Add logic once sent invitations API is implemented
  };

  return (
    <div className="flex flex-col lg:flex-row bg-[#F5F3EE] p-2 sm:p-4 md:p-6 mt-14 min-h-screen">
      {/* Header */}
      <Header notifications={[]} />

      {/* Main Content */}
      <div className="flex-grow p-2 sm:p-4 flex flex-col lg:flex-row">
        {/* Left/Main Section */}
        <div className="w-full lg:flex-1 lg:ml-22">
          {/* Manage Invitations in a white card */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
            <h2 className="text-xl mb-4">Manage invitations</h2>
            <div className="border-b border-gray-200 mb-4"></div>

            {/* Tabs */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <button
                  onClick={() => setSelectedTab('received')}
                  className={`px-4 py-2 rounded-t transition-colors duration-200 font-semibold
                    ${
                      selectedTab === 'received'
                        ? 'text-green-800 border-b-2 border-green-800'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  style={{ background: 'none', boxShadow: 'none' }}
                >
                  Received
                </button>
                <button
                  onClick={() => setSelectedTab('sent')}
                  className={`ml-4 px-4 py-2 rounded-t transition-colors duration-200 font-semibold
                    ${
                      selectedTab === 'sent'
                        ? 'text-green-800 border-b-2 border-green-800'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  style={{ background: 'none', boxShadow: 'none' }}
                >
                  Sent
                </button>
              </div>
            </div>

            {/* Invitations List */}
            <div>
              {isLoading ? (
                <p className="text-gray-600">Loading...</p>
              ) : invitations.length > 0 ? (
                <ul className="space-y-4">
                  {invitations.map((invitation) => (
                    <li key={invitation._id} className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                      <img
                        src={invitation.profilePicture || "/Images/user.svg"}
                        alt={`${invitation.firstName} ${invitation.lastName}`}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{`${invitation.firstName} ${invitation.lastName}`}</p>
                        <p className="text-xs text-gray-500 truncate">{invitation.headline}</p>
                      </div>
                      <div className="ml-0 sm:ml-auto flex items-center mt-2 sm:mt-0">
                        {selectedTab === 'received' ? (
                          <>
                            <button
                              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-300 mr-2"
                              onClick={() => ignoreInvitation(invitation._id)}
                            >
                              Ignore
                            </button>
                            <button
                              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition duration-300"
                              onClick={() => acceptInvitation(invitation._id)}
                            >
                              Accept
                            </button>
                          </>
                        ) : (
                          <button
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-300"
                            onClick={() => handleWithdraw(invitation._id)}
                          >
                            Withdraw
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center mt-16">
                  <img
                    src="/Images/invitations.png"
                    alt="No new invitations"
                    className="w-40 h-40 mb-4"
                  />
                  <p className="text-black text-2xl text-center">No new invitations</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full lg:w-80 lg:ml-6 mt-6 lg:mt-0 hidden lg:block">
          <div className="sticky top-20">
            <HiringAd />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitationManager;