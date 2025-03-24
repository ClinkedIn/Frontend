import React from "react";

const ProfileCard = ({ user={} }) => {
  return (
    <div className="w-56 max-w-xs bg-white shadow-sm rounded-xl border border-gray-300">
      {/* Cover Image */}
      <div className="relative w-full h-14 bg-gray-200 rounded-t-xl">
        {/* Profile Image */}
        <img
          src={user.profileImage || "https://via.placeholder.com/80"}
          alt="Profile"
           className="absolute top-6 left-[25%] transform -translate-x-1/2 w-20 h-20 rounded-full border-2 border-white object-cover shadow-md"
        />
      </div>

      {/* User Info */}
      <div className="mt-10 p-4">
        <h2 className="text-lg font-semibold">{user.name || "John Doe"}</h2>
        <p className="text-gray-500 text-xs">{user.location || "Unknown Location"}</p>
        <p className="mt-1 gap-1 text-xs font-medium">
        <span>{user.university || "University Name"}</span>
        </p>
      </div>
    </div>
  );
};

export default ProfileCard;
