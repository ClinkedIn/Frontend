import React, { useState } from "react";

interface SkillFormProps {
  initialData?: {
    skillName: string;
    education?: number[];
    experience?: number[];
  };
  onSave: (formData: any) => void;
  onClose: () => void;
}

/**
 * Array of commonly used skills for quick selection
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

const SkillsForm: React.FC<SkillFormProps> = ({
  initialData,
  onSave,
  onClose,
}) => {
  const [skillName, setSkillName] = useState(initialData?.skillName || "");
  const [errors, setErrors] = useState<{ skillName?: string }>({});
  const isEditing = initialData?.skillName ? true : false;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSave({
        skillName,
        originalSkillName: isEditing ? initialData?.skillName : null,
        education: initialData?.education || [],
        experience: initialData?.experience || [],
        isEditing,
      });
    }
  };

  const selectCommonSkill = (skill: string) => {
    setSkillName(skill);
  };

  return (
    <div className="fixed inset-0 bg-black/30  z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-xl shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white flex justify-between items-center p-4 border-b rounded-t-lg">
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

        <form onSubmit={handleSubmit}>
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
                    errors.skillName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.skillName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.skillName}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Common skills:
                </p>
                <div className="flex flex-wrap gap-2">
                  {COMMON_SKILLS.map((skill, index) => (
                    <button
                      type="button"
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

          <div className="sticky bottom-0 bg-white p-4 border-t flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SkillsForm;
