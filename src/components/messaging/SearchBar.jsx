
import React, { useState, useEffect } from 'react';
import { IoMdSearch } from "react-icons/io";

const ConversationSearch = ({ onSelectUser,connections,loading,error }) => {
 
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredConnections, setFilteredConnections] = useState([]);
  const [showResults, setShowResults] = useState(false); // Control dropdown visibility

  useEffect(() => {
    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const results = connections.filter(conn =>
        conn.fullName.toLowerCase().includes(lowerSearchTerm)
      );
      setFilteredConnections(results);
      setShowResults(true); // Show results when searching
    } else {
      setFilteredConnections([]);
      setShowResults(false); // Hide results when search is empty
    }
  }, [searchTerm, connections]);

  const handleSelect = (user) => {
    onSelectUser(user); // Pass the selected user object { userId, fullName, profilePicture }
    setSearchTerm(''); // Clear search term
    setShowResults(false); // Hide results
  };

  return (
    <div className="p-3 border-b relative">
      <div className="relative">
        <input
          type="text"
          placeholder="Search connections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.trim() && setShowResults(true)} // Show results on focus if there's text
         
          className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-100 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
        />
       
       <IoMdSearch className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />

      </div>

      {/* --- Search Results Dropdown --- */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto z-20">
          {loading && <div className="p-3 text-sm text-gray-500">Loading connections...</div>}
          {error && <div className="p-3 text-sm text-red-500">Error: {error}</div>}
          {!loading && !error && filteredConnections.length === 0 && searchTerm.trim() && (
             <div className="p-3 text-sm text-gray-500">No connections found for "{searchTerm}".</div>
          )}
          {!loading && !error && filteredConnections.map(user => (
            <div
              key={user.userId}
              onClick={() => handleSelect(user)}
              className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
            >
              <img
                src={user.profilePicture || 'https://via.placeholder.com/40'}
                alt={user.fullName}
                className="w-8 h-8 rounded-full mr-3"
              />
              <span className="text-sm">{user.fullName}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConversationSearch;