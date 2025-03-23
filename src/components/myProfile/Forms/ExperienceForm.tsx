import React, { useState } from "react";

interface ExperienceFormProps {
  onClose: () => void;
  onSave: (experience: {
    title: string;
    employmentType: string;
    organization: string;
    currentlyWorking: boolean;
    startMonth: string;
    startYear: string;
    endMonth: string;
    endYear: string;
    location: string;
    locationType: string;
    description: string;
    profileHeadline?: string;
    jobSource?: string;
  }) => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [organization, setOrganization] = useState("");
  const [currentlyWorking, setCurrentlyWorking] = useState(false);
  const [startMonth, setStartMonth] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [endYear, setEndYear] = useState("");
  const [location, setLocation] = useState("");
  const [locationType, setLocationType] = useState("");
  const [description, setDescription] = useState("");

  const [profileHeadline, setProfileHeadline] = useState("");
  const [jobSource, setJobSource] = useState("");

  const [errors, setErrors] = useState<{
    title?: string;
    organization?: string;
    startDate?: string;
    endDate?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      title?: string;
      organization?: string;
      startDate?: string;
      endDate?: string;
    } = {};
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }

    if (!organization.trim()) {
      newErrors.organization = "Company or organization is required";
      isValid = false;
    }

    if (!startMonth || !startYear) {
      newErrors.startDate = "Start date is required";
      isValid = false;
    }

    if (!currentlyWorking && (!endMonth || !endYear)) {
      newErrors.endDate = "End date is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        title,
        employmentType,
        organization,
        currentlyWorking,
        startMonth,
        startYear,
        endMonth,
        endYear,
        location,
        locationType,
        description,
        profileHeadline,
        jobSource,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)]  flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-xl shadow-lg overflow-y-auto max-h-[98vh]">
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
                Title<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Retail Sales Manager"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.title ? "border-red-500" : ""
                }`}
                required
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employment type
              </label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full px-3 py-2 border rounded-md appearance-none"
              >
                <option value="">Please select</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Self-employed">Self-employed</option>
                <option value="Freelance">Freelance</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Apprenticeship">Apprenticeship</option>
                <option value="Seasonal">Seasonal</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company or organization<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Microsoft"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.organization ? "border-red-500" : ""
                }`}
                required
              />
              {errors.organization && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.organization}
                </p>
              )}
            </div>

            <div className="flex items-center mt-2">
              <div className="flex items-center h-10">
                <div className="bg-green-600 text-white rounded p-1 mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
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
                <label className="text-gray-700">
                  I am currently working in this role
                </label>
              </div>
              <input
                type="checkbox"
                checked={currentlyWorking}
                onChange={() => setCurrentlyWorking(!currentlyWorking)}
                className="h-4 w-4 ml-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start date<span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={startMonth}
                  onChange={(e) => setStartMonth(e.target.value)}
                  className={`border rounded-md px-3 py-2 appearance-none ${
                    errors.startDate ? "border-red-500" : ""
                  }`}
                  required
                >
                  <option value="">Month</option>
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                </select>
                <select
                  value={startYear}
                  onChange={(e) => setStartYear(e.target.value)}
                  className={`border rounded-md px-3 py-2 appearance-none ${
                    errors.startDate ? "border-red-500" : ""
                  }`}
                  required
                >
                  <option value="">Year</option>
                  {Array.from(
                    { length: 50 },
                    (_, i) => new Date().getFullYear() - i
                  ).map((year) => (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
              )}
            </div>

            {!currentlyWorking && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End date<span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={endMonth}
                    onChange={(e) => setEndMonth(e.target.value)}
                    className={`border rounded-md px-3 py-2 appearance-none ${
                      errors.endDate ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">Month</option>
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                  </select>
                  <select
                    value={endYear}
                    onChange={(e) => setEndYear(e.target.value)}
                    className={`border rounded-md px-3 py-2 appearance-none ${
                      errors.endDate ? "border-red-500" : ""
                    }`}
                  >
                    <option value="">Year</option>
                    {Array.from(
                      { length: 50 },
                      (_, i) => new Date().getFullYear() - i
                    ).map((year) => (
                      <option key={year} value={year.toString()}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.endDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="Ex: London, United Kingdom"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location type
              </label>
              <select
                value={locationType}
                onChange={(e) => setLocationType(e.target.value)}
                className="w-full px-3 py-2 border rounded-md appearance-none"
              >
                <option value="">Please select</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Pick a location type (ex: remote)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                placeholder="List your major duties and successes, highlighting specific projects"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-md h-32"
              ></textarea>
              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center">
                  <div className="bg-yellow-100 rounded p-1 mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-yellow-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <span className="text-blue-600 font-medium text-sm">
                    Get AI suggestions
                  </span>
                  <span className="text-gray-500 text-sm ml-1">
                    with Premium
                  </span>
                </div>
                <span className="text-gray-500 text-sm">0/2,000</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile headline
              </label>
              <input
                type="text"
                placeholder="Ex: Biomedical engineering student at Cairo university"
                value={profileHeadline}
                onChange={(e) => setProfileHeadline(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
              <p className="text-xs text-gray-500 mt-1">
                Appears below your name at the top of the profile
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Where did you find this job?
              </label>
              <select
                value={jobSource}
                onChange={(e) => setJobSource(e.target.value)}
                className="w-full px-3 py-2 border rounded-md appearance-none"
              >
                <option value="">Please select</option>
                <option value="Company website">Company website</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Job board">Job board</option>
                <option value="Recruiter">Recruiter</option>
                <option value="Personal connection">Personal connection</option>
                <option value="University">University</option>
                <option value="Other">Other</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                This information will be used to improve LinkedIn's job search
                experience.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-4 border-t bg-gray-50">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceForm;
