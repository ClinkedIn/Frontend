import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../Footer/Footer";
import { useSignup } from "../../../context/SignUpContext"; 

const SignUpLocation = () => {
  const { signupData, setSignupData } = useSignup();
  const [location, setLocation] = useState(signupData.location || "");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!location.trim()) {
      return;
    }

    // Store location in context
    setSignupData((prevData) => ({
      ...prevData,
      location,
    }));

    // Navigate to the next step
    navigate("career");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {/* Logo */}
      <img
        className="absolute top-6 left-45 h-8"
        src="/public/images/login-logo.svg"
        alt="LinkedIn"
      />

      {/* Title */}
      <h1 className="text-3xl font-normal text-gray-900 mb-3">
        Welcome! What's your location?
      </h1>
      <p className="text-gray-500 mb-4 text-sm">
        See people, jobs, and news in your area.
      </p>

      {/* Form */}
      <div className="w-[360px] p-6 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Location Input */}
          <div className="flex flex-col">
            <label htmlFor="location" className="text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 border py-1 rounded-md text-sm border-gray-600"
              placeholder="Enter your city, state, or country"
            />
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700"
          >
            Next
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default SignUpLocation;
