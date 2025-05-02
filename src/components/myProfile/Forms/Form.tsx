import React, { ReactNode } from "react";

interface FormProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
}

const Form: React.FC<FormProps> = ({ title, onClose, children, footer }) => {
  return (
    <div className="fixed inset-0 bg-black/30  z-50 flex items-start justify-center overflow-y-auto">
      <div
        className={`bg-white rounded-lg lg:w-[45%] w-[100%] min-h-[100vh] flex flex-col`}
      >
        <div className="sticky top-0 z-10 bg-white flex justify-between items-center p-4 border-b rounded-t-lg">
          <h2 className="text-xl font-semibold">{title}</h2>
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

        <div className="flex-grow overflow-auto bg-transparent">{children}</div>

        {footer && (
          <div className="p-4 border-t flex justify-end">{footer}</div>
        )}
      </div>
    </div>
  );
};

export default Form;
