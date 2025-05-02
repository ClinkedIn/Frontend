import React, { useState, useRef } from "react";
import { Upload, FileText, AlertCircle, CheckCircle, X } from "lucide-react";
import axios from "axios";
import ConfirmationDialog from "../ConfirmationDialog";

// API constants
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_ROUTES = {
  resume: `${API_BASE_URL}/user/resume`,
};

interface ResumeFormProps {
  onClose: () => void;
  onResumeSaved: () => Promise<void>;
  onUploadSuccess: () => void;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ onClose, onResumeSaved }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    setError(null);

    // Check file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const validExtensions = ["pdf", "doc", "docx"];

    if (
      !allowedTypes.includes(file.type) &&
      !validExtensions.includes(fileExtension || "")
    ) {
      setError("Invalid file type. Only PDF, DOC, and DOCX are allowed.");
      return false;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError(
        `File size exceeds 10MB limit. Your file is ${(
          file.size /
          (1024 * 1024)
        ).toFixed(2)}MB`
      );
      return false;
    }

    return true;
  };

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      } else {
        e.target.value = "";
      }
    }
  };

  const handleSave = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("resume", selectedFile);

      await axios.post(API_ROUTES.resume, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        },
      });

      await onResumeSaved();
      onUploadSuccess();
    } catch (error: any) {
      console.error("Error uploading resume:", error);
      setError(
        error.response?.data?.message ||
          "Failed to upload resume. Please try again later."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirm = () => {
    onClose();
  };

  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

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
    <div className="fixed inset-0 bg-black/30  z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden lg:w-[45%] w-[100%] max-h-[90vh]  max-w-2xl">
        <div className="sticky top-0 z-10 bg-white flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold">Upload Resume</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <p className="text-sm text-gray-600 mb-4">
            Upload your resume to help recruiters find you. Accepted formats:
            PDF, DOC, DOCX (max 10MB).
          </p>

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
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            </div>
          )}

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-4">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block text-blue-600">
                      Uploading...
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-blue-600">
                      {uploadProgress}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                  <div
                    style={{ width: `${uploadProgress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                  ></div>
                </div>
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
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            onClick={handleSave}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? "Uploading..." : "Upload Resume"}
          </button>
        </div>

        {showConfirmation && (
          <ConfirmationDialog
            title="Resume Uploaded"
            message="Your resume has been successfully uploaded."
            confirmText="Done"
            onConfirm={handleConfirm}
            onCancel={handleConfirm}
          />
        )}
      </div>
    </div>
  );
};

export default ResumeForm;
