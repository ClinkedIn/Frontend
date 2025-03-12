import React, { useState } from "react";
import Button from "../../generalComponets/Button";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting reset request for:", email);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 ">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Forgot password
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="emailOrPhone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email or Phone
            </label>
            <input
              type="text"
              id="emailOrPhone"
              placeholder="Email or Phone"
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <p className="text-sm text-gray-700 mb-6">
            We'll send a verification code to this email or phone number if it
            matches an existing LinkedIn account.
          </p>

          <div className="flex flex-col space-y-3 items-center">
            <Button className="w-full" type="submit">
              Next
            </Button>
            <button
              type="button"
              className=" w-1/4 py-3 text-gray-700 font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 text-decoration-line: underline"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
