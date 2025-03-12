import React, { useState, ChangeEvent, FocusEvent, FormEvent } from "react";
import Button from "../../Button";

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface Errors {
  newPassword: string;
  confirmPassword: string;
}

export default function UpdatePasswordForm() {
  const [formData, setFormData] = useState<FormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Errors>({
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name as keyof FormData, value);
  };

  const validateField = (name: keyof FormData, value: string) => {
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };

      if (name === "newPassword") {
        newErrors.newPassword = value.length < 8 && value.length > 0
          ? "Your password is too short. It should be at least 8 characters long"
          : "";

        if (formData.confirmPassword && value !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        } else {
          newErrors.confirmPassword = "";
        }
      }

      if (name === "confirmPassword") {
        newErrors.confirmPassword = value.length < 8 && value.length > 0
          ? "Your password is too short. It should be at least 8 characters long"
          : value !== formData.newPassword
          ? "Passwords do not match"
          : "";
      }

      return newErrors;
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isNewPasswordValid = formData.newPassword.length >= 8;
    const isConfirmPasswordValid = formData.confirmPassword.length >= 8;
    const doPasswordsMatch = formData.newPassword === formData.confirmPassword;

    if (!isNewPasswordValid || !isConfirmPasswordValid || !doPasswordsMatch) {
      setErrors({
        newPassword: isNewPasswordValid ? "" : "Your password is too short. It should be at least 8 characters long",
        confirmPassword: isConfirmPasswordValid
          ? doPasswordsMatch
            ? ""
            : "Passwords do not match"
          : "Your password is too short. It should be at least 8 characters long",
      });
      return;
    }

    console.log("Form submitted successfully", formData);
  };

  return (
    <div className="bg-slate-300 p-2 container mx-auto lg:w-1/2 rounded-3xl shadow-2xl ">
      <div className="my-4">
        <h1 className="text-3xl font-bold">Change Password</h1>
        <p className="my-2">Create a new password that is at least 8 characters long.</p>
      </div>
      <form onSubmit={handleSubmit}>
        {(["currentPassword", "newPassword", "confirmPassword"] as (keyof FormData)[]).map((field) => (
          <div className="flex flex-col my-2" key={field}>
            <label htmlFor={field}>
              {field === "currentPassword" ? "Type your current password" : field === "newPassword" ? "Type your new password" : "Retype your new password"}
              <span className="text-red-700">*</span>
            </label>
            <div className="relative">
              <input
                required
                className="border-2 border-black rounded-md p-1 w-full"
                placeholder={`Enter your ${field.replace("Password", " password")}`}
                type="password"
                name={field}
                id={field}
                value={formData[field]}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600"
                onClick={() => {
                  const input = document.getElementById(field) as HTMLInputElement;
                  if (input) input.type = input.type === "password" ? "text" : "password";
                }}
              >
                Show
              </button>
            </div>
            {field in errors && errors[field as keyof Errors] && <p className="text-red-600 mt-1">{errors[field as keyof Errors]}</p>}
          </div>
        ))}

        <div className="flex items-center my-3">
          <input type="checkbox" id="requireAllDevices" className="mr-2" />
          <label htmlFor="requireAllDevices">Require all devices to sign in with new password</label>
        </div>

        <Button type="submit" className="" id="" onClick={() => {}}>Save Password</Button>
      </form>
    </div>
  );
}