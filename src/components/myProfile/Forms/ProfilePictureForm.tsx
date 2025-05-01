import React, { useState, useRef } from "react";

/**
 * Props interface for the ProfilePictureForm component
 * @interface ProfilePictureFormProps
 * @property {string} currentImage - URL of the current profile picture
 * @property {function} onUpload - Callback function when a new image is uploaded
 * @property {function} onCancel - Callback function to cancel the profile picture update
 * @property {function} onApply - Callback function to apply the edited image
 */
interface ProfilePictureFormProps {
  currentImage: string;
  onUpload: (file: File) => void;
  onCancel: () => void;
  onApply: (editedImageUrl: string) => void;
}

/**
 * Type definition for the different editor tabs available
 * @typedef {('crop'|'filters'|'adjust')} EditorTab
 */
type EditorTab = "crop" | "filters" | "adjust";

/**
 * Component for managing profile picture uploads and edits
 *
 * @component
 * @param {ProfilePictureFormProps} props - Component props
 * @returns {React.ReactElement} Profile picture form component
 */
const ProfilePictureForm: React.FC<ProfilePictureFormProps> = ({
  currentImage,
  onUpload,
  onCancel,
  onApply,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<EditorTab>("crop");
  const [zoomValue, setZoomValue] = useState<number>(0);
  const [rotationValue, setRotationValue] = useState<number>(0);
  const [editedImage, setEditedImage] = useState<string>(currentImage);

  /**
   * Handles file input change events when a new image is selected
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - File input change event
   * @returns {void}
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onUpload(file);
      const imageUrl = URL.createObjectURL(file);
      setEditedImage(imageUrl);
    }
  };

  /**
   * Sets the editing state to true to open the image editor
   *
   * @returns {void}
   */
  const handleEdit = () => {
    setIsEditing(true);
  };

  /**
   * Opens the file selection dialog to add a new photo
   *
   * @returns {void}
   */
  const handleAddPhoto = () => {
    fileInputRef.current?.click();
  };

  /**
   * Handles frame selection functionality (placeholder)
   *
   * @returns {void}
   */
  const handleFrames = () => {};

  /**
   * Clears the current profile picture
   *
   * @returns {void}
   */
  const handleDelete = () => {
    setEditedImage("");
  };

  /**
   * Applies the current edits to the profile picture
   * Creates a canvas with the image and applies rotation and zoom transformations
   *
   * @returns {void}
   */
  const handleApply = () => {
    if (!editedImage) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = editedImage;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotationValue * Math.PI) / 180);
      const scale = 1 + zoomValue / 100;
      ctx.scale(scale, scale);
      ctx.drawImage(
        img,
        -img.width / 2,
        -img.height / 2,
        img.width,
        img.height
      );
      ctx.restore();

      canvas.toBlob((blob) => {
        if (!blob) return;
        onApply(URL.createObjectURL(blob));
        setIsEditing(false);
      }, "image/jpeg");
    };
  };

  /**
   * Changes the active tab in the editor
   *
   * @param {EditorTab} tab - Tab to activate
   * @returns {void}
   */
  const handleTabChange = (tab: EditorTab) => {
    setActiveTab(tab);
  };

  /**
   * Exits the editor and resets editing values
   *
   * @returns {void}
   */
  const handleExitEditor = () => {
    setIsEditing(false);
    setZoomValue(0);
    setRotationValue(0);
  };

  /**
   * Renders the image editor UI with tabs for different editing functions
   *
   * @returns {React.ReactElement} Image editor UI component
   */
  const renderImageEditor = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Edit profile photo</h2>
          <button onClick={handleExitEditor} className="text-gray-500">
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
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Image Preview */}
        <div className="w-full h-64 overflow-hidden flex items-center justify-center bg-gray-100">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="rounded-full overflow-hidden w-48 h-48">
              <img
                src={editedImage}
                alt="Profile preview"
                className="w-full h-full object-cover"
                style={{
                  transform: `rotate(${rotationValue}deg) scale(${
                    1 + zoomValue / 100
                  })`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`flex-1 py-3 px-4 flex items-center justify-center ${
              activeTab === "crop"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
            onClick={() => handleTabChange("crop")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2 4a2 2 0 012-2h4a1 1 0 010 2H4v4a1 1 0 01-2 0V4z" />
              <path d="M18 16a2 2 0 01-2 2h-4a1 1 0 010-2h4v-4a1 1 0 012 0v4z" />
            </svg>
            Crop
          </button>

          <button
            className={`flex-1 py-3 px-4 flex items-center justify-center ${
              activeTab === "filters"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
            onClick={() => handleTabChange("filters")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                clipRule="evenodd"
              />
            </svg>
            Filters
          </button>

          <button
            className={`flex-1 py-3 px-4 flex items-center justify-center ${
              activeTab === "adjust"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600"
            }`}
            onClick={() => handleTabChange("adjust")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
            </svg>
            Adjust
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === "crop" && (
            <>
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Zoom</span>
                  <button
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                    onClick={() => setZoomValue(0)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center">
                  <button
                    className="mr-2 text-gray-500"
                    onClick={() => setZoomValue(Math.max(0, zoomValue - 10))}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={zoomValue}
                    onChange={(e) => setZoomValue(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <button
                    className="ml-2 text-gray-500"
                    onClick={() => setZoomValue(Math.min(100, zoomValue + 10))}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Rotation</span>
                  <button
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                    onClick={() => setRotationValue(0)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => setRotationValue((prev) => prev - 90)}
                    className="flex items-center justify-center p-2 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setRotationValue((prev) => prev + 90)}
                    className="flex items-center justify-center p-2 border border-gray-300 rounded hover:bg-gray-50"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </button>
                  <div className="col-span-2 flex items-center justify-center">
                    <span className="text-gray-600">
                      {rotationValue}° Rotation
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "filters" && (
            <div className="grid grid-cols-3 gap-3 py-2">
              {["Original", "B&W", "Sepia", "Vintage", "Cool", "Warm"].map(
                (filter) => (
                  <div key={filter} className="text-center">
                    <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-transparent hover:border-blue-500 cursor-pointer">
                      <img
                        src={editedImage}
                        alt={filter}
                        className="w-full h-full object-cover"
                        style={{
                          filter:
                            filter === "B&W"
                              ? "grayscale(100%)"
                              : filter === "Sepia"
                              ? "sepia(100%)"
                              : filter === "Vintage"
                              ? "sepia(50%) contrast(110%)"
                              : filter === "Cool"
                              ? "saturate(110%) hue-rotate(10deg)"
                              : filter === "Warm"
                              ? "saturate(120%) hue-rotate(-10deg)"
                              : "none",
                        }}
                      />
                    </div>
                    <p className="text-xs mt-1">{filter}</p>
                  </div>
                )
              )}
            </div>
          )}

          {activeTab === "adjust" && (
            <div className="space-y-4 py-2">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700 text-sm">Brightness</span>
                  <button className="text-xs text-blue-600">Reset</button>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="50"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700 text-sm">Contrast</span>
                  <button className="text-xs text-blue-600">Reset</button>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="50"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700 text-sm">Saturation</span>
                  <button className="text-xs text-blue-600">Reset</button>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="50"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={handleExitEditor}
            className="mr-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );

  // Main component render
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-900 text-white rounded-lg max-w-md w-full">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold">Profile photo</h2>
            <button onClick={onCancel} className="text-white">
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
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Profile Image */}
          <div className="flex justify-center p-6">
            <div className="w-64 h-64 rounded-full overflow-hidden">
              {editedImage ? (
                <img
                  src={editedImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <svg
                    className="w-20 h-20 text-gray-400"
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
              )}
            </div>
          </div>

          {/* Privacy Section */}
          <div className="px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center bg-gray-800 rounded-full px-2 py-1 border border-gray-700">
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
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span>Anyone</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-4 border-t border-gray-700 mt-4">
            <button
              onClick={handleEdit}
              className="flex flex-col items-center justify-center p-4 hover:bg-gray-800"
            >
              <svg
                className="w-6 h-6 mb-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              <span className="text-sm">Edit</span>
            </button>

            <button
              onClick={handleAddPhoto}
              className="flex flex-col items-center justify-center p-4 hover:bg-gray-800"
            >
              <svg
                className="w-6 h-6 mb-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-sm">Add photo</span>
            </button>

            <button
              onClick={handleFrames}
              className="flex flex-col items-center justify-center p-4 hover:bg-gray-800"
            >
              <svg
                className="w-6 h-6 mb-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm">Frames</span>
            </button>

            <button
              onClick={handleDelete}
              className="flex flex-col items-center justify-center p-4 hover:bg-gray-800"
            >
              <svg
                className="w-6 h-6 mb-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span className="text-sm">Delete</span>
            </button>
          </div>

          {/* Apply button */}
          <div className="p-4 border-t border-gray-700 flex justify-end">
            <button
              onClick={onApply.bind(null, editedImage)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Apply
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      {isEditing && renderImageEditor()}
    </>
  );
};

export default ProfilePictureForm;
