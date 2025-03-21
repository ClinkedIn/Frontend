import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../Footer/Footer"; 

const SignupNamePage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      return;
    }
    navigate("/signup-location");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Logo */}
      <img
        className="absolute top-6 left-45 h-8"
        src="/public/images/login-logo.svg"
        alt="LinkedIn"
      />

      {/* Header Text */}
      <h1 className="text-3xl font-normal text-gray-900 mb-6">
        Make the most of your professional life
      </h1>

      {/* Form Container */}
      <div className="w-[360px] p-6 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name Input */}
          <div className="flex flex-col">
            <label htmlFor="first-name" className="text-sm font-medium text-gray-700 mb-1">
              First name
            </label>
            <input
              id="first-name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-2 border py-1 rounded-md text-sm border-gray-600"
            />
          </div>

          {/* Last Name Input */}
          <div className="flex flex-col">
            <label htmlFor="last-name" className="text-sm font-medium text-gray-700 mb-1">
              Last name
            </label>
            <input
              id="last-name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-2 border py-1 rounded-md text-sm border-gray-600"
            />
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700"
          >
            Continue
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default SignupNamePage;
