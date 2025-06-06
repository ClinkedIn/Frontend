/**
 * @module ProfilePage
 * @description User profile page component that displays and manages user profile information
 * @requires React
 * @requires axios
 */

/**
 * ProfilePage Component
 *
 * This component renders a user's LinkedIn-like profile page with multiple sections:
 * - Profile header with user details and profile/cover images
 * - Experience section showing work history
 * - Education section showing academic background
 * - Skills section displaying user's professional skills
 * - Resume section for CV/resume upload and display
 * - Activity section showing recent user activity
 * - People You May Know widget for networking suggestions
 *
 * @component
 * @example
 * return (
 *   <ProfilePage />
 * )
 */
import React, { useState, useEffect } from "react";
import axios from "axios";

import Navbar from "../../components/UpperNavBar";
import ProfileHeader from "../../components/myProfile/ProfileHeader";
import ExperienceSection from "../../components/myProfile/ExperienceSection";
import EducationSection from "../../components/myProfile/EducationSection";
import SkillsSection from "../../components/myProfile/SkillsSection";
import ResumeSection from "../../components/myProfile/ResumeSection";
import Button from "../../components/Button";
import ExperienceForm from "../../components/myProfile/Forms/ExperienceForm";
import EducationForm from "../../components/myProfile/Forms/EducationForm";
import SkillsForm from "../../components/myProfile/Forms/SkillsForm";
import ResumeForm from "../../components/myProfile/Forms/ResumeForm";
import AddSectionForm from "../../components/myProfile/Forms/AddSectionForm";
import ActivitySection from "../../components/myProfile/ActivitySection";
import PeopleYouMayKnow from "../../components/myProfile/PeopleYouMayKnow";
import adPhoto from "../../../public/Images/linkedInAd.png";
import { useNavigate } from "react-router-dom";

/**
 * Interface for Experience Form Data
 * Contains all fields required for creating or editing work experiences
 * @typedef {Object} ExperienceFormData
 * @property {number} [index] - Index for editing existing experience
 * @property {string} jobTitle - Job position/title
 * @property {string} companyName - Name of the employer/company
 * @property {string} fromMonth - Starting month of employment
 * @property {string} fromYear - Starting year of employment
 * @property {string} [toMonth] - End month (optional if currently working)
 * @property {string} [toYear] - End year (optional if currently working)
 * @property {boolean} [currentlyWorking] - Indicates if this is current position
 * @property {string} [employmentType] - Type of employment (Full-time, Part-time, etc.)
 * @property {string} [location] - Physical location of the job
 * @property {string} [locationType] - Remote, On-site, Hybrid
 * @property {string} [description] - Job description/responsibilities
 * @property {string[]} [skills] - Skills utilized in this role
 * @property {File|null} [media] - Supporting documents/media
 * @property {string} [foundVia] - How the job was found
 * @property {string} fromDate - Formatted start date
 * @property {string} [toDate] - Formatted end date
 */
interface ExperienceFormData {
  index?: number; // Index for editing existing experience
  jobTitle: string; // Job position/title
  companyName: string; // Name of the employer/company
  fromMonth: string; // Starting month of employment
  fromYear: string; // Starting year of employment
  toMonth?: string; // End month (optional if currently working)
  toYear?: string; // End year (optional if currently working)
  currentlyWorking?: boolean; // Indicates if this is current position
  employmentType?: string; // Type of employment (Full-time, Part-time, etc.)
  location?: string; // Physical location of the job
  locationType?: string; // Remote, On-site, Hybrid
  description?: string; // Job description/responsibilities
  skills?: string[]; // Skills utilized in this role
  media?: File | null; // Supporting documents/media
  foundVia?: string; // How the job was found
  fromDate;
  toDate?: string; // Formatted end date
}

/**
 * Interface for Education Form Data
 * Contains all fields required for creating or editing education entries
 * @typedef {Object} EducationFormData
 * @property {number} [index] - Index for editing existing education entry
 * @property {string} schoolName - Name of school/university
 * @property {string} degree - Degree obtained
 * @property {string} fieldOfStudy - Major/concentration
 * @property {string} startYear - Year education began
 * @property {string} [endYear] - Year education completed (optional if currently studying)
 * @property {boolean} [currentlyStudying] - Indicates if currently studying
 * @property {string} [description] - Description of studies
 */
