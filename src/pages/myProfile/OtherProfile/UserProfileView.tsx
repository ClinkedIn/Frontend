import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavBar from "../../../components/UpperNavBar";
import adPhoto from "../../../../public/Images/linkedInAd.png";
import Form from "../../../components/myProfile/Forms/Form";
import SkillEndorsements from "../../../components/myProfile/SkillEndorsements";

interface Skill {
  skillName: string;
  endorsements?: Array<{
    userId: string;
    name: string;
    profilePicture?: string;
    firstName?: string;
    lastName?: string;
    headline?: string;
  }>;
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
  _id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  coverPicture?: string;
  lastJobTitle?: string;
  location?: string;
  about?: {
    description?: string;
    skills?: string[];
  };
  email?: string;
  resume?: string;
  industry?: string;
  followers?: Array<{ entity: string; entityType: string; followedAt: string }>;
  connectionList?: string[];
  workExperience?: WorkExperience[];
  education?: Education[];
  skills?: Skill[];
  languages?: Array<{ language: string; proficiency: string }>;
  privacySettings?: {
    profileVisibility: "public" | "connections" | "private";
  };
  profilePrivacySettings?: "public" | "connectionsOnly" | "private";
  phone?: string;
  website?: string;
}

interface MessageState {
  content: string;
  type: "success" | "error";
  visible: boolean;
}

interface UserActivity {
  postId: string;
  userId: string;
  firstName: string;
  lastName: string;
  headline: string;
  profilePicture?: string;
  postDescription: string;
  attachments?: string[];
  impressionCounts: {
    like: number;
    support: number;
    celebrate: number;
    love: number;
    insightful: number;
    funny: number;
    total: number;
  };
  commentCount: number;
  repostCount: number;
  createdAt: string;
  updatedAt: string;
  taggedUsers?: Array<{
    userId: string;
    userType: string;
    firstName: string;
    lastName: string;
    companyName: string | null;
  }>;
  whoCanSee: string;
  whoCanComment: string;
  isRepost: boolean;
  isSaved: boolean;
  activityType: string;
  activityDate: string;
  repostId?: string;
  reposterId?: string;
  reposterFirstName?: string;
  reposterLastName?: string;
  reposterProfilePicture?: string;
  reposterHeadline?: string;
  repostDescription?: string;
  repostDate?: string;
  commentId?: string;
  commentText?: string;
  commentDate?: string;
  commenterId?: string;
  commenterFirstName?: string;
  commenterLastName?: string;
  commenterProfilePicture?: string;
  commenterHeadline?: string;
}

