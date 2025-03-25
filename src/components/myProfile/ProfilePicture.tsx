import React, { useState, useRef, useEffect } from "react";
import ProfilePictureForm from "./Forms/ProfilePictureForm";
import defaultProfilePic from "/Images/defaultProfilePic.png";

interface ProfilePhotoProps {
  currentImageUrl?: string;
  onImageChange: (file: File) => void;
  onImageDelete: () => void;
}

const ProfilePhoto: React.FC<ProfilePhotoProps> = ({
  currentImageUrl,
  onImageChange,
}) => {
  const [showForm, setShowForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentImage, setCurrentImage] = useState<string>(
    currentImageUrl || defaultProfilePic
  );
  const [imageLoadError, setImageLoadError] = useState(false);

  useEffect(() => {
    if (!currentImageUrl) {
      const img = new Image();
      img.onload = () => {
        setCurrentImage(img.src);
        setImageLoadError(false);
      };
      img.onerror = () => {
        console.error("Failed to load default profile image");
        setImageLoadError(true);
        setCurrentImage(defaultProfilePic);
      };
      img.src = defaultProfilePic;
    } else {
      setCurrentImage(currentImageUrl);
      setImageLoadError(false);
    }
  }, [currentImageUrl]);

  const handleButtonClick = () => {
    setShowForm(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageChange(e.target.files[0]);
      setCurrentImage(URL.createObjectURL(e.target.files[0]));
      setImageLoadError(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const renderImage = () => {
    if (imageLoadError) {
      return (
        <div
          onClick={handleButtonClick}
          className="w-full h-full bg-gray-300 flex items-center justify-center"
        >
          <svg
            className="w-16 h-16 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      );
    }

    return (
      <img
        src={currentImage}
        alt="Profile"
        className="w-full h-full object-cover"
        onError={() => setImageLoadError(true)}
      />
    );
  };

  return (
    <div className="relative flex items-center justify-center w-32 h-32 rounded-full bg-gray-200 overflow-hidden">
      {renderImage()}

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
          onUpload={onImageChange}
          onCancel={handleCloseForm}
          onApply={(editedImageUrl) => {
            fetch(editedImageUrl)
              .then((res) => res.blob())
              .then((blob) => {
                const file = new File([blob], "edited-profile.jpg", {
                  type: "image/jpeg",
                });
                onImageChange(file);
                setShowForm(false);
                setCurrentImage(editedImageUrl);
                setImageLoadError(false);
              })
              .catch((error) => {
                console.error("Error processing edited image:", error);
                setShowForm(false);
              });
          }}
        />
      )}
    </div>
  );
};

export default ProfilePhoto;