interface EducationFormData {
  index?: number; // Index for editing existing education entry
  schoolName: string; // Name of school/university
  degree: string; // Degree obtained
  fieldOfStudy: string; // Major/concentration
  startYear: string; // Year education began
  endYear?: string; // Year education completed (optional if currently studying)
  currentlyStudying?: boolean; // Indicates if currently studying
  description?: string; // Description of studies
}

/**
 * Interface for Skill Form Data
 * Contains all fields required for creating or editing skills
 * @typedef {Object} SkillFormData
 * @property {string} skillName - Name of the skill
 * @property {string|null} [originalSkillName] - Original skill name when editing
 * @property {number[]} [education] - Associated education entries by index
 * @property {number[]} [experience] - Associated experience entries by index
 * @property {boolean} [isEditing] - Flag indicating if in edit mode
 */
interface SkillFormData {
  skillName: string;
  originalSkillName?: string | null;
  education?: number[];
  experience?: number[];
  isEditing?: boolean;
}

/**
 * Interface for Contact Information
 * Contains user contact details
 * @typedef {Object} ContactInfo
 * @property {{day: number, month: string}} [birthDay] - User's birthday
 * @property {{url: string|null, type: string|null}} [website] - User's website
 * @property {string} phone - User's phone number
 * @property {string} phoneType - Type of phone number
 * @property {string} address - User's address
 */
interface ContactInfo {
  birthDay?: {
    day: number;
    month: string;
  };
  website?: {
    url: string | null;
    type: string | null;
  };
  phone: string;
  phoneType: string;
  address: string;
}

/**
 * Interface for About Information
 * Contains user's description and skills
 * @typedef {Object} AboutInfo
 * @property {string|null} description - User's bio or description
 * @property {string[]} skills - User's skills
 */
interface AboutInfo {
  description: string | null;
  skills: string[];
}

/**
 * Interface for User Data
 * Contains all user profile information
 * @typedef {Object} User
 * @property {string} firstName - User's first name
 * @property {string} lastName - User's last name
 * @property {ContactInfo} contactInfo - User's contact information
 * @property {AboutInfo} about - User's description and skills
 * @property {string|null} profilePicture - URL to profile picture
 * @property {string|null} coverPicture - URL to cover picture
 * @property {string|null} headline - Professional headline
 * @property {string|null} additionalName - Middle or additional name
 * @property {string|null} website - Personal or professional website
 * @property {string|null} location - User's location
 * @property {string|null} industry - User's industry
 * @property {Array} [workExperience] - User's work experience
 * @property {Array} [education] - User's education
 * @property {Array} [skills] - User's skills
 * @property {Object} [resume] - User's resume information
 * @property {string} _id - User's unique identifier
 */
