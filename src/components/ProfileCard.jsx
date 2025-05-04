import React from "react";

const ProfileCard = ({ user={} }) => {
 
  return (
    <div className=" bg-white shadow-sm rounded-xl border border-gray-300">
      <div className="relative w-full h-14">
        {/* Profile Image */}
        <img
          src={user.user?.coverPicture || "blank-profile-picture.png"}
          alt="Cover"
          className="w-full h-full object-cover rounded-t-xl"
        />
        <img
          src={user.user?.profilePicture || "blank-profile-picture.png"}
          alt="Profile"
           className="absolute top-6 left-[25%] transform -translate-x-1/2 w-20 h-20 rounded-full border-2 border-white object-cover shadow-md"
        />
      </div>

      {/* User Info */}
      <div className="mt-10 p-4">
    <h2 className="text-lg font-semibold">
        {`${user.user?.firstName || "John"} ${user.user?.lastName || "Doe"}`}
    </h2>
    <p className="text-gray-500 text-xs">{user.user?.location || "Unknown Location"}</p>
    <p className="mt-1 gap-1 text-xs font-medium"></p>
</div>
    </div>
  );
};

export default ProfileCard;
