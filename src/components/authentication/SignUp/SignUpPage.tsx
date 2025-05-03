import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";
import GoogleLogin from "../../GoogleLoginButton";
import Footer from "../../Footer/Footer";
import { useSignup } from "../../../context/SignUpContext";
import { useAuth } from "../../../context/AuthContext";
import { auth, provider, signInWithPopup } from "../../../../firebase";
import { getMessaging, getToken } from "firebase/messaging";
import axios from "axios";

/**
 * The `SignupPage` component renders a user interface for signing up to the application.
 * It includes form fields for first name, last name, email, and password, along with
 * validation logic for each field. The component also integrates Google Sign-Up and
 * reCAPTCHA for enhanced security and user convenience.
 *
 * @component
 *
 * @description
 * This component provides the following features:
 * - Input fields for first name, last name, email, and password with real-time validation.
 * - Error messages for invalid inputs.
 * - A "Remember me" checkbox for user preference.
 * - reCAPTCHA integration to prevent automated sign-ups.
 * - Google Sign-Up functionality using Firebase Authentication.
 * - A responsive design with animations for a better user experience.
 *
 * @remarks
 * - The component uses the `useSignup` and `useAuth` hooks for managing user data and authentication state.
 * - It relies on environment variables (`VITE_SITEKEY` and `VITE_API_BASE_URL`) for reCAPTCHA and API integration.
 * - The `motion` library is used for animations, and `react-toastify` is used for displaying notifications.
 *
 * @example
 * ```tsx
 * import SignupPage from './SignUpPage';
 *
 * const App = () => {
 *   return (
 *     <div>
 *       <SignupPage />
 *     </div>
 *   );
 * };
 *
 * export default App;
 * ```
 *
 * @returns {JSX.Element} The rendered sign-up page component.
 */
