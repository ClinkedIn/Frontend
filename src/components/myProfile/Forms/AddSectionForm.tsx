import Form from "./Form";

const AddSectionForm = ({ onClose, onAddSection }) => {
  const handleResumeUpload = () => onAddSection("resume");

  return (
    <Form title="Add to profile" onClose={onClose} maxWidth="max-w-lg">
      <div className="p-4 border-b bg-transparent">
        <h3 className="text-xl font-semibold mb-2">
          Set up your profile in minutes with a resume
        </h3>
        <p className="text-gray-600 mb-4">
          Upload a recent resume to fill out your profile with the help of AI.
        </p>
        <button
          onClick={handleResumeUpload}
          className="bg-[#0073b1] text-white px-4 py-2 rounded-full font-medium hover:bg-[#005f90]"
        >
          Get started
        </button>
      </div>

      <div className="p-4 bg-transparent">
        <h3 className="text-xl font-semibold mb-4">Manual setup</h3>
        <div className="border-b pb-4 mb-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-medium">Core</h4>
            <button className="text-gray-500">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 9L12 15L18 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <p className="text-gray-600 mt-2 mb-4">
            Start with the basics. Filling out these sections will help you be
            discovered by recruiters and people you may know
          </p>

          <div className="space-y-4">
            <div className="border-b pb-4">
              <button
                className="w-full text-left text-gray-700 hover:text-gray-900"
                onClick={() => onAddSection("education")}
              >
                Add education
              </button>
            </div>
            <div className="border-b pb-4">
              <button
                className="w-full text-left text-gray-700 hover:text-gray-900"
                onClick={() => onAddSection("experience")}
              >
                Add experience
              </button>
            </div>
            <div className="pb-2">
              <button
                className="w-full text-left text-gray-700 hover:text-gray-900"
                onClick={() => onAddSection("skills")}
              >
                Add skills
              </button>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
};

export default AddSectionForm;
