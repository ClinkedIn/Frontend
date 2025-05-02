/**
 * ScreeningQuestionCard component renders a dynamic form card based on a given screening question type.
 * 
 * Depending on the `questionType` prop, it displays appropriate input fields to capture user responses,
 * such as text inputs, dropdowns, and number fields. It also provides a remove button to delete the question card.
 * 
 * @component
 * 
 * @param {Object} props - Component props.
 * @param {string} props.questionType - The type of screening question to render (e.g., "Education", "Language", "Work Experience", etc.).
 * @param {Object} props.data - An object containing the values for the inputs (e.g., `degree`, `language`, `proficiency`, etc.).
 * @param {Function} props.onChange - Callback triggered when input fields are updated. Receives the updated data object.
 * @param {Function} props.onRemove - Callback triggered when the question card is removed.
 * 
 * @returns {JSX.Element} A styled card displaying a question and related input fields based on the provided type.
 */
const ScreeningQuestionCard = ({ questionType, data, onChange, onRemove }) => {

  /**
   * Renders the appropriate form fields based on the given question type.
   * 
   * This function determines which fields should be rendered based on the `questionType` prop. It handles
   * rendering text inputs, select options, and other form elements as required for each specific question type.
   * 
   * @returns {JSX.Element|null} The form fields or null if no fields are rendered for the given `questionType`.
   */
  const renderFields = () => {
    switch (questionType) {
      case "Background Check":
      case "Driver's License":
      case "Drug Test":
      case "Hybrid Work":
      case "Location":
      case "Onsite Work":
      case "Remote Work":
      case "Urgent Hiring Need":
      case "Visa Status":
      case "Work Authorization":
        return (
          <div className="mt-2 text-gray-700">
            <p className="font-medium">Ideal answer:</p>
            <p>Yes</p>
          </div>
        );

      case "Education":
        return (
          <div className="mt-2 space-y-2">
            <label className="block font-medium text-gray-700">
              Degree
              <input
                type="text"
                className="mt-1 block w-full rounded border-black border-2"
                value={data.degree || ""}
                onChange={(e) => onChange({ degree: e.target.value })}
              />
            </label>
          </div>
        );

      case "Expertise with Skill":
      case "Industry Experience":
      case "Work Experience":
        return (
          <div className="mt-2 space-y-2">
            <label className="block font-medium text-gray-700">
              {questionType.includes("Skill") ? "Skill" : questionType.includes("Industry") ? "Industry" : "Job Function"}
              <input
                type="text"
                className="mt-1 block w-full rounded border-black border-2"
                value={data.name || ""}
                onChange={(e) => onChange({ ...data, name: e.target.value })}
              />
            </label>
            <label className="block font-medium text-gray-700">
              Years of Experience
              <input
                type="number"
                className="mt-1 block w-full rounded border-black border-2"
                value={data.years || ""}
                onChange={(e) => onChange({ ...data, years: e.target.value })}
              />
            </label>
          </div>
        );

      case "Language":
        return (
          <div className="mt-2 space-y-2">
            <label className="block font-medium text-gray-700">
              Language
              <input
                type="text"
                className="mt-1 block w-full rounded border-black border-2"
                value={data.language || ""}
                onChange={(e) => onChange({ ...data, language: e.target.value })}
              />
            </label>
            <label className="block font-medium text-gray-700">
              Proficiency
              <select
                className="mt-1 block w-full rounded border-black border-2"
                value={data.proficiency || ""}
                onChange={(e) => onChange({ ...data, proficiency: e.target.value })}
              >
                <option value="">Select level</option>
                {proficiencyLevels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </label>
          </div>
        );

      case "Custom Question":
        return (
          <div className="mt-2 space-y-2">
            <label className="block font-medium text-gray-700">
              Custom Question
              <input
                type="text"
                className="mt-1 block w-full rounded border-black border-2"
                value={data.question || ""}
                onChange={(e) => onChange({ ...data, question: e.target.value })}
              />
            </label>

            <label className="block font-medium text-gray-700">
              Answer Type
              <select
                className="mt-1 block w-full rounded border-black border-2"
                value={data.answerType || ""}
                onChange={(e) => onChange({ ...data, answerType: e.target.value, answerValue: "" })}
              >
                <option value="">Select type</option>
                <option value="yesno">Yes/No</option>
                <option value="number">Numeric</option>
              </select>
            </label>

            {data.answerType === "yesno" && (
              <label className="block font-medium text-gray-700">
                Expected Answer
                <select
                  className="mt-1 block w-full rounded border-black border-2"
                  value={data.answerValue || ""}
                  onChange={(e) => onChange({ ...data, answerValue: e.target.value })}
                >
                  <option value="">Select</option>
                  {yesNoOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </label>
            )}

            {data.answerType === "number" && (
              <label className="block font-medium text-gray-700">
                Numeric Answer
                <input
                  type="number"
                  className="mt-1 block w-full rounded border-black border-2"
                  value={data.answerValue || ""}
                  onChange={(e) => onChange({ ...data, answerValue: e.target.value })}
                />
              </label>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const questionTexts = {
    "Background Check": "Are you willing to undergo a background check, in accordance with local law/regulations?",
    "Driver's License": "Do you have a valid driver's license?",
    "Drug Test": "Are you willing to take a drug test, in accordance with local law/regulations?",
    "Education": "Have you completed the following level of education: [Degree]?",
    "Expertise with Skill": "How many years of work experience do you have with [Skill]?",
    "Hybrid Work": "Are you comfortable working in a hybrid setting?",
    "Industry Experience": "How many years of [Industry] experience do you currently have?",
    "Language": "What is your level of proficiency in [Language]?",
    "Location": "Are you comfortable commuting to this job's location?",
    "Onsite Work": "Are you comfortable working in an onsite setting?",
    "Remote Work": "Are you comfortable working in a remote setting?",
    "Urgent Hiring Need": "We must fill this position urgently. Can you start immediately?",
    "Visa Status": "Will you now or in the future require sponsorship for employment visa status?",
    "Work Authorization": "Are you legally authorized to work in Egypt?",
    "Work Experience": "How many years of [Job Function] experience do you currently have?",
    "Custom Question": "Write a custom screening question."
  };

  return (
    <div className="p-4 border rounded-lg shadow bg-white">
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-semibold text-gray-900">{questionTexts[questionType]}</h3>
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-gray-600 text-xl leading-none"
        >
          &times;
        </button>
      </div>
      {renderFields()}
      <div className="mt-4 flex items-center">
        <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
        <label className="ml-2 text-sm text-gray-700">Must–have qualification</label>
      </div>
    </div>
  );
};

export default ScreeningQuestionCard;
