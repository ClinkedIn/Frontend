import React, { useState, useEffect } from "react";
import CoverPhoto from "./CoverPhoto";
import ProfilePhoto from "./ProfilePicture";
import { useNavigate } from "react-router";
import axios from "axios";
import { BASE_URL } from "../../constants";  
/**
 * Interface representing the contact information of a user
 * @interface ContactInfo
 */
interface ContactInfo {
  /** Birthday information with day and month */
  birthDay?: {
    /** Day of birth (1-31) */
    day: number;
    /** Month of birth (January-December) */
    month: string;
  };
  /** Website information */
  website?: {
    /** Website URL */
    url: string | null;
    /** Type of website (Personal, Company, Blog, etc.) */
    type: string | null;
  };
  /** Phone number */
  phone: string;
  /** Type of phone (Home, Work, Mobile) */
  phoneType: string;
  /** Physical address */
  address: string;
}

/**
 * Interface representing user's about information
 * @interface AboutInfo
 */
interface AboutInfo {
  /** User description/bio */
  description: string | null;
  /** List of user's skills */
  skills: string[];
}

/**
 * Interface representing a user profile
 * @interface User
 */
interface User {
  /** User's first name */
  firstName: string;
  /** User's last name */
  lastName: string;
  /** User's contact information */
  contactInfo: ContactInfo;
  /** User's about information */
  about: AboutInfo;
  /** URL to user's profile picture */
  profilePicture: string | null;
  /** URL to user's cover picture */
  coverPicture: string | null;
  /** User's professional headline */
  headline: string | null;
  /** User's additional name (e.g. middle name) */
  additionalName: string | null;
  /** User's personal or professional website */
  website: string | null;
  /** User's location */
  location: string | null;
  /** User's industry/sector */
  industry: string | null;
}

/**
 * Profile header component that displays and manages the user's profile information
 *
 * This component handles:
 * - Display of user profile and cover images
 * - User name and headline
 * - About section with description and skills
 * - Contact information
 * - Editing functionality for all profile sections
 *
 * @returns {JSX.Element} Rendered profile header component
 */
