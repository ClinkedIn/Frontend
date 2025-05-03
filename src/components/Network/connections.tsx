import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Header from '../UpperNavBar'; // Import the Header component
import HiringAd from '../HiringAd'; // Import the HiringAd component
import { BASE_URL } from '../../constants';

// Define the connection interface
interface Connection {
  _id: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  lastJobTitle: string;
}

// Define the API response interface for connections
interface ConnectionsResponse {
  connections: Connection[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

export const getConnectionsCount = async (): Promise<number> => {
  try {
    const response = await axios.get(`${BASE_URL}/user/connections`);
    return response.data?.pagination?.total || 0;
  } catch {
    return 0;
  }
};

const Connections: React.FC = () => {
  const navigate = useNavigate();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [filteredConnections, setFilteredConnections] = useState<Connection[]>([]);
  const [totalConnections, setTotalConnections] = useState(0);
  const [sortOption, setSortOption] = useState('Recently Added'); // Default sort option
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Sort dropdown
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null); // Dropdown position
  const [searchTerm, setSearchTerm] = useState(''); // For searching users
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null); // 3-dots dropdown
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
  const [confirmRemoveName, setConfirmRemoveName] = useState<string>("");
  const sortDropdownRef = useRef<HTMLDivElement | null>(null);
  const threeDotsDropdownRef = useRef<HTMLDivElement | null>(null);

