import React from "react";
import Button from "../Button";
interface SkillsConfirmationProps {
  onAddMore: () => void;
  onClose: () => void;
}

const SkillsConfirmation: React.FC<SkillsConfirmationProps> = ({
  onAddMore,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full h-full max-w-3xl">
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
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

        <div className="flex flex-col items-center px-6 pb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h2 className="text-xl font-medium text-gray-800 mb-8">
            Your skill has been added
          </h2>

          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Next, add another skill
          </h3>

          <div className="flex items-center mb-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path d="M12 14l9-5-9-5-9 5 9 5z" />
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
              />
            </svg>
            <p className="text-gray-600">
              Adding more skills can help you stand out from other candidates.
            </p>
          </div>

          <div className="flex w-full justify-between gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-2 text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-full  p-3 m-2  cursor-pointer font-semibold"
            >
              No thanks
            </button>

            <Button
              onClick={onAddMore}
              className="flex-1 px-6 py-2   text-white rounded-full hover:bg-[#026aa7]"
            >
              Add more skills
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsConfirmation;