const UserProfileView = () => {
  const { userId } = useParams<{ userId: string }>();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userActivity, setUserActivity] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<MessageState | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [canViewProfile, setCanViewProfile] = useState(true); // Default to true, API will tell us if we can't view
  const [activeTab, setActiveTab] = useState("all");
  const [endorsingSkill, setEndorsingSkill] = useState<string | null>(null);
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);
  const [privacyNotice, setPrivacyNotice] = useState("");
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  const [basicProfile, setBasicProfile] = useState(null);
  const [basicProfileLoading, setBasicProfileLoading] = useState(true);

  const openEndorsementModal = (skill: Skill) => {
    setActiveSkill(skill);
  };

  const closeEndorsementModal = () => {
    setActiveSkill(null);
  };

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

  const showMessage = (content: string, type: "success" | "error") => {
    setMessage({
      content,
      type,
      visible: true,
    });
  };

  const fetchUserActivity = async (filter = "all") => {
    if (!userId || !canViewProfile) return;

    try {
      setActivityLoading(true);
      const response = await api.get(
        `/user/${userId}/user-activity?filter=${filter}&page=1&limit=5`
      );

      if (response.data && response.data.posts) {
        setUserActivity(response.data.posts);
      }
    } catch (error) {
      console.error("Error fetching user activity:", error);
    } finally {
      setActivityLoading(false);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    fetchUserActivity(tab.toLowerCase());
  };

  const handleFollow = async () => {
    if (isProcessing || !userProfile || !currentUserId) return;

    try {
      setIsProcessing(true);

      if (isFollowing) {
        setIsFollowing(false);
        await api.delete(`/user/follow/${userId}`);
        showMessage("Unfollowed successfully", "success");

        if (userProfile.followers) {
          setUserProfile({
            ...userProfile,
            followers: userProfile.followers.filter(
              (f) => f.entity !== currentUserId
            ),
          });
        }
      } else {
        setIsFollowing(true);
        await api.post(`/user/follow/${userId}`, {});
        showMessage("Followed successfully", "success");

        const newFollower = {
          entity: currentUserId,
          entityType: "user",
          followedAt: new Date().toISOString(),
        };

        setUserProfile({
          ...userProfile,
          followers: [...(userProfile.followers || []), newFollower],
        });
      }
    } catch (error) {
      setIsFollowing(!isFollowing);

      if (error.response?.status === 400) {
        showMessage(
          error.response.data.message || "Something went wrong",
          "error"
        );
      } else {
        console.error("Follow/unfollow error:", error);
        showMessage("Action failed. Please try again.", "error");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  const EndorserCard = ({
    endorser,
  }: {
    endorser: Skill["endorsements"][0];
  }) => {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchUserDetails = async () => {
        try {
          const response = await api.get(`/user/${endorser.userId}`);
          setUserDetails(response.data?.user);
        } catch (error) {
          console.error("Error fetching user details:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserDetails();
    }, [endorser.userId]);

    return (
      <li className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
          {endorser.profilePicture || userDetails?.profilePicture ? (
            <img
              src={endorser.profilePicture || userDetails?.profilePicture}
              alt={`${endorser.name || userDetails?.firstName}'s profile`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-400"
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

        <div className="flex-1 min-w-0">
          <h3 className="text-gray-800 font-medium truncate">
            {endorser.firstName && endorser.lastName
              ? `${endorser.firstName} ${endorser.lastName}`
              : endorser.name ||
                userDetails?.firstName ||
                `User ${endorser.userId.substring(0, 4)}`}
          </h3>

          {loading ? (
            <div className="h-4 bg-gray-200 rounded w-3/4 mt-1 animate-pulse"></div>
          ) : (
            <p className="text-gray-500 text-sm truncate">
              {userDetails?.lastJobTitle ||
                userDetails?.headline ||
                endorser.headline ||
                "LinkedIn Member"}
            </p>
          )}
        </div>
      </li>
    );
  };

  const handleEndorseSkill = async (skillName: string) => {
    if (isProcessing || !userProfile || !currentUserId) return;

    try {
      setIsProcessing(true);
      setEndorsingSkill(skillName);

      const skill = userProfile.skills.find((s) => s.skillName === skillName);
      const hasEndorsed = hasUserEndorsedSkill(skill);

      if (hasEndorsed) {
        await api.delete(
          `/user/skills/endorsements/remove-endorsement/${encodeURIComponent(
            skillName
          )}`,
          { data: { skillOwnerId: userProfile._id } }
        );

        setUserProfile((prev) => ({
          ...prev,
          skills: prev.skills.map((s) =>
            s.skillName === skillName
              ? {
                  ...s,
                  endorsements: (s.endorsements || []).filter(
                    (e) => e.userId !== currentUserId
                  ),
                }
              : s
          ),
        }));
      } else {
        await api.post("/user/skills/endorsements/add-endorsement", {
          skillOwnerId: userProfile._id,
          skillName,
        });

        const response = await api.get("/user/me");
        const currentUser = response.data.user;

        setUserProfile((prev) => ({
          ...prev,
          skills: prev.skills.map((s) =>
            s.skillName === skillName
              ? {
                  ...s,
                  endorsements: [
                    ...(s.endorsements || []),
                    {
                      userId: currentUserId,
                      name: `${currentUser.firstName} ${currentUser.lastName}`,
                      firstName: currentUser.firstName,
                      lastName: currentUser.lastName,
                      profilePicture: currentUser.profilePicture,
                      headline:
                        currentUser.headline || currentUser.lastJobTitle,
                    },
                  ],
                }
              : s
          ),
        }));
      }
    } catch (error) {
      console.error("Error updating endorsement:", error);
      showMessage(
        error.response?.data?.message || "Failed to update endorsement",
        "error"
      );
    } finally {
      setEndorsingSkill(null);
      setIsProcessing(false);
    }
  };

  const hasUserEndorsedSkill = (skill: Skill): boolean => {
    if (!currentUserId || !skill?.endorsements) return false;
    return skill.endorsements.some((e) => e.userId === currentUserId);
  };

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `${diffInWeeks} week${diffInWeeks === 1 ? "" : "s"} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths === 1 ? "" : "s"} ago`;
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} year${diffInYears === 1 ? "" : "s"} ago`;
  };

  const fetchBasicProfileInfo = async (userId: string) => {
    try {
      const response = await api.get(`/user/${userId}`);
      return response.data?.user || null;
    } catch (error: any) {
      console.error("Error fetching basic profile info:", error);

      if (error.response?.status === 403) {
        if (error.response.data?.user) {
          // Return whatever basic profile info we can get
          return error.response.data.user;
        }

        // If no user info but we have a message, return minimal profile
        if (error.response.data?.message) {
          return {
            _id: userId,
            firstName: "LinkedIn",
            lastName: "User",
            profilePrivacySettings: "private",
          };
        }
      }

      // In case of other errors, return minimal profile info
      return {
        _id: userId,
        firstName: "LinkedIn",
        lastName: "User",
        profilePrivacySettings: "private",
      };
    }
  };
  // Effect for fetching basic profile info when needed
  useEffect(() => {
    const getBasicInfo = async () => {
      if (!userId || canViewProfile) return;

      setBasicProfileLoading(true);
      const basicInfo = await fetchBasicProfileInfo(userId);
      setBasicProfile(basicInfo);
      setBasicProfileLoading(false);
    };

    getBasicInfo();
  }, [userId, canViewProfile]);

  useEffect(() => {
    const init = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const currentUserResponse = await api.get("/user/me");
        if (!currentUserResponse.data || !currentUserResponse.data.user) {
          return;
        }
        const currentId = currentUserResponse.data.user._id;
        setCurrentUserId(currentId);

        try {
          const response = await api.get(`/user/${userId}`);
          const user = response.data?.user;

          if (!user) throw new Error("User not found");

          const isFollowing = user.followers?.some(
            (f) => f.entity === currentId
          );
          setIsFollowing(!!isFollowing);
          setUserProfile(user);
          setCanViewProfile(true);
          setPrivacyNotice("");

          const isCurrentUserConnected =
            user.connectionList?.includes(currentId);

          // Check if privacy settings restrict viewing
          if (user.profilePrivacySettings === "private") {
            setCanViewProfile(false);
            setPrivacyNotice("This profile is private. Connect to view more.");
          } else if (
            user.profilePrivacySettings === "connectionsOnly" &&
            !isCurrentUserConnected
          ) {
            setCanViewProfile(false);
            setPrivacyNotice(
              "Only connections can view this profile. Send a connection request to see more."
            );
          } else {
            // Only fetch activity if we can view the profile
            await fetchUserActivity();
          }
        } catch (error: any) {
          if (error.response?.status === 404) {
            setNotFound(true);
            setError("User not found.");
          } else if (error.response?.status === 403) {
            setCanViewProfile(false);

            // Capture the privacy message from the error response
            if (error.response.data?.message) {
              setPrivacyNotice(error.response.data.message);
            } else {
              setPrivacyNotice("This profile has restricted access.");
            }

            // Get basic profile info even for restricted profiles
            const basicInfo = await fetchBasicProfileInfo(userId);
            if (basicInfo) {
              setBasicProfile(basicInfo);
            }
          } else {
            setError("Failed to load user profile.");
          }
        }
      } catch (error) {
        console.error("Error during initialization:", error);
        showMessage("Failed to load user profile", "error");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [userId]);

  useEffect(() => {
    const fetchBasicInfo = async () => {
      if (!userId || canViewProfile) return;

      setBasicProfileLoading(true);
      const basicInfo = await fetchBasicProfileInfo(userId);
      setBasicProfile(basicInfo);
      setBasicProfileLoading(false);
    };

    fetchBasicInfo();
  }, [userId, canViewProfile]);

  useEffect(() => {
    const initializeProfile = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const currentUserResponse = await api.get("/user/me");
        const currentId = currentUserResponse.data?.user?._id;
        setCurrentUserId(currentId);

        const response = await api.get(`/user/${userId}`);
        const user = response.data?.user;

        if (!user) throw new Error("User not found");

        setUserProfile(user);
        setIsFollowing(user.followers?.some((f) => f.entity === currentId));
        setCanViewProfile(true);
        setPrivacyNotice("");

        if (user.profilePrivacySettings === "private") {
          setCanViewProfile(false);
          setPrivacyNotice("This profile is private. Connect to view more.");
        } else if (
          user.profilePrivacySettings === "connectionsOnly" &&
          !user.connectionList?.includes(currentId)
        ) {
          setCanViewProfile(false);
          setPrivacyNotice(
            "Only connections can view this profile. Send a connection request to see more."
          );
        } else {
          await fetchUserActivity();
        }
      } catch (error: any) {
        if (error.response?.status === 404) {
          setNotFound(true);
          setError("User not found.");
        } else if (error.response?.status === 403) {
          setCanViewProfile(false);
          setPrivacyNotice(
            error.response.data?.message ||
              "This profile has restricted access."
          );
          const basicInfo = await fetchBasicProfileInfo(userId);
          setBasicProfile(basicInfo);
        } else {
          setError("Failed to load user profile.");
        }
      } finally {
        setLoading(false);
      }
    };

    initializeProfile();
  }, [userId]);

  const isSkillEndorsed = (skill: Skill): boolean => {
    return hasUserEndorsedSkill(skill);
  };

  const FollowButton = () => {
    return (
      <button
        onClick={handleFollow}
        disabled={isProcessing}
        className="bg-white cursor-pointer text-[#0073b1] border-[#0073b1] border-2 px-4 py-1 rounded-full hover:bg-[#EAF4FD] hover:[border-width:2px] box-border font-medium text-sm transition-all duration-150"
      >
        {isProcessing ? "Processing..." : isFollowing ? "Following" : "Follow"}
      </button>
    );
  };

  const SkillEndorsementSection = () => (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Skills</h2>
          {currentUserId === userId && (
            <button className="text-gray-400 hover:text-gray-600">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
          )}
        </div>
        {userProfile.skills && userProfile.skills.length > 0 ? (
          <div className="space-y-4">
            {userProfile.skills.map((skill, index) => (
              <div
                key={index}
                className="border-b border-gray-100 last:border-b-0 pb-3 last:pb-0"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{skill.skillName}</span>
                    <SkillEndorsements
                      skillName={skill.skillName}
                      endorsements={skill.endorsements}
                      onEndorse={async (skillName) => {
                        await handleEndorseSkill(skillName);
                        return true;
                      }}
                      onRemoveEndorse={async (skillName) => {
                        await handleEndorseSkill(skillName);
                        return true;
                      }}
                      currentUserId={currentUserId || ""}
                      skillOwnerId={userProfile._id}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No skills listed</p>
        )}
      </div>
    </div>
  );

  const ActivityCard = ({ activity }: { activity: UserActivity }) => {
    const activityType = activity.activityType;

    return (
      <div className="bg-white shadow-sm rounded-lg p-4 mb-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              {activity.profilePicture ? (
                <img
                  src={activity.profilePicture}
                  alt={`${activity.firstName}'s profile`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-400"
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

          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <div>
                <span className="font-medium">
                  {activity.firstName} {activity.lastName}
                </span>
                {activityType === "repost" && (
                  <span className="text-gray-500"> reposted this</span>
                )}
                {activityType === "comment" && (
                  <span className="text-gray-500"> commented on a post</span>
                )}
                {activity.headline && (
                  <p className="text-gray-500 text-sm">{activity.headline}</p>
                )}
              </div>
              <span className="text-gray-500 text-xs">
                {formatRelativeTime(
                  activity.activityDate || activity.createdAt
                )}
              </span>
            </div>

            <div className="mt-2">
              <p className="text-gray-700">{activity.postDescription}</p>

              {activity.attachments && activity.attachments.length > 0 && (
                <div className="mt-3">
                  <img
                    src={activity.attachments[0]}
                    alt="Post attachment"
                    className="rounded-lg w-full h-auto max-h-96 object-cover"
                  />
                </div>
              )}

              {activityType === "comment" && activity.commentText && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 text-sm">
                    {activity.commentText}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>{activity.impressionCounts?.total || 0} reactions</span>
                  <span>{activity.commentCount || 0} comments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ProfileHeader = ({ profile, isRestricted = false }) => {
    return (
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="relative">
          {/* Cover photo with consistent fallback */}
          <div
            className="w-full h-48 bg-gray-200 bg-cover bg-center"
            style={{
              backgroundImage: profile?.coverPicture
                ? `url(${profile.coverPicture})`
                : "none",
            }}
          ></div>

          {/* Profile picture with consistent fallback */}
          <div className="absolute bottom-0 transform translate-y-1/2 left-8">
            <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-gray-200 flex items-center justify-center">
              {profile?.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt={`${profile.firstName || "User"}'s profile`}
                  className="w-full h-full object-cover"
                />
              ) : (
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
              )}
            </div>
          </div>
        </div>

        <div className="pt-16 px-8 flex flex-col md:flex-row md:items-center md:justify-between pb-10">
          <div>
            {/* Always show name with fallback */}
            <h1 className="text-2xl font-bold">
              {profile?.firstName && profile?.lastName
                ? `${profile.firstName} ${profile.lastName}`
                : "LinkedIn User"}
            </h1>

            {/* Conditionally show job title */}
            {profile?.lastJobTitle && (
              <p className="text-gray-600">{profile.lastJobTitle}</p>
            )}

            {/* Conditionally show location */}
            {profile?.location && (
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
                {profile.location}
              </p>
            )}
          </div>

          {/* Action buttons section */}
          {!isRestricted && (
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button className="bg-white cursor-pointer text-[#0073b1] border-[#0073b1] border-2 px-4 py-1 rounded-full hover:bg-[#EAF4FD] hover:[border-width:2px] box-border font-medium text-sm transition-all duration-150">
                Connect
              </button>
              <FollowButton />
            </div>
          )}
        </div>

        {/* Show privacy notice for restricted profiles */}
        {isRestricted && privacyNotice && (
          <div className="px-8 pb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                <span>This profile has restricted access. </span>
                <span className="font-semibold">
                  {privacyNotice || "Connect to view more details."}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderRestrictedProfile = () => {
    if (basicProfileLoading) {
      return (
        <>
          <NavBar />
          <div className="max-w-6xl mx-auto p-4">
            <div className="flex gap-6">
              <div className="w-full lg:w-3/4">
                <div className="animate-pulse flex flex-col space-y-4">
                  <div className="w-full h-48 bg-gray-200 rounded"></div>
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-gray-200 h-24 w-24"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <NavBar />
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex gap-6">
            <div className="w-full lg:w-3/4">
              {/* Use the ProfileHeader component */}
              <ProfileHeader profile={basicProfile} isRestricted={true} />
            </div>

            {/* Advertisement section */}
            <div className="hidden lg:block lg:w-1/4">
              <div className="shadow-sm rounded-lg overflow-hidden mt-8">
                <img
                  src={adPhoto}
                  alt="LinkedIn Advertisement"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  // Loading state
  if (loading) {
    return (
      <>
        <NavBar />
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex gap-6">
            <div className="w-full lg:w-3/4">
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
            <div className="hidden lg:block lg:w-1/4">
              <div className="bg-gray-100 rounded-lg h-64 animate-pulse"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Not Found state
  if (notFound) {
    return (
      <>
        <NavBar />
        <div className="max-w-6xl mx-auto p-4 mt-8">
          <div className="bg-white shadow-sm rounded-lg p-10 text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              User Not Found
            </h2>
            <p className="text-gray-500">
              The user profile you are looking for doesn't exist or has been
              removed.
            </p>
          </div>
        </div>
      </>
    );
  }

  if (!canViewProfile) {
    return renderRestrictedProfile();
  }

  return (
    <>
      <NavBar />
      <div className="max-w-6xl mx-auto p-4 mt-8">
        {message && (
          <div
            className={`fixed top-4 right-4 z-50 px-4 py-2 rounded shadow-lg ${
              message.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {message.content}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-3/4 space-y-4">
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
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

              <div className="pt-16 px-8 flex flex-col md:flex-row md:items-center md:justify-between pb-10">
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
                <div className="ml-115 mt-4 md:mt-0">
                  <button className="bg-white cursor-pointer text-[#0073b1] border-[#0073b1] border-2 px-4 py-1 rounded-full hover:bg-[#EAF4FD] hover:[border-width:2px] box-border font-medium text-sm transition-all duration-150">
                    Connect
                  </button>
                </div>

                <div className="mt-4 md:mt-0">
                  <FollowButton />
                </div>
              </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">About</h2>

                <p className="text-gray-700 mb-4">
                  {userProfile?.about?.description || "No bio available"}
                </p>

                {/* Fix 3: Contact information display */}
                <div className="mt-4 text-sm text-gray-600 space-y-2">
                  {userProfile?.location && (
                    <p className="flex items-center">
                      <span className="mr-2">📍</span>
                      <span>{userProfile.location}</span>
                    </p>
                  )}
                  {userProfile?.phone && (
                    <p className="flex items-center">
                      <span className="mr-2">📞</span>
                      <span>{userProfile.phone}</span>
                    </p>
                  )}
                  {userProfile?.website && (
                    <p className="flex items-center">
                      <span className="mr-2">🌐</span>
                      <a
                        href={userProfile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {userProfile.website}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Experience</h2>
                  {currentUserId === userId && (
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                {userProfile.workExperience &&
                userProfile.workExperience.length > 0 ? (
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
                          <p className="text-gray-500 text-sm">
                            {item.location}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {formatDate(item.fromDate)} -{" "}
                            {item.toDate ? formatDate(item.toDate) : "Present"}
                          </p>
                          {item.description && (
                            <p className="text-gray-700 mt-2">
                              {item.description}
                            </p>
                          )}
                          {item.skills && item.skills.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {item.skills.map((skill, i) => (
                                <span
                                  key={i}
                                  className="bg-gray-100 px-2 py-1 rounded-md text-sm text-gray-700"
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
                  <p className="text-gray-500">No work experience listed</p>
                )}
              </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Education</h2>
                  {currentUserId === userId && (
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </button>
                  )}
                </div>
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
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              ></path>
                            </svg>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium">{item.school}</h3>
                          <p className="text-gray-600">
                            {item.degree}
                            {item.fieldOfStudy && `, ${item.fieldOfStudy}`}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {formatDate(item.startDate)} -{" "}
                            {item.endDate
                              ? formatDate(item.endDate)
                              : "Present"}
                          </p>
                          {item.grade && (
                            <p className="text-gray-500 text-sm">
                              Grade: {item.grade}
                            </p>
                          )}
                          {item.description && (
                            <p className="text-gray-700 mt-2">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No education listed</p>
                )}
              </div>
            </div>

            <SkillEndorsementSection />

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Activity</h2>
                  <div className="text-sm text-gray-500">
                    {userProfile.followers?.length || 0} followers
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex space-x-2 mb-4">
                    <button
                      onClick={() => handleTabChange("all")}
                      className={`px-4 py-2 rounded-full ${
                        activeTab === "all"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => handleTabChange("posts")}
                      className={`px-4 py-2 rounded-full ${
                        activeTab === "posts"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Posts
                    </button>
                    <button
                      onClick={() => handleTabChange("comments")}
                      className={`px-4 py-2 rounded-full ${
                        activeTab === "comments"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Comments
                    </button>
                    <button
                      onClick={() => handleTabChange("reposts")}
                      className={`px-4 py-2 rounded-full ${
                        activeTab === "reposts"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Reposts
                    </button>
                  </div>

                  {activityLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((index) => (
                        <div key={index} className="animate-pulse">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-200"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                              <div className="h-40 bg-gray-200 rounded"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : userActivity.length > 0 ? (
                    <div className="space-y-4">
                      {userActivity.map((activity) => (
                        <ActivityCard
                          key={activity.postId}
                          activity={activity}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <svg
                        className="w-16 h-16 text-gray-300 mx-auto mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        ></path>
                      </svg>
                      <p className="text-gray-500">No activities found.</p>
                      {currentUserId === userId && (
                        <button className="mt-4 text-blue-600 hover:text-blue-800 font-medium">
                          Create a post
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {activeSkill && (
            <Form
              title={`Endorsements for "${activeSkill.skillName}"`}
              onClose={closeEndorsementModal}
            >
              <div className="p-4">
                {activeSkill.endorsements &&
                activeSkill.endorsements.length > 0 ? (
                  <ul className="space-y-4">
                    {activeSkill.endorsements.map((endorser, i) => (
                      <EndorserCard key={i} endorser={endorser} />
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No endorsements found.</p>
                )}
              </div>
            </Form>
          )}

          <div className="hidden lg:block lg:w-1/4">
            <div className="shadow-sm rounded-lg overflow-hidden mt-8 ">
              <div className="w-full h-full">
                <img
                  src={adPhoto}
                  alt="LinkedIn Advertisement - See who's hiring on LinkedIn"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfileView;
