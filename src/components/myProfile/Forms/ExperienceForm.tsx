import React, { useState } from "react";
import ConfirmationDialog from "../ConfirmationDialog";

/**
 * Props interface for the ExperienceForm component
 */
interface ExperienceFormProps {
  onClose: () => void;
  onSave: (experience: any) => void;
}

/**
 * List of companies available for selection in the form
 */
const COMPANIES = [
  "Google",
  "Apple",
  "Microsoft",
  "Amazon",
  "Meta",
  "Netflix",
  "IBM",
  "Oracle",
  "Intel",
  "Cisco",
  "Adobe",
  "Salesforce",
  "Twitter",
  "LinkedIn",
  "Shopify",
  "Spotify",
  "Tesla",
  "Uber",
  "Airbnb",
  "Slack",
  "PayPal",
  "Square",
  "Zoom",
];

/**
 * Available job types for the form
 */
const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance",
  "Temporary",
  "Volunteer",
  "Remote",
  "Hybrid",
  "On-site",
];

/**
 * List of job titles available for selection
 */
const JOB_TITLES = [
  "Software Engineer",
  "Product Manager",
  "Data Scientist",
  "UX Designer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "DevOps Engineer",
  "QA Engineer",
  "Project Manager",
  "Content Writer",
  "Marketing Specialist",
  "Sales Representative",
  "Customer Support",
  "HR Manager",
  "Financial Analyst",
  "Business Analyst",
  "Research Scientist",
  "Systems Administrator",
  "Network Engineer",
];

/**
 * List of common skills for quick selection
 */
const COMMON_SKILLS = [
  "Python",
  "JavaScript",
  "HTML",
  "CSS",
  "React",
  "Node.js",
  "SQL",
  "Java",
  "C++",
  "AI",
  "Machine Learning",
  "Data Science",
  "Project Management",
  "Leadership",
  "Communication",
  "Problem Solving",
  "Critical Thinking",
  "Teamwork",
];

/**
 * Experience Form component
 * Allows users to add or edit professional experience entries
 *
 * @param {ExperienceFormProps} props - Component props
 * @returns {React.FC} The Experience Form component
 */
