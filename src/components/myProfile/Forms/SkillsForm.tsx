import React, { useState } from "react";

interface SkillsFormProps {
  onAdd: (skill: string, context: { education?: string }) => void;
  onCancel: () => void;
  educationOptions: string[];
}

const SUGGESTED_SKILLS = [
  { name: "Engineering" },
  { name: "Marketing" },
  { name: "Analytical Skills" },
  { name: "Research Skills" },
  { name: "Project Management" },
  { name: "Strategy" },
  { name: "Design" },
  { name: "Management" },
  { name: "Customer Service" },
  { name: "Communication" },
];

const SkillsForm: React.FC<SkillsFormProps> = ({
  onAdd,
  onCancel,
  educationOptions,
}) => {
  const [skill, setSkill] = useState<string>("");
  const [selectedEducation, setSelectedEducation] = useState<string | null>(
    null
  );
  const [followSkill, setFollowSkill] = useState<boolean>(true);
  const [errors, setErrors] = useState<{ skill?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(true);

  const handleSubmit = () => {
    if (!skill.trim()) {
      setErrors({ skill: "Skill is required" });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      onAdd(skill, {
        education: selectedEducation || undefined,
      });
      setIsSubmitting(false);
    }, 500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSkill(suggestion);
    setShowSuggestions(false);
    setErrors({});
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl max-h-screen flex flex-col">
        <div className="border-b flex justify-between items-center p-4">
          <h2 className="text-xl font-semibold">Add skill</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
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

        <div className="flex-grow overflow-auto p-4">
          <p className="text-sm text-gray-500 mb-4">* Indicates required</p>

          <div className="mb-6">
            <label className="block mb-2 font-medium">Skill*</label>
            <input
              type="text"
              value={skill}
              onChange={(e) => {
                setSkill(e.target.value);
                if (e.target.value.trim()) {
                  setErrors({ ...errors, skill: undefined });
                }
                setShowSuggestions(true);
              }}
              className={`w-full p-3 border ${
                errors.skill ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
              placeholder="Example: Project Management"
            />
            {errors.skill && (
              <p className="text-red-500 text-sm mt-1">{errors.skill}</p>
            )}
          </div>

          {showSuggestions && (
            <div className="mb-6">
              <h3 className="text-base font-medium mb-3">
                Suggested based on your profile
              </h3>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_SKILLS.map((suggestionItem, index) => (
                  <button
                    key={index}
                    className="border border-gray-300 rounded-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => handleSuggestionClick(suggestionItem.name)}
                  >
                    {suggestionItem.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">
              Show us where you used this skill
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              75% of hirers value skill context. Select at least one item to
              show where you used this skill.
            </p>

            <h4 className="font-medium mb-2">Education</h4>
            {educationOptions.map((education, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`edu-${index}`}
                  checked={selectedEducation === education}
                  onChange={() =>
                    setSelectedEducation(
                      selectedEducation === education ? null : education
                    )
                  }
                  className="w-5 h-5 text-blue-600 bg-gray-100 rounded border-gray-300 mr-3"
                />
                <label htmlFor={`edu-${index}`} className="text-gray-700">
                  {education}
                </label>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <div className="flex items-center bg-green-50 p-3 rounded-md">
              <input
                type="checkbox"
                id="follow-skill"
                checked={followSkill}
                onChange={() => setFollowSkill(!followSkill)}
                className="w-5 h-5 text-[#0073b1]  bg-gray-100 rounded border-gray-300 mr-3"
              />
              <label htmlFor="follow-skill" className="text-gray-700">
                Follow this skill to keep up with relevant content.
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-end">
          {isSubmitting ? (
            <button
              disabled
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-full"
            >
              Saving
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-[#0073b1]  text-white rounded-full hover:bg-[#026aa7]"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillsForm;
