import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { MdSearch } from "react-icons/md";
import { BASE_URL } from "../constants";
import { db } from "../../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const Header = ({ notifications }) => {
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
  const [currentUser, setUser] = useState();

  // Fetch unread notification count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/notifications/unread-count`, {
          withCredentials: true,
        });
        setUnreadCount(response.data.unreadCount || 0);
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };
    fetchUnreadCount();
  }, [notifications]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/user/me`, {
      
          withCredentials:true
        });
    
        setUser(response.data.user);
        console.log("User data:", response.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();

  }, []);

  useEffect(() => {
    if (!currentUser?._id)
      return;
    const conversationsRef = collection(db, 'conversations');
    const q = query(
      conversationsRef,
      where('participants', 'array-contains', currentUser._id)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let totalUnread = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        let countForUser = data.unreadCounts?.[currentUser._id] || 0;
        if (data.forceUnread) 
          countForUser = countForUser-1 ;
        totalUnread += countForUser;
      });

      console.log("Total unread messages from Firestore:", totalUnread);
      setUnreadCountMessages(totalUnread);

    }, (error) => {
      
      console.error("Error fetching unread message count from Firestore:", error);
      setUnreadCountMessages(0); 
    });
    return () => {
      console.log("Cleaning up Firestore listener for unread messages count.");
      unsubscribe();
    };


  }
, [currentUser?._id]);



  // Close dropdowns when clicking outside
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
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle User Search
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
        const response = await axios.get(`${BASE_URL}/api/user/search`, {
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

  // Handlers
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

  // Submit job search
  const handleJobSearch = async (e) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("q", searchQuery);
      if (location) params.append("location", location);
      const response = await axios.get(`${BASE_URL}/api/search/jobs?${params}`);
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

  return (
    <header className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-50">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex">
          {/* Logo */}
          <a href="/feed">
            <img src="/Images/home-logo.svg" alt="Logo" className="w-8 h-8 min-w-8" />
          </a>

          {/* Conditional Search Bar */}
          <form
            onSubmit={handleJobSearch}
            className="relative flex rounded-lg"
          >
            {/* Show Job Search only on /jobs */}
            {currentPath === "jobs" ? (
              <>
                <div className="flex items-center bg-[#edf3f8] rounded-sm ml-2">
                  <MdSearch color="#5f6163" className="w-4 h-4 mr-2 ml-1" />
                  <input
                    type="text"
                    placeholder="Title, skill or company"
                    className="text-sm placeholder-[#5f6163] w-full outline-none bg-transparent py-2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center bg-[#edf3f8] rounded-sm ml-2">
                  <input
                    type="text"
                    placeholder="City, state, or zip code"
                    className="text-sm placeholder-[#5f6163] w-full outline-none bg-transparent py-2"
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
              // Show User Search everywhere else
              <div className="flex items-center bg-[#edf3f8] rounded-sm ml-2">
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

          {/* User Results Dropdown */}
          {showResults && userResults.length > 0 && currentPath !== "jobs" && (
            <div
              ref={searchRef}
              className="absolute top-full mt-12 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto"
            >
              <ul>
                {userResults.map((user) => (
                  <li
                    key={user._id}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSearchTerm("");
                      navigate(`/profile/${user._id}`);
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
                      {user.company && <p className="text-xs text-gray-500">{user.company}</p>}
                      <p className="text-xs text-gray-400">{user.industry}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Navigation Icons */}
        <nav className="flex space-x-6">
          <button
            className="hover:bg-gray-200 p-2 rounded-lg"
            onClick={() => navigate("/feed")}
          >
            <img src="/Images/nav-home.svg" alt="Home" className="w-6 h-6 min-w-6" />
          </button>
          <button
            className="hover:bg-gray-200 p-2 rounded-lg"
            onClick={() => navigate("/network")}
          >
            <img src="/Images/nav-network.svg" alt="Network" className="w-6 h-6 min-w-6" />
          </button>
          <button
            className="hover:bg-gray-200 p-2 rounded-lg"
            onClick={handleJobsClick}
          >
            <img src="/Images/nav-jobs.svg" alt="Jobs" className="w-6 h-6 min-w-6" />
          </button>
          <button className="relative flex flex-col items-center text-xs text-gray-600 hover:text-black p-1" onClick={handleMessagingClick}>
            <img src="/Images/nav-messaging.svg" alt="Messaging" className="w-6 h-6" />
            {unreadCountMessages > 0 && (
              <div className="absolute -top-1 left-1/2 ml-1 bg-[#cb112d] text-white rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-[10px] md:text-xs font-medium">
                {unreadCountMessages > 10 ? '10+' : unreadCountMessages} 
              </div>
            )}
          </button>
          <button
            className="hover:bg-gray-200 p-2 rounded-lg relative"
            onClick={handleNotificationsClick}
          >
            <img
              src="/Images/nav-notifications.svg"
              alt="Notifications"
              className="w-6 h-6 min-w-6"
            />
            {unreadCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-[#cb112d] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                {unreadCount}
              </div>
            )}
          </button>
        </nav>

        {/* User & Work Dropdowns */}
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
                      <p className="text-xs text-gray-500">Software Developer</p>
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
              </div>
            )}
          </div>
          <button className="flex items-center space-x-2 hover:bg-gray-200 p-2 rounded-lg">
            <img src="/Images/nav-work.svg" alt="Work" className="w-6 h-6" />
            <img src="/Images/down-icon.svg" alt="Dropdown" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;