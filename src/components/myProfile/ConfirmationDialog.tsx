// src/components/ConfirmationDialog.tsx
import React from "react";

/**
 * Props for the ConfirmationDialog component.
 */
interface ConfirmationDialogProps {
  /** Title displayed at the top of the dialog */
  title: string;
  /** Main message content of the dialog */
  message: string;
  /** Text for the confirm button (defaults to "Done") */
  confirmText?: string;
  /** Text for the cancel button (defaults to "Cancel") */
  cancelText?: string;
  /** Function called when the confirm button is clicked */
  onConfirm: () => void;
  /** Function called when the cancel button is clicked */
  onCancel: () => void;
  /** Whether to show the "Add More" button */
  showAddMore?: boolean;
  /** Function called when the "Add More" button is clicked */
  onAddMore?: () => void;
  /** Class name for the confirm button (optional) */
  confirmButtonClass?: string;
}

/**
 * A confirmation dialog component that displays a message with action buttons.
 *
 * @param {object} props - Component props
 * @param {string} props.title - Title of the dialog
 * @param {string} props.message - Message to display in the dialog
 * @param {string} [props.confirmText="Done"] - Text for the confirmation button
 * @param {string} [props.cancelText] - Text for the cancel button (not currently used in implementation)
 * @param {Function} props.onConfirm - Callback function when user confirms
 * @param {Function} props.onCancel - Callback function when user cancels
 * @param {boolean} [props.showAddMore=false] - Whether to show an "Add More" button
 * @param {Function} [props.onAddMore] - Callback function when "Add More" is clicked
 * @returns {JSX.Element} Rendered confirmation dialog
 */
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
