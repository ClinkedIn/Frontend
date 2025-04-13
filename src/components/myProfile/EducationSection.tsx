import React, { useState, useEffect } from "react";
import axios from "axios";
import EducationForm from "./Forms/EducationForm";
import ConfirmationDialog from "./ConfirmationDialog";
import { Loader, Plus, Pencil, X, Trash2 } from "lucide-react";
import { BASE_URL } from "../../constants";
interface Education {
  index?: number;
  school: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  grade?: string;
  activitiesAndSocieties?: string;
  description?: string;
  skills?: string[];
}

interface EducationFormData {
  index?: number;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startMonth: string;
  startYear: string;
  endMonth?: string;
  endYear?: string;
  grade?: string;
  activities?: string;
  description?: string;
}

interface EducationSectionProps {
  showEducationForm?: boolean;
  setShowEducationForm?: React.Dispatch<React.SetStateAction<boolean>>;
}

const API_BASE_URL = BASE_URL;
const API_ROUTES = {
  login: `${API_BASE_URL}/user/login`,
  education: `${API_BASE_URL}/user/education`,
};

const getMonthNumber = (monthName: string): string => {
  const months = [
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
  const monthIndex = months.findIndex((m) => m === monthName);
  return monthIndex !== -1
    ? (monthIndex + 1).toString().padStart(2, "0")
    : "01";
};

const EducationSection: React.FC<EducationSectionProps> = ({
  showEducationForm: externalShowForm,
  setShowEducationForm: externalSetShowForm,
}) => {
  // State management
  const [educations, setEducations] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // UI state
  const [showForm, setShowFormInternal] = useState(false);
  const [showAddConfirmation, setShowAddConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<
    number | undefined
  >(undefined);
  const [isProcessing, setIsProcessing] = useState(false);

  const showEducationFormState =
    externalShowForm !== undefined ? externalShowForm : showForm;

  const setShowEducationFormState = (show: boolean) => {
    if (externalSetShowForm) {
      externalSetShowForm(show);
    } else {
      setShowFormInternal(show);
    }
  };

  // Convert form data to API format
  const convertFormToApiFormat = (formData: EducationFormData): Education => {
    const startDate = `${formData.startYear}-${getMonthNumber(
      formData.startMonth
    )}-01`;

    let endDate;
    if (formData.endMonth && formData.endYear) {
      endDate = `${formData.endYear}-${getMonthNumber(formData.endMonth)}-01`;
    }

    return {
      index: formData.index,
      school: formData.school,
      degree: formData.degree,
      fieldOfStudy: formData.fieldOfStudy,
      startDate,
      endDate,
      grade: formData.grade,
      activitiesAndSocieties: formData.activities,
      description: formData.description,
      skills: [],
    };
  };

  // Parse education data from API response
  const parseEducationData = (data: any): Education[] => {
    if (Array.isArray(data)) {
      return data.map((edu, idx) => ({ ...edu, index: idx }));
    }

    if (data.educations && Array.isArray(data.educations)) {
      return data.educations.map((edu: any, idx: number) => ({
        ...edu,
        index: idx,
      }));
    }

    if (data.message && data.message.includes("deleted") && data.educations) {
      return Array.isArray(data.educations)
        ? data.educations.map((edu: any, idx: number) => ({
            ...edu,
            index: idx,
          }))
        : [];
    }

    if (data.school) {
      return [{ ...data, index: 0 }];
    }

    console.error("Invalid data structure from server:", data);
    return [];
  };

  // Login function
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
        console.log("Authenticated ");
        await fetchEducation();
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

  // Fetch education data
  const fetchEducation = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(API_ROUTES.education, {
        withCredentials: true,
      });

      const educationData = parseEducationData(response.data);
      setEducations(educationData);
      setIsLoading(false);
    } catch (error: any) {
      console.error("Error fetching education data:", error);

      if (error.response && error.response.status === 401) {
        setIsAuthenticated(false);
        setError("Your session has expired. Please login again.");
      } else {
        setError(
          error.response?.data?.message || "Failed to load education data."
        );
      }

      setIsLoading(false);
    }
  };

  // Save education data
  const handleSaveEducation = async (formData: EducationFormData) => {
    try {
      setIsProcessing(true);
      await new Promise((resolve) => setTimeout(resolve, 300));

      const apiData = convertFormToApiFormat(formData);

      if (formData.index !== undefined) {
        await axios.patch(
          `${API_ROUTES.education}/${formData.index}`,
          apiData,
          { withCredentials: true }
        );
      } else {
        await axios.post(API_ROUTES.education, apiData, {
          withCredentials: true,
        });
      }

      await fetchEducation();

      setShowEducationFormState(false);
      setShowAddConfirmation(true);
      setIsProcessing(false);
    } catch (error: any) {
      console.error("Error saving education:", error);

      if (error.response && error.response.status === 401) {
        setIsAuthenticated(false);
        setError("Your session has expired. Please login again.");
      } else {
        setError(
          error.response?.data?.message || "Failed to save education data."
        );
      }

      setIsProcessing(false);
    }
  };

  const handleDeleteEducation = async () => {
    setIsProcessing(true);

    if (pendingDeleteIndex === undefined) {
      return;
    }

    try {
      const response = await axios.delete(
        `${API_ROUTES.education}/${pendingDeleteIndex}`,
        { withCredentials: true }
      );

      const updatedEducations = parseEducationData(response.data);
      setEducations(updatedEducations);

      setShowDeleteConfirmation(false);
      setShowDeleteSuccess(true);
      setPendingDeleteIndex(undefined);
      setIsProcessing(false);
    } catch (error: any) {
      console.error("Error deleting education:", error);

      if (error.response && error.response.status === 401) {
        setIsAuthenticated(false);
        setError("Your session has expired. Please login again.");
      } else {
        setError(
          error.response?.data?.message || "Failed to delete education."
        );
      }

      setIsProcessing(false);
    }
  };

  useEffect(() => {
    login();
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
        onClick={login}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  // Education Entry Form View (Empty State)
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
          <p className="text-gray-500">School</p>
          <p className="text-gray-400 text-sm">Degree, Field of study</p>
          <p className="text-gray-400 text-sm">2019 - 2023</p>
        </div>
      </div>
      <button
        onClick={() => setShowEducationFormState(true)}
        className="w-full text-blue-600 font-medium border border-blue-600 rounded-full py-2 hover:bg-blue-50 transition-colors"
      >
        Add education
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
        <h2 className="text-xl font-bold text-gray-800">Education</h2>
        {educations.length > 0 && (
          <div className="flex space-x-2">
            <button
              onClick={() => setShowEducationFormState(true)}
              className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
              title="Add education"
            >
              <Plus size={20} />
            </button>
            <button
              className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
              title="Edit education"
            >
              <Pencil size={20} />
            </button>
          </div>
        )}
      </div>

      {error ? (
        <ErrorView />
      ) : educations.length > 0 ? (
        <div className="space-y-4">
          {educations.map((edu, idx) => {
            // Format years for display
            const startYear = edu.startDate
              ? new Date(edu.startDate).getFullYear().toString()
              : "";
            const endYear = edu.endDate
              ? new Date(edu.endDate).getFullYear().toString()
              : "Present";

            // Format degree and field of study
            const degreeAndField = [edu.degree, edu.fieldOfStudy]
              .filter(Boolean)
              .join(", ");

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
                      d="M12 14l9-5-9-5-9 5 9 5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-gray-800">{edu.school}</h3>
                    <button
                      onClick={() => {
                        setPendingDeleteIndex(edu.index);
                        setShowDeleteConfirmation(true);
                      }}
                      className="text-red-500 hover:text-red-700 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete education"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {degreeAndField && (
                    <p className="text-gray-600 text-sm">{degreeAndField}</p>
                  )}
                  <p className="text-gray-500 text-sm">
                    {startYear} - {endYear}
                  </p>

                  {/* Show additional details if available */}
                  {edu.grade && (
                    <p className="text-gray-500 text-sm mt-1">
                      Grade: {edu.grade}
                    </p>
                  )}
                  {edu.activitiesAndSocieties && (
                    <p className="text-gray-500 text-sm mt-1">
                      Activities: {edu.activitiesAndSocieties}
                    </p>
                  )}
                  {edu.description && (
                    <p className="text-gray-600 mt-1 text-sm">
                      {edu.description}
                    </p>
                  )}
                  {edu.skills && edu.skills.length > 0 && (
                    <div className="mt-2">
                      <p className="text-gray-500 text-sm">Skills:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {edu.skills.map((skill, idx) => (
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

      {/* Education Form Modal */}
      {showEducationFormState && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-screen overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-bold">Education</h3>
              <button
                onClick={() => setShowEducationFormState(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-600 mb-4">
                Show your qualifications and be up to 2X more likely to receive
                a recruiter InMail
              </p>
              <EducationForm
                onClose={() => setShowEducationFormState(false)}
                onSave={handleSaveEducation}
              />
            </div>
          </div>
        </div>
      )}

      {/* Add Confirmation Dialog */}
      {showAddConfirmation && (
        <ConfirmationDialog
          title="Education Added Successfully"
          message="Your education has been added to your profile."
          confirmText="Done"
          onConfirm={() => setShowAddConfirmation(false)}
          onCancel={() => setShowAddConfirmation(false)}
          showAddMore
          onAddMore={() => {
            setShowAddConfirmation(false);
            setShowEducationFormState(true);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirmation && (
        <ConfirmationDialog
          title="Delete Education"
          message="Are you sure you want to delete this education entry?"
          confirmText="Delete"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
          onConfirm={handleDeleteEducation}
          onCancel={() => {
            setShowDeleteConfirmation(false);
            setPendingDeleteIndex(undefined);
          }}
        />
      )}

      {/* Delete Success Dialog */}
      {showDeleteSuccess && (
        <ConfirmationDialog
          title="Education Deleted Successfully"
          message="The education entry has been removed from your profile."
          confirmText="OK"
          onConfirm={() => setShowDeleteSuccess(false)}
          onCancel={() => setShowDeleteSuccess(false)}
        />
      )}
    </div>
  );
};

export default EducationSection;
