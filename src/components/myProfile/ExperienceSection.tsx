import React, { useState, useEffect } from "react";
import axios from "axios";
import ExperienceForm from "./Forms/ExperienceForm";
import ConfirmationDialog from "./ConfirmationDialog";
import { Loader, Plus, Pencil, X, Trash2 } from "lucide-react";

interface Experience {
  index?: number;
  jobTitle: string;
  companyName: string;
  fromDate: string;
  toDate?: string;
  currentlyWorking?: boolean;
  employmentType?: string;
  location?: string;
  locationType?: string;
  description?: string;
  foundVia?: string;
  skills?: string[];
  media?: File | null;
  _id?: string; // Added to handle MongoDB IDs
}

interface ExperienceFormData {
  index?: number;
  jobTitle: string;
  companyName: string;
  employmentType?: string;
  location?: string;
  fromMonth: string;
  fromYear: string;
  toMonth?: string;
  toYear?: string;
  currentlyWorking?: boolean;
  locationType?: string;
  description?: string;
  skills?: string[];
  media?: File | null;
  foundVia?: string;
}

interface ExperienceSectionProps {
  showExperienceForm?: boolean;
  setShowExperienceForm?: React.Dispatch<React.SetStateAction<boolean>>;
}

// Update to use API_BASE_URL from environment or config
const API_BASE_URL = "http://localhost:3000";
const API_ROUTES = {
  me: `${API_BASE_URL}/user/me`,
  experience: `${API_BASE_URL}/user/experience`,
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getMonthNumber = (monthName: string): string => {
  const monthIndex = MONTHS.findIndex((m) => m === monthName);
  return monthIndex !== -1
    ? (monthIndex + 1).toString().padStart(2, "0")
    : "01";
};

// Function to extract month and year from date string
const extractDateInfo = (dateString: string) => {
  if (!dateString) return { month: "January", year: "2023" };

  try {
    const date = new Date(dateString);
    const month = MONTHS[date.getMonth()];
    const year = date.getFullYear().toString();
    return { month, year };
  } catch (error) {
    console.error("Error parsing date:", error);
    return { month: "January", year: "2023" };
  }
};

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  showExperienceForm: externalShowForm,
  setShowExperienceForm: externalSetShowForm,
}) => {
  // State management
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

  // UI state
  const [showForm, setShowFormInternal] = useState(false);
  const [showAddConfirmation, setShowAddConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<
    number | undefined
  >(undefined);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(
    null
  );

  const showExperienceFormState =
    externalShowForm !== undefined ? externalShowForm : showForm;

  const setShowExperienceFormState = (show: boolean) => {
    if (externalSetShowForm) {
      externalSetShowForm(show);
    } else {
      setShowFormInternal(show);
    }
  };

  // Convert form data to API format
  const convertFormToApiFormat = (formData: any): Experience => {
    const fromDate = `${formData.fromYear}-${getMonthNumber(
      formData.fromMonth
    )}-01`;

    let toDate;
    if (formData.toMonth && formData.toYear && !formData.currentlyWorking) {
      toDate = `${formData.toYear}-${getMonthNumber(formData.toMonth)}-01`;
    }

    return {
      jobTitle: formData.jobTitle,
      companyName: formData.companyName,
      fromDate,
      toDate,
      currentlyWorking: formData.currentlyWorking || false,
      employmentType: formData.employmentType,
      location: formData.location,
      locationType: formData.locationType,
      description: formData.description,
      foundVia: formData.foundVia,
      skills: formData.skills || [],
      media: formData.media,
    };
  };

  // Convert API experience to form data format
  const convertApiToFormData = (experience: Experience): ExperienceFormData => {
    const { month: fromMonth, year: fromYear } = extractDateInfo(
      experience.fromDate
    );

    let toMonth = "",
      toYear = "";
    if (experience.toDate) {
      const toDateInfo = extractDateInfo(experience.toDate);
      toMonth = toDateInfo.month;
      toYear = toDateInfo.year;
    }

    return {
      index: experience.index,
      jobTitle: experience.jobTitle,
      companyName: experience.companyName,
      employmentType: experience.employmentType || "",
      location: experience.location || "",
      fromMonth,
      fromYear,
      toMonth,
      toYear,
      currentlyWorking: experience.currentlyWorking || false,
      locationType: experience.locationType || "",
      description: experience.description || "",
      skills: experience.skills || [],
      foundVia: experience.foundVia || "",
    };
  };

  // Fetch user data with experiences from /user/me endpoint
  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(API_ROUTES.me);

      if (response.data && response.data.user) {
        setUserData(response.data.user);

        // Extract and format work experience from user data
        const workExp = response.data.user.workExperience || [];
        const formattedExperiences = workExp.map((exp: any, idx: number) => ({
          ...exp,
          index: idx,
        }));

        setExperiences(formattedExperiences);
      } else {
        throw new Error("User data not found in response");
      }

      setIsLoading(false);
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      setError(
        error.response?.data?.message || "Failed to load user profile data."
      );
      setIsLoading(false);
    }
  };

  // Save experience data
  const handleSaveExperience = async (formData: any) => {
    try {
      setIsProcessing(true);

      // Create FormData object for multipart form data submission (for media files)
      const apiData = convertFormToApiFormat(formData);

      // Use FormData for API submission to handle media files properly
      const formDataForApi = new FormData();

      // Add all fields to FormData
      Object.keys(apiData).forEach((key) => {
        if (key === "skills" && Array.isArray(apiData[key])) {
          // Handle skills array properly
          apiData[key].forEach((skill: string) => {
            formDataForApi.append("skills", skill);
          });
        } else if (key === "media" && apiData[key] instanceof File) {
          // Add media file if it exists
          formDataForApi.append("media", apiData[key]);
        } else if (apiData[key] !== undefined && apiData[key] !== null) {
          // Add other fields
          formDataForApi.append(key, apiData[key].toString());
        }
      });

      let response;

      if (formData.index !== undefined && experiences[formData.index]?._id) {
        // Update existing experience
        const experienceId = experiences[formData.index]._id;
        response = await axios.patch(
          `${API_ROUTES.experience}/${experienceId}`,
          formDataForApi,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // Add new experience
        response = await axios.post(API_ROUTES.experience, formDataForApi, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      // Refresh user data to get updated experiences
      await fetchUserData();

      setShowExperienceFormState(false);
      setShowAddConfirmation(true);
      setEditingExperience(null);
      setIsProcessing(false);
    } catch (error: any) {
      console.error("Error saving experience:", error);
      setError(
        error.response?.data?.message || "Failed to save experience data."
      );
      setIsProcessing(false);
    }
  };

  const handleEditExperience = (exp: Experience) => {
    setEditingExperience(exp);
    setShowExperienceFormState(true);
  };

  const handleDeleteExperience = async () => {
    if (pendingDeleteIndex === undefined) {
      return;
    }

    try {
      setIsProcessing(true);

      const experienceId = experiences[pendingDeleteIndex]?._id;
      if (!experienceId) {
        throw new Error("Experience ID not found");
      }

      await axios.delete(`${API_ROUTES.experience}/${experienceId}`);

      // Refresh user data
      await fetchUserData();

      setShowDeleteConfirmation(false);
      setShowDeleteSuccess(true);
      setPendingDeleteIndex(undefined);
      setIsProcessing(false);
    } catch (error: any) {
      console.error("Error deleting experience:", error);
      setError(error.response?.data?.message || "Failed to delete experience.");
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

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
        onClick={fetchUserData}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  // Experience Entry Form View (Empty State)
  const EmptyStateView = () => (
    <div className="p-4 border border-gray-200 rounded-lg">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 mr-3 bg-gray-100 flex items-center justify-center rounded-lg text-gray-400">
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
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
        </div>
        <div>
          <p className="text-gray-500">Position</p>
          <p className="text-gray-400 text-sm">Company, Location</p>
          <p className="text-gray-400 text-sm">2019 - 2023</p>
        </div>
      </div>
      <button
        onClick={() => setShowExperienceFormState(true)}
        className="w-full text-blue-600 font-medium border border-blue-600 rounded-full py-2 hover:bg-blue-50 transition-colors"
      >
        Add experience
      </button>
    </div>
  );

  // If still loading data
  if (isLoading) {
    return <LoadingSkeletonView />;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4 w-[900px] m-auto relative">
      {/* Processing Overlay */}
      {isProcessing && <LoadingOverlay />}

      {/* Header with title and add button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Experience</h2>
        {experiences.length > 0 && (
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setEditingExperience(null);
                setShowExperienceFormState(true);
              }}
              className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
              title="Add experience"
            >
              <Plus size={20} />
            </button>
          </div>
        )}
      </div>

      {error ? (
        <ErrorView />
      ) : experiences.length > 0 ? (
        <div className="space-y-4">
          {experiences.map((exp, idx) => {
            // Format years for display
            const startYear = exp.fromDate
              ? new Date(exp.fromDate).getFullYear().toString()
              : "";
            const endYear = exp.currentlyWorking
              ? "Present"
              : exp.toDate
              ? new Date(exp.toDate).getFullYear().toString()
              : "Present";

            return (
              <div key={idx} className="flex items-start group">
                <div className="w-10 h-10 mr-3 bg-blue-50 flex items-center justify-center rounded-lg text-blue-500">
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
                      strokeWidth="2"
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-gray-800">
                      {exp.jobTitle}
                    </h3>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditExperience(exp)}
                        className="text-blue-500 hover:text-blue-700 p-1"
                        title="Edit experience"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setPendingDeleteIndex(exp.index);
                          setShowDeleteConfirmation(true);
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete experience"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{exp.companyName}</p>
                  {exp.employmentType && (
                    <p className="text-gray-500 text-sm">
                      {exp.employmentType}
                    </p>
                  )}
                  {exp.location && (
                    <p className="text-gray-500 text-sm">{exp.location}</p>
                  )}
                  <p className="text-gray-500 text-sm">
                    {startYear} - {endYear}
                  </p>
                  {exp.description && (
                    <p className="text-gray-600 mt-1 text-sm">
                      {exp.description}
                    </p>
                  )}
                  {exp.skills && exp.skills.length > 0 && (
                    <div className="mt-2">
                      <p className="text-gray-500 text-sm">Skills:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {exp.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyStateView />
      )}

      {/* Experience Form Dialog */}
      {showExperienceFormState && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <ExperienceForm
            initialData={
              editingExperience
                ? convertApiToFormData(editingExperience)
                : undefined
            }
            onClose={() => {
              setShowExperienceFormState(false);
              setEditingExperience(null);
            }}
            onSave={handleSaveExperience}
          />
        </div>
      )}

      {/* Add Confirmation Dialog */}
      {showAddConfirmation && (
        <ConfirmationDialog
          title={
            editingExperience
              ? "Experience Updated Successfully"
              : "Experience Added Successfully"
          }
          message={
            editingExperience
              ? "Your experience has been updated on your profile."
              : "Your experience has been added to your profile."
          }
          confirmText="Done"
          onConfirm={() => setShowAddConfirmation(false)}
          onCancel={() => setShowAddConfirmation(false)}
          showAddMore={!editingExperience}
          onAddMore={() => {
            setShowAddConfirmation(false);
            setEditingExperience(null);
            setShowExperienceFormState(true);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirmation && (
        <ConfirmationDialog
          title="Delete Experience"
          message="Are you sure you want to delete this experience entry?"
          confirmText="Delete"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
          onConfirm={handleDeleteExperience}
          onCancel={() => {
            setShowDeleteConfirmation(false);
            setPendingDeleteIndex(undefined);
          }}
        />
      )}

      {/* Delete Success Dialog */}
      {showDeleteSuccess && (
        <ConfirmationDialog
          title="Experience Deleted Successfully"
          message="The experience entry has been removed from your profile."
          confirmText="OK"
          onConfirm={() => setShowDeleteSuccess(false)}
          onCancel={() => setShowDeleteSuccess(false)}
        />
      )}
    </div>
  );
};

export default ExperienceSection;
