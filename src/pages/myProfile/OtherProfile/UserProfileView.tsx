import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface Skill {
  skillName: string;
  endorsements?: Array<{ userId: string; name: string }>;
}

interface WorkExperience {
  jobTitle: string;
  companyName: string;
  location: string;
  fromDate: string;
  toDate?: string;
  description: string;
  skills?: string[];
}

interface Education {
  school: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  grade?: string;
  description?: string;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  profilePicture?: string;
  coverPicture?: string;
  lastJobTitle?: string;
  location?: string;
  bio?: string;
  followers?: Array<{ entity: string }>;
  connectionList?: string[];
  workExperience?: WorkExperience[];
  education?: Education[];
  skills?: Skill[];
}

interface MessageState {
  content: string;
  type: "success" | "error";
  visible: boolean;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

const UserProfileView: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [message, setMessage] = useState<MessageState | null>(null);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get(`user/${userId}`, {
        withCredentials: true,
      });

      setUserProfile(response.data.user);

      const isAlreadyFollowing =
        response.data.user.followers &&
        response.data.user.followers.some(
          (f: { entity: string }) => f.entity === response.data.currentUserId
        );
      setIsFollowing(isAlreadyFollowing);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      showMessage("Failed to load user profile", "error");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  useEffect(() => {
    // Effect to hide the message after 3 seconds
    if (message?.visible) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const showMessage = (content: string, type: "success" | "error") => {
    setMessage({
      content,
      type,
      visible: true,
    });
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await api.delete(`user/follow/${userId}`, {
          withCredentials: true,
        });

        setIsFollowing(false);
        showMessage("Unfollowed successfully", "success");
      } else {
        await api.post(
          `user/follow/${userId}`,
          {},
          {
            withCredentials: true,
          }
        );

        setIsFollowing(true);
        showMessage("Followed successfully", "success");
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        showMessage(
          error.response.data.message || "Something went wrong",
          "error"
        );
      } else {
        console.error("Follow/unfollow error:", error);
        showMessage("Action failed. Please try again.", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="w-full h-48 bg-gray-200 rounded"></div>
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-gray-200 h-24 w-24"></div>
            <div className="flex-1 space-y-2">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return <div className="text-center py-8 text-lg">User not found</div>;
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg overflow-hidden relative">
      {/* Toast Message Component */}
      {message && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg ${
            message.type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {message.content}
        </div>
      )}

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

      <div className="pt-16 px-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{`${userProfile.firstName} ${userProfile.lastName}`}</h1>
          {userProfile.lastJobTitle && (
            <p className="text-gray-600">{userProfile.lastJobTitle}</p>
          )}
          {userProfile.location && (
            <p className="text-gray-500 text-sm flex items-center mt-1">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
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
        <div className="mt-4 md:mt-0">
          <button
            onClick={handleFollow}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isFollowing
                ? "border border-gray-300 text-gray-700 hover:bg-gray-50"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        </div>
      </div>

      <div className="border-t border-gray-200 mt-6"></div>

      {/* About Section */}
      <div className="p-8">
        <h2 className="text-xl font-semibold mb-4">About</h2>
        <p className="text-gray-700">{userProfile.bio || "No bio available"}</p>
      </div>

      {/* Experience Section */}
      <div className="p-8 border-t border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Experience</h2>
        {userProfile.workExperience && userProfile.workExperience.length > 0 ? (
          <div className="space-y-6">
            {userProfile.workExperience.map((item, index) => (
              <div key={index} className="flex">
                <div className="mr-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium">{item.jobTitle}</h3>
                  <p className="text-gray-600">{item.companyName}</p>
                  <p className="text-gray-500 text-sm">{item.location}</p>
                  <p className="text-gray-500 text-sm">
                    {formatDate(item.fromDate)} -{" "}
                    {item.toDate ? formatDate(item.toDate) : "Present"}
                  </p>
                  <p className="text-gray-700 mt-2">{item.description}</p>
                  {item.skills && item.skills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No experience listed</p>
        )}
      </div>

      {/* Education Section */}
      <div className="p-8 border-t border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Education</h2>
        {userProfile.education && userProfile.education.length > 0 ? (
          <div className="space-y-6">
            {userProfile.education.map((item, index) => (
              <div key={index} className="flex">
                <div className="mr-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium">{item.school}</h3>
                  <p className="text-gray-600">
                    {item.degree}{" "}
                    {item.fieldOfStudy && `in ${item.fieldOfStudy}`}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {formatDate(item.startDate)} -{" "}
                    {item.endDate ? formatDate(item.endDate) : "Present"}
                  </p>
                  {item.grade && (
                    <p className="text-gray-500 text-sm">Grade: {item.grade}</p>
                  )}
                  {item.description && (
                    <p className="text-gray-700 mt-2">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No education listed</p>
        )}
      </div>

      <div className="p-8 border-t border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Skills</h2>
        {userProfile.skills && userProfile.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {userProfile.skills.map((skill, index) => (
              <div
                key={index}
                className="px-3 py-1 bg-gray-100 rounded-full text-gray-700 text-sm"
              >
                {skill.skillName}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No skills listed</p>
        )}
      </div>
    </div>
  );
};

export default UserProfileView;
