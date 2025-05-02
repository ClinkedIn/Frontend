import React, { useState, useEffect } from "react";
import CoverPhoto from "./CoverPhoto";
import ProfilePhoto from "./ProfilePicture";
import { useNavigate } from "react-router";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import ConfirmationDialog from "./ConfirmationDialog";

interface ContactInfo {
  birthDay?: {
    day: number;
    month: string;
  };
  website?: {
    url: string | null;
    type: string | null;
  };
  phone: string;
  phoneType: string;
  address: string;
}

interface AboutInfo {
  description: string | null;
  skills?: string[];
}

interface User {
  firstName: string;
  lastName: string;
  contactInfo: ContactInfo;
  about: AboutInfo;
  profilePicture: string | null;
  coverPicture: string | null;
  headline: string | null;
  additionalName: string | null;
  website: string | null;
  location: string | null;
  industry: string | null;
  isVerified?: boolean;
  connections?: number;
  university?: string;
}

interface ProfileHeaderProps {
  userData: User;
  onUpdateAbout: (about: AboutInfo) => Promise<boolean>;
  onUpdateContactInfo: (contactInfo: ContactInfo) => Promise<boolean>;
  onUpdateProfilePicture: (file: File) => Promise<boolean>;
  onUpdateCoverPicture: (file: File) => Promise<boolean>;
  onAddSection?: () => void;
  onRefreshUserData: () => Promise<any>;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userData,
  onUpdateAbout,
  onUpdateContactInfo,
  onUpdateProfilePicture,
  onUpdateCoverPicture,
  onAddSection,
  onRefreshUserData,
}) => {
  const [coverImageUrl, setCoverImageUrl] = useState<string | undefined>(
    userData?.coverPicture || "/default-cover.jpg"
  );
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(
    userData?.profilePicture || "/profile-image.jpg"
  );
  const [showEditForm, setShowEditForm] = useState(false);

  const [contactInfo, setContactInfo] = useState<ContactInfo>(
    userData?.contactInfo || {
      phone: "",
      phoneType: "Mobile",
      address: "",
      website: { url: null, type: null },
    }
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [aboutText, setAboutText] = useState(
    userData?.about?.description || ""
  );

  const [errors, setErrors] = useState({
    phone: "",
    website: "",
  });

  let navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      phone: "",
      website: "",
    };

    // Phone validation - simple format check
    if (contactInfo.phone && !/^[+]?[\d\s-()]+$/.test(contactInfo.phone)) {
      newErrors.phone = "Please enter a valid phone number";
      isValid = false;
    }

    // Website URL validation
    if (
      contactInfo.website?.url &&
      !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,})([/\w .-]*)*\/?$/.test(
        contactInfo.website.url
      )
    ) {
      newErrors.website = "Please enter a valid website URL";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCoverImageChange = async (file: File) => {
    try {
      const success = await onUpdateCoverPicture(file);
      if (success) {
        setCoverImageUrl(URL.createObjectURL(file));
      }
    } catch (error) {
      console.error("Error updating cover image:", error);
      setUpdateError("Failed to update cover image");
    }
  };

  const fetchProfilePicture = async () => {
    try {
      const response = await api.get("/user/pictures/profile-picture");
      if (response.data?.profilePicture) {
        setProfileImageUrl(response.data.profilePicture);
      }
    } catch (error) {
      console.error("Error fetching profile picture:", error);
      setProfileImageUrl("/profile-image.jpg");
    }
  };

  const handleProfileImageChange = async (file: File) => {
    if (!file) return;
    try {
      const success = await onUpdateProfilePicture(file);
      if (success) {
        setProfileImageUrl(URL.createObjectURL(file));
      }
    } catch (error) {
      console.error("Error updating profile image:", error);
      setUpdateError("Failed to update profile image");
    }
  };

  useEffect(() => {
    fetchProfilePicture();
  }, []);

  useEffect(() => {
    if (userData?.about?.description !== undefined) {
      setAboutText(userData.about.description);
    }
  }, [userData?.about?.description]);

  const handleEditName = () => {
    navigate("/update-username");
  };

  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setUpdateError(null);

    try {
      const aboutPayload: AboutInfo = {
        description: aboutText.trim(),
        skills: userData?.about?.skills || [],
      };

      const aboutSuccess = await onUpdateAbout(aboutPayload);
      const contactSuccess = await onUpdateContactInfo(contactInfo);

      if (aboutSuccess && contactSuccess) {
        await onRefreshUserData();
        setShowEditForm(false);
        setShowConfirmationDialog(true);
      } else {
        setUpdateError(
          !aboutSuccess
            ? "Failed to update about section"
            : "Failed to update contact information"
        );
      }
    } catch (err) {
      console.error("Error updating profile information:", err);
      setUpdateError("An error occurred while updating your profile");
    } finally {
      setIsLoading(false);
    }
  };
  const handleConfirmDialogClose = () => {
    setShowConfirmationDialog(false);
  };

  const handleAddMoreSection = () => {
    setShowConfirmationDialog(false);
    if (onAddSection) {
      onAddSection();
    }
  };

  return (
    <div className="rounded-lg shadow-[0_5px_5px_-3px_rgba(0,0,0,0.1)] bg-white mb-4 mt-10 overflow-hidden">
      <div className="relative ">
        <div className="h-60 overflow-hidden  bg-[#F4F2EE]">
          <CoverPhoto
            currentImageUrl={coverImageUrl}
            onImageChange={handleCoverImageChange}
          />
        </div>
        <div className="absolute -bottom-16 left-8">
          <div className="rounded-full border-4 border-white w-32 h-32 overflow-hidden">
            <ProfilePhoto
              currentImageUrl={profileImageUrl}
              onImageChange={handleProfileImageChange}
              onFetchImage={fetchProfilePicture}
            />
          </div>
        </div>
      </div>

      {updateError && (
        <div className="mx-8 mt-2 p-2 bg-red-100 text-red-700 rounded flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {updateError}
        </div>
      )}

      <div className="bg-white pt-20 px-8 pb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              {userData.firstName} {userData.lastName}
              {userData.isVerified && (
                <span className="ml-2 text-blue-800">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
              <button
                onClick={handleEditName}
                className="ml-2 text-gray-500 hover:text-gray-700"
                aria-label="Edit name"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
            </h1>

            {userData.headline && (
              <p className="text-gray-600 mt-1">{userData.headline}</p>
            )}

            <div className="flex flex-wrap items-center gap-1 mt-2 text-gray-600 text-sm">
              {userData.location && <p>{userData.location}</p>}
              {userData.location && userData.industry && (
                <span className="mx-1">•</span>
              )}
              {userData.industry && <p>{userData.industry}</p>}

              {userData.university && (
                <div className="flex items-center mt-1">
                  <span className="mr-2">🎓</span>
                  <span>{userData.university}</span>
                </div>
              )}
            </div>

            {userData.connections && (
              <p className="text-blue-600 text-sm font-medium mt-2">
                {userData.connections}+ connections
              </p>
            )}
          </div>

          <button
            onClick={() => setShowEditForm(true)}
            className="text-[#0073b1] hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
        </div>

        {showEditForm && (
          <div
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowEditForm(false);
            }}
          >
            <div
              className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-medium">Edit</h2>
                <button
                  onClick={() => setShowEditForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleEditFormSubmit} className="p-4">
                <div className="mb-6">
                  <div>
                    <label className="block text-gray-700 mb-1 font-medium">
                      About
                    </label>
                    <textarea
                      value={aboutText}
                      onChange={(e) => setAboutText(e.target.value)}
                      className="w-full border border-gray-300 rounded p-2 h-32"
                      placeholder="Tell us about yourself..."
                      maxLength={500}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {aboutText?.length || 0}/500 characters
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-1 font-medium">
                      Phone
                    </label>
                    <div className="flex space-x-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={contactInfo.phone}
                          onChange={(e) =>
                            setContactInfo({
                              ...contactInfo,
                              phone: e.target.value,
                            })
                          }
                          className={`w-full border ${
                            errors.phone ? "border-red-500" : "border-gray-300"
                          } rounded p-2`}
                          placeholder="Your phone number"
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                      <select
                        value={contactInfo.phoneType}
                        onChange={(e) =>
                          setContactInfo({
                            ...contactInfo,
                            phoneType: e.target.value,
                          })
                        }
                        className="border border-gray-300 rounded p-2"
                      >
                        <option value="Mobile">Mobile</option>
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-1 font-medium">
                      Address
                    </label>
                    <input
                      type="text"
                      value={contactInfo.address}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          address: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded p-2"
                      placeholder="Your address"
                      maxLength={100}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 mb-1 font-medium">
                      Website
                    </label>
                    <div className="flex space-x-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={contactInfo.website?.url || ""}
                          onChange={(e) =>
                            setContactInfo({
                              ...contactInfo,
                              website: {
                                url: e.target.value,
                                type: contactInfo.website?.type || "Personal",
                              },
                            })
                          }
                          className={`w-full border ${
                            errors.website
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded p-2`}
                          placeholder="https://example.com"
                        />
                        {errors.website && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.website}
                          </p>
                        )}
                      </div>
                      <select
                        value={contactInfo.website?.type || "Personal"}
                        onChange={(e) =>
                          setContactInfo({
                            ...contactInfo,
                            website: {
                              url: contactInfo.website?.url || null,
                              type: e.target.value,
                            },
                          })
                        }
                        className="border border-gray-300 rounded p-2"
                      >
                        <option value="Personal">Personal</option>
                        <option value="Company">Company</option>
                        <option value="Blog">Blog</option>
                        <option value="Portfolio">Portfolio</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Confirmation Dialog */}
        {showConfirmationDialog && (
          <ConfirmationDialog
            title="Profile Updated"
            message="Your profile information has been updated successfully."
            confirmText="Done"
            onConfirm={handleConfirmDialogClose}
            onCancel={handleConfirmDialogClose}
            showAddMore={!!onAddSection}
            onAddMore={handleAddMoreSection}
          />
        )}

        <div>
          <div>
            {userData?.about?.description ? (
              <p className="text-gray-700 whitespace-pre-wrap">
                {userData.about.description}
              </p>
            ) : (
              <div className="flex justify-between items-center mt-2 pl-3 w-[25%]">
                <p className="text-gray-500 italic">Add Your Bio</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 w-[75%]">
          <div className="flex flex-col space-y-3">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faPhone} className="text-[#0073b1]" />
                <div>
                  <p className="text-sm font-medium text-[#676767]">
                    {contactInfo.phone || "No phone added"}
                  </p>
                  {contactInfo.phone && (
                    <p className="text-sm text-[#676767] font-extralight">
                      {contactInfo.phoneType}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-[#0073b1]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm font-medium text-[#676767]">
                  {contactInfo.address || "No address added"}
                </p>
              </div>
            </div>

            {contactInfo.website?.url && (
              <div className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-medium">{contactInfo.website.url}</p>
                  <p className="text-sm text-gray-500">
                    {contactInfo.website.type} Website
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-2 mt-6">
          <button
            onClick={onAddSection}
            className="bg-white cursor-pointer text-[#0073b1] border-[#0073b1] border-2 px-4 py-1 rounded-full hover:bg-[#EAF4FD] hover:[border-width:2px] box-border font-medium text-sm transition-all duration-150"
          >
            Add profile section
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
