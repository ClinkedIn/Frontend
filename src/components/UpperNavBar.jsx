import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { MdLocationPin, MdSearch } from "react-icons/md";
import Jobs from "../pages/jobs/Jobs";
import { BASE_URL } from "../constants";
/**
 * Header component representing the upper navigation bar of the application.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Array} props.notifications - Array of notification objects.
 *
 * @returns {JSX.Element} The rendered Header component.
 *
 * @description
 * The Header component includes:
 * - A logo that navigates to the feed page.
 * - A search bar for job searches (visible only on the "jobs" page).
 * - Navigation icons for Home, Network, Jobs, Messaging, and Notifications.
 * - User and Work dropdown icons.
 *
 * @example
 * <Header notifications={notifications} />
 *
 * @functionality
 * - Fetches the unread notification count on mount.
 * - Handles navigation to various pages (e.g., notifications, jobs, messaging).
 * - Allows users to perform job searches with title and location filters.
 * - Displays the unread notification count badge.
 *
 * @dependencies
 * - React hooks: useState, useEffect.
 * - React Router hooks: useNavigate, useLocation.
 * - Axios for API requests.
 */
const Header = ({ notifications }) => {
  const [showUser, setShowUser] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();
  const locations = useLocation();
  const currentPath = locations.pathname.split("/")[1];
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/notifications/unread-count`,
          { withCredentials: true }
        );
        console.log("unread count:", response);
        setUnreadCount(response.data.unreadCount);
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };

    fetchUnreadCount();
  }, [notifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUser(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handler to navigate to notifications page
  /**
   * Navigates the user to the notifications page.
   * This function is triggered when the notifications button is clicked.
   */
  const handleNotificationsClick = () => {
    navigate("/notifications");
  };

  // Handler to navigate to jobs page
  /**
   * Navigates the user to the '/jobs' route.
   * This function is typically used as an event handler for navigation actions.
   */
  const handleJobsClick = () => {
    navigate("/jobs");
  };

  // Handler for profile navigation
  const handleProfileClick = () => {
    navigate("/profile");
    setShowUser(false);
  };

  // Handler for settings navigation
  const handleSettingsClick = () => {
    navigate("/settings");
    setShowUser(false);
  };

  /**
   * Handles the search functionality by sending a GET request to the server
   * with the provided search query and location parameters. Navigates to the
   * job board page with the search results and relevant state data.
   *
   * @async
   * @function handleSearch
   * @param {Object} e - The event object from the form submission.
   * @returns {Promise<void>} - A promise that resolves when the search is complete.
   * @throws {Error} - Logs an error to the console if the search request fails.
   */
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("q", searchQuery);
      if (location) params.append("location", location);

      const response = await axios.get(
        `${BASE_URL}/search/jobs?${params}`
      );

      navigate("/job-board", {
        state: {
          jobs: response.data,
          searchQuery,
          location,
          currentPath,
        },
      });
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  /**
   * Navigates the user to the messaging page with a specific ID.
   *
   * @function handleMessagingClick
   * @description This function is triggered when the messaging button is clicked.
   * It redirects the user to the `/messaging/123` route using the `navigate` function.
   */
  const handleMessagingClick = () => {
    navigate("/messaging/123");
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-50">
      <div className="flex items-center justify-between max-w-6xl mx-auto px-4 py-2">
        <div className="flex">
          {/* Logo */}
          <a href="/feed">
            <img src="/Images/home-logo.svg" alt="Logo" className="w-8 h-8" />
          </a>
          {/* Search Bar */}
          {currentPath == "jobs" && (
            <form onSubmit={handleSearch} className="flex rounded-lg">
              <div className="flex items-center bg-[#edf3f8] rounded-sm ml-2 ">
                <MdSearch color="#5f6163" className="w-4 h-4 mr-2 ml-1" />
                <input
                  type="text"
                  placeholder="Title, skill or company"
                  className=" text-sm placeholder-[#5f6163] w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center bg-[#edf3f8] rounded-sm ml-2">
                <MdLocationPin color="#5f6163" className="w-4 h-4 mr-2 ml-1" />
                <input
                  type="text"
                  placeholder="City, state, or zip code"
                  className="placeholder-[#5f6163] text-sm w-64"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 ml-1 text-white px-2 py-2 rounded-lg hover:bg-blue-700"
              >
                Search
              </button>
            </form>
          )}
        </div>

        {/* Navigation Icons */}
        <nav className="flex space-x-6">
          <button
            className="hover:bg-gray-200 p-2 rounded-lg"
            onClick={() => navigate("/feed")}
          >
            <img src="/Images/nav-home.svg" alt="Home" className="w-6 h-6" />
          </button>

          <button className="hover:bg-gray-200 p-2 rounded-lg">
            <img
              src="/Images/nav-network.svg"
              alt="Network"
              className="w-6 h-6"
            />
          </button>

          <button
            className="hover:bg-gray-200 p-2 rounded-lg"
            onClick={handleJobsClick}
          >
            <img src="/Images/nav-jobs.svg" alt="Jobs" className="w-6 h-6" />
          </button>
          <button
            className="hover:bg-gray-200 p-2 rounded-lg"
            onClick={handleMessagingClick}
          >
            <img
              src="/Images/nav-messaging.svg"
              alt="Messaging"
              className="w-6 h-6"
            />
          </button>
          <button
            className="hover:bg-gray-200 p-2 rounded-lg relative"
            onClick={handleNotificationsClick}
          >
            <img
              src="/Images/nav-notifications.svg"
              alt="Notifications"
              className="w-6 h-6"
            />
            {unreadCount > 0 && (
              <div
                className="absolute -top-1 -right-1 bg-[#cb112d] text-white rounded-full 
                w-5 h-5 flex items-center justify-center text-xs font-medium"
              >
                {unreadCount}
              </div>
            )}
          </button>
        </nav>

        {/* User & Work Icons with Dropdown */}
        <div className="flex space-x-4 items-center">
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center space-x-2 hover:bg-gray-200 p-2 rounded-lg"
              onClick={() => setShowUser(!showUser)}
            >
              <img
                src="/Images/user.svg"
                alt="User"
                className="w-6 h-6 rounded-full"
              />
              <img
                src="/Images/down-icon.svg"
                alt="Dropdown"
                className={`w-4 h-4 transition-transform duration-200 ${
                  showUser ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* User dropdown menu */}
            {showUser && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-200">
                  <div className="flex items-center">
                    <img
                      src="/Images/user.svg"
                      alt="User Profile"
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-medium text-gray-800">John Doe</p>
                      <p className="text-xs text-gray-500">
                        Software Developer
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleProfileClick}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  My Profile
                </button>
                <button
                  onClick={handleSettingsClick}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </button>
                {/* <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-200">
                  Sign Out
                </button> */}
              </div>
            )}
          </div>

          <button className="flex items-center space-x-2 hover:bg-gray-200 p-2 rounded-lg">
            <img src="/Images/nav-work.svg" alt="Work" className="w-6 h-6" />
            <img
              src="/Images/down-icon.svg"
              alt="Dropdown"
              className="w-4 h-4"
            />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
