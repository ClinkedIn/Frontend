import React, { useState, useEffect } from "react";
import ConfirmationDialog from "../ConfirmationDialog";
import { XCircle } from "lucide-react";

/**
 * Interface for experience form data
 */
interface ExperienceFormData {
  index?: number;
  jobTitle: string;
  companyName: string;
  fromMonth: string;
  fromYear: string;
  toMonth?: string;
  toYear?: string;
  currentlyWorking?: boolean;
  employmentType?: string;
  location?: string;
  locationType?: string;
  description?: string;
  skills?: string[];
  media?: File | null;
  foundVia?: string;
}

/**
 * Props interface for the ExperienceForm component
 */
interface ExperienceFormProps {
  initialData?: ExperienceFormData;
  onClose: () => void;
  onSave: (experience: any) => void;
}

/**
 * Lists of dropdown options for the form
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

const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance",
  "Temporary",
  "Volunteer",
];

const LOCATION_TYPES = ["Remote", "Hybrid", "On-site"];

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

const COMMON_SKILLS = [
  "Python",
  "JavaScript",
  "TypeScript",
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

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Experience Form component
 * Allows users to add or edit professional experience entries
 * @param {ExperienceFormProps} props - Component props
 * @param {ExperienceFormData} [props.initialData] - Initial data for editing an existing experience
 * @param {Function} props.onClose - Function to call when closing the form
 * @param {Function} props.onSave - Function to call when saving experience data
 * @returns {JSX.Element} Experience form component
 */
