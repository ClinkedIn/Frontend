import React, { useState, useEffect } from "react";
import axios from "axios";
import ConfirmationDialog from "./ConfirmationDialog";
import {
  Loader,
  Upload,
  Trash2,
  FileText,
  ExternalLink,
  X,
} from "lucide-react";
import { BASE_URL } from "../../constants";

const API_BASE_URL = BASE_URL;
const API_ROUTES = {
  login: `${API_BASE_URL}/user/login`,
  resume: `${API_BASE_URL}/user/resume`,
};

interface ResumeSectionProps {
  showResumeForm?: boolean;
  setShowResumeForm?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ResumeSection: React.FC<ResumeSectionProps> = ({
  showResumeForm: externalShowForm,
  setShowResumeForm: externalSetShowForm,
}) => {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [googleDocsUrl, setGoogleDocsUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [showForm, setShowFormInternal] = useState(false);
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const showResumeFormState =
    externalShowForm !== undefined ? externalShowForm : showForm;

  const setShowResumeFormState = (show: boolean) => {
    if (externalSetShowForm) {
      externalSetShowForm(show);
    } else {
      setShowFormInternal(show);
    }
  };

  const login = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const credentials = {
        email: "john.doe@example.com",
        password: "Password123!",
      };

      const response = await axios.post(API_ROUTES.login, credentials, {
        withCredentials: true,
      });

      if (response.data) {
        axios.defaults.withCredentials = true;

        if (response.data.token) {
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.token}`;
        }

        setIsAuthenticated(true);
        await fetchResume();
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setIsAuthenticated(false);
      setError(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
      setIsLoading(false);
    }
  };

  const fetchResume = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(API_ROUTES.resume, {
        withCredentials: true,
      });

      if (response.data && response.data.resume) {
        setResumeUrl(response.data.resume);
        setGoogleDocsUrl(response.data.googleDocsUrl || null);
      } else {
        setResumeUrl(null);
        setGoogleDocsUrl(null);
      }

      setIsLoading(false);
    } catch (error: any) {
      console.error("Error fetching resume data:", error);

      if (error.response && error.response.status === 400) {
        setResumeUrl(null);
        setGoogleDocsUrl(null);
        setIsLoading(false);
      } else if (error.response && error.response.status === 401) {
        setIsAuthenticated(false);
        setError("Your session has expired. Please login again.");
        setIsLoading(false);
      } else {
        setError(
          error.response?.data?.message || "Failed to load resume data."
        );
        setIsLoading(false);
      }
    }
  };

  const validateFile = (file: File): boolean => {
    setFileError(null);

    console.log("Validating file:", file.name, file.type, file.size);

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError(
        `File size exceeds 10MB limit. Your file is ${(
          file.size /
          (1024 * 1024)
        ).toFixed(2)}MB`
      );
      return false;
    }

    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/x-msword",
      "application/vnd.ms-word",
    ];

    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const validExtensions = ["pdf", "doc", "docx"];

    if (
      !validTypes.includes(file.type) &&
      !validExtensions.includes(fileExtension || "")
    ) {
      setFileError(
        `Invalid file type: ${file.type}. Only PDF, DOC, and DOCX files are allowed`
      );
      return false;
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      console.log("Selected file:", file.name, file.type, file.size);

      if (validateFile(file)) {
        setSelectedFile(file);
      } else {
        e.target.value = "";
        setSelectedFile(null);
      }
    }
  };

  const handleUploadResume = async () => {
    if (!selectedFile) {
      setFileError("Please select a file to upload");
      return;
    }

    setIsProcessing(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("resume", selectedFile);

      console.log(
        "Uploading file:",
        selectedFile.name,
        selectedFile.type,
        selectedFile.size
      );

      const response = await axios.post(API_ROUTES.resume, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        },
      });

      console.log("Upload response:", response.data);

      if (response.data && response.data.resume) {
        setResumeUrl(response.data.resume);
        setGoogleDocsUrl(
          response.data.googleDocsUrl ||
            `https://docs.google.com/viewer?url=${encodeURIComponent(
              response.data.resume
            )}&embedded=true`
        );

        setShowResumeFormState(false);
        setShowUploadSuccess(true);
        setSelectedFile(null);
      }

      setIsProcessing(false);
    } catch (error: any) {
      console.error("Error uploading resume:", error);
      console.log("Error response:", error.response?.data);

      if (error.response && error.response.status === 400) {
        setFileError(
          error.response?.data?.message ||
            "Server rejected the file. Please make sure it's a valid PDF, DOC, or DOCX under 10MB."
        );
      } else if (error.response && error.response.status === 401) {
        setIsAuthenticated(false);
        setError("Your session has expired. Please login again.");
      } else {
        setFileError(
          error.response?.data?.message || "Failed to upload resume."
        );
      }

      setIsProcessing(false);
    }
  };

  const handleDeleteResume = async () => {
    setIsProcessing(true);

    try {
      await axios.delete(API_ROUTES.resume, { withCredentials: true });

      setResumeUrl(null);
      setGoogleDocsUrl(null);
      setShowDeleteConfirmation(false);
      setShowDeleteSuccess(true);
      setIsProcessing(false);
    } catch (error: any) {
      console.error("Error deleting resume:", error);

      if (error.response && error.response.status === 401) {
        setIsAuthenticated(false);
        setError("Your session has expired. Please login again.");
      } else {
        setError(error.response?.data?.message || "Failed to delete resume.");
      }

      setIsProcessing(false);
    }
  };

  useEffect(() => {
    login();
  }, []);

  const getFileNameFromUrl = (url: string): string => {
    const parts = url.split("/");
    return parts[parts.length - 1] || "Resume";
  };

  const getFileTypeInfo = (url: string) => {
    if (url.toLowerCase().endsWith(".pdf")) {
      return { icon: "pdf", text: "PDF Document" };
    } else if (
      url.toLowerCase().endsWith(".doc") ||
      url.toLowerCase().endsWith(".docx")
    ) {
      return { icon: "doc", text: "Word Document" };
    } else {
      return { icon: "file", text: "Document" };
    }
  };

  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <Loader className="h-8 w-8 text-gray-600 animate-spin" />
    </div>
  );

  const LoadingSkeletonView = () => (
    <div className="bg-white rounded-lg shadow p-4 mb-4 w-full">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-20 bg-gray-100 rounded-lg mb-3"></div>
      </div>
    </div>
  );

  const ErrorView = () => (
    <div className="text-red-500 p-4 rounded-lg bg-red-50 flex flex-col items-center">
      <p className="mb-3 text-center">{error}</p>
      <button
        onClick={login}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  const EmptyStateView = () => (
    <div className="p-4 border border-gray-200 rounded-lg">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 mr-3 bg-gray-100 flex items-center justify-center rounded-lg text-gray-400">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <p className="text-gray-500">No Resume Uploaded</p>
          <p className="text-gray-400 text-sm">
            Upload your resume to make it easier for recruiters to find you
          </p>
        </div>
      </div>
      <button
        onClick={() => setShowResumeFormState(true)}
        className="w-full text-blue-600 font-medium border border-blue-600 rounded-full py-2 hover:bg-blue-50 transition-colors"
      >
        Upload resume
      </button>
    </div>
  );

  const ResumeForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold">Upload Resume</h3>
          <button
            onClick={() => setShowResumeFormState(false)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          <p className="text-gray-600 mb-4">
            Upload your resume to make it easier for recruiters to find you.
            Supported formats: PDF, DOC, DOCX (max 10MB)
          </p>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
            <input
              type="file"
              id="resume-upload"
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            />
            <label
              htmlFor="resume-upload"
              className="flex flex-col items-center cursor-pointer"
            >
              <Upload className="w-10 h-10 text-blue-500 mb-2" />
              <p className="text-gray-700 font-medium mb-1">
                {selectedFile
                  ? selectedFile.name
                  : "Click to upload or drag and drop"}
              </p>
              <p className="text-gray-500 text-sm">
                PDF, DOC or DOCX (max 10MB)
              </p>
            </label>
          </div>

          {fileError && (
            <div className="text-red-500 text-sm mb-4">{fileError}</div>
          )}

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mb-4">
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

          <div className="flex justify-end border-t pt-4 mt-4">
            <button
              onClick={() => setShowResumeFormState(false)}
              className="mr-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleUploadResume}
              disabled={!selectedFile || isProcessing}
              className={`px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 ${
                !selectedFile || isProcessing
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <LoadingSkeletonView />;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4 w-[900px] m-auto relative">
      {isProcessing && <LoadingOverlay />}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Resume</h2>
        {resumeUrl && (
          <div className="flex space-x-2">
            <button
              onClick={() => setShowResumeFormState(true)}
              className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
              title="Update resume"
            >
              <Upload size={20} />
            </button>
          </div>
        )}
      </div>

      {error ? (
        <ErrorView />
      ) : resumeUrl ? (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start group">
            <div className="w-10 h-10 mr-3 bg-blue-50 flex items-center justify-center rounded-lg text-blue-500">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h3 className="font-medium text-gray-800">
                  {getFileNameFromUrl(resumeUrl)}
                </h3>
                <button
                  onClick={() => setShowDeleteConfirmation(true)}
                  className="text-red-500 hover:text-red-700 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete resume"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="text-gray-500 text-sm">
                {getFileTypeInfo(resumeUrl).text}
              </p>

              <div className="mt-3 flex space-x-2">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <span className="mr-1">Download</span>
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </a>

                {googleDocsUrl && (
                  <a
                    href={googleDocsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <span className="mr-1">Preview</span>
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>

              {googleDocsUrl && (
                <div className="mt-4 border border-gray-200 rounded overflow-hidden h-64">
                  <iframe
                    src={googleDocsUrl}
                    className="w-full h-full"
                    title="Resume Preview"
                  ></iframe>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <EmptyStateView />
      )}

      {showResumeFormState && <ResumeForm />}

      {showUploadSuccess && (
        <ConfirmationDialog
          title="Resume Uploaded Successfully"
          message="Your resume has been added to your profile."
          confirmText="Done"
          onConfirm={() => setShowUploadSuccess(false)}
          onCancel={() => setShowUploadSuccess(false)}
        />
      )}

      {showDeleteConfirmation && (
        <ConfirmationDialog
          title="Delete Resume"
          message="Are you sure you want to delete your resume? This action cannot be undone."
          confirmText="Delete"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
          onConfirm={handleDeleteResume}
          onCancel={() => setShowDeleteConfirmation(false)}
        />
      )}

      {showDeleteSuccess && (
        <ConfirmationDialog
          title="Resume Deleted Successfully"
          message="Your resume has been removed from your profile."
          confirmText="OK"
          onConfirm={() => setShowDeleteSuccess(false)}
          onCancel={() => setShowDeleteSuccess(false)}
        />
      )}
    </div>
  );
};

export default ResumeSection;
