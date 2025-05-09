import React, { useState, useEffect } from "react";
import ConfirmationDialog from "../ConfirmationDialog";
import { XCircle } from "lucide-react";

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
  // media?: File | null;
  foundVia?: string;
}

interface ExperienceFormProps {
  initialData?: ExperienceFormData;
  onClose: () => void;
  onSave: (experience: any) => void;
}

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
  "Full Time",
  "Part Time",
  "Contract",
  "Internship",
  "Freelance",
  "Temporary",
  "Volunteer",
];

const LOCATION_TYPES = ["Remote", "Hybrid", "Onsite"];

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

const foundVia = [
  "Indeed",
  "LinkedIn",
  "Company Website",
  "Other job sites",
  "Referral",
  "Contracted by Recruiter",
  "Staffing Agency",
  "Other",
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

const ExperienceForm: React.FC<ExperienceFormProps> = ({
  initialData,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<ExperienceFormData>({
    jobTitle: "",
    companyName: "",
    fromMonth: "January",
    fromYear: new Date().getFullYear().toString(),
    toMonth: "December",
    toYear: new Date().getFullYear().toString(),
    currentlyWorking: false,
    employmentType: "",
    location: "",
    description: "",
  });

  const [customCompany, setCustomCompany] = useState("");
  const [showOtherCompany, setShowOtherCompany] = useState(false);
  const [customSkill, setCustomSkill] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [experienceData, setExperienceData] = useState<any>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) =>
    (currentYear - i).toString()
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);

      if (
        initialData.companyName &&
        !COMPANIES.includes(initialData.companyName)
      ) {
        setShowOtherCompany(true);
        setCustomCompany(initialData.companyName);
      }
    }
  }, [initialData]);

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

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

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

  const handleCustomCompanyChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomCompany(e.target.value);
    setFormData((prev) => ({
      ...prev,
      companyName: e.target.value,
    }));

    if (errors.companyName) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.companyName;
        return newErrors;
      });
    }
  };

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files.length > 0) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       media: e.target.files![0],
  //     }));
  //   }
  // };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = "Job title is required";
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!formData.employmentType) {
      newErrors.employmentType = "Employment type is required";
    }

    if (!formData.fromMonth) {
      newErrors.fromMonth = "Start month is required";
    }

    if (!formData.fromYear) {
      newErrors.fromYear = "Start year is required";
    }

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

  const formatDateForApi = (month: string, year: string) => {
    const monthIndex = MONTHS.indexOf(month);
    const formattedMonth = (monthIndex + 1).toString().padStart(2, "0");
    return `${year}-${formattedMonth}-01`;
  };

  const prepareDataForSubmission = () => {
    const fromDate = formatDateForApi(formData.fromMonth, formData.fromYear);
    const toDate = formData.currentlyWorking
      ? null
      : formatDateForApi(
          formData.toMonth || "December",
          formData.toYear || new Date().getFullYear().toString()
        );

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
      foundVia: formData.foundVia,
    };
  };

  const handleSave = () => {
    if (validateForm()) {
      const data = prepareDataForSubmission();
      setExperienceData(data);
      setShowConfirmation(true);
    }
  };

  const handleConfirm = () => {
    onSave(experienceData);
    onClose();
  };

  const handleAddMore = () => {
    onSave(experienceData);
    setFormData({
      jobTitle: "",
      companyName: "",
      fromMonth: "January",
      fromYear: new Date().getFullYear().toString(),
      employmentType: "",
      location: "",
      description: "",
    });
    setCustomCompany("");
    setShowOtherCompany(false);
    setShowConfirmation(false);
  };

  return (
    <div className="fixed inset-0 bg-black/30  z-50 flex items-center justify-center">
      <div
        className={`bg-white rounded-lg lg:w-[45%] w-[100%]  flex flex-col max-h-[100vh] overflow-y-auto shadow-lg`}
      >
        <div className="sticky top-0 z-10 bg-white flex justify-between items-center p-4 border-b rounded-t-lg">
          <h3 className="text-xl font-semibold">Add Experience</h3>
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
                    setFormData((prev) => ({
                      ...prev,
                      jobTitle: e.target.value,
                    }))
                  }
                  className="w-full mt-2 px-3 py-2 border rounded-md border-gray-300"
                />
              )}
              {errors.jobTitle && (
                <p className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>
              )}
            </div>
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
                <p className="text-red-500 text-sm mt-1">
                  {errors.companyName}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="employmentType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Employment Type<span className="text-red-500">*</span>
              </label>
              <select
                id="employmentType"
                name="employmentType"
                value={formData.employmentType || ""}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.employmentType ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select employment type</option>
                {EMPLOYMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.employmentType && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.employmentType}
                </p>
              )}
            </div>
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
            <div className="space-y-4">
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
                placeholder="Describe your responsibilities and the achievements you made in this role."
                value={formData.description || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
              ></textarea>
            </div>

            {/* <div>
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
            </div> */}
            <div>
              <label
                htmlFor="foundVia"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Found via
              </label>
              <select
                id="foundVia"
                name="foundVia"
                value={formData.foundVia || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Where did you found this job ?</option>
                {foundVia.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

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

        {showConfirmation && (
          <ConfirmationDialog
            title="Experience Add"
            message={`${formData.jobTitle} at ${formData.companyName} will be added to your profile.`}
            confirmText="Okay"
            onConfirm={handleConfirm}
            onCancel={() => setShowConfirmation(false)}
            showAddMore={!initialData}
            onAddMore={handleAddMore}
          />
        )}
      </div>
    </div>
  );
};

export default ExperienceForm;
