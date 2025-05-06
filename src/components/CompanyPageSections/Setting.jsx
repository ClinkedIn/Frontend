import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { BASE_URL } from "../../constants";
import { useOutletContext, useNavigate } from "react-router-dom";
import { FiSearch, FiUser, FiX } from "react-icons/fi";
import { FaSpinner, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

/**
 * @typedef {Object} Admin
 * @property {string} id - Unique identifier for the admin
 * @property {string} firstName - Admin's first name
 * @property {string} lastName - Admin's last name
 * @property {string} email - Admin's email address
 * @property {string} [profilePicture] - URL to the admin's profile picture
 * @property {string} role - Role of the admin (e.g., "admin", "owner")
 */

/**
 * @typedef {Object} User
 * @property {string} _id - Unique identifier for the user
 * @property {string} firstName - User's first name
 * @property {string} lastName - User's last name
 * @property {string} email - User's email address
 * @property {string} [profilePicture] - URL to the user's profile picture
 * @property {string} status - User's status (e.g., "active", "inactive")
 */

/**
 * @typedef {Object} CompanyInfo
 * @property {string} id - Company identifier
 * @property {string} name - Company name
 */

/**
 * Company Settings Page component that allows managing company administrators
 * and includes company deletion functionality.
 *
 * @component
 * @returns {JSX.Element} The rendered CompanySettingPage component
 */
const CompanySettingPage = () => {
  /** @type {[Admin[], function]} - State for company administrators */
  const [admins, setAdmins] = useState([]);

  /** @type {CompanyInfo} - Company information from context */
  const { companyInfo } = useOutletContext();

  /** @type {[string, function]} - State for user search term */
  const [searchTerm, setSearchTerm] = useState("");

  /** @type {[User[], function]} - State for search results */
  const [userResults, setUserResults] = useState([]);

  /** @type {[boolean, function]} - State for showing search results */
  const [showResults, setShowResults] = useState(false);

  /** @type {[boolean, function]} - State for admin loading status */
  const [loadingAdmins, setLoadingAdmins] = useState(true);

  /** @type {[boolean, function]} - State for search loading status */
  const [loadingSearch, setLoadingSearch] = useState(false);

  /** @type {[string|null, function]} - State for tracking admin being added */
  const [addingAdmin, setAddingAdmin] = useState(null);

  /** @type {[string|null, function]} - State for tracking admin being removed */
  const [removingAdmin, setRemovingAdmin] = useState(null);

  /** @type {[boolean, function]} - State for delete confirmation visibility */
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  /** @type {[boolean, function]} - State for company deletion status */
  const [deleting, setDeleting] = useState(false);

  /** Navigation function for route changes */
  const navigate = useNavigate();

  /** Default profile picture URL */
  const DEFAULT_PROFILE_PICTURE = "/Images/user.svg";

  /**
   * Fetches administrators for the company
   *
   * @async
   * @function fetchAdmins
   * @returns {Promise<void>}
   */
  const fetchAdmins = useCallback(async () => {
    if (!companyInfo || !companyInfo.id) return;
    setLoadingAdmins(true);
    try {
      const response = await axios.get(`${BASE_URL}/companies/${companyInfo.id}/admin`, {
        withCredentials: true,
      });
      console.log(response.data.admins)
      setAdmins(response.data.admins || []);
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast.error("Failed to load administrators");
      setAdmins([]);
    } finally {
      setLoadingAdmins(false);
    }
  }, [companyInfo]);

  /**
   * Effect to fetch admins when component mounts or companyInfo changes
   */
  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  /**
   * Effect to handle user search with debouncing
   */
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
        const nonAdminUsers = (response.data.users || []).filter(
            (user) => !admins.some((admin) => admin.id === user._id)
        );
        setUserResults(nonAdminUsers);
        setShowResults(true);
      } catch (error) {
        console.error("User search error:", error);
        toast.error("Failed to search users");
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

  /**
   * Adds a user as an administrator to the company
   *
   * @async
   * @function handleAddAdmin
   * @param {User} user - The user to add as an administrator
   * @returns {Promise<void>}
   */
  const handleAddAdmin = async (user) => {
    if (!companyInfo || !companyInfo.id || !user || !user._id) return;
    setAddingAdmin(user._id);
    try {
      await axios.post(
          `${BASE_URL}/companies/${companyInfo.id}/admin`,
          { userId: user._id },
          { withCredentials: true }
      );
      toast.success(`${user.firstName} ${user.lastName} added as admin`);
      fetchAdmins();
      setSearchTerm("");
      setUserResults([]);
      setShowResults(false);
    } catch (error) {
      console.error("Error adding admin:", error);
      toast.error("Failed to add admin");
    } finally {
      setAddingAdmin(null);
    }
  };

  /**
   * Removes an administrator from the company
   *
   * @async
   * @function handleRemoveAdmin
   * @param {Admin} admin - The administrator to remove
   * @returns {Promise<void>}
   */
  const handleRemoveAdmin = async (admin) => {
    if (!companyInfo || !companyInfo.id || !admin.id) return;
    setRemovingAdmin(admin.id);
    try {
      await axios.delete(`${BASE_URL}/companies/${companyInfo.id}`, {
        data: { userId: admin.id },
        withCredentials: true,
      });
      toast.success(`${admin.firstName} ${admin.lastName} removed from admins`);
      fetchAdmins();
    } catch (error) {
      console.error("Error removing admin:", error);
      toast.error("Failed to remove admin");
    } finally {
      setRemovingAdmin(null);
    }
  };

  /**
   * Deletes the company permanently
   *
   * @async
   * @function handleDeleteCompany
   * @returns {Promise<void>}
   */
  const handleDeleteCompany = async () => {
    if (!companyInfo || !companyInfo.id) return;
    setDeleting(true);
    try {
      await axios.delete(`${BASE_URL}/companies/${companyInfo.id}`, {
        withCredentials: true,
      });
      toast.success("Company deleted successfully");
      navigate("/feed");
    } catch (error) {
      console.error("Error deleting company:", error);
      toast.error(error.response?.data?.message || "Failed to delete company");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
      <div className="mt-4 bg-white w-full rounded-lg shadow-xl p-8">
        {/* Admin Management Section */}
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Manage Administrators</h3>

          {/* Search Bar */}
          <div className="mb-6">
            <label htmlFor="user-search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Users to Add as Admins
            </label>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                  id="user-search"
                  type="text"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Search for a user..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Search Results */}
          {loadingSearch && (
              <div className="flex items-center justify-center py-4">
                <FaSpinner className="animate-spin text-blue-600 text-xl mr-2" />
                <span className="text-gray-600">Searching...</span>
              </div>
          )}
          {showResults && userResults.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg max-h-60 overflow-y-auto mb-6 shadow-sm">
                <ul className="divide-y divide-gray-200">
                  {userResults.map(
                      (user) =>
                          user?.status !== "inactive" && (
                              <li
                                  key={user._id}
                                  className="px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-all duration-150"
                              >
                                <div className="flex items-center">
                                  <img
                                      src={user.profilePicture || DEFAULT_PROFILE_PICTURE}
                                      alt={`${user.firstName} ${user.lastName}'s profile picture`}
                                      className="w-10 h-10 rounded-full mr-3 object-cover border border-gray-200"
                                  />
                                  <div>
                          <span className="font-medium text-gray-800">
                            {user.firstName} {user.lastName}
                          </span>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                  </div>
                                </div>
                                <button
                                    onClick={() => handleAddAdmin(user)}
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1.5 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 text-sm font-medium"
                                    disabled={addingAdmin === user._id}
                                >
                                  {addingAdmin === user._id ? (
                                      <FaSpinner className="animate-spin inline-block mr-1" />
                                  ) : (
                                      "Add as Admin"
                                  )}
                                </button>
                              </li>
                          )
                  )}
                </ul>
              </div>
          )}
          {showResults && !loadingSearch && userResults.length === 0 && searchTerm.trim() && (
              <p className="text-gray-500 text-sm mb-6">No users found matching your search.</p>
          )}

          {/* Current Admins List */}
          <div>
            <h4 className="text-xl font-semibold text-gray-800 mb-4">Current Administrators</h4>
            {loadingAdmins ? (
                <div className="flex items-center justify-center py-4">
                  <FaSpinner className="animate-spin text-blue-600 text-xl mr-2" />
                  <span className="text-gray-600">Loading administrators...</span>
                </div>
            ) : admins.length <= 1 ? (
                <p className="text-gray-500 text-sm">You are the only administrator for this company.</p>
            ) : (
                <ul className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
                  {admins.map(
                      (admin) =>
                          admin.role !== "owner" && (
                              <li
                                  key={admin.id}
                                  className="px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-all duration-150"
                              >
                                <div className="flex items-center">
                                  <img
                                      src={admin.profilePicture || DEFAULT_PROFILE_PICTURE}
                                      alt={`${admin.firstName} ${admin.lastName}'s profile picture`}
                                      className="w-10 h-10 rounded-full mr-3 object-cover border border-gray-200"
                                  />
                                  <div>
                          <span className="font-medium text-gray-800">
                            {admin.firstName} {admin.lastName}
                          </span>
                                    <p className="text-sm text-gray-500">{admin.email}</p>
                                  </div>
                                </div>
                                <button
                                    onClick={() => handleRemoveAdmin(admin)}
                                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-1.5 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 text-sm font-medium"
                                    disabled={removingAdmin === admin.id}
                                >
                                  {removingAdmin === admin.id ? (
                                      <FaSpinner className="animate-spin inline-block mr-1" />
                                  ) : (
                                      "Remove"
                                  )}
                                </button>
                              </li>
                          )
                  )}
                </ul>
            )}
          </div>

          {/* Danger Zone: Delete Company */}
          {
            <div className="mt-12 border-t border-gray-200 pt-8">
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Danger Zone</h4>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-lg font-medium text-red-800">Delete Company</h5>
                    <p className="text-sm text-red-600">
                      Permanently delete this company and all associated data. This action cannot be undone.
                    </p>
                  </div>
                  <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center gap-2"
                  >
                    <FaTrash />
                    Delete Company
                  </button>
                </div>
              </div>
            </div>
          }
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">Confirm Deletion</h3>
                  <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete <span className="font-medium">{companyInfo.name}</span>? This
                  action is permanent and cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                      onClick={handleDeleteCompany}
                      disabled={deleting}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 disabled:bg-red-400 flex items-center gap-2"
                  >
                    {deleting ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                    {deleting ? "Deleting..." : "Delete Company"}
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default CompanySettingPage;