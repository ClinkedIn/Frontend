import React, { useState, useRef, useEffect } from "react";
import ProfilePictureForm from "./Forms/ProfilePictureForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

/**
 * Interface for ProfilePhoto component props
 * @interface ProfilePhotoProps
 * @property {string} [currentImageUrl] - URL of the current profile photo if one exists
 * @property {function} [onImageChange] - Callback when image is changed
 * @property {function} [onImageDelete] - Callback when image is deleted
 * @property {function} [onFetchImage] - Callback to fetch the image
 */
interface ProfilePhotoProps {
  currentImageUrl?: string;
  onImageChange?: (imageUrl: string) => void;
  onImageDelete?: () => void;
  onFetchImage?: () => Promise<void>;
}

/** Default profile photo path used when no custom image is set */
const DEFAULT_PROFILE_PIC = "/Images/defaultProfilePic.png";

// API base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create an axios instance with credentials
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/**
 * Component for displaying and managing a user's profile photo
 *
 * @component
 * @param {ProfilePhotoProps} props - The component props
 * @returns {JSX.Element} Rendered ProfilePhoto component
 */
const ProfilePhoto: React.FC<ProfilePhotoProps> = ({
  currentImageUrl,
  onImageChange,
  onImageDelete,
  onFetchImage,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentImage, setCurrentImage] = useState<string>(DEFAULT_PROFILE_PIC);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasProfilePhoto, setHasProfilePhoto] = useState<boolean>(false);

  // Fetch profile photo on component mount
  useEffect(() => {
    fetchProfilePicture();
  }, []);

  /**
   * Fetches the current profile photo from the API
   */
  const fetchProfilePicture = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/user/pictures/profile-picture");
      if (response.data && response.data.profilePicture) {
        setCurrentImage(response.data.profilePicture);
        setHasProfilePhoto(true);
        if (onImageChange) {
          onImageChange(response.data.profilePicture);
        }
      } else {
        setCurrentImage(DEFAULT_PROFILE_PIC);
        setHasProfilePhoto(false);
      }
    } catch (err) {
      console.error("Error fetching profile photo:", err);
      // Don't set error state here to avoid showing error to user
      // Just use default profile photo
      setCurrentImage(DEFAULT_PROFILE_PIC);
      setHasProfilePhoto(false);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Uploads a new profile photo to the API
   * @param {File} file - The image file to upload
   */
  const uploadProfilePicture = async (file: File) => {
    try {
      setIsLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post(
        "/user/pictures/profile-picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data && response.data.profilePicture) {
        setCurrentImage(response.data.profilePicture);
        setHasProfilePhoto(true);
        if (onImageChange) {
          onImageChange(response.data.profilePicture);
        }
      }
    } catch (err: any) {
      console.error("Error uploading profile photo:", err);
      setError(err.response?.data?.message || "Failed to upload profile photo");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Deletes the current profile photo
   */
  const deleteProfilePicture = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await api.delete("/user/pictures/profile-picture");
      setCurrentImage(DEFAULT_PROFILE_PIC);
      setHasProfilePhoto(false);

      if (onImageChange) {
        onImageChange(DEFAULT_PROFILE_PIC);
      }
      if (onImageDelete) {
        onImageDelete();
      }
    } catch (err: any) {
      console.error("Error deleting profile photo:", err);
      setError(err.response?.data?.message || "Failed to delete profile photo");
    } finally {
      setIsLoading(false);
      setShowOptions(false);
    }
  };

  /**
   * Toggles the options menu
   */
  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  /**
   * Opens the profile photo form
   */
  const openEditForm = () => {
    setShowForm(true);
    setShowOptions(false);
  };

  /**
   * Handles file selection from the file input
   * @param {React.ChangeEvent<HTMLInputElement>} e - File input change event
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadProfilePicture(e.target.files[0]);
      setShowOptions(false);
    }
  };

  /**
   * Closes the profile photo form
   */
  const handleCloseForm = () => {
    setShowForm(false);
  };

  /**
   * Handler for when a new image is selected in the form
   */
  const handleImageChange = (file: File) => {
    uploadProfilePicture(file);
  };

  /**
   * Handles edited image from ProfilePictureForm
   */
  const handleApplyEdit = (editedImageUrl: string) => {
    fetch(editedImageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "edited-profile.jpg", {
          type: "image/jpeg",
        });
        uploadProfilePicture(file);
        setShowForm(false);
      })
      .catch((error) => {
        console.error("Error processing edited image:", error);
        setError("Failed to process edited image");
        setShowForm(false);
      });
  };

  return (
    <div className="relative w-full h-full">
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-full">
          <span className="text-gray-600">Loading...</span>
        </div>
      ) : (
        <div className="relative w-full h-full">
          <img
            src={currentImage}
            alt="Profile"
            className="w-full h-full object-cover"
            onError={() => setCurrentImage(DEFAULT_PROFILE_PIC)}
          />
        </div>
      )}

      {error && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white p-1 text-xs">
          {error}
        </div>
      )}

      <button
        className="absolute bottom-3 right-3 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center hover:cursor-pointer"
        onClick={openEditForm}
        aria-label="Edit profile photo"
        disabled={isLoading}
      >
        <FontAwesomeIcon
          icon={faCamera}
          className="text-[#005cb7] hover:text-[#004182] text-xs"
        />
      </button>

      {showOptions && hasProfilePhoto && (
        <div className="absolute bottom-10 right-0 bg-white shadow-lg rounded-md py-2 z-10">
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center"
            onClick={openEditForm}
          >
            <FontAwesomeIcon icon={faPencil} className="mr-2" />
            Edit Photo
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 text-sm flex items-center"
            onClick={deleteProfilePicture}
          >
            <FontAwesomeIcon icon={faTrash} className="mr-2" />
            Remove Photo
          </button>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {showForm && (
        <ProfilePictureForm
          currentImage={currentImage}
          onUpload={handleImageChange}
          onCancel={handleCloseForm}
          onApply={handleApplyEdit}
          onDelete={deleteProfilePicture}
        />
      )}
    </div>
  );
};

export default ProfilePhoto;
