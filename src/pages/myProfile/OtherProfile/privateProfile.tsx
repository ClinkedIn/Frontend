import React from "react";

const PrivateProfileMessage = ({
  userProfile,
  onConnect,
  onFollow,
  isFollowing,
  isProcessing,
}) => {
  const visibility =
    userProfile?.privacySettings?.profileVisibility || "public";

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden relative">
      {/* Profile header with cover image */}
      <div className="relative">
        <div
          className="w-full h-48 bg-cover bg-center"
          style={{
            backgroundImage: `url(${
              userProfile.coverPicture || "/placeholder-cover.jpg"
            })`,
          }}
        ></div>
        <div className="absolute bottom-0 transform translate-y-1/2 left-8">
          <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden">
            {userProfile.profilePicture ? (
              <img
                src={userProfile.profilePicture}
                alt={`${userProfile.firstName}'s profile`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile basic info */}
      <div className="pt-16 px-8 flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{`${userProfile.firstName} ${userProfile.lastName}`}</h1>
          {userProfile.lastJobTitle && (
            <p className="text-gray-600">{userProfile.lastJobTitle}</p>
          )}
          <p className="text-gray-500 text-sm mt-1">
            {userProfile.connectionList?.length > 500
              ? "500+ connections"
              : `${userProfile.connectionList?.length || 0} connections`}
            {userProfile.followers?.length > 0 &&
              ` • ${userProfile.followers.length} followers`}
          </p>
          {userProfile.location && (
            <p className="text-gray-500 text-sm flex items-center mt-1">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
              {userProfile.location}
            </p>
          )}
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button
            onClick={onConnect}
            className="bg-white cursor-pointer text-[#0073b1] border-[#0073b1] border-2 px-4 py-1 rounded-full hover:bg-[#EAF4FD] hover:[border-width:2px] box-border font-medium text-sm transition-all duration-150"
          >
            Connect
          </button>
          <button
            onClick={onFollow}
            disabled={isProcessing}
            className="bg-white cursor-pointer text-[#0073b1] border-[#0073b1] border-2 px-4 py-1 rounded-full hover:bg-[#EAF4FD] hover:[border-width:2px] box-border font-medium text-sm transition-all duration-150"
          >
            {isProcessing
              ? "Processing..."
              : isFollowing
              ? "Following"
              : "Follow"}
          </button>
        </div>
      </div>

      {/* Privacy message */}
      <div className="border-t border-gray-200 mt-6"></div>
      <div className="p-8 bg-gray-50 text-center">
        <div className="mx-auto max-w-lg">
          <svg
            className="w-12 h-12 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            ></path>
          </svg>
          <h2 className="text-xl font-semibold mb-2">
            Profile is {visibility}
          </h2>
          {visibility === "private" ? (
            <p className="text-gray-600">
              This profile is private. The user has chosen to keep their
              information private.
            </p>
          ) : (
            <p className="text-gray-600">
              This profile is only visible to connections. To see more details,
              send a connection request.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivateProfileMessage;
