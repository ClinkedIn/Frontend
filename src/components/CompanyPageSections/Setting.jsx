import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { BASE_URL } from "../../constants";
import { useOutletContext } from "react-router-dom";

const CompanySettingPage = () => {
  const [admins, setAdmins] = useState([]);
  const { companyInfo } = useOutletContext();
  const [searchTerm, setSearchTerm] = useState(""); 
  const [userResults, setUserResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [addingAdmin, setAddingAdmin] = useState(null); 
  const [removingAdmin, setRemovingAdmin] = useState(null); 
  const DEFAULT_PROFILE_PICTURE = "/Images/user.svg"


  const fetchAdmins = useCallback(async () => {
    if (!companyInfo || !companyInfo.id) return;
    setLoadingAdmins(true);
    try {
      const response = await axios.get(`${BASE_URL}/companies/${companyInfo.id}/admin`, {
        withCredentials: true
      });
      setAdmins(response.data.admins || []);
      console.log(response.data.admins)
    } catch (error) {
      console.error("Error fetching admins:", error);
      setAdmins([]); 
    } finally {
      setLoadingAdmins(false);
    }
  }, [companyInfo]); 

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]); 

  useEffect(() => {
    if (!searchTerm.trim()) {
      setUserResults([]);
      setShowResults(false);
      return;
    }

    setLoadingSearch(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        params.append("query", searchTerm);
        const response = await axios.get(`${BASE_URL}/user/search`, {
          params,
          withCredentials: true,
        });
        console.log("users",response.data.users)
        const nonAdminUsers = (response.data.users || []).filter(user =>
          !admins.some(admin => admin.id === user._id)
        );
        setUserResults(nonAdminUsers);
        setShowResults(true);
      } catch (error) {
        console.error("User search error:", error);
        setUserResults([]);
      } finally {
        setLoadingSearch(false);
      }
    }, 500);

    return () => {
      clearTimeout(delayDebounceFn);
      setLoadingSearch(false); 
    };
  }, [searchTerm, admins]); 

  const handleAddAdmin = async (user) => {
    if (!companyInfo || !companyInfo.id || !user || !user._id) return;
    setAddingAdmin(user._id);
    try {
      
      await axios.post(`${BASE_URL}/companies/${companyInfo.id}/admin`, { userId: user._id }, {
        withCredentials: true
      });
      fetchAdmins();
      setSearchTerm("");
      setUserResults([]);
      setShowResults(false);
    } catch (error) {
      console.error("Error adding admin:", error);
    } finally {
      setAddingAdmin(null);
    }
  };

  const handleRemoveAdmin = async (admin) => {
    if (!companyInfo || !companyInfo.id || !admin.id) return;
    
    try {
        await axios.delete(`${BASE_URL}/companies/${companyInfo.id}/admin`, {
        data: { userId: admin.id }, 
        withCredentials: true 
        });
      setRemovingAdmin(admin.id);
      fetchAdmins();
    } catch (error) {
      console.error("Error removing admin:", error);
      
    } finally {
      setRemovingAdmin(null);
    }
  };


  return (
    <div className="mt-4 bg-white flex flex-col items-center w-full rounded-lg shadow-lg p-8">

      {/* Admin Management Section */}
      <div className="w-full max-w-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Manage Administrators</h3>

        {/* Search Bar for Adding Admins */}
        <div className="mb-4">
          <label htmlFor="user-search" className="block text-gray-700 text-sm font-bold mb-2">
            Search and Add Users as Admins:
          </label>
          <input
            id="user-search"
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Search for a user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Search Results */}
        {loadingSearch && <p>Searching...</p>}
        {showResults && userResults.length > 0 && (
          <div className="border rounded max-h-40 overflow-y-auto mb-4">
            <ul className="divide-y divide-gray-200">
              {userResults.map((user) => (
                user?.status !=="inactive" && 
                <li key={user._id} className="px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={user.profilePicture || DEFAULT_PROFILE_PICTURE} 
                      alt={`${user.firstName} ${user.lastName}'s profile picture`} 
                      className="w-8 h-8 rounded-full mr-3 object-cover" 
                    />
                    <span>{user.firstName + " " + user.lastName}</span>
                  </div>
                  <button
                    onClick={() => handleAddAdmin(user)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs focus:outline-none focus:shadow-outline disabled:opacity-50"
                    disabled={addingAdmin === user._id}
                  >
                    {addingAdmin === user._id ? 'Adding...' : 'Add as Admin'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {showResults && !loadingSearch && userResults.length === 0 && searchTerm.trim() && (
          <p className="text-gray-600 text-sm mb-4">No users found matching your search.</p>
        )}


        {/* List of Current Admins */}
        <div>
          <h4 className="text-lg font-semibold mb-2">Current Administrators:</h4>
          {loadingAdmins ? (
            <p>Loading administrators...</p>
          ) : admins.length === 1 ? (
            <p className="text-gray-600 text-sm">No administrators found for this company otherwise you.</p>
          ) : (
            <ul className="divide-y divide-gray-200 border rounded">
              {admins.map((admin) => (
              admin.role !=="owner" && 
                (<li key={admin.id} className="px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center"> 
                    <img
                      src={admin.profilePicture || DEFAULT_PROFILE_PICTURE} 
                      alt={`${admin.firstName} ${admin.lastName}'s profile picture`} 
                      className="w-8 h-8 rounded-full mr-3 object-cover" 
                    />
                    <span>{admin.firstName + " " + admin.lastName}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveAdmin(admin)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs focus:outline-none focus:shadow-outline disabled:opacity-50"
                    disabled={removingAdmin === admin.id}
                  >
                    {removingAdmin === admin.id ? 'Removing...' : 'Remove'}
                  </button>
                </li>)
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default CompanySettingPage;