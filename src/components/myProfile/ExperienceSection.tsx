import React, { useState, useEffect } from "react";
import axios from "axios";
import ExperienceForm from "./Forms/ExperienceForm";
import ConfirmationDialog from "./ConfirmationDialog";
import { Loader, Plus, Trash2 } from "lucide-react";
import {
  faBriefcaseClock,
  faCalendar,
  faMapMarkedAlt,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * Interface representing an experience entry
 * @interface Experience
 */
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
  _id?: string;
}

/**
 * Interface representing the form data structure for experience
 * @interface ExperienceFormData
 */
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

/**
 * Props for the ExperienceSection component
 * @interface ExperienceSectionProps
 */
interface ExperienceSectionProps {
  showExperienceForm?: boolean;
  setShowExperienceForm?: React.Dispatch<React.SetStateAction<boolean>>;
  experience?: Experience[];
  onExperienceSaved?: () => void;
}

/**
 * Base URL for API requests
 * @constant {string}
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * API route endpoints
 * @constant {Object}
 */
const API_ROUTES = {
  me: `${API_BASE_URL}/user/me`,
  experience: `${API_BASE_URL}/user/experience`,
};

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/**
 * List of month names
 * @constant {string[]}
 */
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

/**
 * Converts month name to two-digit month number string
 * @param {string} monthName - The name of the month
 * @returns {string} Two-digit month number as string (01-12)
 */
const getMonthNumber = (monthName: string): string => {
  const monthIndex = MONTHS.findIndex((m) => m === monthName);
  return monthIndex !== -1
    ? (monthIndex + 1).toString().padStart(2, "0")
    : "01";
};

/**
 * Extracts month and year from a date string
 * @param {string} dateString - Date in ISO format
 * @returns {{month: string, year: string}} Object containing month name and year
 */
const extractDateInfo = (dateString: string) => {
  if (!dateString) return { month: "April", year: "2025" };

  try {
    const date = new Date(dateString);
    const month = MONTHS[date.getMonth()];
    const year = date.getFullYear().toString();
    return { month, year };
  } catch (error) {
    console.error("Error parsing date:", error);
    return { month: "April", year: "2025" };
  }
};

/**
 * Parses experience data from API response
 * @param {any} data - Response data from API
 * @returns {Experience[]} Formatted experience array
 */
const parseExperienceData = (data: any): Experience[] => {
  if (Array.isArray(data)) {
    return data.map((exp, idx) => ({ ...exp, index: idx }));
  }

  if (data.experiences && Array.isArray(data.experiences)) {
    return data.experiences.map((exp: any, idx: number) => ({
      ...exp,
      index: idx,
    }));
  }

  if (data.message && data.message.includes("deleted") && data.experiences) {
    return Array.isArray(data.experiences)
      ? data.experiences.map((exp: any, idx: number) => ({
          ...exp,
          index: idx,
        }))
      : [];
  }

  if (data.jobTitle) {
    return [{ ...data, index: 0 }];
  }

  console.error("Invalid data structure from server:", data);
  return [];
};

/**
 * Component for displaying and managing work experience entries
 * @component
 * @param {ExperienceSectionProps} props - Component props
 * @returns {JSX.Element} Experience section component
 */
