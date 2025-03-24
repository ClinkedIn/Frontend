import React, { useState } from "react";
import EducationForm from "./Forms/EducationForm";

interface Education {
  school: string;
  degree: string;
  fieldOfStudy: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  grade?: string;
  activities?: string;
  description?: string;
}

interface EducationSectionProps {
  showEducationForm?: boolean;
  setShowEducationForm?: (show: boolean) => void;
}

const EducationSection: React.FC<EducationSectionProps> = ({
  showEducationForm: externalShowForm,
  setShowEducationForm: externalSetShowForm,
}) => {
  const [internalShowForm, setInternalShowForm] = useState(false);
  const [educations, setEducations] = useState<Education[]>([]);

  const showEducationForm =
    externalShowForm !== undefined ? externalShowForm : internalShowForm;
  const setShowEducationForm = externalSetShowForm || setInternalShowForm;

  const handleSaveEducation = (education: Education) => {
    setEducations([...educations, education]);
  };

  const formatDateRange = (edu: Education) => {
    const startDate =
      edu.startMonth && edu.startYear
        ? `${edu.startMonth} ${edu.startYear}`
        : "";
    const endDate =
      edu.endMonth && edu.endYear ? `${edu.endMonth} ${edu.endYear}` : "";

    return startDate && endDate ? `${startDate} - ${endDate}` : "";
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-4 w-240 ml-[-165px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Education</h3>
        <div className="flex">
          <button
            onClick={() => setShowEducationForm(true)}
            className="text-gray-600 hover:bg-gray-100 p-2 rounded-full mr-2"
            title="Add education"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
          <button
            className="text-gray-600 hover:bg-gray-100 p-2 rounded-full"
            title="Edit section"
          >
            <svg
              className="h-5 w-5"
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
        </div>
      </div>

      {educations.map((edu, index) => (
        <div key={index} className="flex items-start mb-4">
          <div className="mr-4 mt-1">
            <img
              src={`/university-icon-${index}.jpg`}
              alt={edu.school}
              className="w-10 h-10 rounded"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/40";
              }}
            />
          </div>
          <div>
            <h4 className="font-medium">{edu.school}</h4>
            <p className="text-gray-700">
              {edu.degree}
              {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}
            </p>
            <p className="text-gray-500 text-sm">{formatDateRange(edu)}</p>
            {edu.grade && (
              <p className="text-gray-500 text-sm">Grade: {edu.grade}</p>
            )}
            {edu.activities && (
              <p className="text-gray-500 text-sm">
                Activities: {edu.activities}
              </p>
            )}
            {edu.description && (
              <p className="text-gray-600 mt-1">{edu.description}</p>
            )}
          </div>
        </div>
      ))}

      {showEducationForm && (
        <EducationForm
          onClose={() => setShowEducationForm(false)}
          onSave={handleSaveEducation}
        />
      )}
    </div>
  );
};

export default EducationSection;
