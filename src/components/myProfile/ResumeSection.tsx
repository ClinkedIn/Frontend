import React, { useState } from "react";
import axios from "axios";
import ConfirmationDialog from "./ConfirmationDialog";
import { Loader, Trash2, FileText, ExternalLink } from "lucide-react";
import Button from "../Button";
import ResumeForm from "./Forms/ResumeForm";

// API constants
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_ROUTES = {
  resume: `${API_BASE_URL}/user/resume`,
};

interface ResumeSectionProps {
  resume: any;
  onResumeSaved: () => Promise<void>;
}

const ResumeSection: React.FC<ResumeSectionProps> = ({
  resume,
  onResumeSaved,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [showResumeForm, setShowResumeForm] = useState(false);

  const handleOpenResumeForm = () => {
    setShowResumeForm(true);
  };

  const handleCloseResumeForm = () => {
    setShowResumeForm(false);
  };

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

  const googleDocsUrl =
    resume?.googleDocsUrl ||
    `https://docs.google.com/viewer?url=${encodeURIComponent(
      resume
    )}&embedded=true`;

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4 relative w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Resume</h2>
        <div className="flex space-x-2">
          <button
            className="bg-white cursor-pointer text-[#0073b1] border-[#0073b1] border-2 px-4 py-1 rounded-full hover:bg-[#EAF4FD] hover:[border-width:2px] box-border font-medium text-sm transition-all duration-150"
            onClick={handleOpenResumeForm}
          >
            Update
          </button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-start group">
          <div className="w-10 h-10 mr-3 bg-blue-50 flex items-center justify-center rounded-lg text-blue-500">
            <FileText className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between">
              <h3 className="font-medium text-gray-800 truncate">
                {getFileNameFromUrl(resume)}
              </h3>
            </div>
            <p className="text-gray-500 text-sm">
              {getFileTypeInfo(resume).text}
            </p>
            <div className="mt-3 flex space-x-2">
              <a
                href={resume}
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

              <a
                href={googleDocsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <span className="mr-1">Preview</span>
                <ExternalLink size={16} />
              </a>
            </div>
            <div className="mt-4 border border-gray-200 rounded overflow-hidden h-64">
              <iframe
                src={googleDocsUrl}
                className="w-full h-full"
                title="Resume Preview"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
          {error}
        </div>
      )}

      {showResumeForm && (
        <ResumeForm
          onClose={handleCloseResumeForm}
          onResumeSaved={onResumeSaved}
          initialData={resume}
          onUploadSuccess={() => {}}
        />
      )}
    </div>
  );
};

export default ResumeSection;
