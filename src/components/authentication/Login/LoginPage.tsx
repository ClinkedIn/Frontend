import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { motion } from "framer-motion";
import Footer from "../../Footer/Footer";
import GoogleLogin from "../../GoogleLoginButton";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";
import { BASE_URL } from "../../../constants";
import { getMessaging, getToken } from "firebase/messaging";
import { app, auth, provider, generateToken } from "../../../../firebase"; // adjust import if needed
import { signInWithPopup } from "firebase/auth";

/**
 * The `LoginPage` component renders a login form for user authentication.
 * It includes input fields for email and password, a Google login button,
 * and a submit button to trigger the login process. The component also
 * handles form validation, error display, and login mutation using React Query.
 *
 * Features:
 * - Validates user input for email and password fields.
 * - Displays error messages for invalid inputs.
 * - Toggles password visibility.
 * - Handles login requests and manages authentication tokens.
 * - Redirects the user to the feed page upon successful login.
 * - Provides a link to the signup page for new users.
 *
 * Dependencies:
 * - React Query for managing the login mutation.
 * - Axios for making HTTP requests.
 * - React Router for navigation.
 * - Framer Motion for animations.
 * - Toast notifications for success and error messages.
 *
 * @component
 * @returns {JSX.Element} The rendered login page component.
 */
