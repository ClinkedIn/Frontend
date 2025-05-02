import React, { useState, useRef, useEffect } from "react";
import CoverPhotoForm from "./Forms/CoverPhotoForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

/**
 * Interface for CoverPhoto component props
 * @interface CoverPhotoProps
 * @property {string} [currentImageUrl] - URL of the current cover photo if one exists
 */
interface CoverPhotoProps {
  currentImageUrl?: string;
}

/** Default cover photo path used when no custom image is set */
const DEFAULT_COVER_PHOTO = "/Images/defaultCover.png";

// API base URL from environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create an axios instance with credentials
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/**
 * Component for displaying and managing a user's profile cover photo
 *
 * @component
 * @param {CoverPhotoProps} props - The component props
 * @returns {JSX.Element} Rendered CoverPhoto component
 */
const CoverPhoto: React.FC<CoverPhotoProps> = ({ currentImageUrl }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const fileInputRef = useRef(null);
  const [currentImage, setCurrentImage] = useState<string>(DEFAULT_COVER_PHOTO);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasCoverPhoto, setHasCoverPhoto] = useState<boolean>(false);

  // Fetch cover photo on component mount
  useEffect(() => {
    fetchCoverPhoto();
  }, []);

  /**
   * Fetches the current cover photo from the API
   */
  const fetchCoverPhoto = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/user/pictures/cover-picture");
      if (response.data && response.data.coverPicture) {
        setCurrentImage(response.data.coverPicture);
        setHasCoverPhoto(true);
      } else {
        setCurrentImage(DEFAULT_COVER_PHOTO);
        setHasCoverPhoto(false);
      }
    } catch (err) {
      console.error("Error fetching cover photo:", err);
      // Don't set error state here to avoid showing error to user
      // Just use default cover photo
      setCurrentImage(DEFAULT_COVER_PHOTO);
      setHasCoverPhoto(false);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Uploads a new cover photo to the API
   * @param {File} file - The image file to upload
   */
  const uploadCoverPhoto = async (file: File) => {
    try {
      setIsLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post(
        "/user/pictures/cover-picture",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data && response.data.coverPicture) {
        setCurrentImage(response.data.coverPicture);
        setHasCoverPhoto(true);
      }
    } catch (err: any) {
      console.error("Error uploading cover photo:", err);
      setError(err.response?.data?.message || "Failed to upload cover photo");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Deletes the current cover photo
   */
  const deleteCoverPhoto = async () => {
    try {
      setIsLoading(true);
      setError(null);

      await api.delete("/user/pictures/cover-picture");
      setCurrentImage(DEFAULT_COVER_PHOTO);
      setHasCoverPhoto(false);
    } catch (err: any) {
      console.error("Error deleting cover photo:", err);
      setError(err.response?.data?.message || "Failed to delete cover photo");
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
   * Opens the cover photo form
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
      uploadCoverPhoto(e.target.files[0]);
      setShowOptions(false);
    }
  };

  /**
   * Closes the cover photo form
   */
  const handleCloseForm = () => {
    setShowForm(false);
  };

  /**
   * Handler for when a new image is selected in the form
   */
  const handleImageChange = (file: File) => {
    uploadCoverPhoto(file);
  };

  /**
   * Handles edited image from CoverPhotoForm
   */
  const handleApplyEdit = (editedImageUrl: string) => {
    fetch(editedImageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "edited-cover.jpg", {
          type: "image/jpeg",
        });
        uploadCoverPhoto(file);
        setShowForm(false);
      })
      .catch((error) => {
        console.error("Error processing edited image:", error);
        setError("Failed to process edited image");
        setShowForm(false);
      });
  };

  return (
    <div className="relative mt-7 h-64 w-full overflow-hidden rounded-t-lg bg-gray-400 hover:cursor-pointer">
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <span className="text-gray-600">Loading...</span>
        </div>
      ) : (
        <div className="relative w-full h-full">
          <div
            className="w-full h-full bg-cover bg-no-repeat bg-center"
            style={{
              backgroundImage: `url(${currentImage})`,
              backgroundPosition: "center 20%",
            }}
          />
        </div>
      )}

      {error && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white p-2 text-sm">
          {error}
        </div>
      )}

      {/* Show camera icon if no cover photo, otherwise show edit button */}
      {!hasCoverPhoto ? (
        <button
          className="absolute top-7 right-6 px-[8px] py-[4px] bg-white rounded-full shadow-md hover:cursor-pointer"
          onClick={openEditForm}
          aria-label="Add cover photo"
          disabled={isLoading}
        >
          <FontAwesomeIcon
            className="text-[#005cb7] hover:text-[#004182]"
            icon={faCamera}
          />
        </button>
      ) : (
        <button
          className="absolute top-7 right-6 px-[8px] py-[4px] bg-white rounded-full shadow-md hover:cursor-pointer"
          onClick={toggleOptions}
          aria-label="Edit cover photo"
          disabled={isLoading}
        >
          <FontAwesomeIcon
            className="text-[#005cb7] hover:text-[#004182]"
            icon={faPencil}
          />
        </button>
      )}

      {showOptions && hasCoverPhoto && (
        <div className="absolute top-16 right-4 bg-white shadow-lg rounded-md py-2 z-10">
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center"
            onClick={openEditForm}
          >
            <FontAwesomeIcon icon={faCamera} className="mr-2" />
            change Photo
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100  text-sm flex items-center"
            onClick={deleteCoverPhoto}
          >
            <FontAwesomeIcon icon={faTrash} className="mr-2 text-red-600" />
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
        <CoverPhotoForm
          onUpload={handleImageChange}
          onCancel={handleCloseForm}
          onApply={handleApplyEdit}
        />
      )}
    </div>
  );
};

export default CoverPhoto;
