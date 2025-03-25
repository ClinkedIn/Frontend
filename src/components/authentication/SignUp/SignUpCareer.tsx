import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSignup } from "../../../context/SignUpContext"; 
import Footer from "../../Footer/Footer";

const SignupCareer = () => {
  const navigate = useNavigate();
  const { signupData, setSignupData } = useSignup();

  // Validate forms
  const isCareerValid = signupData.jobTitle?.trim() && signupData.company?.trim();
  const isStudentValid = signupData.school?.trim() && signupData.startYear && signupData.endYear;

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  // Function to check if the entered date is valid
  const isValidDate = (day: number, month: number, year: number) => {
    if (!day || !month || !year) return false;
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  };

  const isBirthDateValid = isValidDate(
    parseInt(signupData.dobDay || "0", 10),
    parseInt(signupData.dobMonth || "0", 10),
    parseInt(signupData.dobYear || "0", 10)
  );

  const handleToggleStudent = () => {
    setSignupData({ ...signupData, isStudent: !signupData.isStudent });
  };

  const handleToggleOver16 = () => {
    setSignupData({ ...signupData, over16: !signupData.over16 });
  };

  const handleContinue = () => {
    if (signupData.isStudent ? isStudentValid && (signupData.over16 || isBirthDateValid) : isCareerValid) {
      navigate("/verify-email");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 sm:px-6">
      {/* LinkedIn Logo */}
      <div className="w-full flex justify-center mb-6">
        <img className="absolute top-6 left-45 h-8" src="/public/images/login-logo.svg" alt="LinkedIn" />
      </div>

      {/* Form Heading */}
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 text-center mb-6">
        Your profile helps you discover new people and opportunities
      </h1>

      {/* Form Container */}
      <div className="w-full max-w-[90%] sm:max-w-md bg-white p-5 rounded-lg shadow-md">
        {!signupData.isStudent ? (
          <>
            {/* Career Form */}
            <label className="block text-sm text-gray-700 mb-1">Most recent job title *</label>
            <input
              type="text"
              name="jobTitle"
              value={signupData.jobTitle || ""}
              onChange={handleChange}
              placeholder="Enter job title"
              className="w-full p-2 py-1 border border-gray-500 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200"
            />

            <label className="block text-sm text-gray-700 mt-4 mb-1">Employment type</label>
            <select
              name="employmentType"
              value={signupData.employmentType || ""}
              onChange={handleChange}
              className="w-full p-2 py-1 border border-gray-500 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200"
            >
              <option value="">Select one</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Freelance">Freelance</option>
            </select>

            <label className="block text-sm text-gray-700 mt-4 mb-1">Most recent company *</label>
            <input
              type="text"
              name="company"
              value={signupData.company || ""}
              onChange={handleChange}
              placeholder="Enter company name"
              className="w-full p-2 py-1 border border-gray-500 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </>
        ) : (
          <>
            {/* Student Form */}
            <label className="block text-sm text-gray-700 mb-1">School or College/University *</label>
            <input
              type="text"
              name="school"
              value={signupData.school || ""}
              onChange={handleChange}
              placeholder="Enter your school"
              className="w-full p-2 py-1 border border-gray-500 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200"
            />

            <div className="flex space-x-2 mt-4">
              <div className="w-1/2">
                <label className="block text-sm text-gray-700 mb-1">Start year *</label>
                <select
                  name="startYear"
                  value={signupData.startYear || ""}
                  onChange={handleChange}
                  className="w-full p-2 py-1 border border-gray-500 rounded-md"
                >
                  <option value="">Select</option>
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i} value={(2025 - i).toString()}>{2025 - i}</option>
                  ))}
                </select>
              </div>

              <div className="w-1/2">
                <label className="block text-sm text-gray-700 mb-1">End year *</label>
                <select
                  name="endYear"
                  value={signupData.endYear || ""}
                  onChange={handleChange}
                  className="w-full p-2 py-1 border border-gray-500 rounded-md"
                >
                  <option value="">Select</option>
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i} value={(2025 + i).toString()}>{2025 + i}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Over 16 Toggle */}
            <div className="border border-gray-400 py-3 rounded-md p-4 mt-4 flex justify-between items-center">
              <span className="text-gray-700 text-sm mr-4">I'm over 16</span>
              <div
                onClick={handleToggleOver16}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition duration-300 ${
                  signupData.over16 ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform transition duration-300 ${
                    signupData.over16 ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </div>
            </div>

            {/* Date of Birth */}
            {!signupData.over16 && (
              <div className="mt-4">
                <label className="block text-sm text-gray-700 mb-1">Date of Birth *</label>
                <div className="flex space-x-2">
                  {/* Day Dropdown */}
                  <select name="dobDay" value={signupData.dobDay || ""} onChange={handleChange} className="w-1/3 p-2 border rounded-md">
                    <option value="">Day</option>
                    {Array.from({ length: 31 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>

                  {/* Month Dropdown */}
                  <select name="dobMonth" value={signupData.dobMonth || ""} onChange={handleChange} className="w-1/3 p-2 border rounded-md">
                    <option value="">Month</option>
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => (
                      <option key={i + 1} value={i + 1}>{m}</option>
                    ))}
                  </select>

                  {/* Year Dropdown */}
                  <select name="dobYear" value={signupData.dobYear || ""} onChange={handleChange} className="w-1/3 p-2 border rounded-md">
                    <option value="">Year</option>
                    {Array.from({ length: 100 }, (_, i) => (
                      <option key={i} value={2025 - i}>{2025 - i}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </>
        )}

        {/* Toggle Between Student and Career */}
        <motion.button className="w-full mt-4 text-gray-700 text-sm font-semibold hover:underline" onClick={handleToggleStudent}>
          {signupData.isStudent ? "I'm not a student" : "I'm a student"}
        </motion.button>

        {/* Continue Button */}
        <motion.button className="w-full mt-4 py-2 text-lg font-semibold rounded-full bg-blue-600 text-white hover:bg-blue-700" onClick={handleContinue}>
          Continue
        </motion.button>
      </div>

      <Footer />
    </div>
  );
};

export default SignupCareer;