const ProfileHeaderMain: React.FC = () => {
  const [coverImageUrl, setCoverImageUrl] = useState<string | undefined>(
    "/default-cover.jpg"
  );
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(
    "/profile-image.jpg"
  );
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [showAboutForm, setShowAboutForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [aboutText, setAboutText] = useState<string | null>(null);
  const [aboutSkills, setAboutSkills] = useState<string[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phone: "",
    phoneType: "Home",
    address: "",
    birthDay: { day: 1, month: "January" },
    website: { url: null, type: null },
  });

  let navigate = useNavigate();

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/user/me`);

        if (response.data && response.data.user) {
          setUser(response.data.user);

          // Set profile and cover images if available
          if (response.data.user.profilePicture) {
            setProfileImageUrl(response.data.user.profilePicture);
          }

          if (response.data.user.coverPicture) {
            setCoverImageUrl(response.data.user.coverPicture);
          }

          // Set about and contact info
          if (response.data.user.about) {
            setAboutText(response.data.user.about.description);
            setAboutSkills(response.data.user.about.skills || []);
          }

          if (response.data.user.contactInfo) {
            setContactInfo(response.data.user.contactInfo);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data. Please try again later.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  /**
   * Handles changing the cover image
   * @param {File} file - The new cover image file
   */
  const handleCoverImageChange = (file: File) => {
    const url = URL.createObjectURL(file);
    setCoverImageUrl(url);
  };

  /**
   * Handles deletion of the cover image
   */
  const handleCoverImageDelete = () => {
    setCoverImageUrl(undefined);
  };

  /**
   * Handles changing the profile image
   * @param {File} file - The new profile image file
   */
  const handleProfileImageChange = (file: File) => {
    const url = URL.createObjectURL(file);
    setProfileImageUrl(url);
  };

  /**
   * Handles deletion of the profile image
   */
  const handleProfileImageDelete = () => {
    setProfileImageUrl(undefined);
  };

  /**
   * Navigates to the username update page
   */
  const handleEditName = () => {
    navigate("/update-username");
  };

  /**
   * Submits the updated about section to the server
   * @param {React.FormEvent} e - Form submission event
   */
  const handleAboutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`${BASE_URL}/user/about`, {
        about: {
          description: aboutText,
          skills: aboutSkills,
        },
      });

      if (response.data) {
        // Update local state with response data
        setUser((prev) =>
          prev
            ? {
                ...prev,
                about: {
                  description: aboutText,
                  skills: aboutSkills,
                },
              }
            : null
        );
        setShowAboutForm(false);
      }
    } catch (err) {
      console.error("Error updating about section:", err);
      setError("Failed to update about section. Please try again.");
    }
  };

  /**
   * Submits the updated contact information to the server
   * @param {React.FormEvent} e - Form submission event
   */
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        `${BASE_URL}/user/contact-info`,
        contactInfo
      );

      if (response.data) {
        // Update local state with response data
        setUser((prev) =>
          prev
            ? {
                ...prev,
                contactInfo: contactInfo,
              }
            : null
        );
        setShowContactForm(false);
      }
    } catch (err) {
      console.error("Error updating contact info:", err);
      setError("Failed to update contact information. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow w-240 m-auto ml-4 p-6">
        <div className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded-t-lg"></div>
          <div className="h-32 flex items-center justify-center">
            <div className="h-24 w-24 bg-gray-300 rounded-full"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-1/3 mt-6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mt-4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow w-240 m-auto ml-4 p-6">
        <div className="text-red-500 text-center">
          <p>{error}</p>
          <button
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
                {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
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
              <div className="flex items-center text-gray-600 bg-gray-100 rounded-md px-2 py-1">
                {user?.headline || ""}
              </div>
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

        {/* About Section */}
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-800">About</h2>
            <button
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
              onClick={() => setShowAboutForm(true)}
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

          {showAboutForm ? (
            <form onSubmit={handleAboutSubmit} className="mt-2">
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="about"
                >
                  Description
                </label>
                <textarea
                  id="about"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={aboutText || ""}
                  onChange={(e) => setAboutText(e.target.value)}
                  rows={4}
                  placeholder="Add a description about yourself..."
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="skills"
                >
                  Skills (up to 5)
                </label>
                <input
                  id="skills"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline"
                  value={aboutSkills.join(", ")}
                  onChange={(e) => {
                    const skillsArray = e.target.value
                      .split(",")
                      .map((skill) => skill.trim());
                    setAboutSkills(
                      skillsArray.filter((skill) => skill !== "").slice(0, 5)
                    );
                  }}
                  placeholder="Add skills separated by commas (React, Node.js, etc.)"
                />
                <p className="text-xs text-gray-500">
                  {aboutSkills.length}/5 skills added
                </p>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded"
                  onClick={() => setShowAboutForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          ) : (
            <div>
              <p className="text-gray-600 mt-1">
                {user?.about?.description ||
                  "Add a description about yourself..."}
              </p>

              {user?.about?.skills && user.about.skills.length > 0 && (
                <div className="mt-3">
                  <p className="text-gray-700 font-medium mb-1">Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {user.about.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-600 text-sm px-3 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Contact Information Section */}
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-800">
              Contact Info
            </h2>
            <button
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
              onClick={() => setShowContactForm(true)}
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

          {showContactForm ? (
            <form onSubmit={handleContactSubmit} className="mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="phone"
                  >
                    Phone
                  </label>
                  <input
                    id="phone"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={contactInfo.phone}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, phone: e.target.value })
                    }
                    placeholder="Phone number"
                  />
                </div>

                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="phoneType"
                  >
                    Phone Type
                  </label>
                  <select
                    id="phoneType"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={contactInfo.phoneType}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        phoneType: e.target.value,
                      })
                    }
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Mobile">Mobile</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="address"
                  >
                    Address
                  </label>
                  <input
                    id="address"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={contactInfo.address}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        address: e.target.value,
                      })
                    }
                    placeholder="Address"
                  />
                </div>

                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="birthDay"
                  >
                    Birth Day
                  </label>
                  <div className="flex gap-2">
                    <select
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={contactInfo.birthDay?.day || 1}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          birthDay: {
                            ...(contactInfo.birthDay as any),
                            day: Number(e.target.value),
                          },
                        })
                      }
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(
                        (day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        )
                      )}
                    </select>

                    <select
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={contactInfo.birthDay?.month || "January"}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          birthDay: {
                            ...(contactInfo.birthDay as any),
                            month: e.target.value,
                          },
                        })
                      }
                    >
                      {[
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                      ].map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="websiteUrl"
                  >
                    Website
                  </label>
                  <input
                    id="websiteUrl"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={contactInfo.website?.url || ""}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        website: {
                          ...(contactInfo.website as any),
                          url: e.target.value,
                        },
                      })
                    }
                    placeholder="Website URL"
                  />
                </div>

                <div>
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="websiteType"
                  >
                    Website Type
                  </label>
                  <select
                    id="websiteType"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={contactInfo.website?.type || "Personal"}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        website: {
                          ...(contactInfo.website as any),
                          type: e.target.value,
                        },
                      })
                    }
                  >
                    <option value="Personal">Personal</option>
                    <option value="Company">Company</option>
                    <option value="Blog">Blog</option>
                    <option value="Portfolio">Portfolio</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end mt-4">
                <button
                  type="button"
                  className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded"
                  onClick={() => setShowContactForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-2">
              {contactInfo.phone && (
                <div className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-gray-500 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <div>
                    <p className="text-gray-700">{contactInfo.phone}</p>
                    <p className="text-gray-500 text-sm">
                      {contactInfo.phoneType}
                    </p>
                  </div>
                </div>
              )}

              {contactInfo.address && (
                <div className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-gray-500 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p className="text-gray-700">{contactInfo.address}</p>
                </div>
              )}

              {contactInfo.birthDay && (
                <div className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-gray-500 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-gray-700">
                    {contactInfo.birthDay.day} {contactInfo.birthDay.month}
                  </p>
                </div>
              )}

              {contactInfo.website?.url && (
                <div className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-gray-500 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                  <div>
                    <a
                      href={contactInfo.website.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {contactInfo.website.url}
                    </a>
                    {contactInfo.website.type && (
                      <p className="text-gray-500 text-sm">
                        {contactInfo.website.type}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {!contactInfo.phone &&
                !contactInfo.address &&
                !contactInfo.website?.url && (
                  <p className="text-gray-500">
                    No contact information added yet.
                  </p>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeaderMain;