interface User {
  firstName: string;
  lastName: string;
  contactInfo: ContactInfo;
  about: AboutInfo;
  profilePicture: string | null;
  coverPicture: string | null;
  headline: string | null;
  additionalName: string | null;
  website: string | null;
  location: string | null;
  industry: string | null;
  workExperience?: any[];
  education?: any[];
  skills?: any[];
  resume?: any;
  _id: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const API_ROUTES = {
  me: `${API_BASE_URL}/user/me`,
  education: `${API_BASE_URL}/user/education`,
  experience: `${API_BASE_URL}/user/experience`,
  skills: `${API_BASE_URL}/user/skills`,
  resume: `${API_BASE_URL}/user/resume`,
  profile: `${API_BASE_URL}/user/pictures`,
  about: `${API_BASE_URL}/user/about`,
  contactInfo: `${API_BASE_URL}/user/contact-info`,
};

/**
 * SubscriptionAd Component
 * Displays a premium subscription advertisement
 * @component
 * @returns {JSX.Element} Subscription advertisement component
 */
const SubscriptionAd = () => {
  const navigate = useNavigate();

  const handleAdClick = () => {
    navigate("/Subscription-Plans");
  };
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-3 border-b">
        <h3 className="text-base font-medium">LockedIn Premium</h3>
      </div>
      <div className="p-3">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-[#F8C77E] rounded-full flex items-center justify-center text-black text-2xl mb-2">
            P
          </div>
          <p className="text-sm text-center mb-3">
            Unlock premium features to boost your career
          </p>
          <button
            className="bg-[#F8C77E] hover:bg-[#E9A53F] text-black rounded-full px-4 py-1 text-sm w-full"
            onClick={handleAdClick}
          >
            Try Premium for free
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * LinkedInProfile Component
 * Main profile component that manages user data and profile sections
 * @component
 * @returns {JSX.Element} Complete profile page
 */
const LinkedInProfile: React.FC = () => {
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [showSkillsForm, setShowSkillsForm] = useState(false);
  const [showResumeForm, setShowResumeForm] = useState(false);
  const [showAddSectionForm, setShowAddSectionForm] = useState(false);

  const [userData, setUserData] = useState<User | null>(null);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [resume, setResume] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<any>(null);
  const [selectedEducation, setSelectedEducation] = useState<any>(null);
  const [selectedSkill, setSelectedSkill] = useState<any>(null);

  /**
   * Fetches user profile data from the API
   * @async
   * @function fetchUserData
   * @returns {Promise<Object|null>} User data object or null if error
   */
  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get(API_ROUTES.me);

      if (response.data && response.data.user) {
        const user = response.data.user;
        const formattedUser = {
          ...user,
          about: {
            description: user.about?.description ?? user.bio ?? null,
            skills: user.skills?.map((skill: any) => skill.skillName) || [],
          },
        };

        setUserData(formattedUser);
        if (user.workExperience) {
          const formattedExperiences = user.workExperience.map(
            (exp: any, idx: number) => ({
              ...exp,
              index: idx,
            })
          );
          setExperiences(formattedExperiences);
        } else {
          setExperiences([]);
        }

        if (user.education) {
          const formattedEducation = user.education.map(
            (edu: any, idx: number) => ({
              ...edu,
              index: idx,
            })
          );
          setEducation(formattedEducation);
        } else {
          setEducation([]);
        }

        if (user.skills) {
          const formattedSkills = user.skills.map(
            (skill: any, idx: number) => ({
              ...skill,
              index: idx,
            })
          );
          setSkills(formattedSkills);
        } else {
          setSkills([]);
        }

        if (user.resume) {
          setResume(user.resume);
        } else {
          setResume(null);
        }

        setIsLoading(false);
        return user;
      } else {
        throw new Error("User data not found in response");
      }
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      setError("Failed to load user profile data. Please try again later.");
      setExperiences([]);
      setEducation([]);
      setSkills([]);
      setResume(null);
      setIsLoading(false);
      return null;
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  /**
   * Updates the user's about section
   * @async
   * @function handleUpdateAbout
   * @param {AboutInfo} aboutData - The about data to update
   * @returns {Promise<boolean>} Success status
   */
  const handleUpdateAbout = async (aboutData: AboutInfo) => {
    try {
      const response = await api.patch(API_ROUTES.about, { about: aboutData });
      if (userData) {
        setUserData((prev) => ({
          ...prev!,
          about: {
            ...prev!.about,
            description: aboutData.description,
          },
        }));
      }
      return true;
    } catch (error) {
      console.error("Error updating about section:", error);
      return false;
    }
  };

  /**
   * Updates the user's contact information
   * @async
   * @function handleUpdateContactInfo
   * @param {ContactInfo} contactInfoData - The contact information to update
   * @returns {Promise<boolean>} Success status
   */
  const handleUpdateContactInfo = async (contactInfoData: ContactInfo) => {
    try {
      await api.patch(API_ROUTES.contactInfo, contactInfoData);
      if (userData) {
        setUserData({
          ...userData,
          contactInfo: contactInfoData,
        });
      }
      return true;
    } catch (error) {
      console.error("Error updating contact info:", error);
      return false;
    }
  };

  /**
   * Fetches the user's profile picture from the API
   * @async
   * @function handleFetchProfilePicture
   * @returns {Promise<string|null>} URL of the profile picture or null if not found
   */
  const handleFetchProfilePicture = async () => {
    try {
      const response = await api.get(`${API_ROUTES.profile}/profile-picture`);
      return response.data?.profilePicture || null;
    } catch (error) {
      console.error("Error fetching profile picture:", error);
      return null;
    }
  };

  /**
   * Updates the user's profile picture
   * @async
   * @function handleUpdateProfilePicture
   * @param {File} file - The image file to upload as profile picture
   * @returns {Promise<boolean>} Success status
   * @throws {Error} When no file is provided
   */
  const handleUpdateProfilePicture = async (file: File) => {
    try {
      if (!file) {
        throw new Error("No file provided");
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post(
        `${API_ROUTES.profile}/profile-picture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.profilePicture) {
        setUserData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            profilePicture: response.data.profilePicture,
          };
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating profile picture:", error);
      return false;
    }
  };

  const handleUpdateCoverPicture = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("coverPicture", file);

      await api.post(`${API_ROUTES.profile}/cover-picture`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const url = URL.createObjectURL(file);
      if (userData) {
        setUserData({
          ...userData,
          coverPicture: url,
        });
      }

      return true;
    } catch (error) {
      console.error("Error updating cover picture:", error);
      return false;
    }
  };

  const handleSaveExperience = async (formData: ExperienceFormData) => {
    try {
      const getMonthNumber = (month: string): string =>
        (MONTHS.indexOf(month) + 1).toString().padStart(2, "0");

      const { fromDate, toDate, ...rest } = formData;

      const cleanedData = {
        ...rest,
        fromDate,
        ...(toDate ? { toDate } : {}),
      };

      await api.post(API_ROUTES.experience, cleanedData);

      await fetchUserData();
      setShowExperienceForm(false);
      setSelectedExperience(null);
      return true;
    } catch (error: any) {
      console.error("Error saving experience:", error);
      setError(
        error.response?.data?.message || "Failed to save experience data."
      );
      return false;
    }
  };

  const handleSaveEducation = async (formData: EducationFormData) => {
    try {
      const cleanedData = Object.fromEntries(
        Object.entries(formData).filter(
          ([_, value]) =>
            value !== "" &&
            value !== undefined &&
            !(Array.isArray(value) && value.length === 0)
        )
      );

      let response;
      if (formData.index !== undefined && education[formData.index]?._id) {
        const educationId = education[formData.index]._id;
        response = await api.patch(
          `${API_ROUTES.education}/${educationId}`,
          cleanedData
        );
      } else {
        response = await api.post(API_ROUTES.education, cleanedData);
      }

      const updatedUser = await fetchUserData();

      if (updatedUser?.education) {
        const formattedEducation = updatedUser.education.map(
          (edu: any, idx: number) => ({
            ...edu,
            index: idx,
          })
        );
        setEducation(formattedEducation);
      }

      setShowEducationForm(false);
      setSelectedEducation(null);
      return true;
    } catch (error: any) {
      console.error("Error saving education:", error);
      setError(
        error.response?.data?.message || "Failed to save education data."
      );
      return false;
    }
  };

  const handleSaveSkill = async (formData: SkillFormData) => {
    try {
      const cleanedData = Object.fromEntries(
        Object.entries(formData).filter(
          ([_, value]) =>
            value !== "" &&
            value !== undefined &&
            !(Array.isArray(value) && value.length === 0)
        )
      );

      if (formData.isEditing && formData.originalSkillName) {
        await api.patch(`${API_ROUTES.skills}/${formData.originalSkillName}`, {
          newSkillName: formData.skillName,
          educationIndexes: formData.education || [],
          experienceIndexes: formData.experience || [],
        });
      } else {
        await api.post(API_ROUTES.skills, {
          skillName: formData.skillName,
          educationIndexes: formData.education || [],
          experienceIndexes: formData.experience || [],
        });
      }

      await fetchUserData();
      setShowSkillsForm(false);
      setSelectedSkill(null);
      return true;
    } catch (error: any) {
      console.error("Error saving skill:", error);
      setError(error.response?.data?.message || "Failed to save skill data.");
      return false;
    }
  };

  const handleDeleteSkill = async (skillName: string) => {
    try {
      await api.delete(`${API_ROUTES.skills}/${skillName}`);
      await fetchUserData();
      return true;
    } catch (error: any) {
      console.error("Error deleting skill:", error);
      setError(error.response?.data?.message || "Failed to delete skill.");
      return false;
    }
  };

  const handleSaveResume = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("resume", file);

      await api.post(API_ROUTES.resume, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      await fetchUserData();
      setShowResumeForm(false);
      return true;
    } catch (error: any) {
      console.error("Error uploading resume:", error);
      setError(error.response?.data?.message || "Failed to upload resume.");
      return false;
    }
  };

  const handleEditExperience = (experience: any) => {
    setSelectedExperience(experience);
    setShowExperienceForm(true);
  };

  const handleEditEducation = (edu: any) => {
    setSelectedEducation(edu);
    setShowEducationForm(true);
  };

  const handleEditSkill = (skill: any) => {
    setSelectedSkill(skill);
    setShowSkillsForm(true);
  };

  const handleCloseForm = () => {
    setShowExperienceForm(false);
    setShowEducationForm(false);
    setShowSkillsForm(false);
    setShowResumeForm(false);
    setShowAddSectionForm(false);
    setSelectedExperience(null);
    setSelectedEducation(null);
    setSelectedSkill(null);
  };

  const handleAddSection = (sectionType: string) => {
    setShowAddSectionForm(false);

    switch (sectionType) {
      case "experience":
        setShowExperienceForm(true);
        break;
      case "education":
        setShowEducationForm(true);
        break;
      case "skills":
        setShowSkillsForm(true);
        break;
      case "resume":
        setShowResumeForm(true);
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#F4F2EE] min-h-screen">
        <Navbar />
        <div className="max-w-5xl mx-auto p-4 text-center">
          <p className="text-lg mt-8">Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div className="bg-[#F4F2EE] min-h-screen">
        <Navbar />
        <div className="max-w-5xl mx-auto p-4">
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mt-8">
            <h3 className="font-medium text-lg mb-2">Unable to load profile</h3>
            <p>{error}</p>
            <Button
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              onClick={fetchUserData}
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#F4F2EE] min-h-screen overflow-hidden">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap">
          <div className="w-full lg:w-3/4 lg:pr-6">
            {userData && (
              <ProfileHeader
                userData={userData}
                onUpdateAbout={handleUpdateAbout}
                onUpdateContactInfo={handleUpdateContactInfo}
                onUpdateProfilePicture={handleUpdateProfilePicture}
                onUpdateCoverPicture={handleUpdateCoverPicture}
                onAddSection={() => setShowAddSectionForm(true)}
                onFetchProfilePicture={handleFetchProfilePicture}
                onRefreshUserData={fetchUserData}
              />
            )}

            {experiences.length > 0 && (
              <div className="mt-6">
                <ExperienceSection
                  experience={experiences}
                  onExperienceSaved={fetchUserData}
                />
              </div>
            )}
            {education.length > 0 && (
              <div className="mt-6">
                <EducationSection
                  education={education}
                  onEducationSaved={() => fetchUserData()}
                />
              </div>
            )}
            {skills.length > 0 && (
              <div className="mt-6">
                <SkillsSection
                  skills={skills}
                  onEditSkill={handleEditSkill}
                  onSkillsSaved={() => fetchUserData()}
                  onDeleteSkill={handleDeleteSkill}
                  currentUserId={userData?._id || ""}
                  skillOwnerId={userData?._id || ""}
                />
              </div>
            )}
            {resume && (
              <div className="mt-6">
                <ResumeSection resume={resume} onResumeSaved={fetchUserData} />
              </div>
            )}

            <div className="mt-6 mb-8">
              <ActivitySection userId={userData?._id} />
            </div>
          </div>

          <div className="hidden lg:block lg:w-1/4">
            <div className="space-y-6 mt-18">
              <PeopleYouMayKnow />
            </div>

            <div className="mt-4">
              <SubscriptionAd />
            </div>

            <div className="shadow-sm rounded-lg overflow-hidden mt-4">
              <div className="w-full h-full">
                <img
                  src={adPhoto}
                  alt="LinkedIn Advertisement - See who's hiring on LinkedIn"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddSectionForm && (
        <div className="fixed inset-0 flex  items-center justify-center z-50">
          <AddSectionForm
            onClose={handleCloseForm}
            onAddSection={handleAddSection}
          />
        </div>
      )}

      {showExperienceForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <ExperienceForm
            initialData={selectedExperience}
            onSave={handleSaveExperience}
            onClose={handleCloseForm}
          />
        </div>
      )}

      {showEducationForm && (
        <EducationForm
          initialData={selectedEducation}
          onSave={handleSaveEducation}
          onClose={handleCloseForm}
        />
      )}

      {showSkillsForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <SkillsForm
            initialData={selectedSkill}
            onSave={handleSaveSkill}
            onClose={handleCloseForm}
          />
        </div>
      )}

      {showResumeForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <ResumeForm
            onSave={handleSaveResume}
            onClose={handleCloseForm}
            onResumeSaved={fetchUserData}
          />
        </div>
      )}
    </>
  );
};

export default LinkedInProfile;