const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setAuthToken } = useAuth();




  useEffect (()=>{

    const getFCM = async () =>
      {
        const token = await generateToken();
        setFcmToken(token);
      }
  
      getFCM();
   },[])



  // Helper function to validate form inputs
  /**
   * Validates the login form by checking if the username and password fields are filled.
   * If any field is empty, it sets the corresponding error message in the `errors` state.
   *
   * @returns {boolean} - Returns `true` if the form is valid (no errors), otherwise `false`.
   */
  const validateForm = (): boolean => {
    const newErrors: { username?: string; password?: string } = {};

    if (!username.trim()) newErrors.username = "Email is required";
    if (!password.trim()) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  // Helper function to handle token storage
  /**
   * Saves authentication and refresh tokens.
   *
   * This function stores the provided authentication token in the AuthContext
   * and persists both the authentication token and refresh token in the browser's
   * localStorage for future use.
   *
   * @param {any} data - An object containing the tokens to be saved.
   * @param {string} [data.authToken] - The authentication token to be saved.
   * @param {string} [data.refreshToken] - The refresh token to be saved.
   */
  const saveTokens = (data: any) => {
    if (data.authToken) {
      setAuthToken(data.authToken); // Save the token in AuthContext
      localStorage.setItem("authToken", data.authToken); // Persist in localStorage
    }
    if (data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken); // Persist refreshToken
    }
  };



  // Google login handler (Firebase-based, with FCM token)
  const handleGoogleSuccess = async () => {
    try {
      // Step 1: Sign in with Google using Firebase
      const googleResult = await signInWithPopup(auth, provider);

      // Step 2: Try to get FCM token (ignore if blocked)
      let fcmToken: string | null = null;
      try {
        const messaging = getMessaging(app);
        fcmToken = await getToken(messaging, {
          vapidKey: "BKQc38HyUXuvI_yz5hPvprjVjmWrcUjTP2H7J_cjGoyMMoBGNBbC0ucVGrzM67rICMclmUuOx-mdt7CXlpnhq9g",
        });
        if (fcmToken) {
          console.log("FCM Token:", fcmToken);
        }
      } catch (err) {
        console.warn("FCM token not available (permission denied or blocked). Proceeding without it.");
        // Do not block login if FCM fails
      }

      // Step 3: Get Google ID token
      const tokenId = await googleResult.user.getIdToken();

      // Step 4: Send FCM token in body, Google ID token in Authorization header
      const { data } = await axios.post(
        `${BASE_URL}/user/auth/google`,
        { fcmToken }, // fcmToken may be null
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenId}`,
          },
          withCredentials: true,
        }
      );

      // Step 5: Save tokens and login
      saveTokens(data);
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Login successful!");
      setTimeout(() => navigate("/feed"), 1000);
    } catch (error: any) {
      console.error("Google login failed:", error);
      toast.error(error?.response?.data?.error || "Google login failed.");
    }
  };



  // Login mutation hook
  /**
   * A custom hook that creates a mutation for handling user login.
   *
   * This mutation sends a POST request to the login endpoint with the provided email and password,
   * and handles success and error scenarios accordingly.
   *
   * @typeParam void - The type of the data returned on success (no data in this case).
   * @typeParam unknown - The type of the error object.
   * @typeParam { email: string; password: string } - The type of the variables passed to the mutation function.
   *
   * @mutationFn
   * Sends a POST request to the login endpoint with the provided email and password.
   * Includes credentials in the request for authentication purposes.
   *
   * @onSuccess
   * - Logs the success message and response data.
   * - Saves the authentication tokens using `saveTokens`.
   * - Invalidates the "authUser" query to refresh user data.
   * - Displays a success toast notification.
   * - Redirects the user to the "/feed" page after a short delay.
   *
   * @onError
   * - Extracts and displays an error message using `getErrorMessage`.
   * - Displays an error toast notification.
   */
  const loginMutation = useMutation<
    void,
    unknown,
    { email: string; password: string }
  >({
    mutationFn: async ({ email, password }) =>
      await axios.post(
        `${BASE_URL}/user/login`,
        { email, password, fcmToken },
        { withCredentials: true }
      ),

    onSuccess: (data: any) => {
      console.log("Login successful:", data);
      saveTokens(data); // Save tokens
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Login successful!");
      setTimeout(() => navigate("/feed"), 1000);
    },

    onError: (err) => {
      // Extract error details from the response
      const errorResponse = err as {
        response?: { status?: number; data?: { error?: string } };
      };
      const statusCode = errorResponse.response?.status;
      const errorMessageFromServer = errorResponse.response?.data?.error;

      // Define the error message based on the status code or default fallback
      let errorMessage: string;

      if (statusCode === 404) {
        errorMessage = "User not found. Please check your email or password.";
      } else if (errorMessageFromServer) {
        errorMessage = errorMessageFromServer; // Use the error message from the server
      } else {
        errorMessage = "Invalid credentials"; // Default fallback message
      }

      // Display the error message using toast
      toast.error(errorMessage);
    },
  });



  // Form submission handler
  /**
   * Handles the form submission event for the login page.
   *
   * @param e - The form submission event.
   *
   * Prevents the default form submission behavior, validates the form,
   * and triggers the login mutation with the provided username and password.
   * If the form validation fails, the submission is halted.
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    loginMutation.mutate({ email: username, password });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white relative">
      {/* Logo */}
      <img
        className="absolute top-6 left-13 h-7"
        src="/Images/lockedin.png"
        alt="LinkedIn"
      />

      {/* Login Form */}
      <motion.div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-gray-900 text-left mb-4">
          Sign in
        </h2>

        {/* Google Login Button */}
        <GoogleLogin className="w-full" onClick={handleGoogleSuccess} />

        {/* Separator */}
        <div className="relative flex items-center my-4">
          <div className="w-full border-t border-gray-300"></div>
          <span className="px-3 text-sm text-gray-500 bg-white">or</span>
          <div className="w-full border-t border-gray-300"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <input
              type="text"
              placeholder="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full p-3 border rounded-md text-sm ${
                errors.username ? "border-red-500" : "border-gray-500"
              }`}
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 border rounded-md text-sm ${
                errors.password ? "border-red-500" : "border-gray-500"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-blue-600 hover:underline text-sm font-semibold"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password Row */}
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="mr-2 accent-green-700 scale-125"
              />
              <label htmlFor="remember-me" className="text-sm text-gray-700">
                Remember me
              </label>
            </div>

            {/* Forgot Password Link */}
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full py-3 text-white bg-blue-600 rounded-full hover:bg-blue-700 text-sm font-semibold flex items-center justify-center"
            disabled={loginMutation.isPending}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loginMutation.isPending ? (
              <Loader className="size-5 animate-spin" />
            ) : (
              "Sign in"
            )}
          </motion.button>
        </form>

        {/* Signup Link */}
        <p className="mt-4 text-center text-sm text-gray-600">
          New to LinkedIn?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Join now
          </Link>
        </p>
      </motion.div>

      {/* Fixed Footer - Always at bottom of screen */}
      <footer className="fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-200 py-4">
        <Footer />
      </footer>
    </div>
  );
};

export default LoginPage;
