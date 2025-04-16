import React, { useState } from "react";
import ConfirmationDialog from "../ConfirmationDialog";

interface EducationFormProps {
  onClose: () => void;
  onSave: (education: any) => void;
}

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

const EducationForm: React.FC<EducationFormProps> = ({ onClose, onSave }) => {
  const [school, setSchool] = useState("");
  const [customSchool, setCustomSchool] = useState("");
  const [degree, setDegree] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [grade, setGrade] = useState("");
  const [activitiesAndSocieties, setActivitiesAndSocieties] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const [media, setMedia] = useState("");
  const [errors, setErrors] = useState<{
    school?: string;
    startDate?: string;
  }>({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [educationData, setEducationData] = useState<any>(null);
  const [showOtherSchool, setShowOtherSchool] = useState(false);

  const validateForm = () => {
    const newErrors: { school?: string; startDate?: string } = {};
    let isValid = true;

    const actualSchool = showOtherSchool ? customSchool : school;

    if (!actualSchool.trim()) {
      newErrors.school = "School name is required";
      isValid = false;
    }

    if (!startDate) {
      newErrors.startDate = "Start date is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (validateForm()) {
      const finalSchool = showOtherSchool ? customSchool : school;
      const data = {
        school: finalSchool,
        degree,
        fieldOfStudy,
        startDate,
        endDate: endDate || undefined,
        grade: grade || undefined,
        activitiesAndSocieties: activitiesAndSocieties || undefined,
        description: description || undefined,
        skills: selectedSkills.length > 0 ? selectedSkills : undefined,
        media: media || undefined,
      };

      setEducationData(data);
      setShowConfirmation(true);
    }
  };

  const handleConfirm = () => {
    // Call the onSave function with the education data
    onSave(educationData);
    onClose();
  };

  const handleAddMore = () => {
    // Save current data and reset form
    onSave(educationData);
    resetForm();
  };

  const resetForm = () => {
    setSchool("");
    setCustomSchool("");
    setDegree("");
    setFieldOfStudy("");
    setGrade("");
    setActivitiesAndSocieties("");
    setDescription("");
    setSelectedSkills([]);
    setCustomSkill("");
    setMedia("");
    setShowConfirmation(false);
    setShowOtherSchool(false);
  };

  const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSchool(value);
    setShowOtherSchool(value === "other");
  };

  const addSkill = () => {
    if (customSkill && !selectedSkills.includes(customSkill)) {
      setSelectedSkills([...selectedSkills, customSkill]);
      setCustomSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  const selectSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
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
              <select
                value={school}
                onChange={handleSchoolChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.school && !showOtherSchool ? "border-red-500" : ""
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
                  onChange={(e) => setCustomSchool(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md mt-2 ${
                    errors.school ? "border-red-500" : ""
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
                className="w-full px-3 py-2 border rounded-md"
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
                className="w-full px-3 py-2 border rounded-md"
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
              <input
                type="text"
                placeholder="YYYY-MM-DD (e.g., 2017-09-01)"
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
                Format: YYYY-MM-DD (e.g., 2017-09-01)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End date (or expected)
              </label>
              <input
                type="text"
                placeholder="YYYY-MM-DD (e.g., 2021-06-01)"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: YYYY-MM-DD (e.g., 2021-06-01)
              </p>
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
                placeholder="Ex: Coding Club, Debate Team"
                value={activitiesAndSocieties}
                onChange={(e) => setActivitiesAndSocieties(e.target.value)}
                className="w-full px-3 py-2 border rounded-md h-24 resize-none"
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
                Media (Transcripts, Certificates, etc.)
              </label>
              <input
                type="text"
                placeholder="URL to your document (e.g., https://example.com/transcript.pdf)"
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
          title="Education Added"
          message={`${
            showOtherSchool ? customSchool : school
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

export default EducationForm;
