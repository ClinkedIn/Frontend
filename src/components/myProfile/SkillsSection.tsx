import React, { useState, useEffect } from "react";
import { Pencil, Plus, Trash2, Users } from "lucide-react";
import ConfirmationDialog from "./ConfirmationDialog";
import SkillEndorsements from "./SkillEndorsements.tsx";

interface Skill {
  _id?: string;
  skillName: string;
  education?: number[];
  experience?: number[];
  endorsements?: string[];
  index?: number;
}

interface SkillsSectionProps {
  skills: Skill[];
  onEditSkill: (skill: Skill) => void;
  onSkillsSaved: () => Promise<void>;
  onDeleteSkill?: (skillName: string) => Promise<boolean>;
  currentUserId: string;
  skillOwnerId: string;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({
  skills,
  onEditSkill,
  onSkillsSaved,
  onDeleteSkill,
  currentUserId,
  skillOwnerId,
}) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [pendingDeleteSkill, setPendingDeleteSkill] = useState<Skill | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteConfirmation = (skill: Skill) => {
    setPendingDeleteSkill(skill);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteSkill = async () => {
    if (!pendingDeleteSkill) return;

    setIsProcessing(true);
    try {
      if (onDeleteSkill) {
        // Use the provided delete function from parent
        const success = await onDeleteSkill(pendingDeleteSkill.skillName);

        if (success) {
          setShowDeleteConfirmation(false);
          setShowDeleteSuccess(true);
        } else {
          throw new Error("Failed to delete the skill");
        }
      } else {
        // Fallback to original behavior
        await onSkillsSaved();
        setShowDeleteConfirmation(false);
        setShowDeleteSuccess(true);
      }
      setPendingDeleteSkill(null);
    } catch (error: any) {
      console.error("Error in skill deletion process:", error);
      setError(error.message || "An error occurred while deleting the skill");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEndorseSkill = async (
    skillName: string,
    skillOwnerId: string
  ) => {
    try {
      const response = await fetch(
        "/user/skills/endorsements/add-endorsement",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            skillOwnerId,
            skillName,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add endorsement");
      }

      await onSkillsSaved();
      return true;
    } catch (error: any) {
      console.error("Error adding endorsement:", error);
      throw error;
    }
  };

  const handleRemoveEndorsement = async (
    skillName: string,
    skillOwnerId: string
  ) => {
    try {
      const response = await fetch(
        `/user/skills/endorsements/remove-endorsement/${skillName}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            skillOwnerId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to remove endorsement");
      }

      await onSkillsSaved();
      return true;
    } catch (error: any) {
      console.error("Error removing endorsement:", error);
      throw error;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4 relative w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Skills</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => onEditSkill({ skillName: "" })}
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {skills.length > 0 ? (
          skills.map((skill, idx) => (
            <div
              key={skill._id || idx}
              className="border border-gray-200 rounded-lg p-3 group relative hover:border-blue-200"
            >
              <div className="flex justify-between">
                <h3 className="font-medium text-gray-800">{skill.skillName}</h3>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleDeleteConfirmation(skill)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Delete skill"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {(skill.education || skill.experience) &&
                (skill.education?.length > 0 ||
                  skill.experience?.length > 0) && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Related to:</p>
                    <div className="flex flex-wrap gap-1">
                      {skill.education?.map((eduIdx) => (
                        <span
                          key={`edu-${eduIdx}`}
                          className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded"
                        >
                          Education #{eduIdx + 1}
                        </span>
                      ))}
                      {skill.experience?.map((expIdx) => (
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

              <SkillEndorsements
                skillName={skill.skillName}
                endorsements={skill.endorsements || []}
                onEndorse={handleEndorseSkill}
                onRemoveEndorse={handleRemoveEndorsement}
                currentUserId={currentUserId}
                skillOwnerId={skillOwnerId}
              />
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-8 text-gray-500">
            No skills added yet. Click the + button to add your first skill.
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirmation && (
        <ConfirmationDialog
          title="Delete Skill"
          message={`Are you sure you want to delete "${pendingDeleteSkill?.skillName}" from your profile?`}
          confirmText="Delete"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
          onConfirm={handleDeleteSkill}
          onCancel={() => {
            setShowDeleteConfirmation(false);
            setPendingDeleteSkill(null);
          }}
          isLoading={isProcessing}
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
