import { useState, useEffect } from "react"; // Add useEffect import
import axios from "axios"; // Add axios import

const Header = ({notifications}) => {
  const [showUser, setShowUser] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0); 


  // Add useEffect to fetch unread count
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
  return (
    <header className="fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-50">
      <div className="flex items-center justify-between max-w-6xl mx-auto px-4 py-2">
        {/* Logo */}
        <a href="/feed">
          <img src="/Images/home-logo.svg" alt="Logo" className="w-8 h-8" />
        </a>

        {/* Navigation Icons */}
        <nav className="flex space-x-6">
          <button className="hover:bg-gray-200 p-2 rounded-lg">
            <img src="/Images/nav-home.svg" alt="Home" className="w-6 h-6" />
          </button>
          <button className="hover:bg-gray-200 p-2 rounded-lg">
            <img src="/Images/nav-network.svg" alt="Network" className="w-6 h-6" />
          </button>
          <button className="hover:bg-gray-200 p-2 rounded-lg">
            <img src="/Images/nav-jobs.svg" alt="Jobs" className="w-6 h-6" />
          </button>
          <button className="hover:bg-gray-200 p-2 rounded-lg">
            <img src="/Images/nav-messaging.svg" alt="Messaging" className="w-6 h-6" />
          </button>
          {/* Notifications Icon with Badge */}
        <button className="hover:bg-gray-200 p-2 rounded-lg relative">
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
