import React, { useState } from "react";
import ExperienceForm from "./Forms/ExperienceForm";

interface Experience {
  title: string;
  organization: string;
  date: string;
}
interface ExperienceSectionProps {
  showExperienceForm: boolean;
  setShowExperienceForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = () => {
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [experiences, setExperiences] = useState<Experience[]>([]);

  const handleSaveExperience = (experience: Partial<Experience>) => {
    setExperiences([...experiences, experience as Experience]);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-4 w-240 ml-[-165px] border-2 border-dashed border-gray-300 relative">
      <h3 className="text-lg font-semibold">Experience</h3>
      <p className="text-gray-600 mb-4">
        Showcase your accomplishments and get up to 2X as many profile views and
        connections
      </p>

      {experiences.length > 0 ? (
        experiences.map((exp, index) => (
          <div
            key={index}
            className="flex items-start p-4 bg-gray-50 rounded-lg mb-4"
          >
            <div className="mr-4 mt-1">
              <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-800">{exp.title}</p>
              <p className="text-gray-500 text-sm">{exp.organization}</p>
              <p className="text-gray-500 text-sm">{exp.date}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="flex items-start p-4 bg-gray-50 rounded-lg mb-4">
          <div className="mr-4 mt-1">
            <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
              <svg
                className="h-6 w-6 text-gray-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div>
            <p className="font-medium text-gray-800"></p>
            <p className="text-gray-500 text-sm"></p>
            <p className="text-gray-500 text-sm"></p>
          </div>
        </div>
      )}

      <button
        className="border border-blue-600 text-blue-600 rounded-full px-4 py-1.5 font-medium"
        onClick={() => setShowExperienceForm(true)}
      >
        Add Experience
      </button>

      {showExperienceForm && (
        <ExperienceForm
          onClose={() => setShowExperienceForm(false)}
          onSave={handleSaveExperience}
        />
      )}
    </div>
  );
};

export default ExperienceSection;
