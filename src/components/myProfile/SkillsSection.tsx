import React, { useState, useEffect } from "react";
import axios from "axios";
import SkillsForm from "./Forms/SkillsForm";
import ConfirmationDialog from "./ConfirmationDialog";
import { Loader, Plus, Pencil, Trash2, X } from "lucide-react";

interface Skill {
  skillName: string;
  education: number[];
  experience: number[];
}

interface SkillsSectionProps {
  showSkillsForm?: boolean;
  setShowSkillsForm?: React.Dispatch<React.SetStateAction<boolean>>;
}

// API configuration
const API_BASE_URL = "http://localhost:3000";
const API_ROUTES = {
  skills: `${API_BASE_URL}/user/skills`,
};

const SkillsSection: React.FC<SkillsSectionProps> = ({
  showSkillsForm: externalShowForm,
  setShowSkillsForm: externalSetShowForm,
}) => {
  // State management
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [showForm, setShowFormInternal] = useState(false);
  const [showAddConfirmation, setShowAddConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [pendingDeleteSkill, setPendingDeleteSkill] = useState<string | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);

  // Form state control - use external if provided, internal otherwise
  const showSkillsFormState =
    externalShowForm !== undefined ? externalShowForm : showForm;

  const setShowSkillsFormState = (show: boolean) => {
    if (externalSetShowForm) {
      externalSetShowForm(show);
    } else {
      setShowFormInternal(show);
    }
  };

  const fetchSkills = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(API_ROUTES.skills);

      if (response.data && response.data.skills) {
        setSkills(response.data.skills);
      } else {
        setSkills([]);
      }
      setIsLoading(false);
    } catch (error: any) {
      console.error("Error fetching skills data:", error);
      setError(error.response?.data?.message || "Failed to load skills data.");
      setIsLoading(false);
    }
  };

  // Save skill
  const handleSaveSkill = async (skillData: any) => {
    try {
      setIsProcessing(true);

      // Simulating network delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (skillData.isEditing && skillData.originalSkillName) {
        // Update existing skill
        await axios.patch(
          `${API_ROUTES.skills}/${skillData.originalSkillName}`,
          {
            newSkillName: skillData.skillName,
            educationIndexes: skillData.educationIndexes,
            experienceIndexes: skillData.experienceIndexes,
          }
        );
      } else {
        // Add new skill
        await axios.post(API_ROUTES.skills, {
          skillName: skillData.skillName,
          educationIndexes: skillData.educationIndexes || [],
          experienceIndexes: skillData.experienceIndexes || [],
        });
      }

      await fetchSkills();
      setShowSkillsFormState(false);
      setShowAddConfirmation(true);
      setIsProcessing(false);
    } catch (error: any) {
      console.error("Error saving skill:", error);
      setError(error.response?.data?.message || "Failed to save skill.");
      setIsProcessing(false);
    }
  };

  // Delete skill
  const handleDeleteSkill = async () => {
    if (!pendingDeleteSkill) return;

    try {
      setIsProcessing(true);

      await axios.delete(`${API_ROUTES.skills}/${pendingDeleteSkill}`);

      await fetchSkills();
      setShowDeleteConfirmation(false);
      setShowDeleteSuccess(true);
      setPendingDeleteSkill(null);
      setIsProcessing(false);
    } catch (error: any) {
      console.error("Error deleting skill:", error);
      setError(error.response?.data?.message || "Failed to delete skill.");
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // Component rendering helpers
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
        onClick={fetchSkills}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  // Empty state view when no skills are added
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
          <p className="text-gray-500">Skills</p>
          <p className="text-gray-400 text-sm">
            Add your skills to showcase your expertise
          </p>
        </div>
      </div>
      <button
        onClick={() => setShowSkillsFormState(true)}
        className="w-full text-blue-600 font-medium border border-blue-600 rounded-full py-2 hover:bg-blue-50 transition-colors"
      >
        Add skills
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
        <h2 className="text-xl font-bold text-gray-800">Skills</h2>
        {skills.length > 0 && (
          <div className="flex space-x-2">
            <button
              onClick={() => setShowSkillsFormState(true)}
              className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
              title="Add skill"
            >
              <Plus size={20} />
            </button>
            <button
              className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
              title="Edit skills"
            >
              <Pencil size={20} />
            </button>
          </div>
        )}
      </div>

      {error ? (
        <ErrorView />
      ) : skills.length > 0 ? (
        <div className="space-y-4">
          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {skills.map((skill, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-lg p-3 group relative hover:border-blue-200"
              >
                <div className="flex justify-between">
                  <h3 className="font-medium text-gray-800">
                    {skill.skillName}
                  </h3>
                  <button
                    onClick={() => {
                      setPendingDeleteSkill(skill.skillName);
                      setShowDeleteConfirmation(true);
                    }}
                    className="text-red-500 hover:text-red-700 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete skill"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Tags for related items */}
                {(skill.education.length > 0 ||
                  skill.experience.length > 0) && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Related to:</p>
                    <div className="flex flex-wrap gap-1">
                      {skill.education.map((eduIdx) => (
                        <span
                          key={`edu-${eduIdx}`}
                          className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded"
                        >
                          Education #{eduIdx + 1}
                        </span>
                      ))}
                      {skill.experience.map((expIdx) => (
                        <span
                          key={`exp-${expIdx}`}
                          className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded"
                        >
                          Experience #{expIdx + 1}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyStateView />
      )}

      {/* Skills Form Modal */}
      {showSkillsFormState && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-screen overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-bold">Skills</h3>
              <button
                onClick={() => setShowSkillsFormState(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-600 mb-4">
                Add skills to showcase your strengths and attract potential
                employers
              </p>
              <SkillsForm
                onClose={() => setShowSkillsFormState(false)}
                onSave={handleSaveSkill}
              />
            </div>
          </div>
        </div>
      )}

      {/* Add Confirmation Dialog */}
      {showAddConfirmation && (
        <ConfirmationDialog
          title="Skill Added Successfully"
          message="Your skill has been added to your profile."
          confirmText="Done"
          onConfirm={() => setShowAddConfirmation(false)}
          onCancel={() => setShowAddConfirmation(false)}
          showAddMore
          onAddMore={() => {
            setShowAddConfirmation(false);
            setShowSkillsFormState(true);
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirmation && (
        <ConfirmationDialog
          title="Delete Skill"
          message="Are you sure you want to delete this skill from your profile?"
          confirmText="Delete"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
          onConfirm={handleDeleteSkill}
          onCancel={() => {
            setShowDeleteConfirmation(false);
            setPendingDeleteSkill(null);
          }}
        />
      )}

      {/* Delete Success Dialog */}
      {showDeleteSuccess && (
        <ConfirmationDialog
          title="Skill Deleted Successfully"
          message="The skill has been removed from your profile."
          confirmText="OK"
          onConfirm={() => setShowDeleteSuccess(false)}
          onCancel={() => setShowDeleteSuccess(false)}
        />
      )}
    </div>
  );
};

export default SkillsSection;
