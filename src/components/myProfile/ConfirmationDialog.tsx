// src/components/ConfirmationDialog.tsx
import React from "react";

interface ConfirmationDialogProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  showAddMore?: boolean;
  onAddMore?: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  title,
  message,
  confirmText = "Done",
  onConfirm,
  showAddMore = false,
  onAddMore,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 h-full">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
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

          <h2 className="text-xl font-medium text-gray-800 mb-2">{title}</h2>
          <p className="text-gray-600 mb-6">{message}</p>

          <div className="flex w-full gap-3">
            {showAddMore && (
              <button
                onClick={onAddMore}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700"
              >
                Add More
              </button>
            )}
            <button
              onClick={onCancel}
              className={`flex-1 px-4 py-2 rounded-full left-10 font-medium ${
                showAddMore
                  ? "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2 rounded-full font-medium ${
                showAddMore
                  ? "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
