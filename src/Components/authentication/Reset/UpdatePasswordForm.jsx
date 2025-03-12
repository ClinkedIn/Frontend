import React, { useState } from "react";
import Button from "../../generalComponets/Button";

export default function UpdatePasswordForm() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
    console.log("value==> ", value);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };

    if (name === "newPassword") {
      if (value.length < 8 && value.length > 0) {
        newErrors.newPassword =
          "Your password is too short. It should be at least 8 characters long";
      } else {
        newErrors.newPassword = "";
      }

      // Check if confirm password matches when new password changes
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      } else if (formData.confirmPassword) {
        newErrors.confirmPassword = "";
      }
    }

    if (name === "confirmPassword") {
      if (value.length < 8 && value.length > 0) {
        newErrors.confirmPassword =
          "Your password is too short. It should be at least 8 characters long";
      } else if (value !== formData.newPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      } else {
        newErrors.confirmPassword = "";
      }
    }

    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields before submission
    const isNewPasswordValid = formData.newPassword.length >= 8;
    const isConfirmPasswordValid = formData.confirmPassword.length >= 8;
    const doPasswordsMatch = formData.newPassword === formData.confirmPassword;

    if (!isNewPasswordValid) {
      setErrors((prev) => ({
        ...prev,
        newPassword:
          "Your password is too short. It should be at least 8 characters long",
      }));
    }

    if (!isConfirmPasswordValid) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          "Your password is too short. It should be at least 8 characters long",
      }));
    } else if (!doPasswordsMatch) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
    }

    // Only proceed if all validations pass
    if (isNewPasswordValid && isConfirmPasswordValid && doPasswordsMatch) {
      console.log("Form submitted successfully", formData);
      // Add your form submission logic here
    }
  };

  return (
    <div className="bg-slate-300 p-2 container mx-auto lg:w-1/2 rounded-3xl shadow-2xl ">
      <div className="my-4">
        <h1 className="text-3xl font-bold">change password</h1>
        <p className="my-2">
          Create a new password that is at least 8 characters long.
        </p>
      </div>
      <div>
        <form onSubmit={handleSubmit} className="">
          <div className="flex flex-col my-2">
            <label htmlFor="currentPassword">
              Type your current password <span className="text-red-700">*</span>
            </label>
            <div className="relative">
              <input
                required
                className="border-2 border-black rounded-md p-1 w-full"
                placeholder="Enter your current password"
                type="password"
                name="currentPassword"
                id="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600"
                onClick={() => {
                  const input = document.getElementById("currentPassword");
                  input.type = input.type === "password" ? "text" : "password";
                }}
              >
                Show
              </button>
            </div>
          </div>

          <div className="flex flex-col my-2">
            <label htmlFor="newPassword">
              Type your new password <span className="text-red-700">*</span>
            </label>
            <div className="relative">
              <input
                required
                className="border-2 border-black rounded-md p-1 w-full"
                placeholder="Enter your new password"
                type="password"
                name="newPassword"
                id="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                {formData.newPassword.length}/200
              </div>
            </div>
            {errors.newPassword && (
              <div className="text-red-600 flex items-center mt-1">
                <svg
                  className="w-5 h-5 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.newPassword}
              </div>
            )}
          </div>

          <div className="flex flex-col my-2">
            <label htmlFor="confirmPassword">
              Retype your new password <span className="text-red-700">*</span>
            </label>
            <div className="relative">
              <input
                required
                className="border-2 border-black rounded-md p-1 w-full"
                placeholder="Confirm your new password"
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600"
                onClick={() => {
                  const input = document.getElementById("confirmPassword");
                  input.type = input.type === "password" ? "text" : "password";
                }}
              >
                Show
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="text-red-600 flex items-center mt-1">
                <svg
                  className="w-5 h-5 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.confirmPassword}
              </div>
            )}
          </div>

          <div className="flex items-center my-3">
            <input type="checkbox" id="requireAllDevices" className="mr-2" />
            <label htmlFor="requireAllDevices">
              Require all devices to sign in with new password
            </label>
          </div>

          <Button type="submit">Save Password</Button>
        </form>
      </div>
    </div>
  );
}
