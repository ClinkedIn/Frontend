import React, { useState } from "react";
import ConfirmationDialog from "../ConfirmationDialog";

/**
 * Props interface for the SkillsForm component
 * @interface SkillsFormProps
 * @property {Function} onClose - Function to handle closing the form
 * @property {Function} onSave - Function to handle saving the skill data
 * @property {Object} [editSkill] - Optional skill object for editing existing skills
 * @property {string} editSkill.skillName - Name of the skill being edited
 * @property {number[]} editSkill.educationIndexes - Array of education indexes related to this skill
 * @property {number[]} editSkill.experienceIndexes - Array of experience indexes related to this skill
 */
interface SkillsFormProps {
  onClose: () => void;
  onSave: (skill: any) => void;
  editSkill?: {
    skillName: string;
    educationIndexes: number[];
    experienceIndexes: number[];
  };
}

/**
 * Array of commonly used skills for quick selection
 * @constant {string[]} COMMON_SKILLS
 */
const COMMON_SKILLS = [
  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "Node.js",
  "Python",
  "Java",
  "C++",
  "SQL",
  "MongoDB",
  "GraphQL",
  "TypeScript",
  "Git",
  "Docker",
  "AWS",
  "Azure",
  "Leadership",
  "Communication",
  "Problem Solving",
  "Project Management",
  "Agile",
  "Design Thinking",
  "Data Analysis",
];

/**
 * SkillsForm component for adding or editing skills in user profile
 *
 * @component
 * @param {SkillsFormProps} props - The component props
 * @returns {React.ReactElement} A form modal for adding or editing skills
 */
const SkillsForm: React.FC<SkillsFormProps> = ({
  onClose,
  onSave,
  editSkill,
}) => {
  const [skillName, setSkillName] = useState(editSkill?.skillName || "");
  const [originalSkillName, setOriginalSkillName] = useState(
    editSkill?.skillName || ""
  );
  const [isEditing, setIsEditing] = useState(!!editSkill);
  const [errors, setErrors] = useState<{ skillName?: string }>({});

  /**
   * Validates the form input fields
   *
   * @returns {boolean} True if form is valid, false otherwise
   */
  const validateForm = () => {
    const newErrors: { skillName?: string } = {};
    let isValid = true;

    if (!skillName.trim()) {
      newErrors.skillName = "Skill name is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  /**
   * Handles saving the skill data after validation
   */
  const handleSave = () => {
    if (validateForm()) {
      onSave({
        skillName,
        originalSkillName: isEditing ? originalSkillName : null,
        isEditing,
      });
    }
  };

  /**
   * Sets the skill name to a selected common skill
   *
   * @param {string} skill - The selected common skill
   */
  const selectCommonSkill = (skill: string) => {
    setSkillName(skill);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-xl shadow-lg overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold">
            {isEditing ? "Edit Skill" : "Add Skill"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">* Indicates required</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skill Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex: JavaScript, Project Management, Photoshop"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.skillName ? "border-red-500" : ""
                }`}
              />
              {errors.skillName && (
                <p className="text-red-500 text-sm mt-1">{errors.skillName}</p>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Common skills:
              </p>
              <div className="flex flex-wrap gap-2">
                {COMMON_SKILLS.map((skill, index) => (
                  <button
                    key={index}
                    onClick={() => selectCommonSkill(skill)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      skillName === skill
                        ? "bg-blue-100 text-blue-600 border border-blue-300"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillsForm;
