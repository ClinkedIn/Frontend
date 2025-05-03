import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { MdSearch, MdHome } from "react-icons/md";
import { IoBagSharp, IoChatbubbleEllipses, IoNotifications } from "react-icons/io5";
import { BsFillPeopleFill } from "react-icons/bs";
import { FaBars } from "react-icons/fa"; // Add this for a mobile menu icon if needed
import { BASE_URL } from "../constants";
import {
  collection,
  addDoc,
  getDoc,
  setDoc,
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase"; // Adjust the import path as necessary
import React from "react";
import { useAuth } from "../context/AuthContext";

/**
 * Header component that manages the navigation, search, and notifications.
 *
 * @component
 * @example
 * // Example usage:
 * <Header notifications={[]} pendingInvitationsCount={pendingInvitations.length} />
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Array} props.notifications - Array of notifications to be passed to the component.
 * @param {number} props.pendingInvitationsCount - Count of pending invitations.
 *
 * @returns {JSX.Element} The Header component.
 */
const Header = ({ notifications, pendingInvitationsCount }) => {
  /**
   * State variables:
   * - `showUser`: Toggles the visibility of the user dropdown.
   * - `unreadCount`: Stores the count of unread notifications.
   * - `searchQuery`: The search query for job search.
   * - `location`: The location filter for job search.
   * - `searchTerm`: The search term for user search.
   * - `userResults`: The list of user results based on the search term.
   * - `showResults`: Boolean flag to show user search results dropdown.
   * - `unreadCountMessages`: Stores the count of unread messages.
   * - `conversations`: Stores the user's conversations.
   * - `loadingConversations`: Boolean flag for loading state of conversations.
   * - `currentUser`: Stores the current user's data.
   * - `showWork`: Toggles the visibility of the work dropdown.
   * - `mobileMenuOpen`: Toggles the visibility of the mobile menu.
   *
   * @type {object}
   */
  const [showUser, setShowUser] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState(""); // For job search
  const [location, setLocation] = useState(""); // For job location filter
  const [searchTerm, setSearchTerm] = useState(""); // For user search
  const [userResults, setUserResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const locations = useLocation();
  const currentPath = locations.pathname.split("/")[1];
  const dropdownRef = useRef(null);
  const searchRef = useRef(null); // ref for user results dropdown
  const [unreadCountMessages, setUnreadCountMessages] = useState(0);
  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  const workDropdownRef = useRef(null);
  const [showWork, setShowWork] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentUser = {
    uid: "123",
  };
  const { logout } = useAuth();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/me`, {
          withCredentials: true,
        });
        setUserInfo(response.data.user);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/notifications/unread-count`,
          {
            withCredentials: true,
          }
        );
        setUnreadCount(response.data.unreadCount || 0);
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };
    fetchUnreadCount();
  }, [notifications]);

  /**
   * Fetches the current user's data and updates the state.
   */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user/me`, {
          withCredentials: true,
        });
        setUserInfo(response.data.user);
        console.log("User data:", response.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  /**
   * Fetches unread message counts from Firestore and updates the state.
   */
  useEffect(() => {
    if (!currentUser?._id) return;

    const conversationsRef = collection(db, "conversations");
    const q = query(
      conversationsRef,
      where("participants", "array-contains", currentUser._id)
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        let totalUnread = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          let countForUser = data.unreadCounts?.[currentUser._id] || 0;
          if (data.forceUnread?.[currentUser._id]) countForUser = countForUser - 1;
          totalUnread += countForUser;
        });

        console.log("Total unread messages from Firestore:", totalUnread);
        setUnreadCountMessages(totalUnread);
      },
      (error) => {
        console.error(
          "Error fetching unread message count from Firestore:",
          error
        );
        setUnreadCountMessages(0);
      }
    );

    return () => {
      console.log("Cleaning up Firestore listener for unread messages count.");
      unsubscribe();
    };
  }, [currentUser?._id]);

  /**
   * Handles the closing of dropdowns when clicking outside of them.
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUser(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * Handles the user search logic with debouncing.
   */
  useEffect(() => {
    if (!searchTerm.trim()) {
      setUserResults([]);
      setShowResults(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append("query", searchTerm);
        const response = await axios.get(`${BASE_URL}/user/search`, {
          params,
          withCredentials: true,
        });
        setUserResults(response.data.users || []);
        setShowResults(true);
      } catch (error) {
        console.error("User search error:", error);
        setUserResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  /**
   * Handles the navigation for various actions, such as viewing notifications, job listings, or settings.
   */
  const handleNotificationsClick = () => navigate("/notifications");
  const handleJobsClick = () => navigate("/jobs");
  const handleProfileClick = () => {
    navigate("/profile");
    setShowUser(false);
  };
  const handleSettingsClick = () => {
    navigate("/settings");
    setShowUser(false);
  };
  const handleMessagingClick = () => navigate("/messaging");
  const handleCreateCompany = () => {
    navigate("/company/setup/new");
    setShowWork(false);
  };

  /**
   * Handles the job search and navigation to the job board.
   * @param {Event} e - The form submit event.
   */
  const handleJobSearch = async (e) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("q", searchQuery);
      if (location) params.append("location", location);

      const response = await axios.get(`${BASE_URL}/search/jobs?${params}`);
      console.log("Job search response:", response.data);
      navigate("/job-board", {
        state: {
          jobs: response.data.jobs,
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
   * Handles user logout
   */
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  /**
   * Determines whether to show the job search bar based on the current path.
   */
  let path = false;
  if (
    currentPath === "jobs" ||
    currentPath === "job-board" ||
    currentPath === "myjobs"
  ) {
    path = true;
  }
  return (
    <header className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-50">
      <div className="relative flex items-center justify-between px-2 sm:px-4 py-2">
        {/* Logo */}
        <a
          href="/feed"
          className="flex-shrink-0 absolute left-2 top-1/2 transform -translate-y-1/2 md:static md:translate-y-0 md:left-0 ml-23"
          style={{ zIndex: 10 }}
        >
          <img src="/Images/blue-lockedin.png" alt="Logo" className="w-12 h-12 min-w-12" />
        </a>

        {/* Desktop Search Bar */}
        <form
          onSubmit={handleJobSearch}
          className="relative flex rounded-lg flex-1 max-w-xl mx-4 hidden md:flex"
        >
          {path ? (
            <>
              <div className="flex items-center bg-[#edf3f8] rounded-sm ml-2">
                <MdSearch color="#5f6163" className="w-4 h-4 mr-2 ml-1" />
                <input
                  type="text"
                  placeholder="Word, Title, skill or company"
                  className="text-sm placeholder-[#5f6163] w-full outline-none bg-transparent py-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center bg-[#edf3f8] rounded-sm ml-2">
                <input
                  type="text"
                  placeholder="City, state, or zip code"
                  className="text-sm placeholder-[#5f6163] w-full outline-none bg-transparent pl-1 py-2 ml-1"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 ml-1 text-white px-2 py-2 rounded-lg"
              >
                Search
              </button>
            </>
          ) : (
            <div className="flex items-center bg-[#edf3f8] rounded-sm ml-2 w-90">
              <MdSearch color="#5f6163" className="w-4 h-4 mr-2 ml-1" />
              <input
                type="text"
                placeholder="Search"
                className="text-sm placeholder-[#5f6163] w-full outline-none bg-transparent py-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowResults(true)}
              />
            </div>
          )}
        </form>

        {/* Mobile Search Bar */}
        <div className="flex md:hidden flex-1 mx-2 min-w-0 justify-center">
          <div className="flex items-center bg-[#edf3f8] rounded-sm w-full max-w-xs mx-auto">
            <MdSearch color="#5f6163" className="w-4 h-4 mr-2 ml-1" />
            <input
              type="text"
              placeholder="Search"
              className="text-sm placeholder-[#5f6163] w-full outline-none bg-transparent py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowResults(true)}
            />
          </div>
        </div>

        {/* Mobile Search Icon (replaces search bar on mobile) */}
        <div className="flex md:hidden items-center ml-14">
          <button
            className="p-2 rounded-full hover:bg-gray-200"
            onClick={() => setShowResults(true)}
            aria-label="Open search"
            type="button"
          >
            <MdSearch color="#5f6163" className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Search Dropdown */}
        {showResults && (
          <div className="fixed inset-0 z-50 flex items-start justify-center md:hidden" style={{ background: "none" }}>
            <div className="bg-white rounded-lg shadow-lg mt-4 w-11/12 max-w-md p-4 relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowResults(false)}
                aria-label="Close search"
                type="button"
              >
                ×
              </button>
              <div className="flex items-center bg-[#edf3f8] rounded-sm w-full">
                <MdSearch color="#5f6163" className="w-5 h-5 mr-2 ml-1" />
                <input
                  type="text"
                  placeholder="Search"
                  className="text-sm placeholder-[#5f6163] w-full outline-none bg-transparent py-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>
              {/* User Results Dropdown (mobile) */}
              {userResults.length > 0 && (
                <div className="mt-2 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  <ul>
                    {userResults.map((user) => (
                      <li
                        key={user._id}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setSearchTerm("");
                          navigate(`/user/${user._id}`);
                          setShowResults(false);
                        }}
                      >
                        <img
                          src={user.profilePicture || "/Images/user.svg"}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="w-8 h-8 rounded-full mr-3"
                        />
                        <div className="text-sm">
                          <p className="font-medium">{`${user.firstName} ${user.lastName}`}</p>
                          {user.company && (
                            <p className="text-xs text-gray-500">{user.company}</p>
                          )}
                          <p className="text-xs text-gray-400">{user.industry}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* User Results Dropdown */}
        {showResults && userResults.length > 0 && currentPath !== "jobs" && (
          <div
            ref={searchRef}
            className="absolute left-0 right-0 mt-2 w-full max-w-xl bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto mx-auto"
            style={{ top: "100%" }}
          >
            <ul>
              {userResults.map((user) => (
                <li
                  key={user._id}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSearchTerm("");
                    navigate(`/user/${user._id}`);
                    setShowResults(false);
                  }}
                >
                  <img
                    src={user.profilePicture || "/Images/user.svg"}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <div className="text-sm">
                    <p className="font-medium">{`${user.firstName} ${user.lastName}`}</p>
                    {user.company && (
                      <p className="text-xs text-gray-500">{user.company}</p>
                    )}
                    <p className="text-xs text-gray-400">{user.industry}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Navigation Icons */}
        <nav className="hidden md:flex space-x-2 ml-2 mr-27">
          {/* Home */}
          <button
            className={`flex flex-col items-center hover:bg-gray-200 p-1.5 rounded-lg w-16 ${
              currentPath === "feed" ? "text-black" : "text-gray-600"
            }`}
            onClick={() => navigate("/feed")}
          >
            <div className="flex flex-col items-center w-full">
              <MdHome
                className={`w-5 h-5 mb-1 ${
                  currentPath === "feed" ? "text-black" : "text-gray-600"
                }`}
              />
              <span className="text-xs">Home</span>
              {currentPath === "feed" && (
                <div className="w-8 h-0.5 bg-black rounded-full mt-1" />
              )}
            </div>
          </button>
          {/* Network */}
          <button
            className={`relative flex flex-col items-center hover:bg-gray-200 p-1.5 rounded-lg w-16 ${
              currentPath === "network" ? "text-black" : "text-gray-600"
            }`}
            onClick={() => navigate("/network")}
          >
            <div className="flex flex-col items-center w-full">
              <BsFillPeopleFill
                className={`w-5 h-5 mb-1 ${
                  currentPath === "network" ? "text-black" : "text-gray-600"
                }`}
              />
              <span className="text-xs">Network</span>
              {/* Pending Invitations Badge */}
              {pendingInvitationsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#cb112d] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                  {pendingInvitationsCount > 99 ? "99+" : pendingInvitationsCount}
                </span>
              )}
              {currentPath === "network" && (
                <div className="w-8 h-0.5 bg-black rounded-full mt-1" />
              )}
            </div>
          </button>
          {/* Jobs */}
          <button
            className={`flex flex-col items-center hover:bg-gray-200 p-1.5 rounded-lg w-16 ${
              currentPath === "jobs" ? "text-black" : "text-gray-600"
            }`}
            onClick={handleJobsClick}
          >
            <div className="flex flex-col items-center w-full">
              <IoBagSharp
                className={`w-5 h-5 mb-1 ${
                  currentPath === "jobs" ? "text-black" : "text-gray-600"
                }`}
              />
              <span className="text-xs">Jobs</span>
              {currentPath === "jobs" && (
                <div className="w-8 h-0.5 bg-black rounded-full mt-1" />
              )}
            </div>
          </button>
          {/* Messaging */}
          <button
            className={`relative flex flex-col items-center hover:bg-gray-200 p-1.5 rounded-lg w-16 ${
              currentPath === "messaging" ? "text-black" : "text-gray-600"
            }`}
            onClick={handleMessagingClick}
          >
            <div className="flex flex-col items-center w-full">
              <IoChatbubbleEllipses
                className={`w-5 h-5 mb-1 ${
                  currentPath === "messaging" ? "text-black" : "text-gray-6"
                }`}
              />
              <span className="text-xs">Messaging</span>
              {currentPath === "messaging" && (
                <div className="w-8 h-0.5 bg-black rounded-full mt-1" />
              )}
              {unreadCountMessages > 0 && (
                <div className="absolute -top-1 left-1/2 ml-3 bg-[#cb112d] text-white rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-[10px] md:text-xs font-medium">
                  {unreadCountMessages > 10 ? "10+" : unreadCountMessages}
                </div>
              )}
            </div>
          </button>
          {/* Notifications */}
          <button
            className={`hover:bg-gray-200 p-1.5 rounded-lg relative flex flex-col items-center w-16 ${
              currentPath === "notifications" ? "text-black" : "text-gray-600"
            }`}
            onClick={handleNotificationsClick}
          >
            <div className="flex flex-col items-center w-full">
              <IoNotifications
                className={`w-5 h-5 mb-1 ${
                  currentPath === "notifications" ? "text-black" : "text-gray-600"
                }`}
              />
              <span className="text-xs">Notifications</span>
              {currentPath === "notifications" && (
                <div className="w-8 h-0.5 bg-black rounded-full mt-1" />
              )}
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-[#cb112d] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                  {unreadCount}
                </div>
              )}
            </div>
          </button>
        </nav>

        {/* User Profile & Work Dropdown (Desktop) */}
        <div className="hidden md:flex space-x-4 items-center ml-2">
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center space-x-2 hover:bg-gray-200 p-2 rounded-lg"
              onClick={() => setShowUser(!showUser)}
            >
              <img
                src={userInfo?.profilePicture}
                alt="User Profile"
                className="w-8 h-8 rounded-full mr-3"
              />
              <img
                src="/Images/down-icon.svg"
                alt="Dropdown"
                className={`w-5 h-5 transition-transform duration-200 ${
                  showUser ? "rotate-180" : ""
                }`}
              />
            </button>

            {showUser && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-200">
                  <div className="flex items-center">
                    <img
                      src={userInfo?.profilePicture}
                      alt="User Profile"
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {userInfo
                          ? `${userInfo.firstName} ${userInfo.lastName}`
                          : "Loading..."}
                      </p>
                      <p className="text-xs text-gray-500">
                        {userInfo?.lastJobTitle || ""}
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
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-200"
                  onClick={handleLogout}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
          <div className="relative" ref={workDropdownRef}>
            <button
              className="flex items-center space-x-2 hover:bg-gray-200 p-2 rounded-lg mr-22"
              onClick={() => setShowWork(!showWork)}
            >
              <img src="/Images/nav-work.svg" alt="Work" className="w-6 h-6" />
              <img
                src="/Images/down-icon.svg"
                alt="Dropdown"
                className={`w-4 h-4 transition-transform duration-200 ${
                  showWork ? "rotate-180" : ""
                }`}
              />
            </button>
            {showWork && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                <button
                  onClick={handleCreateCompany}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Create Company Page
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Icons */}
        <div className="flex md:hidden items-center space-x-2 ml-2">
          <button
            className={`flex flex-col items-center hover:bg-gray-200 p-1.5 rounded-lg w-10 ${
              currentPath === "feed" ? "text-black" : "text-gray-600"
            }`}
            onClick={() => navigate("/feed")}
          >
            <MdHome className="w-5 h-5" />
          </button>
          <button
            className={`flex flex-col items-center hover:bg-gray-200 p-1.5 rounded-lg w-10 ${
              currentPath === "network" ? "text-black" : "text-gray-600"
            }`}
            onClick={() => navigate("/network")}
          >
            <BsFillPeopleFill className="w-5 h-5" />
          </button>
          <button
            className={`flex flex-col items-center hover:bg-gray-200 p-1.5 rounded-lg w-10 ${
              currentPath === "jobs" ? "text-black" : "text-gray-600"
            }`}
            onClick={handleJobsClick}
          >
            <IoBagSharp className="w-5 h-5" />
          </button>
          <button
            className={`flex flex-col items-center hover:bg-gray-200 p-1.5 rounded-lg w-10 ${
              currentPath === "messaging" ? "text-black" : "text-gray-600"
            }`}
            onClick={handleMessagingClick}
          >
            <IoChatbubbleEllipses className="w-5 h-5" />
            {unreadCountMessages > 0 && (
              <span className="absolute top-0 right-0 bg-[#cb112d] text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-medium">
                {unreadCountMessages > 10 ? "10+" : unreadCountMessages}
              </span>
            )}
          </button>
          <button
            className={`flex flex-col items-center hover:bg-gray-200 p-1.5 rounded-lg w-10 ${
              currentPath === "notifications" ? "text-black" : "text-gray-600"
            }`}
            onClick={handleNotificationsClick}
          >
            <IoNotifications className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#cb112d] text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-medium">
                {unreadCount}
              </span>
            )}
          </button>
          {/* User Profile Icon */}
          <button
            className="flex items-center ml-2"
            onClick={() => setShowUser(!showUser)}
          >
            <img
              src={userInfo?.profilePicture}
              alt="User Profile"
              className="w-8 h-8 rounded-full"
            />
          </button>
        </div>
      </div>
      {/* User Dropdown for mobile */}
      {showUser && (
        <div className="md:hidden absolute right-4 top-16 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
          <div className="px-4 py-2 border-b border-gray-200">
            <div className="flex items-center">
              <img
                src={userInfo?.profilePicture}
                alt="User Profile"
                className="w-8 h-8 rounded-full mr-3"
              />
              <div>
                <p className="font-medium text-gray-800">
                  {userInfo
                    ? `${userInfo.firstName} ${userInfo.lastName}`
                    : "Loading..."}
                </p>
                <p className="text-xs text-gray-500">
                  {userInfo?.lastJobTitle || ""}
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
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-200"
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
