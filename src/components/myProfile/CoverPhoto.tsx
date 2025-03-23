import React, { useState, useRef } from "react";
import CoverPhotoForm from "./Forms/CoverPhotoForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

interface CoverPhotoProps {
  currentImageUrl?: string;
  onImageChange: (file: File) => void;
  onImageDelete: () => void;
}
const DEFAULT_COVER_PHOTO = "../../../public/Images/defaultCover.png";

const CoverPhoto: React.FC<CoverPhotoProps> = ({
  currentImageUrl,
  onImageChange,
  onImageDelete,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const fileInputRef = useRef(null);
  const [currentImage, setCurrentImage] = useState(DEFAULT_COVER_PHOTO);

  const handleButtonClick = () => {
    setShowForm(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageChange(e.target.files[0]);
      setShowOptions(false);
      setCurrentImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSelectImage = () => {
    setShowForm(true);
    setShowOptions(false);
  };

  const handleDeleteImage = () => {
    onImageDelete();
    setShowOptions(false);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  return (
    <div className="relative mt-7 h-64 w-full overflow-hidden rounded-t-lg bg-gray-400 hover:cursor-pointer">
      {currentImage && (
        <div
          className="w-full h-full bg-cover bg-no-repeat bg-center"
          style={{
            backgroundImage: `url(${currentImage})`,
            backgroundPosition: "center 20%",
          }}
        />
      )}

      <button
        className="absolute top-7 right-6 px-[8px] py-[4px] bg-white rounded-full shadow-md hover:cursor-pointer"
        onClick={handleButtonClick}
        aria-label="Change cover photo"
      >
        <FontAwesomeIcon
          className="text-[#005cb7] hover:text-[#004182]"
          icon={faCamera}
        />
      </button>

      {showOptions && (
        <div className="absolute top-16 right-4 bg-white shadow-lg rounded-md py-2 z-10">
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
            onClick={handleSelectImage}
          >
            Change Photo
          </button>
          {currentImageUrl && (
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 text-sm"
              onClick={handleDeleteImage}
            >
              Remove Photo
            </button>
          )}
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
          onUpload={onImageChange}
          onCancel={handleCloseForm}
          onApply={(editedImageUrl) => {
            fetch(editedImageUrl)
              .then((res) => res.blob())
              .then((blob) => {
                const file = new File([blob], "edited-cover.jpg", {
                  type: "image/jpeg",
                });
                onImageChange(file);
                setShowForm(false);
                setCurrentImage(editedImageUrl);
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

export default CoverPhoto;
