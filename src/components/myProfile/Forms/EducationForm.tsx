import React, { useState } from "react";
import ConfirmationDialog from "../ConfirmationDialog";
import Form from "./Form";

/**
 * @interface EducationFormProps
 * @description Props for the EducationForm component
 * @property {object} initialData - Initial education data for editing mode
 * @property {function} onClose - Function to close the form
 * @property {function} onSave - Function to save the education data
 */
interface EducationFormProps {
  initialData?: any;
  onClose: () => void;
  onSave: (education: any) => void;
}

/**
 * @constant UNIVERSITIES
 * @description List of predefined universities available for selection
 * @type {string[]}
 */
const UNIVERSITIES = [
  "Harvard University",
  "Cairo University",
  "Alexandria University",
  "Ain Shams University",
  "Stanford University",
  "Massachusetts Institute of Technology",
  "University of Cambridge",
  "University of Oxford",
  "Yale University",
  "Princeton University",
  "Columbia University",
  "University of Chicago",
  "University of California, Berkeley",
  "Boston University",
  "New York University",
  "University of London",
  "University of Toronto",
  "McGill University",
  "University of Sydney",
  "University of Melbourne",
  "National University of Singapore",
  "Tsinghua University",
  "Peking University",
];

/**
 * @constant DEGREE_TYPES
 * @description List of degree types available for selection
 * @type {string[]}
 */
const DEGREE_TYPES = [
  "Bachelor's",
  "Master's",
  "PhD",
  "Associate's",
  "Bachelor of Arts (BA)",
  "Bachelor of Science (BS)",
  "Bachelor of Fine Arts (BFA)",
  "Bachelor of Business Administration (BBA)",
  "Master of Arts (MA)",
  "Master of Science (MS)",
  "Master of Business Administration (MBA)",
  "Master of Fine Arts (MFA)",
  "Doctor of Philosophy (PhD)",
  "Doctor of Medicine (MD)",
  "Juris Doctor (JD)",
  "High School Diploma",
  "Certificate",
];

/**
 * @constant FIELDS_OF_STUDY
 * @description List of fields of study available for selection
 * @type {string[]}
 */
const FIELDS_OF_STUDY = [
  "Computer Science",
  "Business Administration",
  "Economics",
  "Psychology",
  "Biology",
  "Engineering",
  "Mathematics",
  "Communications",
  "Political Science",
  "English Literature",
  "History",
  "Chemistry",
  "Physics",
  "Sociology",
  "Marketing",
  "Finance",
  "Nursing",
  "Education",
  "Architecture",
  "Graphic Design",
];

/**
 * @constant COMMON_SKILLS
 * @description List of common skills that can be added to education
 * @type {string[]}
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
 * Helper function to generate an array of years for dropdowns
 */
const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 50 }, (_, i) => (currentYear - i).toString());
};

/**
 * @component EducationForm
 * @description A form component that allows users to add or edit their educational history
 * @param {EducationFormProps} props - Component props containing onClose and onSave functions
 * @returns {React.ReactElement} The rendered education form
 */
