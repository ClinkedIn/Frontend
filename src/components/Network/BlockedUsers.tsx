import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Header from '../UpperNavBar';
import HiringAd from '../HiringAd';
import { BASE_URL } from '../../constants';
import BlockButton from './BlockButton';

interface BlockedUser {
  _id: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  lastJobTitle: string;
}

export const getBlockedUsersCount = async (): Promise<number> => {
  try {
    const response = await axios.get(`${BASE_URL}/user/blocked`);
    return response.data.blockedUsers?.length || 0;
  } catch {
    return 0;
  }
};

const BlockedUsers: React.FC = () => {
  const navigate = useNavigate();
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [filteredBlockedUsers, setFilteredBlockedUsers] = useState<BlockedUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const threeDotsDropdownRef = useRef<HTMLDivElement | null>(null);

  // Fetch blocked users
  useEffect(() => {
    const fetchBlockedUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/blocked`);
        if (response.data.blockedUsers) {
          setBlockedUsers(response.data.blockedUsers);
          setFilteredBlockedUsers(response.data.blockedUsers);
        }
      } catch (error) {
        setBlockedUsers([]);
        setFilteredBlockedUsers([]);
      }
    };
    fetchBlockedUsers();
  }, []);

  // Outside click handler for dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (openDropdownId && threeDotsDropdownRef.current && !threeDotsDropdownRef.current.contains(target)) {
        setOpenDropdownId(null);
      }
    }
    if (openDropdownId) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownId]);

  // Handle Search
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchTerm(query);

    if (!query) {
      setFilteredBlockedUsers(blockedUsers);
      return;
    }

    const filtered = blockedUsers.filter((user) =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(query)
    );
    setFilteredBlockedUsers(filtered);
  };

  return (
    <div className="flex flex-col lg:flex-row bg-[#F5F3EE] p-2 sm:p-4 md:p-6 mt-14 min-h-screen">
      {/* Header */}
      <Header notifications={[]} />

      {/* Main Content */}
      <div className="flex-grow p-2 sm:p-4">
        {/* Blocked Users in a white card */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">{`${filteredBlockedUsers.length} blocked users`}</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
            <div className="flex-grow" />
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

          {/* Blocked Users List */}
          <div>
            {filteredBlockedUsers.map((user, idx) => (
              <React.Fragment key={user._id}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-4 relative">
                  <img
                    src={user.profilePicture || "/Images/user.svg"}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-12 h-12 rounded-full cursor-pointer"
                    onClick={() => navigate(`/profile/${user._id}`)}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-medium cursor-pointer hover:underline truncate"
                      onClick={() => navigate(`/profile/${user._id}`)}
                    >
                      {`${user.firstName} ${user.lastName}`}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.lastJobTitle}</p>
                  </div>
                  <div className="ml-0 sm:ml-auto flex items-center relative mt-2 sm:mt-0">
                    <BlockButton userId={user._id} initialBlocked={true} userName={`${user.firstName} ${user.lastName}`} />
                  </div>
                </div>
                {/* Add a line between users except after the last one */}
                {idx < filteredBlockedUsers.length - 1 && (
                  <hr className="border-t border-gray-200 mb-4" />
                )}
              </React.Fragment>
            ))}
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
  );
};

export default BlockedUsers;