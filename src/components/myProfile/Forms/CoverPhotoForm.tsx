import React, { useState, useRef } from "react";
import Form from "./Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";

/**
 * Props interface for the CoverPhotoForm component
 *
 * @interface CoverPhotoFormProps
 * @property {Function} onUpload - Callback function triggered when a file is uploaded
 * @property {Function} onCancel - Callback function triggered when the user cancels the form
 * @property {Function} onApply - Callback function triggered when the user applies the edited image
 */
interface CoverPhotoFormProps {
  onUpload: (file: File) => void;
  onCancel: () => void;
  onApply: (editedImage: string) => void;
}

/**
 * CoverPhotoForm Component
 *
 * Allows users to upload and edit a cover photo with basic editing features like zoom and rotation.
 * The component has two states: upload state and editing state.
 *
 * @param {CoverPhotoFormProps} props - Component props
 * @returns {JSX.Element} - Rendered component
 */
const CoverPhotoForm: React.FC<CoverPhotoFormProps> = ({
  onCancel,
  onApply,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [zoomValue, setZoomValue] = useState<number>(0);
  const [straightenValue, setStraightenValue] = useState<number>(50);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  /**
   * Handles file input change event
   * Reads the selected file and sets the image preview URL
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - File input change event
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result as string);
      setIsEditing(true);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Triggers click on the hidden file input element
   */
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Resets the form state to upload mode
   */
  const handleChangePhoto = () => {
    setIsEditing(false);
    setImagePreviewUrl(null);
  };

  /**
   * Applies the current edits to the image and passes the result to the parent component
   * Creates a canvas element to apply rotation and zoom transformations to the image
   */
  const handleApply = () => {
    if (!imagePreviewUrl) {
      alert("Please upload an image before applying changes.");
      return;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imagePreviewUrl;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      // Convert straightenValue (0-100) to rotation angle (-10 to 10 degrees)
      ctx.rotate(((straightenValue - 50) / 50) * 10 * (Math.PI / 180));
      // Calculate scale factor based on zoom value (0-100)
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
      }, "image/jpeg");
    };
  };

  /**
   * Renders the upload interface when no image is selected
   *
   * @returns {JSX.Element} - Upload UI
   */
  const renderUploadUI = () => (
    <div className="p-6 h-148 lg:h-154">
      <div className="flex items-center mb-6 ">
        <div>
          <button
            className=" bg-[#EDF3F8] rounded-full 
             w-15 h-15 flex items-center justify-center ml-[-10px] mr-2  "
          >
            <FontAwesomeIcon
              icon={faArrowUpFromBracket}
              className="text-4xl text-gray-600 m-auto"
            />
          </button>
        </div>
        <div>
          <h3 className="text-2xl font-normal">Upload a photo</h3>
          <p className="text-gray-600 text-lg">
            Showcase your personality, interests, work, or team moments
          </p>
        </div>
      </div>

      <button
        onClick={handleUploadClick}
        className=" border-2 border-gray-600 text-gray-700 text-lg font-medium rounded-full py-[1.5px] px-4 hover:bg-gray-50 mb-6 hover:cursor-pointer"
      >
        Upload photo
      </button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );

  /**
   * Renders the editor interface when an image is selected
   * Displays the image preview with applied transformations and editing controls
   *
   * @returns {JSX.Element} - Editor UI
   */
  const renderEditorUI = () => (
    <div>
      <div className="w-full h-80 overflow-hidden flex items-center justify-center">
        {imagePreviewUrl && (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={imagePreviewUrl}
              alt="Cover preview"
              className="max-w-full max-h-full object-contain"
              style={{
                transform: `rotate(${
                  ((straightenValue - 50) / 50) * 10
                }deg) scale(${1 + zoomValue / 100})`,
              }}
            />
          </div>
        )}
      </div>

      <div className="flex border-t border-b">
        <button
          className="w-full flex-1 py-3 px-4 flex items-center justify-center
           border-b-2 border-green-600 text-green-600"
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
      </div>

      <div className="p-4">
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
              <button className="mr-2 text-gray-500">
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
              <button className="ml-2 text-gray-500">
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
              <span className="text-gray-700">Straighten</span>
              <button
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                onClick={() => setStraightenValue(50)}
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
              <button className="mr-2 text-gray-500">
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
                value={straightenValue}
                onChange={(e) => setStraightenValue(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <button className="ml-2 text-gray-500">
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
        </>
      </div>
    </div>
  );

  /**
   * Conditionally renders the footer buttons based on the current state
   */
  const EditorFooter = isEditing ? (
    <>
      <button
        onClick={handleChangePhoto}
        className="mr-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50"
      >
        Change photo
      </button>
      <button
        onClick={handleApply}
        className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
      >
        Apply
      </button>
    </>
  ) : null;

  return (
    <Form
      title={isEditing ? "Cover image" : "Add a cover image"}
      onClose={onCancel}
      footer={EditorFooter}
    >
      {isEditing ? renderEditorUI() : renderUploadUI()}
    </Form>
  );
};

export default CoverPhotoForm;
