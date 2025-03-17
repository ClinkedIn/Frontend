import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { FaBell, FaThumbsDown } from "react-icons/fa";

const NotificationCard = ({ notification }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isRead, setIsRead] = useState(false);

  const handleClick = () => {
    setIsRead(true);
  };



  return (
    <div
    onClick={handleClick}
    className={`flex items-center justify-between p-3 cursor-pointer transition-all ${
      isRead ? "bg-white hover:bg-gray-300" : "bg-blue-100 hover:bg-blue-200"
    }`}
  >
      <div className="flex items-start space-x-3">
        {!notification.isRead && <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>}
        <div className="relative w-10 h-10 bg-gray-200  flex items-center justify-center">
          <img src="/job-icon.png" alt="Job" className="w-full h-full rounded-md" />
        </div>
        <p className="text-sm text-gray-800">{notification.content}</p>
      </div>

      <div className="relative">
        <button
          className="p-2 rounded-full hover:bg-gray-200 transition"
          onClick={() => setShowMenu(!showMenu)}
        >
          <BsThreeDots size={18} />
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-72 bg-white shadow-md rounded-md p-2 z-10">
            <button className="flex items-center w-full p-2 hover:bg-gray-100 rounded-md">
              <FaBell className="mr-2 text-gray-600" />
              Change notification preferences
            </button>
            <button className="flex items-center w-full p-2 hover:bg-gray-100 rounded-md">
              <MdDelete className="mr-2 text-gray-600" />
              Delete notification
            </button>
            <button className="flex items-center w-full p-2 hover:bg-gray-100 rounded-md">
              <FaThumbsDown className="mr-2 text-gray-600" />
              Show less like this
            </button>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default NotificationCard;