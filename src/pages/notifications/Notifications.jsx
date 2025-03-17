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
      return selectedPostFilter === "all" || notif.subType === selectedPostFilter;
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
            <ProfileCard user={dummyUser}  onClick={() => navigate("/ads-page")} />
            <div className="p-4 bg-white mt-2 w-full lg:w-56 shadow-sm rounded-xl border border-gray-300">
              <p className="text-sm font-medium text-gray-800">Manage your notifications</p>
              <a href="#" className="text-[#0a66c2] text-sm font-medium hover:underline">
                View settings
              </a>
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
              ) : (
                <p className="text-gray-500 text-sm p-4">📭 No notifications available.</p>
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