  // Fetch connections
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/connections`);
        console.log('Connections API response:', response.data);
        if (response.data.connections) {
          setConnections(response.data.connections);
          setFilteredConnections(response.data.connections);
          setTotalConnections(response.data.pagination.total);
        }
      } catch (error) {
        console.error('Error fetching connections:', error);
      }
    };
    fetchConnections();
  }, []);

  // Unified outside click handler for both dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const sortOpen = isDropdownOpen && sortDropdownRef.current && !sortDropdownRef.current.contains(target);
      const dotsOpen = openDropdownId && threeDotsDropdownRef.current && !threeDotsDropdownRef.current.contains(target);

      if (sortOpen) setIsDropdownOpen(false);
      if (dotsOpen) setOpenDropdownId(null);
    }
    if (isDropdownOpen || openDropdownId) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, openDropdownId]);

  // Handle Sort Option Change
  const handleSortChange = (option: string) => {
    setSortOption(option);
    setIsDropdownOpen(false); // Close the dropdown after selection
    // Apply sorting logic
    switch (option) {
      case 'Recently Added':
        setFilteredConnections([...connections]);
        break;
      case 'First Name':
        setFilteredConnections(
          [...connections].sort((a, b) =>
            a.firstName.localeCompare(b.firstName)
          )
        );
        break;
      case 'Last Name':
        setFilteredConnections(
          [...connections].sort((a, b) =>
            a.lastName.localeCompare(b.lastName)
          )
        );
        break;
      default:
        setFilteredConnections([...connections]);
        break;
    }
  };

  // Handle Search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchTerm(query);

    if (!query) {
      setFilteredConnections(connections);
      return;
    }

    const filtered = connections.filter((connection) =>
      `${connection.firstName} ${connection.lastName}`
        .toLowerCase()
        .includes(query)
    );
    setFilteredConnections(filtered);
  };

  // Handle Remove Connection (now called only after confirmation)
  const handleRemoveConnection = async (connectionId: string) => {
    try {
      await axios.delete(`${BASE_URL}/user/connections/${connectionId}`);
      console.log(`Removed connection with ID: ${connectionId}`);
      // Refresh connections list
      const updatedConnections = connections.filter(
        (connection) => connection._id !== connectionId
      );
      setConnections(updatedConnections);
      setFilteredConnections(updatedConnections);
      setConfirmRemoveId(null);
      setConfirmRemoveName("");
    } catch (error) {
      console.error('Error removing connection:', error);
    }
  };

  // Message handler for each connection
  const handleMessageApplicant = (userId: string, name: string, profilePicture: string) => {
    navigate("/messaging", {
      state: { _id: userId, fullName: name, profilePicture },
    });
  };

  return (
    <div className="flex flex-col lg:flex-row bg-[#F5F3EE] p-2 sm:p-4 md:p-6 mt-14 min-h-screen">
      {/* Header */}
      <Header notifications={[]} />

      {/* Main Content */}
      <div className="flex-grow p-2 sm:p-4">
        {/* Manage Connections in a white card */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{`${totalConnections} connections`}</h2>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            {/* Sort Dropdown */}
            <div className="relative inline-block text-left" ref={sortDropdownRef}>
              <button
                type="button"
                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                id="options-menu"
                aria-haspopup="true"
                onClick={(e) => {
                  setIsDropdownOpen(!isDropdownOpen);
                  const rect = (e.target as HTMLElement).getBoundingClientRect();
                  setDropdownPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
                }}
              >
                Sort by: {sortOption.replace(/([A-Z])/g, ' $1').trim()}
                <svg
                  className="ml-2 -mr-1 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && dropdownPosition && (
                <div
                  className="fixed z-50 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none"
                  style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
                >
                  <div className="py-1 bg-white">
                    <button
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => handleSortChange('Recently Added')}
                    >
                      Recently Added
                    </button>
                    <button
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => handleSortChange('First Name')}
                    >
                      First Name
                    </button>
                    <button
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => handleSortChange('Last Name')}
                    >
                      Last Name
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex-grow" />
            {/* Search Bar */}
            <div className="w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={handleSearch}
                className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:border-blue-500 w-full sm:w-64"
              />
            </div>
          </div>

          {/* Connections List */}
          <div>
            {filteredConnections.map((connection, idx) => (
              <React.Fragment key={connection._id}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4 relative">
                  <img
                    src={connection.profilePicture || "/Images/user.svg"}
                    alt={`${connection.firstName} ${connection.lastName}`}
                    className="w-12 h-12 rounded-full cursor-pointer"
                    onClick={() => navigate(`/profile/${connection._id}`)}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-medium cursor-pointer hover:underline truncate"
                      onClick={() => navigate(`/profile/${connection._id}`)}
                    >
                      {`${connection.firstName} ${connection.lastName}`}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{connection.lastJobTitle}</p>
                  </div>
                  <div className="ml-0 sm:ml-auto flex items-center relative mt-2 sm:mt-0">
                    <button
                      onClick={() =>
                        handleMessageApplicant(
                          connection._id,
                          `${connection.firstName} ${connection.lastName}`,
                          connection.profilePicture
                        )
                      }
                      className="px-4 py-1.5 border border-blue-500 text-blue-600 rounded-full text-sm font-semibold hover:bg-blue-50 transition-colors"
                    >
                      Message
                    </button>
                    <button
                      className="ml-4 px-2 py-1 rounded hover:bg-gray-200 transition"
                      onClick={() =>
                        setOpenDropdownId(openDropdownId === connection._id ? null : connection._id)
                      }
                    >
                      &#8230;
                    </button>
                    {/* Dropdown */}
                    {openDropdownId === connection._id && (
                      <div
                        ref={threeDotsDropdownRef}
                        className="absolute right-0 mt-8 z-30 bg-white border rounded shadow-lg w-48"
                      >
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          onClick={() => {
                            setConfirmRemoveId(connection._id);
                            setConfirmRemoveName(`${connection.firstName} ${connection.lastName}`);
                            setOpenDropdownId(null);
                          }}
                        >
                          <svg className="w-4 h-4 mr-2 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 3h4a2 2 0 012 2v2H8V5a2 2 0 012-2z" />
                          </svg>
                          Remove connection
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {/* Add a line between users except after the last one */}
                {idx < filteredConnections.length - 1 && (
                  <hr className="border-t border-gray-200 mb-4" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmRemoveId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setConfirmRemoveId(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-2">Remove Connection</h2>
            <p className="mb-6">
              Are you sure you want to remove <span className="font-semibold">{confirmRemoveName}</span> as a connection? Don’t worry, {confirmRemoveName.split(' ')[0]} won’t be notified.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={() => setConfirmRemoveId(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
                onClick={() => handleRemoveConnection(confirmRemoveId)}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Right Sidebar */}
      <div className="w-full lg:w-80 lg:ml-6 mt-6 lg:mt-0 hidden lg:block">
        <div className="sticky top-20">
          <HiringAd />
        </div>
      </div>
    </div>
  );
};

export default Connections;