import React, { useState, useRef } from "react";
import ConfirmationDialog from "../ConfirmationDialog";
import { Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";

/**
 * Props for the ResumeForm component
 * @interface ResumeFormProps
 * @property {() => void} onClose - Function to close the resume form
 * @property {(file: File) => void} onSave - Function called when a file is saved/uploaded
 * @property {string} [currentResumeUrl] - URL to the currently uploaded resume if any
 */
interface ResumeFormProps {
  onClose: () => void;
  onSave: (file: File) => void;
  currentResumeUrl?: string;
}

/**
 * ResumeForm component for uploading resume files
 * @param {ResumeFormProps} props - The component props
 * @returns {JSX.Element} The rendered component
 */
const ResumeForm: React.FC<ResumeFormProps> = ({
  onClose,
  onSave,
  currentResumeUrl,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handles drag events to toggle the active state during drag and drop
   * @param {React.DragEvent<HTMLDivElement>} e - The drag event
   */
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  /**
   * Validates the selected file meets the requirements
   * @param {File} file - The file to validate
   * @returns {boolean} Whether the file is valid
   */
  const validateFile = (file: File): boolean => {
    // Check file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Only PDF, DOC, and DOCX are allowed.");
      return false;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit.");
      return false;
    }

    return true;
  };

  /**
   * Handles file drop events
   * @param {React.DragEvent<HTMLDivElement>} e - The drop event
   */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  /**
   * Handles file selection via the file input
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  /**
   * Initiates the file upload process
   */
  const handleSave = () => {
    if (selectedFile) {
      onSave(selectedFile);
      setShowConfirmation(true);
    } else {
      setError("Please select a file to upload.");
    }
  };

  /**
   * Handles confirmation after successful upload
   */
  const handleConfirm = () => {
    onClose();
  };

  /**
   * Opens the file selector dialog
   */
  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  /**
   * Returns an appropriate file type icon based on file extension
   * @param {string} fileName - The name of the file
   * @returns {JSX.Element | null} The icon for the file type
   */
  const getFileTypeIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    if (extension === "pdf") {
      return <span className="text-red-500">PDF</span>;
    } else if (extension === "doc" || extension === "docx") {
      return <span className="text-blue-500">DOC</span>;
    }
    return null;
  };

  /**
   * Formats file size into a human-readable string
   * @param {number} size - The file size in bytes
   * @returns {string} Formatted file size with units
   */
  const formatFileSize = (size: number) => {
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50  bg-black bg-opacity-50">
      <div className="bg-white rounded-lg  shadow-lg overflow-hidden h-[800px] w-[900px]">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold">Upload Resume</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Upload your resume to help recruiters find you. Accepted formats:
            PDF, DOC, DOCX (max 10MB).
          </p>

          {currentResumeUrl && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-blue-500 mr-2" />
                <div>
                  <p className="font-medium text-blue-700">Current Resume</p>
                  <a
                    href={currentResumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    View current resume
                  </a>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Uploading a new resume will replace the current one.
              </p>
            </div>
          )}

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            } cursor-pointer transition-colors duration-200`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={openFileSelector}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            />
            <Upload
              className={`h-12 w-12 mx-auto mb-4 ${
                dragActive ? "text-blue-500" : "text-gray-400"
              }`}
            />
            <p className="font-medium mb-2 text-lg">
              {dragActive
                ? "Drop your file here"
                : "Drag & drop your resume or click to browse"}
            </p>
            <p className="text-sm text-gray-500">
              Supported formats: PDF, DOC, DOCX (max 10MB)
            </p>
          </div>

          {selectedFile && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-gray-500 mr-2" />
                <div className="flex-1 truncate">
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {getFileTypeIcon(selectedFile.name)} •{" "}
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg text-red-700 flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end p-4 border-t bg-gray-50">
          <button
            className="mr-3 px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            onClick={handleSave}
            disabled={!selectedFile}
          >
            Upload Resume
          </button>
        </div>
      </div>

      {showConfirmation && (
        <ConfirmationDialog
          title="Resume Uploaded"
          message="Your resume has been successfully uploaded to your profile."
          confirmText="Done"
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
};

export default ResumeForm;
