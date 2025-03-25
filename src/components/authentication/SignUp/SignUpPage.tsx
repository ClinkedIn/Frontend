import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { auth, provider, signInWithPopup } from "../../../../firebase";
import toast, { Toaster } from "react-hot-toast";
import ReCAPTCHA from "react-google-recaptcha";
import GoogleLogin from "../../GoogleLoginButton";
import Footer from "../../Footer/Footer";
import { useSignup } from "../../../context/SignUpContext";

const SignupPage = () => {
  const { signupData, setSignupData } = useSignup();
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const sitekey =import.meta.env.VITE_SITEKEY
  const navigate = useNavigate();
  // Validate Email Format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    setEmailError("");
    return true;
  };

  // Validate Password Strength
  const validatePassword = (password: string) => {
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

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check ReCAPTCHA
    const recaptchaValue = recaptchaRef.current?.getValue();
    if (!recaptchaValue) {
      toast.error("Please complete the ReCAPTCHA.");
      return;
    }

    // Validate Inputs
    if (!signupData.email.trim() || !signupData.password.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (!validateEmail(signupData.email) || !validatePassword(signupData.password)) {
      return;
    }

    try {
      // Send data to mock API
      const response = await fetch("/api/user/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signupData.email,
          password: signupData.password,
          recaptchaToken: recaptchaValue, // Include reCAPTCHA token
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed.");
      }

      // Save confirmation link (for testing purposes)
      setSignupData((prev) => ({ ...prev, confirmationLink: data.confirmationLink }));

      toast.success("Signup successful! Check your email for confirmation.");
      navigate("name"); // Move to the next step
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  

  // Handle Google Sign Up
  const handleGoogleSignUp = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/signup-name");
    } catch {
      toast.error("Google signup failed.");
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className="flex flex-col items-center justify-center bg-gray-100 pt-16 pb-20">
        <img className="absolute top-6 left-32 h-8.5" src="/public/images/login-logo.svg" alt="LinkedIn" />

        <h1 className="text-3xl font-normal text-gray-900 mb-4 text-center">
          Make the most of your professional life
        </h1>

        <motion.div
          className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
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

            {/* Password Input */}
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

            {/* Remember Me Checkbox */}
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

            {/* ReCAPTCHA Integration */}
            <div className="flex justify-center w-full">
              <ReCAPTCHA sitekey={sitekey} ref={recaptchaRef} />
              <Toaster />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className={`w-full py-3 text-white rounded-full text-sm font-semibold 
                ${emailError || passwordError ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
              whileHover={!emailError && !passwordError ? { scale: 1.02 } : {}}
              whileTap={!emailError && !passwordError ? { scale: 0.98 } : {}}
              disabled={!!emailError || !!passwordError}
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

          {/* Google Signup Button */}
          <GoogleLogin className="w-full" type="button" onClick={handleGoogleSignUp} />

          {/* Already a Member? */}
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
