import React, { useState, useEffect } from "react";
import Header from "../../components/UpperNavBar";
import ProfileCard from "../../components/ProfileCard";
import { useNavigate } from "react-router-dom";
import NotificationCard from "../../components/Notification/NotificationCard"
import axios from "axios";
import FooterLinks from "../../components/FooterLinks";

const Notification = () => {
  const navigate = useNavigate();
  
  const dummyUser = {
    name: "Hamsa Saber",
    location: "Cairo, Egypt",
    university: "Cairo University",
    profileImage: "https://picsum.photos/80",
  };

  const [notifications, setNotifications] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isArrowVisible, setIsArrowVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPostFilter, setSelectedPostFilter] = useState("all");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5173/notifications"
        );
        setNotifications(response.data); // Set fetched notifications
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);
  console.log(notifications)

  // Reset My Posts label when a different main category is selected
  const handleMainFilterChange = (filter) => {
    setSelectedFilter(filter);
    setIsArrowVisible(false);
    setIsDropdownOpen(false);

    // Reset My Posts when switching categories
    if (filter !== "post") {
      setSelectedPostFilter("all");
    }
  };

  // Mapping filter names for display
  const postFilterLabels = {
    all: "My Posts",
    comments: "My Posts | Comments",
    reactions: "My Posts | Reactions",
    reposts: "My Posts | Reposts",
  };

  // Filter Notifications
  const filteredNotifications = notifications.filter((notif) => {
    if (selectedFilter === "all") return true;
  
    if (selectedFilter === "post") {
      return selectedPostFilter === "all" 
        ? notif.type === "post"  
        : notif.subType === selectedPostFilter;
    }
  
    return notif.type === selectedFilter;
  });
  return (
    <div className="bg-[#f4f2ee] min-h-screen ">
      <Header />
      <div className="container mx-auto px-4 pt-20 md:pl-[172px] md:pr-[172px]">
        <div className="flex flex-col lg:flex-row justify-center gap-6 p-2">
          
          {/* Left Sidebar */}
          <div className="w-full lg:w-56 flex flex-col">
            <div  
            className="cursor-pointer"
            onClick={() => navigate("/profile")}><ProfileCard user={dummyUser}  /></div>
            <div className="p-4 bg-white mt-2 w-full lg:w-56 shadow-sm rounded-xl border border-gray-300">
              <p className="text-sm font-medium text-gray-800">Manage your notifications</p>
              <button  
              onClick={()=>navigate("/profile")}
              className="text-[#0a66c2] text-sm font-medium hover:underline" >  View settings</button>
            </div>
          </div>
  
          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            {/* Filter Section */}
            <div className="bg-white p-4 shadow-sm rounded-lg border border-gray-300 mb-3 flex flex-wrap space-x-2">
              {["all", "job", "post", "mention"].map((filter) => (
                <div key={filter} className="relative">
                  {filter === "post" ? (
                    <button
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
                    <button
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
                      {["all", "comments", "reactions", "reposts"].map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setSelectedPostFilter(option);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm flex items-center  ${
                            selectedPostFilter === option
                              ? " text-black  border-l-2 border-[#004c33]"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {option === "all" ? "All" :
                            option === "comments" ? "Comments" :
                            option === "reactions" ? "Reactions" : "Reposts"}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
  
            {/* Notifications List */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-300">
            {filteredNotifications.length > 0 ? (
                <ul>
                  {filteredNotifications.map((notif) => (
                    <NotificationCard key={notif.id} notification={notif} />
                  ))}
                </ul>
              ) : selectedFilter === "job" ? (
                <div className="flex items-center flex-col">
                  <img
                  src="no new notif.png"
                  alt="No New Notifications"
                  className="w-72 h-72 object-cover rounded-md "
                  />
                  <p className="font-semibold text-2xl">No new job notifications</p>
                  <p>When you receive new job updates, notifications will appear here.</p>
                  <button className="m-2  mb-4  px-4 py-2 cursor-pointer text-[#0a66c2] border-2 border-[#0a66c2] rounded-3xl hover:bg-[#ebf4fd] hover:border-4" onClick={() => navigate("/jobs")}>Explore more jobs</button>
                </div>
              ) : selectedFilter === "post" ? (
                <div className="flex items-center flex-col">
                  <img
                  src="no new notif.png"
                  alt="No New Notifications"
                  className="w-72 h-72 object-cover rounded-md "
                  />
                  <p className="font-semibold text-2xl">No new post activities</p>
                  <p>View your previous post activity on your profile.</p>
                  <button className="m-2 mb-4 px-4 py-2 cursor-pointer text-[#0a66c2] border-2 border-[#0a66c2] rounded-3xl hover:bg-[#ebf4fd] hover:border-4 " onClick={() => navigate("/profile")}>View previous activity</button>
                </div>
              ) : selectedFilter === "mention" ? (
                <div className="flex items-center flex-col">
                  <img
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
  
          {/*Ad Section */}
          <div className="w-full lg:w-72">
            <div className="shadow-sm rounded-lg border border-gray-300">
              <img
                src="/ads.png"
                alt="Ad Banner"
                className="w-full rounded-lg cursor-pointer"
                onClick={() => navigate("/ads-page")}
              />
            </div>
  
            {/* Footer Links */}
              <FooterLinks/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
