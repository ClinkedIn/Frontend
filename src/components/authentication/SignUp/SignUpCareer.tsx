import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "../../Footer/footer";

const SignupCareer = () => {
  const navigate = useNavigate();
  const [isStudent, setIsStudent] = useState(false); // Toggle between career and student form
  const [careerData, setCareerData] = useState({
    jobTitle: "",
    employmentType: "",
    company: "",
  });

  const [studentData, setStudentData] = useState({
    school: "",
    startYear: "",
    endYear: "",
    over16: true,
    dobMonth: "",
    dobDay: "",
    dobYear: "",
  });

  // Validate forms
  const isCareerValid = careerData.jobTitle.trim() && careerData.company.trim();
  const isStudentValid =
    studentData.school.trim() && studentData.startYear && studentData.endYear;

  // Handle input changes
  const handleCareerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCareerData({ ...careerData, [e.target.name]: e.target.value });
  };

  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    setStudentData((prev) => {
      const updatedData = { ...prev, [name]: value };
  
      // Validate the date only if all fields are filled
      if (updatedData.dobDay && updatedData.dobMonth && updatedData.dobYear) {
        const day = parseInt(updatedData.dobDay, 10);
        const month = parseInt(updatedData.dobMonth, 10);
        const year = parseInt(updatedData.dobYear, 10);
  
        const isValid = isValidDate(day, month, year);
        
        if (!isValid) {
          alert("Invalid date! Please enter a valid birth date.");
          return prev; // Prevent invalid state update
        }
      }
  
      return updatedData;
    });
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
    parseInt(studentData.dobDay, 10),
    parseInt(studentData.dobMonth, 10),
    parseInt(studentData.dobYear, 10)
  );
  

  const handleToggleStudent = () => {
    setIsStudent(!isStudent);
  };

  const handleContinue = () => {
    if (isStudent ? isStudentValid : isCareerValid) {
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
        {!isStudent ? (
          // Career Form
          <>
            <label className="block text-sm text-gray-700 mb-1">Most recent job title *</label>
            <input
              type="text"
              name="jobTitle"
              value={careerData.jobTitle}
              onChange={handleCareerChange}
              placeholder="Enter job title"
              className="w-full p-2 py-1 border border-gray-500 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200"
            />

            <label className="block text-sm text-gray-700 mt-4 mb-1">Employment type</label>
            <select
              name="employmentType"
              value={careerData.employmentType}
              onChange={handleCareerChange}
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
              value={careerData.company}
              onChange={handleCareerChange}
              placeholder="Enter company name"
              className="w-full p-2 py-1 border border-gray-500 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </>
        ) : (
          // Student Form
          <>
            <label className="block text-sm text-gray-700 mb-1">School or College/University *</label>
            <input
              type="text"
              name="school"
              value={studentData.school}
              onChange={handleStudentChange}
              placeholder="Enter your school"
              className="w-full p-2 py-1 border border-gray-500 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200"
            />

            <div className="flex space-x-2 mt-4">
              <div className="w-1/2">
                <label className="block text-sm text-gray-700 mb-1">Start year *</label>
                <select
                  name="startYear"
                  value={studentData.startYear}
                  onChange={handleStudentChange}
                  className="w-full p-2 py-1 border border-gray-500 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200"
                >
                  <option value="">Select</option>
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i} value={(2025 - i).toString()}>{2025 - i}</option>
                  ))}
                </select>
              </div>

              <div className="w-1/2">
                <label className="block text-sm text-gray-700 mb-1">End year (or expected) *</label>
                <select
                  name="endYear"
                  value={studentData.endYear}
                  onChange={handleStudentChange}
                  className="w-full p-2 py-1 border border-gray-500 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200"
                >
                  <option value="">Select</option>
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i} value={(2025 + i).toString()}>{2025 + i}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Age Toggle Button */}
            <div className="border border-gray-400 py-3 rounded-md p-4 mt-4 flex justify-between items-center">
            <span className="text-gray-700 text-sm mr-4">I'm over 16</span>
            <div
                onClick={() => setStudentData({ ...studentData, over16: !studentData.over16 })}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition duration-300 ${
                studentData.over16 ? "bg-green-500" : "bg-gray-300"
                }`}
            >
                <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition duration-300 ${
                    studentData.over16 ? "translate-x-6" : "translate-x-0"
                }`}
                />
            </div>
            </div>

            
            {/* Birthday Form (Only appears if toggle is OFF) */}
            {!studentData.over16 && (
            <div className="mt-4">
                <label className="block text-sm text-gray-700 mb-1">Date of Birth *</label>
                <div className="flex space-x-2">
                {/* Day Dropdown */}
                <select
                    name="dobDay"
                    value={studentData.dobDay}
                    onChange={handleStudentChange}
                    className="w-1/3 p-2 border rounded-md"
                >
                    <option value="">Day</option>
                    {Array.from({ length: 31 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                        {i + 1}
                    </option>
                    ))}
                </select>

                {/* Month Dropdown */}
                <select
                    name="dobMonth"
                    value={studentData.dobMonth}
                    onChange={handleStudentChange}
                    className="w-1/3 p-2 border rounded-md"
                >
                    <option value="">Month</option>
                    {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                        {new Date(0, i).toLocaleString("default", { month: "long" })}
                    </option>
                    ))}
                </select>

                {/* Year Dropdown */}
                <select
                    name="dobYear"
                    value={studentData.dobYear}
                    onChange={handleStudentChange}
                    className="w-1/3 p-2 border rounded-md"
                >
                    <option value="">Year</option>
                    {Array.from({ length: 100 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                        <option key={year} value={year}>
                        {year}
                        </option>
                    );
                    })}
                </select>
                </div>
            </div>
            )}

          </>
        )}

        {/* Toggle Between Student and Career */}
        <motion.button
          className="w-full mt-4 text-gray-700 text-sm font-semibold hover:underline"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToggleStudent}
        >
          {isStudent ? "I'm not a student" : "I'm a student"}
        </motion.button>

        {/* Continue Button */}
        <motion.button
            className={`w-full mt-4 py-2 text-lg font-semibold rounded-full transition-all ${
                (isStudent ? isStudentValid && (studentData.over16 || isBirthDateValid) : isCareerValid)
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            whileHover={(isStudent ? isStudentValid && (studentData.over16 || isBirthDateValid) : isCareerValid) ? { scale: 1.05 } : {}}
            whileTap={(isStudent ? isStudentValid && (studentData.over16 || isBirthDateValid) : isCareerValid) ? { scale: 0.95 } : {}}
            onClick={handleContinue}
            disabled={!(isStudent ? isStudentValid && (studentData.over16 || isBirthDateValid) : isCareerValid)}
            >
            Continue
        </motion.button>

      </div>

      {/* Footer */}
      <div className="mt-6 w-full">
        <Footer />
      </div>
    </div>
  );
};

export default SignupCareer;