const ExperienceForm: React.FC<ExperienceFormProps> = ({ onClose, onSave }) => {
  const [company, setCompany] = useState("");
  const [customCompany, setCustomCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobType, setJobType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentlyWorking, setCurrentlyWorking] = useState(false);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [media, setMedia] = useState("");
  const [errors, setErrors] = useState<{
    company?: string;
    jobTitle?: string;
    startDate?: string;
  }>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [experienceData, setExperienceData] = useState<any>(null);
  const [showOtherCompany, setShowOtherCompany] = useState(false);

  /**
   * Validates the form fields before submission
   * @returns {boolean} True if the form is valid, false otherwise
   */
  const validateForm = () => {
    const newErrors: {
      company?: string;
      jobTitle?: string;
      startDate?: string;
    } = {};
    let isValid = true;

    const actualCompany = showOtherCompany ? customCompany : company;

    if (!actualCompany.trim()) {
      newErrors.company = "Company name is required";
      isValid = false;
    }

    if (!jobTitle.trim()) {
      newErrors.jobTitle = "Job title is required";
      isValid = false;
    }

    if (!startDate) {
      newErrors.startDate = "Start date is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  /**
   * Formats a date string for the API
   * @param {string} dateString - The date string to format
   * @returns {string} Formatted date string in YYYY-MM-DD format
   */
  const formatDateForApi = (dateString: string) => {
    if (!dateString) return "";

    const parts = dateString.split("-");
    if (parts.length < 2) return dateString;

    const year = parts[0];
    const month = parts[1].padStart(2, "0");
    const day = "01";

    return `${year}-${month}-${day}`;
  };

  /**
   * Handles the save action for the form
   */
  const handleSave = () => {
    if (validateForm()) {
      const finalCompany = showOtherCompany ? customCompany : company;

      const formattedStartDate = formatDateForApi(startDate);
      const formattedEndDate = currentlyWorking
        ? ""
        : formatDateForApi(endDate);

      const data = {
        companyName: finalCompany,
        jobTitle,
        employmentType: jobType,
        fromDate: formattedStartDate,
        toDate: currentlyWorking ? undefined : formattedEndDate || undefined,
        currentlyWorking,
        location: location || undefined,
        locationType: jobType.includes("Remote")
          ? "Remote"
          : jobType.includes("Hybrid")
          ? "Hybrid"
          : jobType.includes("On-site")
          ? "Onsite"
          : undefined,
        description: description || undefined,
        skills: selectedSkills,
        media: media || undefined,
      };

      setExperienceData(data);
      setShowConfirmation(true);
    }
  };

  /**
   * Handles the confirmation action
   */
  const handleConfirm = () => {
    onSave(experienceData);
    onClose();
  };

  /**
   * Handles the add more action in the confirmation dialog
   */
  const handleAddMore = () => {
    onSave(experienceData);
    resetForm();
  };

  /**
   * Resets all form fields to their default values
   */
  const resetForm = () => {
    setCompany("");
    setCustomCompany("");
    setJobTitle("");
    setJobType("");
    setStartDate("");
    setEndDate("");
    setCurrentlyWorking(false);
    setLocation("");
    setDescription("");
    setSelectedSkills([]);
    setCustomSkill("");
    setMedia("");
    setShowConfirmation(false);
    setShowOtherCompany(false);
  };

  /**
   * Handles company selection change
   * @param {React.ChangeEvent<HTMLSelectElement>} e - Change event
   */
  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCompany(value);
    setShowOtherCompany(value === "other");
  };

  /**
   * Adds a custom skill to the selected skills list
   */
  const addSkill = () => {
    if (customSkill && !selectedSkills.includes(customSkill)) {
      setSelectedSkills([...selectedSkills, customSkill]);
      setCustomSkill("");
    }
  };

  /**
   * Removes a skill from the selected skills list
   * @param {string} skill - The skill to remove
   */
  const removeSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  /**
   * Adds a predefined skill to the selected skills list
   * @param {string} skill - The skill to add
   */
  const selectSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-xl shadow-lg overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold">Add experience</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
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
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">* Indicates required</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company<span className="text-red-500">*</span>
              </label>
              <select
                value={company}
                onChange={handleCompanyChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.company && !showOtherCompany ? "border-red-500" : ""
                }`}
                required
              >
                <option value="">Select a company</option>
                {COMPANIES.map((comp, index) => (
                  <option key={index} value={comp}>
                    {comp}
                  </option>
                ))}
                <option value="other">Other (not listed)</option>
              </select>

              {showOtherCompany && (
                <input
                  type="text"
                  placeholder="Enter company name"
                  value={customCompany}
                  onChange={(e) => setCustomCompany(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md mt-2 ${
                    errors.company ? "border-red-500" : ""
                  }`}
                />
              )}

              {errors.company && (
                <p className="text-red-500 text-sm mt-1">{errors.company}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title<span className="text-red-500">*</span>
              </label>
              <select
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.jobTitle ? "border-red-500" : ""
                }`}
              >
                <option value="">Select a job title</option>
                {JOB_TITLES.map((title, index) => (
                  <option key={index} value={title}>
                    {title}
                  </option>
                ))}
              </select>
              {errors.jobTitle && (
                <p className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Type
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select job type</option>
                {JOB_TYPES.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start date<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="YYYY-MM-DD (e.g., 2019-03-15)"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.startDate ? "border-red-500" : ""
                }`}
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Format: YYYY-MM-DD (e.g., 2019-03-15)
              </p>
            </div>

            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="currentlyWorking"
                checked={currentlyWorking}
                onChange={(e) => setCurrentlyWorking(e.target.checked)}
                className="h-4 w-4 text-blue-600"
              />
              <label
                htmlFor="currentlyWorking"
                className="ml-2 text-sm text-gray-700"
              >
                I am currently working here
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End date {!currentlyWorking && "(or expected)"}
              </label>
              <input
                type="text"
                placeholder="YYYY-MM-DD (e.g., 2022-08-30)"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={currentlyWorking}
                className={`w-full px-3 py-2 border rounded-md ${
                  currentlyWorking ? "bg-gray-100" : ""
                }`}
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: YYYY-MM-DD (e.g., 2022-08-30)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="Ex: San Francisco, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                placeholder="You can write about responsibilities, achievements, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-md h-32 resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedSkills.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-blue-100 px-3 py-1 rounded-full flex items-center"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a skill"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  className="flex-grow px-3 py-2 border rounded-md"
                  onKeyPress={(e) => e.key === "Enter" && addSkill()}
                />
                <button
                  onClick={addSkill}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Common skills:
                </p>
                <div className="flex flex-wrap gap-2">
                  {COMMON_SKILLS.map((skill, index) => (
                    <button
                      key={index}
                      onClick={() => selectSkill(skill)}
                      disabled={selectedSkills.includes(skill)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedSkills.includes(skill)
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Media (Projects, Portfolio, etc.)
              </label>
              <input
                type="text"
                placeholder="URL to your work (e.g., https://example.com/project.pdf)"
                value={media}
                onChange={(e) => setMedia(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end p-4 border-t bg-gray-50">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>

      {showConfirmation && (
        <ConfirmationDialog
          title="Experience Added"
          message={`${jobTitle} at ${
            showOtherCompany ? customCompany : company
          } has been added to your profile.`}
          confirmText="Done"
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirmation(false)}
          showAddMore={true}
          onAddMore={handleAddMore}
        />
      )}
    </div>
  );
};

export default ExperienceForm;
