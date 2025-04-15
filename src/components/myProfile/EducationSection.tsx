import React, { useState, useEffect } from "react";
import axios from "axios";
import EducationForm from "./Forms/EducationForm";
import ConfirmationDialog from "./ConfirmationDialog";
import { Loader, Plus, Pencil, X, Trash2 } from "lucide-react";

/**
 * Interface representing an education entry in a user's profile
 * @interface Education
 * @property {number} [index] - The index of the education entry in the array
 * @property {string} school - The name of the school or institution
 * @property {string} [degree] - The degree obtained (optional)
 * @property {string} [fieldOfStudy] - Field of study or major (optional)
 * @property {string} startDate - The start date in ISO format (YYYY-MM-DD)
 * @property {string} [endDate] - The end date in ISO format (YYYY-MM-DD) or undefined for ongoing education
 * @property {string} [grade] - The grade or GPA achieved (optional)
 * @property {string} [activitiesAndSocieties] - Activities and societies participation (optional)
 * @property {string} [description] - Description of the education experience (optional)
 * @property {string[]} [skills] - Skills associated with this education (optional)
 */
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

/**
 * Interface for education form data used in the UI
 * @interface EducationFormData
 * @property {number} [index] - The index of the education entry being edited
 * @property {string} school - The name of the school or institution
 * @property {string} degree - The degree obtained
 * @property {string} fieldOfStudy - Field of study or major
 * @property {string} startMonth - The starting month (e.g., "January")
 * @property {string} startYear - The starting year (e.g., "2020")
 * @property {string} [endMonth] - The ending month (optional)
 * @property {string} [endYear] - The ending year (optional)
 * @property {string} [grade] - The grade or GPA achieved (optional)
 * @property {string} [activities] - Activities and societies participation (optional)
 * @property {string} [description] - Description of the education experience (optional)
 */
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

/**
 * Props for the EducationSection component
 * @interface EducationSectionProps
 * @property {boolean} [showEducationForm] - External control for showing/hiding the education form
 * @property {React.Dispatch<React.SetStateAction<boolean>>} [setShowEducationForm] - External setter for the form visibility state
 */
interface EducationSectionProps {
  showEducationForm?: boolean;
  setShowEducationForm?: React.Dispatch<React.SetStateAction<boolean>>;
}

const API_BASE_URL = "http://localhost:3000";
const API_ROUTES = {
  education: `${API_BASE_URL}/user/education`,
};
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Converts month name to two-digit month number string (01-12)
 * @param {string} monthName - The full name of the month (e.g., "January")
 * @returns {string} - Two-digit month number as string (e.g., "01" for January)
 */
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

/**
 * Education Section Component - Displays and manages user education information
 * @component
 * @param {EducationSectionProps} props - Component props
 * @returns {React.ReactElement} The rendered education section
 */
const EducationSection: React.FC<EducationSectionProps> = ({
  showEducationForm: externalShowForm,
  setShowEducationForm: externalSetShowForm,
}) => {
  const [educations, setEducations] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  /**
   * Converts education form data to API format
   * @param {EducationFormData} formData - The form data from the education form
   * @returns {Education} The education data formatted for the API
   */
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

  /**
   * Parses education data from API response to component format
   * @param {any} data - Response data from the API
   * @returns {Education[]} Array of education entries with proper formatting
   */
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

  /**
   * Fetches education data from the API
   * @async
   * @returns {Promise<void>}
   */
  const fetchEducation = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get(API_ROUTES.education);
      const educationData = parseEducationData(response.data);
      setEducations(educationData);
      setIsLoading(false);
    } catch (error: any) {
      console.error("Error fetching education data:", error);
      setError(
        error.response?.data?.message || "Failed to load education data."
      );
      setIsLoading(false);
    }
  };

  /**
   * Handles saving education data to the API
   * @async
   * @param {EducationFormData} formData - The form data to be saved
   * @returns {Promise<void>}
   */
  const handleSaveEducation = async (formData: EducationFormData) => {
    try {
      setIsProcessing(true);
      await new Promise((resolve) => setTimeout(resolve, 300));

      const apiData = convertFormToApiFormat(formData);

      if (formData.index !== undefined) {
        await api.patch(`${API_ROUTES.education}/${formData.index}`, apiData);
      } else {
        await api.post(API_ROUTES.education, apiData);
      }

      await fetchEducation();

      setShowEducationFormState(false);
      setShowAddConfirmation(true);
      setIsProcessing(false);
    } catch (error: any) {
      console.error("Error saving education:", error);
      setError(
        error.response?.data?.message || "Failed to save education data."
      );
      setIsProcessing(false);
    }
  };

  /**
   * Handles deleting an education entry
   * @async
   * @returns {Promise<void>}
   */
  const handleDeleteEducation = async () => {
    setIsProcessing(true);

    if (pendingDeleteIndex === undefined) {
      return;
    }

    try {
      const response = await axios.delete(
        `${API_ROUTES.education}/${pendingDeleteIndex}`
      );

      const updatedEducations = parseEducationData(response.data);
      setEducations(updatedEducations);

      setShowDeleteConfirmation(false);
      setShowDeleteSuccess(true);
      setPendingDeleteIndex(undefined);
      setIsProcessing(false);
    } catch (error: any) {
      console.error("Error deleting education:", error);
      setError(error.response?.data?.message || "Failed to delete education.");
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  /**
   * Loading overlay component shown during processing
   * @returns {React.ReactElement}
   */
  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <Loader className="h-8 w-8 text-gray-600 animate-spin" />
    </div>
  );

  /**
   * Loading skeleton view for the education section
   * @returns {React.ReactElement}
   */
  const LoadingSkeletonView = () => (
    <div className="bg-white rounded-lg shadow p-4 mb-4 w-full">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-20 bg-gray-100 rounded-lg mb-3"></div>
      </div>
    </div>
  );

  /**
   * Error view component shown when data fetching fails
   * @returns {React.ReactElement}
   */
  const ErrorView = () => (
    <div className="text-red-500 p-4 rounded-lg bg-red-50 flex flex-col items-center">
      <p className="mb-3 text-center">{error}</p>
      <button
        onClick={fetchEducation}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  /**
   * Empty state view shown when no education entries exist
   * @returns {React.ReactElement}
   */
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

  if (isLoading) {
    return <LoadingSkeletonView />;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4 w-[900px] m-auto relative">
      {isProcessing && <LoadingOverlay />}

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
            const startYear = edu.startDate
              ? new Date(edu.startDate).getFullYear().toString()
              : "";
            const endYear = edu.endDate
              ? new Date(edu.endDate).getFullYear().toString()
              : "Present";

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