const EducationForm: React.FC<EducationFormProps> = ({
  initialData,
  onClose,
  onSave,
}) => {
  // Helper functions for date formatting
  const getMonthFromDate = (dateString: string): string => {
    if (!dateString) return "";
    const monthIndex = parseInt(dateString.split("-")[1]) - 1;
    return MONTHS[monthIndex] || "";
  };

  const getYearFromDate = (dateString: string): string => {
    if (!dateString) return "";
    return dateString.split("-")[0] || "";
  };

  const currentYear = new Date().getFullYear();
  const years = generateYearOptions();

  // State initialization
  const [school, setSchool] = useState<string>(initialData?.school || "");
  const [showOtherSchool, setShowOtherSchool] = useState<boolean>(
    initialData?.school && !UNIVERSITIES.includes(initialData.school)
      ? true
      : false
  );
  const [customSchool, setCustomSchool] = useState<string>(
    initialData?.school && !UNIVERSITIES.includes(initialData.school)
      ? initialData.school
      : ""
  );
  const [degree, setDegree] = useState<string>(initialData?.degree || "");
  const [fieldOfStudy, setFieldOfStudy] = useState<string>(
    initialData?.fieldOfStudy || ""
  );
  const [startMonth, setStartMonth] = useState<string>(
    initialData?.startDate ? getMonthFromDate(initialData.startDate) : "January"
  );
  const [startYear, setStartYear] = useState<string>(
    initialData?.startDate
      ? getYearFromDate(initialData.startDate)
      : currentYear.toString()
  );
  const [endMonth, setEndMonth] = useState<string>(
    initialData?.endDate ? getMonthFromDate(initialData.endDate) : ""
  );
  const [endYear, setEndYear] = useState<string>(
    initialData?.endDate ? getYearFromDate(initialData.endDate) : ""
  );
  const [currentlyStudying, setCurrentlyStudying] = useState<boolean>(
    initialData?.currentlyStudying || false
  );
  const [grade, setGrade] = useState<string>(initialData?.grade || "");
  const [activitiesAndSocieties, setActivitiesAndSocieties] = useState<string>(
    initialData?.activitiesAndSocieties || ""
  );
  const [description, setDescription] = useState<string>(
    initialData?.description || ""
  );

  const [errors, setErrors] = useState<{
    school?: string;
    startYear?: string;
    startMonth?: string;
    endYear?: string;
    endMonth?: string;
  }>({});
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [educationData, setEducationData] = useState<any>(null);

  /**
   * @function validateForm
   * @description Validates the form fields before submission
   * @returns {boolean} True if the form is valid, false otherwise
   */
  const validateForm = () => {
    const newErrors: {
      school?: string;
      startYear?: string;
      startMonth?: string;
      endYear?: string;
      endMonth?: string;
    } = {};
    let isValid = true;

    const actualSchool = showOtherSchool ? customSchool : school;

    if (!actualSchool.trim()) {
      newErrors.school = "School name is required";
      isValid = false;
    }

    if (!startYear) {
      newErrors.startYear = "Start year is required";
      isValid = false;
    }

    // Add validation for end dates if not currently studying
    if (!currentlyStudying) {
      if (endYear && !endMonth) {
        newErrors.endMonth = "End month is required if end year is provided";
        isValid = false;
      }
      if (endMonth && !endYear) {
        newErrors.endYear = "End year is required if end month is provided";
        isValid = false;
      }

      // Validate that end date is after start date
      if (endYear && endMonth && startYear && startMonth) {
        const startDate = new Date(`${startMonth} 1, ${startYear}`);
        const endDate = new Date(`${endMonth} 1, ${endYear}`);

        if (endDate < startDate) {
          newErrors.endYear = "End date must be after start date";
          isValid = false;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  /**
   * @function handleSave
   * @description Validates the form and shows the confirmation dialog if valid
   */
  const handleSave = () => {
    if (validateForm()) {
      const finalSchool = showOtherSchool ? customSchool : school;

      const formatDate = (month: string, year: string) => {
        if (!month || !year) return undefined;
        const monthIndex = MONTHS.indexOf(month) + 1;
        return `${year}-${monthIndex.toString().padStart(2, "0")}-01`;
      };

      const data = {
        school: finalSchool,
        degree,
        fieldOfStudy,
        startDate: formatDate(startMonth, startYear),
        endDate: currentlyStudying ? undefined : formatDate(endMonth, endYear),
        currentlyStudying,
        grade: grade || undefined,
        activitiesAndSocieties: activitiesAndSocieties || undefined,
        description: description || undefined,
      };

      setEducationData(data);
      setShowConfirmation(true);
    }
  };

  /**
   * @function handleConfirm
   * @description Finalizes the save operation when user confirms
   */
  const handleConfirm = () => {
    // Call the onSave function with the education data
    onClose();

    onSave(educationData);
  };

  /**
   * @function handleAddMore
   * @description Saves the current education data and resets the form for adding more
   */
  const handleAddMore = () => {
    // Save current data and reset form
    onSave(educationData);
    resetForm();
    setShowConfirmation(false);
  };

  /**
   * @function resetForm
   * @description Resets all form fields to their initial state
   */
  const resetForm = () => {
    setSchool("");
    setCustomSchool("");
    setDegree("");
    setFieldOfStudy("");
    setStartMonth("January");
    setStartYear(currentYear.toString());
    setEndMonth("");
    setEndYear("");
    setCurrentlyStudying(false);
    setGrade("");
    setActivitiesAndSocieties("");
    setDescription("");

    setErrors({});
    setShowOtherSchool(false);
  };

  /**
   * @function handleSchoolChange
   * @description Handles changes to the school selection dropdown
   * @param {React.ChangeEvent<HTMLSelectElement>} e - The change event
   */
  const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSchool(value);
    setShowOtherSchool(value === "other");

    // Clear any error when making a selection
    if (value) {
      setErrors((prev) => ({ ...prev, school: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 max-h-[100vh] z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg lg:w-[45%] w-[100%] max-h-[100vh] flex flex-col  overflow-y-auto shadow-lg">
        <div className="sticky top-0 z-10 bg-white flex justify-between items-center p-4 border-b rounded-t-lg">
          <h2 className="text-xl font-semibold">Add education</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="p-4 bg-white overflow-y-auto max-h-[calc(100vh-160px)]">
          <p className="text-sm text-gray-600 mb-4">* Indicates required</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium te    xt-gray-700 mb-1">
                School<span className="text-red-500">*</span>
              </label>
              <select
                value={school}
                onChange={handleSchoolChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.school && !showOtherSchool
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                required
              >
                <option value="">Select a school</option>
                {UNIVERSITIES.map((uni, index) => (
                  <option key={index} value={uni}>
                    {uni}
                  </option>
                ))}
                <option value="other">Other (not listed)</option>
              </select>

              {showOtherSchool && (
                <input
                  type="text"
                  placeholder="Enter school name"
                  value={customSchool}
                  onChange={(e) => {
                    setCustomSchool(e.target.value);
                    if (e.target.value.trim()) {
                      setErrors((prev) => ({ ...prev, school: undefined }));
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-md mt-2 ${
                    errors.school ? "border-red-500" : "border-gray-300"
                  }`}
                />
              )}

              {errors.school && (
                <p className="text-red-500 text-sm mt-1">{errors.school}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Degree
              </label>
              <select
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full px-3 py-2 border rounded-md border-gray-300"
              >
                <option value="">Select a degree</option>
                {DEGREE_TYPES.map((degreeType, index) => (
                  <option key={index} value={degreeType}>
                    {degreeType}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field of study
              </label>
              <select
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
                className="w-full px-3 py-2 border rounded-md border-gray-300"
              >
                <option value="">Select field of study</option>
                {FIELDS_OF_STUDY.map((field, index) => (
                  <option key={index} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start date<span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <select
                    value={startMonth}
                    onChange={(e) => setStartMonth(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md border-gray-300"
                  >
                    {MONTHS.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={startYear}
                    onChange={(e) => {
                      setStartYear(e.target.value);
                      if (e.target.value) {
                        setErrors((prev) => ({
                          ...prev,
                          startYear: undefined,
                        }));
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.startYear ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  {errors.startYear && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.startYear}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="currentlyStudying"
                checked={currentlyStudying}
                onChange={(e) => setCurrentlyStudying(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="currentlyStudying"
                className="ml-2 block text-sm text-gray-700"
              >
                I am currently studying here
              </label>
            </div>

            {!currentlyStudying && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End date
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <select
                      value={endMonth}
                      onChange={(e) => {
                        setEndMonth(e.target.value);
                        if (e.target.value) {
                          setErrors((prev) => ({
                            ...prev,
                            endMonth: undefined,
                          }));
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-md ${
                        errors.endMonth ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Month</option>
                      {MONTHS.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
                    </select>
                    {errors.endMonth && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.endMonth}
                      </p>
                    )}
                  </div>
                  <div>
                    <select
                      value={endYear}
                      onChange={(e) => {
                        setEndYear(e.target.value);
                        if (e.target.value) {
                          setErrors((prev) => ({
                            ...prev,
                            endYear: undefined,
                          }));
                        }
                      }}
                      className={`w-full px-3 py-2 border rounded-md ${
                        errors.endYear ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Year</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    {errors.endYear && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.endYear}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade
              </label>
              <input
                type="text"
                placeholder="Ex: 3.8 GPA"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-2 border rounded-md border-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Activities and societies
              </label>
              <textarea
                placeholder="Ex: Coding Club, Debate Team"
                value={activitiesAndSocieties}
                onChange={(e) => setActivitiesAndSocieties(e.target.value)}
                className="w-full px-3 py-2 border rounded-md h-24 resize-none border-gray-300"
                maxLength={500}
              ></textarea>
              <div className="flex justify-end">
                <span className="text-xs text-gray-500">
                  {activitiesAndSocieties.length}/500
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                placeholder="You can write about projects, achievements, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-md h-32 resize-none border-gray-300"
              ></textarea>
            </div>
          </div>
        </div>
        <div className="flex justify-end p-4 border-t ">
          <button
            type="button"
            className="mr-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-full font-medium hover:bg-gray-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
        {showConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 ">
            <ConfirmationDialog
              title="Education will be Added"
              message={`${
                showOtherSchool ? customSchool : school
              } will be added to your profile.`}
              confirmText="Okay"
              onConfirm={handleConfirm}
              onCancel={() => setShowConfirmation(false)}
              showAddMore={true}
              onAddMore={handleAddMore}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationForm;