const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  showExperienceForm: externalShowForm,
  setShowExperienceForm: externalSetShowForm,
  experience: initialExperiences,
  onExperienceSaved,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

  const [experiences, setExperiences] = useState<Experience[]>(
    initialExperiences || []
  );
  const [showForm, setShowFormInternal] = useState(false);
  const [showAddConfirmation, setShowAddConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<
    number | undefined
  >(undefined);
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Combined state for showing experience form
   * Uses external state if provided, otherwise uses internal state
   * @type {boolean}
   */
  const showExperienceFormState =
    externalShowForm !== undefined ? externalShowForm : showForm;

  /**
   * Sets the visibility state of the experience form
   * Uses external setter if provided, otherwise uses internal setter
   * @param {boolean} show - Whether to show the form
   * @returns {void}
   */
  const setShowExperienceFormState = (show: boolean) => {
    if (externalSetShowForm) {
      externalSetShowForm(show);
    } else {
      setShowFormInternal(show);
    }
  };

  /**
   * Converts experience form data to API format
   * @param {any} formData - The form data to be converted
   * @returns {Experience} Experience data in API format
   */
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

  /**
   * Converts API experience data to form format
   * @param {Experience} experience - Experience data from API
   * @returns {ExperienceFormData} Experience data in form format
   */
  const convertApiToFormData = (experience: Experience): ExperienceFormData => {
    const { month: fromMonth, year: fromYear } = extractDateInfo(
      experience.fromDate
    );

    let toMonth = "",
      toYear = "";
    if (experience.toDate && experience.toDate !== "null") {
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

  /**
   * Fetches current user data including experience information
   * @async
   * @returns {Promise<void>}
   */
  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get(API_ROUTES.me);

      if (response.data && response.data.user) {
        setUserData(response.data.user);

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

  /**
   * Handles saving or updating an experience entry
   * @async
   * @param {any} formData - The form data to be saved
   * @returns {Promise<void>}
   */
  const handleSaveExperience = async (formData: any) => {
    try {
      setIsProcessing(true);

      const apiData = convertFormToApiFormat(formData);

      const formDataForApi = new FormData();

      Object.entries(apiData).forEach(([key, value]) => {
        if (key === "skills" && Array.isArray(value)) {
          value.forEach((skill: string) => {
            formDataForApi.append("skills", skill);
          });
        } else if (key === "media" && value instanceof File) {
          formDataForApi.append("media", value);
        } else if (value !== undefined && value !== null) {
          formDataForApi.append(key, String(value));
        }
      });

      let response;

      if (formData.index !== undefined && experiences[formData.index]?._id) {
        response = await api.patch(
          `${API_ROUTES.experience}/${formData.index}`,
          formDataForApi,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await api.post(API_ROUTES.experience, formDataForApi, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (onExperienceSaved) {
        onExperienceSaved();
      } else {
        await fetchUserData();
      }

      setShowExperienceFormState(false);
      setShowAddConfirmation(true);
      setIsProcessing(false);
    } catch (error: any) {
      console.error("Error saving experience:", error);
      console.error("Response data:", error.response?.data);
      console.error("Status:", error.response?.status);
      setError(
        error.response?.data?.message || "Failed to save experience data."
      );
      setIsProcessing(false);
    }
  };

  /**
   * Handles deleting an experience entry
   * @async
   * @returns {Promise<void>}
   */
  const parseExperienceData = (data: any): Experience[] => {
    if (Array.isArray(data)) {
      return data.map((exp, idx) => ({ ...exp, index: idx }));
    }

    if (data.experiences && Array.isArray(data.experiences)) {
      return data.experiences.map((exp: any, idx: number) => ({
        ...exp,
        index: idx,
      }));
    }

    if (data.message && data.message.includes("deleted") && data.experiences) {
      return Array.isArray(data.experiences)
        ? data.experiences.map((exp: any, idx: number) => ({
            ...exp,
            index: idx,
          }))
        : [];
    }

    if (data.jobTitle) {
      return [{ ...data, index: 0 }];
    }

    console.error("Invalid data structure from server:", data);
    return [];
  };

  const handleDeleteExperience = async () => {
    setIsProcessing(true);

    if (pendingDeleteIndex === undefined) {
      return;
    }

    try {
      await api.delete(`${API_ROUTES.experience}/${pendingDeleteIndex}`);

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

  /**
   * Fetches user data on component mount
   */
  useEffect(() => {
    if (initialExperiences && initialExperiences.length > 0) {
      setExperiences(initialExperiences);
      setIsLoading(false);
    }
  }, [initialExperiences]);
  /**
   * Renders a loading overlay with spinner
   * @returns {JSX.Element} Loading overlay component
   */
  const LoadingOverlay = () => (
    <div className="fixed inset-0  bg-opacity-30 flex items-center justify-center z-50">
      <Loader className="h-8 w-8 text-gray-600 animate-spin" />
    </div>
  );

  /**
   * Renders a skeleton loading view
   * @returns {JSX.Element} Loading skeleton component
   */
  const LoadingSkeletonView = () => (
    <div className="bg-white rounded-lg shadow p-4 mb-4 ">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-20 bg-gray-100 rounded-lg mb-3"></div>
      </div>
    </div>
  );

  /**
   * Renders an error message with retry button
   * @returns {JSX.Element} Error view component
   */
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

  /**
   * Renders an empty state view when no experiences exist
   * @returns {JSX.Element} Empty state component
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

  if (isLoading) {
    return <LoadingSkeletonView />;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4 m-auto relative w-full">
      {isProcessing && <LoadingOverlay />}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Experience</h2>
        {experiences.length > 0 && (
          <div className="flex space-x-2">
            <button
              onClick={() => {
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
            const startYear = exp.fromDate
              ? new Date(exp.fromDate).getFullYear().toString()
              : "Unknown";

            const endYear = exp.currentlyWorking
              ? "Present"
              : exp.toDate && exp.toDate !== "null"
              ? new Date(exp.toDate).getFullYear().toString()
              : "";

            return (
              <div key={idx} className="flex items-start group">
                <div className="w-10 h-10 mr-3 bg-blue-50 flex items-center justify-center rounded-lg text-blue-500">
                  <FontAwesomeIcon
                    icon={faBriefcaseClock}
                    className=" text-md "
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-gray-800 ">
                      {exp.jobTitle}
                    </h3>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setPendingDeleteIndex(idx);
                          setShowDeleteConfirmation(true);
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete experience"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mt-[-5px]">
                    {exp.companyName}
                  </p>
                  {exp.employmentType && (
                    <p className="text-gray-500 text-sm">
                      <FontAwesomeIcon
                        icon={faUserTie}
                        className="text-[#005cb7] hover:text-[#004182] text-xs mr-2"
                      />
                      {exp.employmentType}
                    </p>
                  )}
                  {exp.location && (
                    <p className="text-gray-500 text-sm">
                      <FontAwesomeIcon
                        icon={faMapMarkedAlt}
                        className="text-[#005cb7] hover:text-[#004182] text-xs mr-2"
                      />{" "}
                      {exp.location}
                    </p>
                  )}
                  <p className="text-gray-500 text-sm">
                    <FontAwesomeIcon
                      icon={faCalendar}
                      className="text-[#005cb7] hover:text-[#004182] text-xs mr-2"
                    />
                    {startYear} - {endYear}
                  </p>
                  {exp.description && (
                    <p className="text-gray-600 mt-1 text-sm">
                      <i className="fas fa-align-left mr-1"></i>
                      {exp.description}
                    </p>
                  )}
                  {exp.foundVia && (
                    <p className="text-gray-500 text-sm">
                      <i className="fas fa-search mr-1"></i>
                      {exp.foundVia}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyStateView />
      )}

      {showExperienceFormState && (
        <div className="fixed inset-0 bg-black/30   flex items-center justify-center z-50">
          <ExperienceForm
            initialData={undefined}
            onClose={() => {
              setShowExperienceFormState(false);
            }}
            onSave={handleSaveExperience}
          />
        </div>
      )}

      {showAddConfirmation && (
        <ConfirmationDialog
          title="Experience Will Be Added"
          message="Your experience will be added to your profile."
          confirmText="Okay"
          onConfirm={() => setShowAddConfirmation(false)}
          onCancel={() => setShowAddConfirmation(false)}
          onAddMore={() => {
            setShowAddConfirmation(false);
            setShowExperienceFormState(true);
          }}
        />
      )}

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
