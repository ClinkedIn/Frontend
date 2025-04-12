import { useState, useEffect } from "react"; 
import axios from "axios"; 
import { useNavigate, useLocation } from "react-router-dom"; 
import { MdLocationPin,MdSearch } from "react-icons/md";
import Jobs from "../pages/jobs/Jobs";

const Header = ({notifications}) => {
  const [showUser, setShowUser] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0); 
  const [searchQuery, setSearchQuery] = useState("");  
  const [location, setLocation] = useState("");
  const navigate = useNavigate(); 
  const locations = useLocation();
  const currentPath = locations.pathname.split('/')[1];
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await axios.get("/notifications/unseenCount");
        setUnreadCount(response.data.count);
      } catch (error) {
        console.error("Error fetching unread count:", error);
      }
    };

    fetchUnreadCount();
  }, [notifications]);

  // Handler to navigate to notifications page
  const handleNotificationsClick = () => {
    navigate('/notifications');
  };

  // Handler to navigate to jobs page
  const handleJobsClick = () => {
    navigate('/jobs');
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('q',searchQuery);
      if (location) params.append('location', location);
      
      const response = await axios.get(
        `http://localhost:3000/search/jobs?${params}`, 
        
      );
      
      navigate('/job-board', { 
        state: { 
          jobs: response.data,
          searchQuery,
          location,
          currentPath
        } 
      });
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleMessagingClick = () => {
    setTab('messaging')
    navigate('/messaging/');
  }
    
  
  return (
    <header className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-50">
      <div className="flex items-center justify-between max-w-6xl mx-auto px-4 py-2">
        <div className="flex">
          {/* Logo */}
        <a href="/feed">
          <img src="/Images/home-logo.svg" alt="Logo" className="w-8 h-8" />
        </a>
        {/* Search Bar */}
        {currentPath=="jobs" && 
        <form onSubmit={handleSearch} className="flex rounded-lg">
          <div className="flex items-center bg-[#edf3f8] rounded-sm ml-2 ">
           <MdSearch 
           color="#5f6163"
           className="w-4 h-4 mr-2 ml-1"/>
            <input
              type="text"
              placeholder="Title, skill or company"
              className=" text-sm placeholder-[#5f6163] w-[832] "
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center bg-[#edf3f8] rounded-sm ml-2">
          <MdLocationPin 
          color="#5f6163"
          className="w-4 h-4 mr-2 ml-1"/>
            <input
              type="text"
              placeholder="City, state, or zip code"
              className="placeholder-[#5f6163] text-sm w-[832]"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <button type="submit" className="bg-blue-600 ml-1 text-white px-2 py-2 rounded-lg hover:bg-blue-700">
            Search
          </button>
        </form>}
        
        </div>
        
        {/* Navigation Icons */}
        <nav className="flex space-x-6">
          <button className="hover:bg-gray-200 p-2 rounded-lg">
            <img src="/Images/nav-home.svg" alt="Home" className="w-6 h-6" />
          </button>
          <button className="hover:bg-gray-200 p-2 rounded-lg">
            <img src="/Images/nav-network.svg" alt="Network" className="w-6 h-6" />
          </button>

          <button 
            className="hover:bg-gray-200 p-2 rounded-lg"
            onClick={handleJobsClick}
          >
            <img src="/Images/nav-jobs.svg" alt="Jobs" className="w-6 h-6" />
          </button>
          <button className="hover:bg-gray-200 p-2 rounded-lg"
            onClick={handleMessagingClick}
          >
            <img src="/Images/nav-messaging.svg" alt="Messaging" className="w-6 h-6" />
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
              <div className="absolute -top-1 -right-1 bg-[#cb112d] text-white rounded-full 
                w-5 h-5 flex items-center justify-center text-xs font-medium">
                {unreadCount}
              </div>
            )}
          </button>
        </nav>

        {/* User & Work Icons */}
        <div className="flex space-x-4 items-center">
          <button
            className="flex items-center space-x-2 hover:bg-gray-200 p-2 rounded-lg"
            onClick={() => setShowUser(!showUser)}
          >
            <img src="/Images/user.svg" alt="User" className="w-6 h-6 rounded-full" />
            <img src="/Images/down-icon.svg" alt="Dropdown" className="w-4 h-4" />
          </button>

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