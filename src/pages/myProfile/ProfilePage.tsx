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
import adPhoto from "../../../public/Images/linkedInAd.png";
import { useNavigate } from "react-router-dom";

interface ExperienceFormData {
  index?: number;
  jobTitle: string;
  companyName: string;
  fromMonth: string;
  fromYear: string;
  toMonth?: string;
  toYear?: string;
  currentlyWorking?: boolean;
  employmentType?: string;
  location?: string;
  locationType?: string;
  description?: string;
  skills?: string[];
  media?: File | null;
  foundVia?: string;
}

interface EducationFormData {
  index?: number;
  schoolName: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear?: string;
  currentlyStudying?: boolean;
  description?: string;
}

interface SkillFormData {
  skillName: string;
  originalSkillName?: string | null;
  education?: number[];
  experience?: number[];
  isEditing?: boolean;
}

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

interface AboutInfo {
  description: string | null;
  skills: string[];
}

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

const handleAdClick = () => {
  const navigate = useNavigate();
  navigate("/premium");
};

const PeopleYouMayKnow = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4 mt-20">
      <div className="p-3 border-b">
        <h3 className="text-base font-medium">People you may know</h3>
      </div>
      <div className="p-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex items-center mb-3 last:mb-0">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="ml-2 flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <button className="bg-white cursor-pointer text-[#0073b1] border-[#0073b1] border-2 px-4 py-1 rounded-full hover:bg-[#EAF4FD] hover:[border-width:2px] box-border font-medium text-sm transition-all duration-150">
              Connect
            </button>
          </div>
        ))}
        <div className="mt-2 text-center">
          <a href="#" className="text-sm text-gray-500 hover:underline">
            Show more
          </a>
        </div>
      </div>
    </div>
  );
};

const SubscriptionAd = () => {
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

  const handleFetchProfilePicture = async () => {
    try {
      const response = await api.get(`${API_ROUTES.profile}/profile-picture`);
      return response.data?.profilePicture || null;
    } catch (error) {
      console.error("Error fetching profile picture:", error);
      return null;
    }
  };

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
      const cleanedData = Object.fromEntries(
        Object.entries(formData).filter(
          ([_, value]) =>
            value !== "" &&
            value !== undefined &&
            !(Array.isArray(value) && value.length === 0)
        )
      );

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
            <div className="mt-8">
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
