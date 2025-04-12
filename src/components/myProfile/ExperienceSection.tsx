import React, { useState } from "react";
import ExperienceForm from "./Forms/ExperienceForm";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface Experience {
  title: string;
  organization: string;
  employmentType?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

interface ExperienceSectionProps {
  showExperienceForm?: boolean;
  setShowExperienceForm?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  showExperienceForm: externalShowForm,
  setShowExperienceForm: externalSetShowForm,
}) => {
  // Local state
  const [showForm, setShowFormInternal] = useState(false);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [showAddConfirmation, setShowAddConfirmation] = useState(false);

  const showExperienceFormState =
    externalShowForm !== undefined ? externalShowForm : showForm;

  const setShowExperienceFormState = (show: boolean) => {
    if (externalSetShowForm) {
      externalSetShowForm(show);
    } else {
      setShowFormInternal(show);
    }
  };

  const handleSaveExperience = (experience: Experience) => {
    setExperiences([...experiences, experience]);
    setShowExperienceFormState(false);
    setShowAddConfirmation(true);
  };

  // Empty state view when no experiences are available
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
          <p className="text-gray-500">Position</p>
          <p className="text-gray-400 text-sm">Company, Location</p>
          <p className="text-gray-400 text-sm">2019 - 2023</p>
        </div>
      </div>
      <button
        onClick={() => setShowExperienceFormState(true)}
        className="w-full text-blue-600 font-medium border border-blue-600 rounded-full py-2 hover:bg-blue-50 transition-colors"
      >
        Add experience
      </button>
    </div>
  );

  // Confirmation Dialog placeholder
  const ConfirmationDialog = ({ title, message, onClose }: any) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h3 className="font-bold text-xl mb-4">{title}</h3>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4 w-[900px] m-auto relative">
      {/* Header with title and add button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Experience</h2>
        {experiences.length > 0 && (
          <div className="flex space-x-2">
            <button
              onClick={() => setShowExperienceFormState(true)}
              className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
              title="Add experience"
            >
              <Plus size={20} />
            </button>
            <button
              className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
              title="Edit experience"
            >
              <Pencil size={20} />
            </button>
          </div>
        )}
      </div>

      {experiences.length > 0 ? (
        <div className="space-y-4">
          {experiences.map((exp, idx) => {
            // Format dates for display
            const startDate = exp.startDate
              ? new Date(exp.startDate).getFullYear()
              : "";
            const endDate = exp.endDate
              ? new Date(exp.endDate).getFullYear()
              : "Present";

            return (
              <div key={idx} className="flex items-start group">
                <div className="w-10 h-10 mr-3 bg-blue-50 flex items-center justify-center rounded-lg text-blue-500">
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
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-gray-800">{exp.title}</h3>
                    <button
                      onClick={() => {
                        // Delete functionality would go here
                      }}
                      className="text-red-500 hover:text-red-700 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete experience"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm">{exp.organization}</p>
                  {exp.location && (
                    <p className="text-gray-500 text-sm">{exp.location}</p>
                  )}
                  <p className="text-gray-500 text-sm">
                    {startDate} - {endDate}
                  </p>
                  {exp.description && (
                    <p className="text-gray-600 mt-1 text-sm">
                      {exp.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyStateView />
      )}

      {/* Experience Form Modal */}
      {showExperienceFormState && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-screen overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-bold">Experience</h3>
              <button
                onClick={() => setShowExperienceFormState(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-600 mb-4">
                Showcase your accomplishments and get up to 2X as many profile
                views and connections
              </p>
              <ExperienceForm
                onClose={() => setShowExperienceFormState(false)}
                onSave={handleSaveExperience}
              />
            </div>
          </div>
        </div>
      )}

      {/* Add Confirmation Dialog */}
      {showAddConfirmation && (
        <ConfirmationDialog
          title="Experience Added Successfully"
          message="Your experience has been added to your profile."
          onClose={() => setShowAddConfirmation(false)}
        />
      )}
    </div>
  );
};

export default ExperienceSection;
