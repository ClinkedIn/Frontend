import React, { useState, useEffect } from "react";
import Header from "../../components/UpperNavBar";
import ProfileCard from "../../components/ProfileCard";
import { useNavigate } from "react-router-dom";
import NotificationCard from "../../components/Notification/NotificationCard"
import axios from "axios";
import FooterLinks from "../../components/FooterLinks";
import { patchRequest } from "../../services/axios";
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { BASE_URL } from "../../constants";

// import { getMessaging, getToken } from 'firebase/messaging';
// import { app } from '../../../firebase'; 



/**
 * The Notification component is responsible for displaying and managing user notifications.
 * It supports filtering notifications by category, marking them as read, and sending test notifications.
 * It fetches notifications and user data from an API and displays them accordingly.
 * 
 * @component
 * @example
 * // Usage
 * <Notification />
 */
const Notification = () => {

  
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isArrowVisible, setIsArrowVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPostFilter, setSelectedPostFilter] = useState("all");
  const [user, setUser] = useState();

  // async function requestFCMToken() {
  //   try {
  //     const messaging = getMessaging(app);
  //     {
  //       const fcmToken = await getToken(messaging, { 
  //         vapidKey: 'BKQc38HyUXuvI_yz5hPvprjVjmWrcUjTP2H7J_cjGoyMMoBGNBbC0ucVGrzM67rICMclmUuOx-mdt7CXlpnhq9g' // From Firebase Console > Cloud Messaging
  //       });
  //       if (fcmToken) {
  //         console.log('FCM Token:', fcmToken);
          
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error getting token:', error);
  //   }
  // }
  // useEffect(() => {
  //   requestFCMToken();
  // }, []);

  const testLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/user/login', {
        email: "Sidney55@gmail.com",
        password: "password123"
      },{
        withCredentials:true
      }
      
    );

      console.log("Login Response:", response.data);
    } catch (error) {
      if (error.response) {
  
        console.error("Login Error - Server Response:", error.response.data);
      } else if (error.request) {
        // Request made but no response received
        console.error("Login Error - No Response:", error.request);
      } else {
        // Something else happened
        console.error("Login Error:", error.message);
      }
    }
  };

  /**
   * Sends a test notification to the backend and shows a toast notification in the app.
   * 
   * @async
   * @function handleSendTestNotification
   */
  const handleSendTestNotification = async () => {
    try {
      // Send to backend (mock)
      const response = await axios.post('/api/send-notification', {
      title: "Test Notification",
        body: "This is a test notification!",
      });
      await fetchNotifications();
  
      // Show in-app toast
      toast.success('New notification received!', {
        
        duration: 4000,
      });
  
    } catch (error) {
      toast.error('Failed to send notification');
      console.error("Error sending notification:", error);
    }
  };
 /**
   * Fetches notifications from the backend and updates the state.
   * 
   * @async
   * @function fetchNotifications
   */
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/notifications",
        {withCredentials:true}
      );
      console.log("notifications:",response.data)
      setNotifications(response.data); // Set fetched notifications
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };
/**
   * Marks a notification as read when clicked.
   *
   * @async
   * @function handleNotificationClick
   * @param {string} id - The ID of the notification to be marked as read.
   */
 //Mark Notification as read
  const handleNotificationClick = async (id) => {
    const response = await axios.patch(
      `${BASE_URL}/api/notifications/mark-read/${id}`,
      {},
      { withCredentials: true }
    );

    if (response?.status === 200) {
        console.log('Updated notification');
        setNotifications(notifications.map(notification =>
            notification._id === id ? { ...notification, isRead: true } : notification
        ));
    } else {
        console.error('Failed to update notification', response);
    }
};
/**
 * Fetches the user data from the backend and updates the state.
 * 
 * @async
 * @function fetchUser
 */
  const fetchUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/user/me`, {
      
          withCredentials:true
        });
    
        setUser(response.data);
        console.log("User data:", response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
  
  /**
   * useEffect hook for executing login, fetching user data, and notifications.
   * It triggers login and fetch data operations on component mount.
   * 
   * @function
   * @hook
   */
  useEffect(() => {
    // const loginAndFetchData = async () => {
    //   await testLogin(); // Ensure login is completed first
    fetchUser();
    fetchNotifications();
  // }
  //   loginAndFetchData()
  }, []);
 /**
   * Handles the change in the main notification filter.
   * Resets post filter and closes dropdown when switching to a different category.
   * 
   * @function handleMainFilterChange
   * @param {string} filter - The selected filter for notifications.
   */
  // Reset My Posts label when a different main category is selected
  const handleMainFilterChange = (filter) => {
    setSelectedFilter(filter);
    setIsArrowVisible(false);
    setIsDropdownOpen(false);

    // Reset My Posts when switching categories
    if (filter !== "post") {
      setSelectedPostFilter("all");
      console.log(notifications)
    }
  };

  // Mapping filter names for display
  const postFilterLabels = {
    all: "My Posts",
    comments: "My Posts | Comments",
    impressions: "My Posts | impressions",
    reposts: "My Posts | Reposts",
  };
/**
   * Filters notifications based on the selected main filter and post filter.
   * 
   * @function filteredNotifications
   * @returns {Array} - The filtered notifications based on user selection.
   */
  // Filter Notifications
  const filteredNotifications = notifications.filter((notif) => {
    if (selectedFilter === "all") return true;
  
    if (selectedFilter === "post") {
      return selectedPostFilter === "all" 
        ? notif.subject === "post"  
        : notif.subject === selectedPostFilter;
    }
  
    return notif.subject === selectedFilter;
  });
  return (
    <div className="bg-[#f4f2ee] min-h-screen ">


<Toaster position="top-right"/>

      <Header notifications={notifications}/>
      <div className="container px-4 pt-20 ">
        <div className="flex flex-col lg:flex-row justify-center gap-6 p-2">
          
          {/* Left Sidebar */}
          <div className="w-full lg:w-56 flex flex-col">
            <div 
            id="Profile-Card" 
            className="cursor-pointer"
            onClick={() => navigate("/profile")}><ProfileCard user={user}  /></div>
            <div className="p-4 bg-white mt-2 w-full lg:w-56 shadow-sm rounded-xl border border-gray-300">
              <p className="text-sm font-medium text-gray-800">Manage your notifications</p>
              <button 
              id="Notification-Settings" 
              onClick={()=>navigate("/profile")}
              className="text-[#0a66c2] text-sm font-medium hover:underline" >  View settings</button>
            </div>
            <div className="w-full lg:w-72">
            <button
              onClick={handleSendTestNotification}
              className=" mb-4 p-2 bg-[#004c33] text-white rounded-lg hover:bg-[#003825] transition-colors"
            >
              Send Test Notification
            </button>

          </div>
          </div>
  
          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            {/* Filter Section */}
            <div className="bg-white p-4 shadow-sm rounded-lg border border-gray-300 mb-3 flex flex-wrap space-x-2">
              {["all", "job", "post", "mention"].map((filter) => (
                <div 
                id="Filter-Tabs"
                key={filter} >
                  {/*if user clicks post: post-notif are shown then clicked again: menu is shown */}
                  {filter === "post" ? (
                    <button
                    id="Post-Tabs"
                      onClick={() => {
                        if (!isArrowVisible) {
                          setIsArrowVisible(true);
                        } else {
                          setIsDropdownOpen(!isDropdownOpen);
                        }
                        setSelectedFilter("post");
                      }}
                      className={`px-4 py-1 rounded-full text-sm font-medium transition-all border flex items-center gap-1 ${
                        selectedFilter === "post"
                          ? "bg-[#004c33] text-white"
                          : "border-gray-400 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {postFilterLabels[selectedPostFilter]} {isArrowVisible && "▼"}
                    </button>
                  ) : (
                    //Other Notification types filtering
                    <button
                    id="Other-Tabs"
                      onClick={() => handleMainFilterChange(filter)}
                      className={`px-4 py-1 rounded-full text-sm font-medium transition-all border ${
                        selectedFilter === filter
                          ? "bg-[#004c33] text-white"
                          : "border-gray-400 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {filter === "all" ? "All" :
                        filter === "job" ? "Jobs" :
                        filter === "post" ? "My Posts" : "Mentions"}
                    </button>
                  )}
  
                  {/* Dropdown Menu for My Posts */}
                  {isDropdownOpen && filter === "post" && (
                    <div className="absolute bg-white shadow-lg rounded-md border border-gray-200 w-40 z-10">
                      <p className="px-3 py-2 text-sm font-semibold">Filter post activity</p>
                      {["all", "comments", "impressions", "reposts"].map((option) => (
                        <button
                        id="Post-Types"
                          key={option}
                          onClick={() => {
                            setSelectedPostFilter(option);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm flex items-center  ${
                            //Changes My Posts filter to include the selected type
                            selectedPostFilter === option
                              ? " text-black  border-l-2 border-[#004c33]"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {option === "all" ? "All" :
                            option === "comments" ? "Comments" :
                            option === "impressions" ? "Reactions" : "Reposts"}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
  
            {/* Notifications List */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-300">
              {/*Displays the filtered notifications */}
            {filteredNotifications.length > 0 ? (
                <ul 
               
                id="Notification-Card">
                  {filteredNotifications.map((notif) => (
                    <NotificationCard key={notif._id} notification={notif} handleNotificationClick={()=>handleNotificationClick(notif._id)} />
                  ))}
                </ul>
                //Handles if Tab doesnt have any notifications
              ) : 
              //Jobs
              selectedFilter === "job" ? (
                <div className="flex items-center flex-col">
                  <img id="No notif img"
                  src="no new notif.png"
                  alt="No New Notifications"
                  className="w-72 h-72 object-cover rounded-md "
                  />
                  <p className="font-semibold text-2xl">No new job notifications</p>
                  <p>When you receive new job updates, notifications will appear here.</p>
                  <button 
                  id="Explore-Jobs"
                  className="m-2  mb-4  px-4 py-2 cursor-pointer text-[#0a66c2] border-2 border-[#0a66c2] rounded-3xl hover:bg-[#ebf4fd] hover:border-4" 
                  onClick={() => navigate("/jobs")}>Explore more jobs</button>
                </div>
              ) : 
              //Post
              selectedFilter === "post" ? (
                <div className="flex items-center flex-col">
                  <img
                  id="No notif img"
                  src="no new notif.png"
                  alt="No New Notifications"
                  className="w-72 h-72 object-cover rounded-md "
                  />
                  <p className="font-semibold text-2xl">No new post activities</p>
                  <p>View your previous post activity on your profile.</p>
                  <button className="m-2 mb-4 px-4 py-2 cursor-pointer text-[#0a66c2] border-2 border-[#0a66c2] rounded-3xl hover:bg-[#ebf4fd] hover:border-4 "
                  id="View-Activity"
                  onClick={() => navigate("/profile")}>View previous activity</button>
                </div>
              ) : 
              //Mention
              selectedFilter === "mention" ? (
                <div className="flex items-center flex-col">
                  <img
                  id="No notif img"
                  src="no new notif.png"
                  alt="No New Notifications"
                  className="w-72 h-72 object-cover rounded-md "
                  />
                  <p className="font-semibold text-2xl">No new mentions</p>
                  <p className="m-4 ">When someone tags you in a post or comment, that notification will appear here.</p>
                </div>
              ) : (
                <div className="text-center">
                  <img src="no new notif.png" alt="No New Notifications" className="w-full h-full object-cover rounded-md" />
                  <p>No New Notifications</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
