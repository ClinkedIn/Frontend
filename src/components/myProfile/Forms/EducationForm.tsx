import React, { useState } from "react";

interface EducationFormProps {
  onClose: () => void;
  onSave: (education: {
    school: string;
    degree: string;
    fieldOfStudy: string;
    startMonth: string;
    startYear: string;
    endMonth: string;
    endYear: string;
    grade?: string;
    activities?: string;
    description?: string;
  }) => void;
}

const EducationForm: React.FC<EducationFormProps> = ({ onClose, onSave }) => {
  const [school, setSchool] = useState("");
  const [degree, setDegree] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [endYear, setEndYear] = useState("");
  const [grade, setGrade] = useState("");
  const [activities, setActivities] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{
    school?: string;
    startDate?: string;
  }>({});

  const validateForm = () => {
    const newErrors: { school?: string; startDate?: string } = {};
    let isValid = true;

    if (!school.trim()) {
      newErrors.school = "School name is required";
      isValid = false;
    }

    if (!startMonth || !startYear) {
      newErrors.startDate = "Start date is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        school,
        degree,
        fieldOfStudy,
        startMonth,
        startYear,
        endMonth,
        endYear,
        grade,
        activities,
        description,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-xl shadow-lg overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold">Add education</h3>
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
                School<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Boston University"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.school ? "border-red-500" : ""
                }`}
                required
              />
              {errors.school && (
                <p className="text-red-500 text-sm mt-1">{errors.school}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Degree
              </label>
              <input
                type="text"
                placeholder="Ex: Bachelor's"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field of study
              </label>
              <input
                type="text"
                placeholder="Ex: Business"
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End date (or expected)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={endMonth}
                  onChange={(e) => setEndMonth(e.target.value)}
                  className="border rounded-md px-3 py-2 appearance-none"
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
                  className="border rounded-md px-3 py-2 appearance-none"
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade
              </label>
              <input
                type="text"
                placeholder="Ex: 3.8 GPA"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Activities and societies
              </label>
              <textarea
                placeholder="Ex: Alpha Phi Omega, Marching Band, Volleyball"
                value={activities}
                onChange={(e) => setActivities(e.target.value)}
                className="w-full px-3 py-2 border rounded-md h-24 resize-none"
                maxLength={500}
              ></textarea>
              <div className="flex justify-end">
                <span className="text-xs text-gray-500">
                  {activities.length}/500
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                placeholder="You can write about the courses you took, projects, achievements, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-md h-32 resize-none"
              ></textarea>
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
    </div>
  );
};

export default EducationForm;