const SignupPage = () => {
  const { signupData, setSignupData } = useSignup();
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [firstNameError, setFirstNameError] = useState(""); // Error state for firstName
  const [lastNameError, setLastNameError] = useState("");   // Error state for lastName
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const sitekey = import.meta.env.VITE_SITEKEY;
  const navigate = useNavigate();
  const { setAuthToken } = useAuth();

  // Helper function to validate email
  /**
   * Validates the provided email address against a standard email format.
   *
   * @param email - The email address to validate.
   * @returns A boolean indicating whether the email is valid.
   *
   * @remarks
   * If the email is invalid, an error message is set using `setEmailError`.
   * If the email is valid, the error message is cleared.
   *
   * @example
   * ```typescript
   * const isValid = validateEmail("example@example.com");
   * console.log(isValid); // true
   * ```
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    setEmailError("");
    return true;
  };

  // Helper function to validate password
  /**
   * Validates the strength of a given password based on specific criteria.
   *
   * The password must meet the following requirements:
   * - At least 8 characters long.
   * - Includes at least one uppercase letter.
   * - Includes at least one numeric digit.
   * - Includes at least one special character (e.g., @$!%*?&).
   *
   * If the password does not meet these criteria, an error message is set
   * using `setPasswordError`. Otherwise, the error message is cleared.
   *
   * @param password - The password string to validate.
   * @returns `true` if the password meets the criteria, otherwise `false`.
   */
  const validatePassword = (password: string): boolean => {
    const strongPasswordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character."
      );
      return false;
    }
    setPasswordError("");
    return true;
  };

  // Helper function to validate names (only alphabetic characters allowed)
  /**
   * Validates a given name to ensure it contains only alphabetic characters.
   * Updates the corresponding error state if the validation fails.
   *
   * @param name - The name to validate.
   * @param fieldName - Specifies whether the name is "firstName" or "lastName".
   * @returns `true` if the name is valid, otherwise `false`.
   */
  const validateName = (name: string, fieldName: "firstName" | "lastName"): boolean => {
    const nameRegex = /^[A-Za-z]+$/; // Only letters allowed
    if (!nameRegex.test(name)) {
      if (fieldName === "firstName") {
        setFirstNameError("First name must contain only alphabetic characters.");
      } else {
        setLastNameError("Last name must contain only alphabetic characters.");
      }
      return false;
    }
    if (fieldName === "firstName") {
      setFirstNameError("");
    } else {
      setLastNameError("");
    }
    return true;
  };

  // Helper function to handle form validation
  /**
   * Validates the signup form by checking the validity of the user's input fields.
   *
   * @returns {boolean} - Returns `true` if all fields (first name, last name, email, and password) are valid; otherwise, returns `false`.
   */
  const validateForm = (): boolean => {
    const isFirstNameValid = validateName(signupData.firstName || "", "firstName");
    const isLastNameValid = validateName(signupData.lastName || "", "lastName");
    const isEmailValid = validateEmail(signupData.email);
    const isPasswordValid = validatePassword(signupData.password);
    return isFirstNameValid && isLastNameValid && isEmailValid && isPasswordValid;
  };

  // Helper function to handle API request
  /**
   * Handles the signup request by sending user data and reCAPTCHA token to the backend.
   * 
   * This function sends a POST request to the backend API to create a new user account.
   * It processes the response, handles errors, and updates the application state accordingly.
   * 
   * @param {string} recaptchaValue - The reCAPTCHA response token to verify the user.
   * 
   * @throws {Error} Throws an error with a user-friendly message if the request fails.
   * 
   * - If the response status is 409, it indicates the email is already registered.
   * - For other errors, a generic error message is displayed.
   * 
   * @remarks
   * - The function expects the `BASE_URL` environment variable to be defined.
   * - It updates the `signupData` state with the confirmation link returned by the backend.
   * - If an `authToken` is returned, it is stored using the `setAuthToken` function.
   * - Displays success or error messages using the `toast` library.
   * - Navigates to the `/feed` route upon successful signup.
   */
  const handleSignupRequest = async (recaptchaValue: string) => {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    try {
      const response = await fetch(`${BASE_URL}/user/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: signupData.firstName,
          lastName: signupData.lastName,
          email: signupData.email,
          password: signupData.password,
          recaptchaResponseToken: recaptchaValue,
        }),
      });

      let data = null;
      let text = "";
      try {
        text = await response.text(); // Get raw text
        data = text ? JSON.parse(text) : null;
      } catch (e) {
        console.warn("Could not parse JSON. Raw text:", text);
      }

      if (!response.ok) {
        console.error("Full response:", response);
        console.error("Raw response text:", text);

        // Handle specific status codes with user-friendly messages
        if (response.status === 409) {
          throw new Error("This email is already registered. Please try logging in or use a different email.");
        }

        // Fallback for other errors
        const errorMessage = data?.error || "Oops! Something went wrong. Please check your details and try again.";
        throw new Error(errorMessage); // Throw the error for the catch block
      }

      // Store the authToken in the AuthContext if returned by the backend
      if (data.authToken) {
        setAuthToken(data.authToken); // Save the token
      }

      setSignupData((prev) => ({ ...prev, confirmationLink: data.confirmationLink }));
      toast.success("Signup successful! Check your email for confirmation.");
      navigate("/verify-email");
    } catch (error: any) {
      // Display the error message to the user
      toast.error(error.message || "An unexpected error occurred. Please try again.");
    }
  };

  // Form submission handler
  /**
   * Handles the form submission for the sign-up page.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   * @returns {Promise<void>} A promise that resolves when the submission process is complete.
   *
   * @description
   * This function performs the following steps:
   * 1. Prevents the default form submission behavior.
   * 2. Retrieves the ReCAPTCHA value from the `recaptchaRef`.
   * 3. Displays an error toast if the ReCAPTCHA is not completed.
   * 4. Validates that all required fields (`firstName`, `lastName`, `email`, `password`) are filled.
   * 5. Displays an error toast if any required field is empty.
   * 6. Validates the form using the `validateForm` function.
   * 7. If all validations pass, triggers the `handleSignupRequest` function with the ReCAPTCHA value.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const recaptchaValue = recaptchaRef.current?.getValue();

    if (!recaptchaValue) {
      toast.error("Please complete the ReCAPTCHA.");
      return;
    }

    if (
      !signupData.firstName?.trim() ||
      !signupData.lastName?.trim() ||
      !signupData.email.trim() ||
      !signupData.password.trim()
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    handleSignupRequest(recaptchaValue);
  };

  // Handle Google Sign-Up
  /**
   * Handles the Google Sign-Up process using Firebase Authentication.
   * This function triggers a popup for the user to sign in with their Google account.
   * Upon successful authentication, the user is navigated to the "/feed" page.
   * If the sign-up process fails, an error toast notification is displayed.
   *
   * @async
   * @function handleGoogleSignUp
   * @returns {Promise<void>} A promise that resolves when the sign-up process is complete.
   */
  const handleGoogleSignUp = async () => {
    try {
      // Step 1: Sign in with Google using Firebase
      const googleResult = await signInWithPopup(auth, provider);

      // Step 2: Try to get FCM token (ignore if blocked)
      let fcmToken: string | null = null;
      try {
        const messaging = getMessaging();
        fcmToken = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
        });
        if (fcmToken) {
          console.log("FCM Token:", fcmToken);
        }
      } catch (err) {
        console.warn("FCM token not available (permission denied or blocked). Proceeding without it.");
        // Do not block signup if FCM fails
      }

      // Step 3: Get Google ID token
      const tokenId = await googleResult.user.getIdToken();

      // Step 4: Send FCM token in body, Google ID token in Authorization header
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      await axios.post(
        `${BASE_URL}/user/auth/google`,
        { fcmToken },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenId}`,
          },
          withCredentials: true,
        }
      );

      // Step 5: Navigate to feed
      navigate("/feed");

    } catch (error) {
      console.error("Google sign-up failed:", error);
      toast.error("Google signup failed.");
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <div className="flex flex-col items-center justify-center bg-gray-100 pt-16 pb-20">
        <img
          className="absolute top-6 left-32 h-8.5"
          src="/Images/lockedin.png"
          alt="LinkedIn"
        />
        <h1 className="text-3xl font-normal text-gray-900 mb-4 text-center">
          Make the most of your professional life
        </h1>

        {/* Form Container */}
        <motion.div
          className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name */}
            <div className="flex flex-col">
              <label htmlFor="first-name" className="text-sm font-semibold text-gray-700 mb-1">
                First name
              </label>
              <input
                id="first-name"
                type="text"
                value={signupData.firstName}
                onChange={(e) => {
                  setSignupData({ ...signupData, firstName: e.target.value });
                  validateName(e.target.value, "firstName");
                }}
                className={`w-full p-3 py-1 border rounded-md text-sm ${
                  firstNameError ? "border-red-500" : "border-gray-600"
                }`}
              />
              {firstNameError && <p className="text-xs text-red-500 mt-1">{firstNameError}</p>}
            </div>

            {/* Last Name */}
            <div className="flex flex-col">
              <label htmlFor="last-name" className="text-sm font-semibold text-gray-700 mb-1">
                Last name
              </label>
              <input
                id="last-name"
                type="text"
                value={signupData.lastName}
                onChange={(e) => {
                  setSignupData({ ...signupData, lastName: e.target.value });
                  validateName(e.target.value, "lastName");
                }}
                className={`w-full p-3 py-1 border rounded-md text-sm ${
                  lastNameError ? "border-red-500" : "border-gray-600"
                }`}
              />
              {lastNameError && <p className="text-xs text-red-500 mt-1">{lastNameError}</p>}
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="text"
                value={signupData.email}
                onChange={(e) => {
                  setSignupData({ ...signupData, email: e.target.value });
                  validateEmail(e.target.value);
                }}
                className={`w-full p-3 py-1 border rounded-md text-sm ${
                  emailError ? "border-red-500" : "border-gray-600"
                }`}
              />
              {emailError && <p className="text-xs text-red-500 mt-1">{emailError}</p>}
            </div>

            {/* Password */}
            <div className="relative flex flex-col">
              <label htmlFor="password" className="text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={signupData.password}
                onChange={(e) => {
                  setSignupData({ ...signupData, password: e.target.value });
                  validatePassword(e.target.value);
                }}
                className={`w-full p-3 py-1 border rounded-md text-sm ${
                  passwordError ? "border-red-500" : "border-gray-600"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-7 text-blue-600 hover:underline text-sm font-semibold"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
              {passwordError && <p className="text-xs text-red-500 mt-1">{passwordError}</p>}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember-me"
                className="mr-2 accent-green-700 scale-125"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label htmlFor="remember-me" className="text-sm text-gray-700">
                Remember me
              </label>
            </div>

            {/* ReCAPTCHA */}
            <div className="flex justify-center w-full">
              <ReCAPTCHA sitekey={sitekey} ref={recaptchaRef} />
              <Toaster />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className={`w-full py-3 text-white rounded-full text-sm font-semibold ${
                emailError || passwordError || firstNameError || lastNameError
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              whileHover={
                !(emailError || passwordError || firstNameError || lastNameError)
                  ? { scale: 1.02 }
                  : {}
              }
              whileTap={
                !(emailError || passwordError || firstNameError || lastNameError)
                  ? { scale: 0.98 }
                  : {}
              }
              disabled={!!(emailError || passwordError || firstNameError || lastNameError)}
            >
              Agree & Join
            </motion.button>
          </form>

          {/* OR Separator */}
          <div className="relative flex items-center my-4">
            <div className="w-full border-t border-gray-300"></div>
            <span className="px-3 text-sm text-gray-500 bg-white">or</span>
            <div className="w-full border-t border-gray-300"></div>
          </div>

          {/* Google Login */}
          <GoogleLogin
            className="w-full"
            type="button"
            onClick={handleGoogleSignUp}
          />

          {/* Already Signed Up */}
          <p className="mt-4 text-center text-sm text-gray-600">
            Already on LinkedIn?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 w-full">
        <Footer />
      </div>
    </div>
  );
};

export default SignupPage;