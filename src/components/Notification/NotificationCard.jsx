import React, { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { FaBell, FaThumbsDown } from "react-icons/fa";
import { MdMarkChatUnread } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../constants";

/**
 * NotificationCard component that displays a notification with options to mark as read, mute, delete, or restore.
 *
 * @component
 * @example
 * const notification = {
 *   id: '123',
 *   isRead: false,
 *   isMuted: false,
 *   sendingUser: { profilePicture: 'path/to/image.jpg' },
 *   content: 'Sample notification content'
 * };
 * <NotificationCard notification={notification} handleNotificationClick={handleClick} />
 *
 * @param {Object} props - Component props.
 * @param {Object} props.notification - The notification object containing details such as content, read status, and user details.
 * @param {Function} props.handleNotificationClick - Function to be triggered when the notification is clicked.
 *
 * @returns {JSX.Element} The rendered notification card.
 */
const NotificationCard = ({ notification, handleNotificationClick, onRefresh}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isRead, setIsRead] = useState(notification.isRead || false);
  const [message, setMessage] = useState(null);
  const [removedNotification, setRemovedNotification] = useState(null);
  const [isMuted, setIsMuted] = useState(notification.isMuted || false);
  const [showDurationMenu, setShowDurationMenu] = useState(false);
  const navigate = useNavigate();

  /**
   * Handles the click event for a notification card.
   * Marks the notification as read if there is no associated message,
   * logs the click event, and triggers the notification click handler.
   *
   * @async
   * @function handleClick
   * @returns {Promise<void>} Resolves when the notification click handling is complete.
   */
  const name = `${notification?.sendingUser.firstName} ${notification?.sendingUser.lastName}`
  const handleClick = async () => {
    if (!message) {
      setIsRead(true);
      if(notification.subject==="comment"||notification.subject==="impression"){
      navigate('/feed',{
        state:{ resourceId:notification.relatedPostId, notification:notification
        }
      })}
      else if(notification.subject==="connection request"){
        navigate('/network')
      }
      else if(notification.subject==="message"){  
        navigate('/messaging',{
          state: { _id: notification.from, fullName: name, profilePicture:notification.sendingUser.profilePicture },
        })

      }
      console.log("handleClick");
      await handleNotificationClick(notification.id);
    }
  };

  /**
   * Deletes a notification by its ID.
   *
   * Sends a DELETE request to the server to remove the specified notification.
   * If successful, updates the state with the removed notification and logs a success message.
   * If an error occurs, logs the error and sets an error message in the state.
   *
   * @async
   * @function handleDeleteNotification
   * @param {string} id - The ID of the notification to be deleted.
   * @returns {Promise<void>} A promise that resolves when the notification is deleted.
   */
  const handleDeleteNotification = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/notifications/${id}`,{withCredentials:true});
      setRemovedNotification(notification);
      console.log("Notification deleted");
    } catch (error) {
      console.error("Error deleting notification:", error);
      setMessage("Failed to delete notification.");
    }
  };

  /**
   * Handles the undo action for a removed notification.
   * 
   * This function prevents the default click event propagation, attempts to restore
   * the removed notification on the backend, and updates the UI accordingly. If the
   * restoration fails, an error message is displayed.
   * 
   * @param {Object} e - The event object from the click event.
   * @throws Will log an error to the console and set a failure message if the undo action fails.
   */
  const handleUndo = async (e) => {
    e.stopPropagation(); // Prevent triggering handleClick

    try {
      // Restore the notification in the backend
      await axios.patch(`${BASE_URL}/notifications/restore-notification/${removedNotification._id}`,{},{
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

  /**
   * Handles muting notifications for a specified duration.
   *
   * This function sends a PATCH request to the server to pause notifications
   * for the given duration. Upon success, it updates the local state to reflect
   * the muted status and hides the duration and menu UI elements.
   *
   * @async
   * @function handleMuteDuration
   * @param {number} duration - The duration (in minutes or other units) for which notifications should be muted.
   * @returns {Promise<void>} Resolves when the operation is complete.
   * @throws {Error} Logs an error to the console if the request fails.
   */
  const handleMuteDuration = async (duration) => {
    try {
     const response= await axios.patch(
        `${BASE_URL}/notifications/pause-notifications`,
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

  /**
   * Handles the unmute action for notifications.
   * Sends a PATCH request to resume notifications and updates the UI state accordingly.
   *
   * @param {Object} e - The event object.
   * @param {Function} e.stopPropagation - Stops the event from propagating to parent elements.
   * @returns {Promise<void>} - A promise that resolves when the unmute action is completed.
   * @throws {Error} - Logs an error to the console if the request fails.
   */
  const handleUnmute = async (e) => {
    e.stopPropagation();
    try {
      const response=await axios.patch(
        `${BASE_URL}/notifications/resume-notifications`,
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
        className={`flex items-center justify-between p-3 cursor-pointer transition-all ${isRead ? "bg-white hover:bg-gray-300" : "bg-blue-100 hover:bg-blue-200"}`}
      >
        {message ? (
          <div className="w-full flex justify-between items-center">
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
              {!isRead && <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>}
              <div className="relative w-10 h-10 bg-gray-200 flex items-center justify-center">
                <img
                  id="Notification-Img"
                  src={notification.sendingUser?.profilePicture??"blank-profile-picture.png"}
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

                <button
                  id="Show-Less-Button"
                  className="flex items-center w-full p-2 hover:bg-gray-100 rounded-md"
                  onClick={async (e) => {
                    e.stopPropagation();
                    setShowMenu(false);

                    if (isRead) {
                      try {
                        await axios.patch(
                          `${BASE_URL}/notifications/mark-unread/${notification._id}`,
                          {},
                          { withCredentials: true }
                        );
                        setIsRead(false);
                        console.log("Notification marked as unread");
                        onRefresh();
                      } catch (error) {
                        console.error("Failed to mark as unread:", error);
                        setMessage("Failed to mark as unread.");
                      }
                    }
                    else {
                      try {
                        await axios.patch(
                          `${BASE_URL}/notifications/mark-read/${notification._id}`,
                          {},
                          { withCredentials: true }
                        );
                        setIsRead(true);
                        console.log("Notification marked as read");
                        onRefresh();
                      } catch (error) {
                        console.error("Failed to mark as read:", error);
                        setMessage("Failed to mark as read.");
                      }
                    }
                  }}
                >
                  <MdMarkChatUnread className="mr-2 text-gray-600" />
                  {isRead? "Mark as unread" : "Mark as read"}
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