const ExperienceForm: React.FC<ExperienceFormProps> = ({
  initialData,
  onClose,
  onSave,
}) => {
  // Form state
  const [formData, setFormData] = useState<ExperienceFormData>({
    jobTitle: "",
    companyName: "",
    fromMonth: "January",
    fromYear: new Date().getFullYear().toString(),
    employmentType: "",
    location: "",
    description: "",
    skills: [],
  });

  const [customCompany, setCustomCompany] = useState("");
  const [showOtherCompany, setShowOtherCompany] = useState(false);
  const [customSkill, setCustomSkill] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [experienceData, setExperienceData] = useState<any>(null);

  // Generate year options for date selectors
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) =>
    (currentYear - i).toString()
  );

  /**
   * Initialize form with existing data if provided
   */
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);

      // Check if company is in the predefined list or needs "Other" option
      if (
        initialData.companyName &&
        !COMPANIES.includes(initialData.companyName)
      ) {
        setShowOtherCompany(true);
        setCustomCompany(initialData.companyName);
      }
    }
  }, [initialData]);

  /**
   * Handles changes to form input fields
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>} e - Change event
   */
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when field is modified
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  /**
   * Handles changes to checkbox inputs
   * @param {React.ChangeEvent<HTMLInputElement>} e - Checkbox change event
   */
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  /**
   * Handles company selection changes, with special handling for "other" option
   * @param {React.ChangeEvent<HTMLSelectElement>} e - Select change event
   */
  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (value === "other") {
      setShowOtherCompany(true);
      setFormData((prev) => ({
        ...prev,
        companyName: customCompany,
      }));
    } else {
      setShowOtherCompany(false);
      setFormData((prev) => ({
        ...prev,
        companyName: value,
      }));
    }
  };

  /**
   * Handles input for custom company name when "other" is selected
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input change event
   */
  const handleCustomCompanyChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomCompany(e.target.value);
    setFormData((prev) => ({
      ...prev,
      companyName: e.target.value,
    }));

    // Clear validation error
    if (errors.companyName) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.companyName;
        return newErrors;
      });
    }
  };

  /**
   * Adds a custom skill to the skills list
   */
  const addSkill = () => {
    if (customSkill && !formData.skills?.includes(customSkill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), customSkill],
      }));
      setCustomSkill("");
    }
  };

  /**
   * Removes a skill from the skills list
   * @param {string} skill - Skill to remove
   */
  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills?.filter((s) => s !== skill) || [],
    }));
  };

  /**
   * Adds a pre-defined common skill to the skills list
   * @param {string} skill - Common skill to add
   */
  const selectCommonSkill = (skill: string) => {
    if (!formData.skills?.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), skill],
      }));
    }
  };

  /**
   * Handles file selection for media uploads
   * @param {React.ChangeEvent<HTMLInputElement>} e - File input change event
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        media: e.target.files![0],
      }));
    }
  };

  /**
   * Validates form fields before submission
   * @returns {boolean} True if form is valid, false otherwise
   */
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Required fields validation
    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = "Job title is required";
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!formData.fromMonth) {
      newErrors.fromMonth = "Start month is required";
    }

    if (!formData.fromYear) {
      newErrors.fromYear = "Start year is required";
    }

    // End date validation if not currently working
    if (!formData.currentlyWorking && formData.toYear && formData.fromYear) {
      const fromYear = parseInt(formData.fromYear);
      const toYear = parseInt(formData.toYear);

      if (toYear < fromYear) {
        newErrors.toYear = "End year cannot be before start year";
      } else if (
        toYear === fromYear &&
        formData.toMonth &&
        formData.fromMonth
      ) {
        const fromMonthIndex = MONTHS.indexOf(formData.fromMonth);
        const toMonthIndex = MONTHS.indexOf(formData.toMonth);

        if (toMonthIndex < fromMonthIndex) {
          newErrors.toMonth =
            "End month cannot be before start month in the same year";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Formats date values for API submission
   * @param {string} month - Month name
   * @param {string} year - Year string
   * @returns {string} Formatted date string in YYYY-MM-DD format
   */
  const formatDateForApi = (month: string, year: string) => {
    const monthIndex = MONTHS.indexOf(month);
    const formattedMonth = (monthIndex + 1).toString().padStart(2, "0");
    return `${year}-${formattedMonth}-01`;
  };

  /**
   * Prepares form data in the format expected by the API
   * @returns {Object} Formatted experience data ready for submission
   */
  const prepareDataForSubmission = () => {
    const fromDate = formatDateForApi(formData.fromMonth, formData.fromYear);

    let toDate;
    if (!formData.currentlyWorking && formData.toMonth && formData.toYear) {
      toDate = formatDateForApi(formData.toMonth, formData.toYear);
    }

    return {
      index: formData.index,
      jobTitle: formData.jobTitle,
      companyName: formData.companyName,
      fromDate,
      toDate,
      currentlyWorking: formData.currentlyWorking || false,
      employmentType: formData.employmentType,
      location: formData.location,
      locationType: formData.locationType,
      description: formData.description,
      skills: formData.skills || [],
      media: formData.media || undefined,
      foundVia: formData.foundVia,
    };
  };

  /**
   * Handles the save button click
   * Validates form and shows confirmation dialog if valid
   */
  const handleSave = () => {
    if (validateForm()) {
      const data = prepareDataForSubmission();
      setExperienceData(data);
      setShowConfirmation(true);
    }
  };

  /**
   * Handles confirmation dialog "Done" action
   * Saves the data and closes the form
   */
  const handleConfirm = () => {
    onSave(experienceData);
    onClose();
  };

  /**
   * Handles confirmation dialog "Add More" action
   * Saves the current data and resets the form for another entry
   */
  const handleAddMore = () => {
    onSave(experienceData);
    // Reset form
    setFormData({
      jobTitle: "",
      companyName: "",
      fromMonth: "January",
      fromYear: new Date().getFullYear().toString(),
      employmentType: "",
      location: "",
      description: "",
      skills: [],
    });
    setCustomCompany("");
    setShowOtherCompany(false);
    setShowConfirmation(false);
  };

  return (
    <div className="bg-white max-h-[90vh] overflow-auto rounded-lg w-full max-w-xl shadow-lg">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-xl font-semibold">
          {initialData ? "Edit Experience" : "Add Experience"}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <XCircle size={24} />
        </button>
      </div>

      <div className="p-4">
        <p className="text-sm text-gray-600 mb-4">
          Showcase your accomplishments and get up to 2X as many profile views
          and connections.
          <span className="text-red-500"> * Indicates required field</span>
        </p>

        <div className="space-y-4">
          {/* Job Title */}
          <div>
            <label
              htmlFor="jobTitle"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Job Title<span className="text-red-500">*</span>
            </label>
            <select
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.jobTitle ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select a job title</option>
              {JOB_TITLES.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
              <option value="other">Other (not listed)</option>
            </select>
            {formData.jobTitle === "other" && (
              <input
                type="text"
                placeholder="Enter job title"
                value={formData.jobTitle === "other" ? "" : formData.jobTitle}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, jobTitle: e.target.value }))
                }
                className="w-full mt-2 px-3 py-2 border rounded-md border-gray-300"
              />
            )}
            {errors.jobTitle && (
              <p className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>
            )}
          </div>

          {/* Company */}
          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Company<span className="text-red-500">*</span>
            </label>
            <select
              id="company"
              value={showOtherCompany ? "other" : formData.companyName}
              onChange={handleCompanyChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.companyName && !showOtherCompany
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              <option value="">Select a company</option>
              {COMPANIES.map((comp) => (
                <option key={comp} value={comp}>
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
                onChange={handleCustomCompanyChange}
                className={`w-full mt-2 px-3 py-2 border rounded-md ${
                  errors.companyName ? "border-red-500" : "border-gray-300"
                }`}
              />
            )}

            {errors.companyName && (
              <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
            )}
          </div>

          {/* Employment Type */}
          <div>
            <label
              htmlFor="employmentType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Employment Type
            </label>
            <select
              id="employmentType"
              name="employmentType"
              value={formData.employmentType || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select employment type</option>
              {EMPLOYMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="Ex: San Francisco, CA"
              value={formData.location || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Location Type */}
          <div>
            <label
              htmlFor="locationType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Location Type
            </label>
            <select
              id="locationType"
              name="locationType"
              value={formData.locationType || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select location type</option>
              {LOCATION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="space-y-4">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date<span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <select
                    name="fromMonth"
                    value={formData.fromMonth}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.fromMonth ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    {MONTHS.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  {errors.fromMonth && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fromMonth}
                    </p>
                  )}
                </div>
                <div>
                  <select
                    name="fromYear"
                    value={formData.fromYear}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.fromYear ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  {errors.fromYear && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.fromYear}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Currently Working Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="currentlyWorking"
                name="currentlyWorking"
                checked={formData.currentlyWorking || false}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="currentlyWorking"
                className="ml-2 block text-sm text-gray-700"
              >
                I am currently working here
              </label>
            </div>

            {/* End Date */}
            {!formData.currentlyWorking && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <select
                      name="toMonth"
                      value={formData.toMonth || ""}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md ${
                        errors.toMonth ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Month</option>
                      {MONTHS.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                    {errors.toMonth && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.toMonth}
                      </p>
                    )}
                  </div>
                  <div>
                    <select
                      name="toYear"
                      value={formData.toYear || ""}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md ${
                        errors.toYear ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Year</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    {errors.toYear && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.toYear}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Describe your responsibilities, achievements, and the skills you used in this role."
              value={formData.description || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
            ></textarea>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills
            </label>
            {/* Selected Skills Tags */}
            {formData.skills && formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full flex items-center text-sm"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-blue-400 hover:text-blue-600"
                      aria-label={`Remove ${skill}`}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Custom Skill */}
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add a skill"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <button
                type="button"
                onClick={addSkill}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>

            {/* Common Skills */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Common skills:
              </p>
              <div className="flex flex-wrap gap-2">
                {COMMON_SKILLS.map((skill, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectCommonSkill(skill)}
                    disabled={formData.skills?.includes(skill)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      formData.skills?.includes(skill)
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

          {/* Media Upload */}
          <div>
            <label
              htmlFor="media"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Media (Projects, Portfolio, etc.)
            </label>
            <input
              type="file"
              id="media"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload documents, images, or presentations related to this role
            </p>
          </div>

          {/* Found Via */}
          <div>
            <label
              htmlFor="foundVia"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Found via
            </label>
            <input
              type="text"
              id="foundVia"
              name="foundVia"
              placeholder="e.g., LinkedIn, Referral, Job Board"
              value={formData.foundVia || ""}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end p-4 border-t bg-gray-50">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md mr-2 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
        >
          Save
        </button>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <ConfirmationDialog
          title={initialData ? "Experience Updated" : "Experience Added"}
          message={`${formData.jobTitle} at ${formData.companyName} has been ${
            initialData ? "updated on" : "added to"
          } your profile.`}
          confirmText="Done"
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirmation(false)}
          showAddMore={!initialData}
          onAddMore={handleAddMore}
        />
      )}
    </div>
  );
};

export default ExperienceForm;
