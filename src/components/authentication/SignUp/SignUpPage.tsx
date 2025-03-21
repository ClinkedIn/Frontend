import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { auth, provider, signInWithPopup } from "../../../../firebase";
import toast from "react-hot-toast";
import Footer from "../../Footer/Footer";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleGoogleSignUp = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/signupname");
    } catch (error) {
      toast.error("Google signup failed.");
    }
  };

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (!validatePassword(password)) {
      toast.error("Please enter a stronger password.");
      return;
    }
    toast.success("Signup successful!");
    navigate("/signup-name");
  };

  return (
    <div className="relative min-h-screen">
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center bg-gray-100 pt-16 pb-20">
        {/* Logo */}
        <img className="absolute top-6 left-32 h-8.5" src="/public/images/login-logo.svg" alt="LinkedIn" />

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
            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 py-1 border rounded-md text-sm border-gray-600"
              />
            </div>

            <div className="relative flex flex-col">
              <label htmlFor="password" className="text-sm font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
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

            <p className="text-xs text-gray-600 text-center">
              By clicking Agree & Join or Continue, you agree to the LinkedIn{" "}
              <Link to="#" className="text-blue-600 hover:underline">
                User Agreement
              </Link>
              ,{" "}
              <Link to="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
              , and{" "}
              <Link to="#" className="text-blue-600 hover:underline">
                Cookie Policy
              </Link>
              .
            </p>

            <motion.button
              type="submit"
              className={`w-full py-3 text-white rounded-full text-sm font-semibold 
                ${passwordError ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
              whileHover={!passwordError ? { scale: 1.02 } : {}}
              whileTap={!passwordError ? { scale: 0.98 } : {}}
              disabled={!!passwordError}
            >
              Agree & Join
            </motion.button>
          </form>

          <div className="relative flex items-center my-4">
            <div className="w-full border-t border-gray-300"></div>
            <span className="px-3 text-sm text-gray-500 bg-white">or</span>
            <div className="w-full border-t border-gray-300"></div>
          </div>

          <motion.button
            onClick={handleGoogleSignUp}
            className="flex items-center justify-center w-full py-2 border border-gray-500 rounded-full text-gray-700 hover:bg-gray-100"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img src="/public/images/google_icon.png" alt="Google" className="h-5 w-5 mr-2" />
            Continue with Google
          </motion.button>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already on LinkedIn?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>

          <p className="mt-2 text-center text-xs text-gray-500">
            Looking to create a page for a business?{" "}
            <Link to="#" className="text-blue-600 hover:underline">
              Get help
            </Link>
          </p>
        </motion.div>
      </div>

      <div className="absolute bottom-0 w-full">
        <Footer />
      </div>
    </div>
  );
};

export default SignupPage;
