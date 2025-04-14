import { useState, ChangeEvent, FocusEvent, FormEvent } from "react";
import Button from "../../Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

/**
 * Represents the structure of the form data used in the UpdatePasswordForm component.
 * 
 * @property currentPassword - The user's current password.
 * @property newPassword - The new password the user wants to set.
 * @property confirmPassword - Confirmation of the new password to ensure they match.
 */
interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Interface representing the structure of form validation errors
 * for the password update functionality.
 *
 * @property {string} newPassword - Error message related to the new password field.
 * @property {string} confirmPassword - Error message related to the confirm password field.
 */
interface Errors {
  newPassword: string;
  confirmPassword: string;
}

export default function UpdatePasswordForm() {
  /**
   * State hook to manage the form data for updating a user's password.
   * 
   * @typedef {Object} FormData
   * @property {string} currentPassword - The user's current password.
   * @property {string} newPassword - The new password the user wants to set.
   * @property {string} confirmPassword - Confirmation of the new password to ensure they match.
   * 
   * @constant
   * @type {[FormData, React.Dispatch<React.SetStateAction<FormData>>]}
   * @description Initializes the form data with empty strings for `currentPassword`, `newPassword`, and `confirmPassword`.
   */
  const [formData, setFormData] = useState<FormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  /**
   * State hook to manage form validation errors for the UpdatePasswordForm component.
   * 
   * @typedef {Object} Errors
   * @property {string} newPassword - Error message related to the new password field.
   * @property {string} confirmPassword - Error message related to the confirm password field.
   * 
   * @constant
   * @type {[Errors, React.Dispatch<React.SetStateAction<Errors>>]}
   * @description Initializes the `errors` state with default values for `newPassword` and `confirmPassword`,
   * and provides a function `setErrors` to update the state.
   */
  const [errors, setErrors] = useState<Errors>({
    newPassword: "",
    confirmPassword: "",
  });

  // Handle input changes
  /**
   * Handles the change event for input fields in the form.
   * Updates the form data state with the new value for the input field that triggered the event.
   *
   * @param {ChangeEvent<HTMLInputElement>} e - The change event triggered by an input field.
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate fields on blur
  /**
   * Handles the blur event for an input field and triggers validation for the field.
   *
   * @param e - The focus event triggered when the input field loses focus.
   * @param e.target - The target element of the focus event.
   * @param e.target.name - The name attribute of the input field.
   * @param e.target.value - The current value of the input field.
   */
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name as keyof FormData, value);
  };

  // Validation logic for fields
  /**
   * Validates a specific field in the form and updates the error state accordingly.
   *
   * @param name - The name of the field to validate. It should be a key of the `FormData` type.
   * @param value - The current value of the field being validated.
   *
   * @remarks
   * - For the `newPassword` field:
   *   - Ensures the password is at least 8 characters long.
   *   - Checks if the `confirmPassword` field matches the `newPassword` field.
   * - For the `confirmPassword` field:
   *   - Ensures the password is at least 8 characters long.
   *   - Checks if the `confirmPassword` matches the `newPassword`.
   *
   * @returns Updates the `errors` state with appropriate error messages for the validated field.
   */
  const validateField = (name: keyof FormData, value: string) => {
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };

      if (name === "newPassword") {
        newErrors.newPassword =
          value.length < 8 && value.length > 0
            ? "Your password is too short. It should be at least 8 characters long"
            : "";

        if (formData.confirmPassword && value !== formData.confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        } else {
          newErrors.confirmPassword = "";
        }
      }

      if (name === "confirmPassword") {
        newErrors.confirmPassword =
          value.length < 8 && value.length > 0
            ? "Your password is too short. It should be at least 8 characters long"
            : value !== formData.newPassword
            ? "Passwords do not match"
            : "";
      }

      return newErrors;
    });
  };

  // Handle form submission
  /**
   * Handles the form submission for updating the password.
   *
   * @param {FormEvent<HTMLFormElement>} e - The form submission event.
   * 
   * This function validates the new password and confirm password fields.
   * It checks the following:
   * - The new password must be at least 8 characters long.
   * - The confirm password must be at least 8 characters long.
   * - The new password and confirm password must match.
   *
   * If any of the above conditions are not met, it sets appropriate error messages
   * in the `errors` state and prevents form submission. Otherwise, it logs the form
   * data to the console as a successful submission.
   */
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isNewPasswordValid = formData.newPassword.length >= 8;
    const isConfirmPasswordValid = formData.confirmPassword.length >= 8;
    const doPasswordsMatch = formData.newPassword === formData.confirmPassword;

    if (!isNewPasswordValid || !isConfirmPasswordValid || !doPasswordsMatch) {
      setErrors({
        newPassword: isNewPasswordValid
          ? ""
          : "Your password is too short. It should be at least 8 characters long",
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
    <div className="container lg:w-4xl mx-auto my-24 flex flex-col justify-between shadow-2xl rounded-lg p-4">
      {/* Back Button */}
      <button className="flex items-center my-4 cursor-pointer w-fit">
        <FontAwesomeIcon icon={faArrowLeft} className="text-gray-700 me-2" />
        Back
      </button>

      {/* Header */}
      <div className="mt-4">
        <h1 className="text-3xl">Change Password</h1>
        <p className="my-2">Create a new password that is at least 8 characters long.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {(["currentPassword", "newPassword", "confirmPassword"] as (keyof FormData)[]).map(
          (field) => (
            <div className="flex flex-col my-8" key={field}>
              <label htmlFor={field}>
                {field === "currentPassword"
                  ? "Type your current password"
                  : field === "newPassword"
                  ? "Type your new password"
                  : "Retype your new password"}
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
              {field in errors && errors[field as keyof Errors] && (
                <p className="text-red-600 mt-1">{errors[field as keyof Errors]}</p>
              )}
            </div>
          )
        )}

        {/* Require All Devices Checkbox */}
        <div className="flex items-center my-3">
          <input type="checkbox" id="requireAllDevices" className="mr-2" />
          <label htmlFor="requireAllDevices">
            Require all devices to sign in with new password
          </label>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="" id="" onClick={() => {}}>
          Save Password
        </Button>
      </form>
    </div>
  );
}