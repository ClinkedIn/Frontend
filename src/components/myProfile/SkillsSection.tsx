import React, { useState } from "react";
import SkillsForm from "./Forms/SkillsForm";
import SkillsConfirmation from "./SkillsConfirmation";

interface Skill {
  name: string;
  context?: {
    education?: string;
  };
  followed: boolean;
  category?: "soft" | "technical";
}

const SkillsSection: React.FC = () => {
  const [showAddSkillForm, setShowAddSkillForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);

  const educationOptions = [""];

  const handleAddSkill = (
    skillName: string,
    context: { education?: string },
    category?: "soft" | "technical"
  ) => {
    const newSkill: Skill = {
      name: skillName,
      context,
      followed: true,
      category: category || "technical",
    };

    setSkills([...skills, newSkill]);
    setShowAddSkillForm(false);
    setShowConfirmation(true);
  };

  const handleAddMore = () => {
    setShowConfirmation(false);
    setShowAddSkillForm(true);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  const softSkills = skills.filter((skill) => skill.category === "soft");
  const technicalSkills = skills.filter(
    (skill) => skill.category === "technical" || !skill.category
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 w-240 ml-[-165px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Skills</h3>
        <div className="flex space-x-4">
          {skills.length > 0 && (
            <>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowAddSkillForm(true)}
                aria-label="Add skill"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
              <button
                className="text-gray-500 hover:text-gray-700"
                aria-label="Edit skills"
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
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {skills.length > 0 ? (
        <div className="mt-2">
          {softSkills.length > 0 && (
            <>
              <h4 className="text-gray-600 font-medium mb-2">Soft skills</h4>
              <div className="mb-4">
                {softSkills.map((skill, index) => (
                  <div
                    key={`soft-${index}`}
                    className="py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="text-gray-800 flex items-center">
                      {skill.name}
                      {skill.context?.education && (
                        <span className="ml-2 text-xs text-gray-500 flex items-center">
                          <span className="inline-block w-4 h-4 mr-1">🎓</span>
                          {skill.context.education}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {technicalSkills.length > 0 && (
            <>
              <h4 className="text-gray-600 font-medium mb-2">
                Technical skills
              </h4>
              <div>
                {technicalSkills.map((skill, index) => (
                  <div
                    key={`tech-${index}`}
                    className="py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="text-gray-800 flex items-center">
                      {skill.name}
                      {skill.context?.education && (
                        <span className="ml-2 text-xs text-gray-500 flex items-center">
                          <span className="inline-block w-4 h-4 mr-1">🎓</span>
                          {skill.context.education}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="mt-4">
            <button
              className="border border-[#0073b1]  text-[#0073b1]  rounded-full px-8 py-2 text-sm font-medium hover:bg-blue-50"
              onClick={() => setShowAddSkillForm(true)}
            >
              Add skills
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-gray-700 mb-4">
            Communicate your fit for new opportunities — 50% of hirers use
            skills data to fill their roles
          </p>

          <button
            className="border border-[#0073b1]  text-[#0073b1]  rounded-full px-8 py-2 text-sm font-medium hover:bg-blue-50"
            onClick={() => setShowAddSkillForm(true)}
          >
            Add skills
          </button>
        </div>
      )}

      {showAddSkillForm && (
        <SkillsForm
          onAdd={handleAddSkill}
          onCancel={() => setShowAddSkillForm(false)}
          educationOptions={educationOptions}
        />
      )}

      {showConfirmation && (
        <SkillsConfirmation
          onAddMore={handleAddMore}
          onClose={handleCloseConfirmation}
        />
      )}
    </div>
  );
};

export { SkillsSection };
