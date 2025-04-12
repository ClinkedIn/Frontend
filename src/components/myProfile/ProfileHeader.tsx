import React, { useState } from "react";
import CoverPhoto from "./CoverPhoto";
import ProfilePhoto from "./ProfilePicture";
import { useNavigate } from "react-router";

const ProfileHeaderMain: React.FC = () => {
  const [coverImageUrl, setCoverImageUrl] = useState<string | undefined>(
    "/default-cover.jpg"
  );
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(
    "/profile-image.jpg"
  );
  let navigate = useNavigate();
  const handleCoverImageChange = (file: File) => {
    const url = URL.createObjectURL(file);
    setCoverImageUrl(url);
  };

  const handleCoverImageDelete = () => {
    setCoverImageUrl(undefined);
  };

  const handleProfileImageChange = (file: File) => {
    const url = URL.createObjectURL(file);
    setProfileImageUrl(url);
  };

  const handleProfileImageDelete = () => {
    setProfileImageUrl(undefined);
  };
  const handleEditName = () => {
    navigate("/update-username");
  };
  return (
    <div className="bg-white rounded-lg shadow w-240 m-auto ml-4">
      <div className="relative">
        <CoverPhoto
          currentImageUrl={coverImageUrl}
          onImageChange={handleCoverImageChange}
          onImageDelete={handleCoverImageDelete}
        />

        <div className="absolute -bottom-16 left-8">
          <ProfilePhoto
            currentImageUrl={profileImageUrl}
            onImageChange={handleProfileImageChange}
            onImageDelete={handleProfileImageDelete}
          />
        </div>
      </div>

      <div className="p-6 pt-20">
        <div className="flex justify-between">
          <div>
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">
                Mohamed Ayman
              </h1>
              <div className="ml-2 flex items-center justify-center text-gray-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div className="flex items-center mt-2">
              <div className="flex items-center text-gray-600 bg-gray-100 rounded-md px-2 py-1"></div>
            </div>
          </div>
          <button
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
            onClick={handleEditName}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeaderMain;
