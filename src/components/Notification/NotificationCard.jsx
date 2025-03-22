import React, { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { FaBell, FaThumbsDown } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NotificationCard = ({ notification, handleNotificationClick }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isRead, setIsRead] = useState(notification.isRead || false);
  const [message, setMessage] = useState(null);
  const [removedNotification, setRemovedNotification] = useState(null);
  const navigate = useNavigate();

  const handleClick = async () => {
    if (!message) {
      setIsRead(true);
      console.log("handleClick");
      await handleNotificationClick(notification.id);
    }
  };

  // Delete Notification
  const handleDeleteNotification = async (id) => {
    try {
      await axios.delete(`/notifications/${id}`);
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
      await axios.post("/notifications/restore", removedNotification);

      // Update UI
      setMessage(null);
      setRemovedNotification(null);
    } catch (error) {
      console.error("Undo failed:", error);
      setMessage("Failed to undo.");
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
                  src={notification.profileImg}
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
                {/* Change notification preferences */}
                <button
                  id="Preferences-Button"
                  className="flex items-center w-full p-2 hover:bg-gray-100 rounded-md"
                >
                  <FaBell className="mr-2 text-gray-600" />
                  Change notification preferences
                </button>

                {/* Delete button */}
                <button
                  id="Delete-Button"
                  className="flex items-center w-full p-2 hover:bg-gray-100 rounded-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMessage("Notification deleted.");
                    handleDeleteNotification(notification.id);
                    setShowMenu(false);
                  }}
                >
                  <MdDelete className="mr-2 text-gray-600" />
                  Delete notification
                </button>

                {/* Show less button */}
                <button
                  id="Show-Less-Button"
                  className="flex items-center w-full p-2 hover:bg-gray-100 rounded-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMessage(
                      "Thanks. Your feedback helps us improve your notifications."
                    );
                    setShowMenu(false);
                    handleDeleteNotification(notification.id);
                  }}
                >
                  <FaThumbsDown className="mr-2 text-gray-600" />
                  Show less like this
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
