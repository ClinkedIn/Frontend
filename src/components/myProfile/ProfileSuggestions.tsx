import React, { useState } from "react";
import ProfileSuggestionForm from "./Forms/ProfileSuggestionForm";

const ProfileSuggestions: React.FC = () => {
  const [showAddSuggestionsForm, setShowAddSuggestionsForm] = useState(false);
  const [profileSummary, setProfileSummary] = useState("");
  const [hasSummary, setHasSummary] = useState(false);

  const handleOpenForm = () => {
    setShowAddSuggestionsForm(true);
  };

  const handleCloseForm = () => {
    setShowAddSuggestionsForm(false);
  };

  const handleSaveSummary = (summary: string) => {
    setProfileSummary(summary);
    setHasSummary(true);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-4 w-240 ml-[-165px]">
      <div className="flex justify-between">
        <h2 className="text-lg font-medium">Suggested for you</h2>
        <span className="text-gray-500 text-sm flex items-center">
          <svg
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          Private to you
        </span>
      </div>

      <div className="mt-4 border border-gray-200 rounded-lg p-4">
        {hasSummary ? (
          <div className="flex">
            <div className="mr-4 flex-shrink-0">
              <div className="bg-green-50 w-12 h-12 rounded flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="font-medium">
                You've added a summary to your profile
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                {profileSummary.length > 100
                  ? `${profileSummary.substring(0, 100)}...`
                  : profileSummary}
              </p>
              <button
                onClick={handleOpenForm}
                className="mt-3 border border-gray-300 rounded-full px-4 py-1.5 text-gray-700 font-medium text-sm"
              >
                Edit summary
              </button>
            </div>
          </div>
        ) : (
          <div className="flex">
            <div className="mr-4 flex-shrink-0">
              <div className="bg-blue-50 w-12 h-12 rounded flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="font-medium">
                Write a summary to highlight your personality or work experience
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Members who include a summary receive up to 3.9 times as many
                profile views.
              </p>
              <button
                onClick={handleOpenForm}
                className="mt-3 border border-gray-300 rounded-full px-4 py-1.5 text-gray-700 font-medium text-sm"
              >
                Add a summary
              </button>
            </div>
          </div>
        )}
      </div>

      {showAddSuggestionsForm && (
        <ProfileSuggestionForm
          onClose={handleCloseForm}
          onSave={handleSaveSummary}
        />
      )}
    </div>
  );
};

export default ProfileSuggestions;
