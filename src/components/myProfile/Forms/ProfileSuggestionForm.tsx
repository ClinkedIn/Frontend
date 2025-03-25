import React, { useState } from "react";

interface ProfileSuggestionFormProps {
  onClose: () => void;
  onSave: (summary: string) => void;
}

const ProfileSuggestionForm: React.FC<ProfileSuggestionFormProps> = ({
  onClose,
  onSave,
}) => {
  const [summary, setSummary] = useState("");
  const [charCount, setCharCount] = useState(0);
  const maxChars = 2600;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setSummary(text);
    setCharCount(text.length);
  };

  const handleSubmit = () => {
    onSave(summary);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-medium">Add summary</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
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

        <div className="p-6">
          <h3 className="text-xl font-medium mb-4">Let's add your summary</h3>
          <p className="text-gray-600 mb-4">
            You can write about your years of experience, industry, or skills.
            People also talk about their achievements or previous job
            experiences.
          </p>

          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 h-60 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={summary}
            onChange={handleTextChange}
            placeholder="Write your summary here..."
          ></textarea>

          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-1 rounded mr-2">
                <svg
                  className="h-5 w-5 text-yellow-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <span className="text-blue-600 font-medium">
                Get AI suggestions
              </span>
              <span className="text-gray-500 ml-1">with Premium</span>
            </div>
            <div className="text-gray-500 text-sm">
              {charCount}/{maxChars}
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={summary.length === 0}
            className={`px-6 py-2 rounded-full font-medium ${
              summary.length === 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSuggestionForm;
