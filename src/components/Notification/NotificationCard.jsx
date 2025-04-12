import React, { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { FaBell, FaThumbsDown } from "react-icons/fa";
import { MdMarkChatUnread } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NotificationCard = ({ notification, handleNotificationClick }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isRead, setIsRead] = useState(notification.isRead || false);
  const [message, setMessage] = useState(null);
  const [removedNotification, setRemovedNotification] = useState(null);
  const [isMuted, setIsMuted] = useState(notification.isMuted || false);
  const [showDurationMenu, setShowDurationMenu] = useState(false);
  const navigate = useNavigate();

  const handleClick = async () => {
    if (!message) {
      setIsRead(true);
      // navigate('/notification-post')
      console.log("handleClick");
      await handleNotificationClick(notification.id);
    }
  };

  // Delete Notification
  const handleDeleteNotification = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/notifications/${id}`,{withCredentials:true});
      setRemovedNotification(notification);
      console.log("Notification deleted");
    } catch (error) {
      console.error("Error deleting notification:", error);
      setMessage("Failed to delete notification.");
    }
  };

  // Undo delete
  const handleUndo = async (e) => {
    e.stopPropagation(); // Prevent triggering handleClick

    try {
      // Restore the notification in the backend
      await axios.patch(`http://localhost:3000/notifications/restore-notification/${removedNotification._id}`,{},{
      
        withCredentials:true
      });

      // Update UI
      setMessage(null);
      setRemovedNotification(null);
    } catch (error) {
      console.error("Undo failed:", error);
      setMessage("Failed to undo.");
    }
  };

  const handleMuteDuration = async (duration) => {
    try {
     const response= await axios.patch(
        `http://localhost:3000/notifications/pause-notifications`,
        { duration },
        { withCredentials: true }
      );
      console.log("mute response:", response)
      console.log("duration:",duration)
      setIsMuted(true);
      setShowDurationMenu(false);
      setShowMenu(false);
    } catch (error) {
      console.error("Failed to mute notifications:", error);
    }
  };

  const handleUnmute = async (e) => {
    e.stopPropagation();
    try {
      const response=await axios.patch(
        `http://localhost:3000/notifications/resume-notifications`,
        {},
        { withCredentials: true }
      );
console.log("unmute response:", response)
      setIsMuted(false);
      setShowMenu(false);
    } catch (error) {
      console.error("Failed to unmute:", error);
    }
  };

  return (
    <div className="relative">
      <div
        onClick={handleClick}
        id="Mark-Read"
        className={`flex items-center justify-between p-3 cursor-pointer transition-all ${
          isRead ? "bg-white hover:bg-gray-300" : "bg-blue-100 hover:bg-blue-200"
        }`}
      >
        {message ? (
          <div className="w-full flex justify-between items-center">
            {/* Displays the action message (delete or show less) */}
            <p className="text-sm text-gray-800">{message}</p>
            <button
              id="Undo"
              className="text-blue-600 text-sm font-medium hover:underline"
              onClick={handleUndo}
            >
              Undo
            </button>
          </div>
        ) : (
          <>
            <div id="Notification-Click" className="flex items-start space-x-3 cursor-pointer max-w-md">
              {/* Blue dot is removed if notification is read */}
              {!isRead && <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>}

              {/* Displaying notification content */}
              <div className="relative w-10 h-10 bg-gray-200 flex items-center justify-center">
                <img
                  id="Notification-Img"
                  src={notification.sendingUser?.profilePicture??""}
                  alt="image"
                  className="w-10 h-10 rounded-md"
                />
              </div>
              <p id="Notification-Content" className="text-sm max-w-sm text-gray-800">
                {notification.content}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Three-Dot Menu */}
      {!message && (
        <div className="absolute top-0 right-0 ">
          <div className="relative">
            <button
              id="Notification-Menu"
              className="p-2 rounded-full hover:bg-gray-200 transition"
              onClick={() => setShowMenu(!showMenu)}
            >
              <BsThreeDots size={18} />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white shadow-md rounded-md p-2 z-50">
                {/* Mute/Unmute Button */}
                {isMuted ? (
                  <button
                    id="Unmute-Button"
                    className="flex items-center w-full p-2 hover:bg-gray-100 rounded-md"
                    onClick={handleUnmute}
                  >
                    <FaBell className="mr-2 text-gray-600" />
                    Unmute Notifications
                  </button>
                ) : (
                  <div className="relative">
                    <button
                      id="Mute-Button"
                      className="flex items-center w-full p-2 hover:bg-gray-100 rounded-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDurationMenu(!showDurationMenu);
                      }}
                    >
                      <FaBell className="mr-2 text-gray-600" />
                      Mute Notifications
                    </button>

                    {showDurationMenu && (
                      <div className="ml-6 mt-1 bg-white border border-gray-200 rounded-md shadow-md w-40 z-50">
                        {["1h", "2h", "3h"].map((duration) => (
                          <button
                            key={duration}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMuteDuration(duration);
                            }}
                          >
                            {duration}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Delete button */}
                <button
                  id="Delete-Button"
                  className="flex items-center w-full p-2 hover:bg-gray-100 rounded-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMessage("Notification deleted.");
                    handleDeleteNotification(notification._id);
                    setShowMenu(false);
                  }}
                >
                  <MdDelete className="mr-2 text-gray-600" />
                  Delete notification
                </button>

               {/* Mark as Unread button */}
                <button
                  id="Show-Less-Button"
                  className="flex items-center w-full p-2 hover:bg-gray-100 rounded-md"
                  onClick={async (e) => {
                    e.stopPropagation();
                    setShowMenu(false);

                    if (isRead) {
                      try {
                        await axios.patch(
                          `http://localhost:3000/notifications/mark-unread/${notification._id}`,
                          {},
                          { withCredentials: true }
                        );
                        setIsRead(false);
                        console.log("Notification marked as unread");
                      } catch (error) {
                        console.error("Failed to mark as unread:", error);
                        setMessage("Failed to mark as unread.");
                      }
                    }
                  }}
                >
                  <MdMarkChatUnread className="mr-2 text-gray-600" />
                  Mark as Unread
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCard;
