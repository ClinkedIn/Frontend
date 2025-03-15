import React, { useState } from "react";
import Header from "../../components/UpperNavBar";
import ProfileCard from "../../components/ProfileCard";
import { useNavigate } from "react-router-dom";
import NotificationCard from "../../components/Notification/NotificationCard"

const Notification = () => {
  const navigate = useNavigate();
  
  const dummyUser = {
    name: "Hamsa Saber",
    location: "Cairo, Egypt",
    university: "Cairo University",
    profileImage: "https://via.placeholder.com/80",
  };

  const allNotifications = [
    { id: 1, type: "job", text: "New job opportunity at Google!" },
    { id: 2, type: "post", subType: "all", text: "Marwan Bassam added a new post." },
    { id: 3, type: "mention", text: "You were mentioned in a comment." },
    { id: 4, type: "job", text: "Amazon is hiring software engineers." },
    { id: 5, type: "post", subType: "comments", text: "Someone commented on your post." },
    { id: 6, type: "post", subType: "reactions", text: "Your post received new likes." },
    { id: 7, type: "post", subType: "reposts", text: "Your post was shared by Ahmed." },
  ];

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isArrowVisible, setIsArrowVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPostFilter, setSelectedPostFilter] = useState("all");

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
  const filteredNotifications = allNotifications.filter((notif) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "post") {
      return selectedPostFilter === "all" || notif.subType === selectedPostFilter;
    }
    return notif.type === selectedFilter;
  });

  return (
    <div className="bg-yellow-50 min-h-screen">
      <Header />
      <div className="pt-20 flex justify-center p-6">
        <div className="flex w-full max-w-6xl gap-6">
          {/* Left Sidebar */}
          <div className="w-56 flex flex-col">
            <ProfileCard user={dummyUser} />
            <div className="p-4 bg-white mt-2 w-56 shadow-sm rounded-xl border border-gray-300">
              <p className="text-sm font-medium text-gray-800">Manage your notifications</p>
              <a href="#" className="text-blue-600 text-sm font-medium hover:underline">
                View settings
              </a>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Filter Section */}
            <div className="bg-white p-4 shadow-sm rounded-lg border border-gray-300 mb-3 flex space-x-2">
              {["all", "job", "post", "mention"].map((filter) => (
                <div key={filter} className="relative">
                  {filter === "post" ? (
                    <button
                      onClick={() => {
                        if (!isArrowVisible) {
                          setIsArrowVisible(true); // Show arrow after first click
                        } else {
                          setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown on second click
                        }
                        setSelectedFilter("post");
                      }}
                      className={`px-4 py-1 rounded-full text-sm font-medium transition-all border flex items-center gap-1 ${
                        selectedFilter === "post"
                          ? "bg-green-700 text-white"
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
                          ? "bg-green-700 text-white"
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
                    <div className="absolute left-0 mt-1 bg-white shadow-lg rounded-md border border-gray-200 w-40 z-10">
                      <p className="px-3 py-2 text-xs text-gray-600">Filter post activity</p>
                      {["all", "comments", "reactions", "reposts"].map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setSelectedPostFilter(option);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm flex items-center ${
                            selectedPostFilter === option
                              ? "font-bold text-black"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <div
                            className={`w-1 h-4 mr-2 ${
                              selectedPostFilter === option ? "bg-green-700" : "bg-transparent"
                            }`}
                          />
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
            <div className="flex-1 bg-white shadow-sm rounded-lg border-2 border-gray-300">
            {filteredNotifications.length > 0 ? (
                  <ul >
                    {filteredNotifications.map((notif) => (
                      <NotificationCard key={notif.id} notification={notif} />
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">📭 No notifications available.</p>
                )}
            </div>
          </div>

          {/* Right Sidebar (Ad Section) */}
          <div>
            <div className="w-72 shadow-sm rounded-lg border border-gray-300">
              <img
                src="/ads.png"
                alt="Ad Banner"
                className="w-72 rounded-lg cursor-pointer"
                onClick={() => navigate("/ads-page")}
              />
            </div>
             {/* Footer Links */}
      <div className="text-xs text-gray-500 space-y-2 text-center mt-6">
        <div className="flex justify-center flex-wrap gap-x-4">
          <a href="#" className="hover:underline hover:text-blue-600">About</a>
          <a href="#" className="hover:underline hover:text-blue-600">Accessibility</a>
          <a href="#" className="hover:underline hover:text-blue-600">Help Center</a>
        </div>
        <div className="flex justify-center flex-wrap gap-x-4">
          <a href="#" className="hover:underline hover:text-blue-600">Privacy & Terms</a>
          <a href="#" className="hover:underline hover:text-blue-600">Ad Choices</a>
        </div>
        <div className="flex justify-center flex-wrap gap-x-4">
          <a href="#" className="hover:underline hover:text-blue-600">Advertising</a>
          <a href="#" className="hover:underline hover:text-blue-600">Business Services</a>
        </div>
        <div className="flex justify-center flex-wrap gap-x-4">
          <a href="#" className="hover:underline hover:text-blue-600">Get the LinkedIn app</a>
          <a href="#" className="hover:underline hover:text-blue-600">More</a>
        </div>
        <p className="text-gray-600 mt-2">© 2025 LinkedIn Corporation</p>
      </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
