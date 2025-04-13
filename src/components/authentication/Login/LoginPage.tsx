import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../../services/axios";

import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { motion } from "framer-motion";
import Footer from "../../Footer/Footer";
import GoogleLogin from "../../GoogleLoginButton";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const navigate = useNavigate();
  const queryClient = useQueryClient();


  interface UserData {
    email: string;
    password: string;
  }

  const { setAuthToken } = useAuth(); // Get the setAuthToken function from context

  // import API_BASE_URL from your .env file
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const loginMutation = useMutation<void, unknown, UserData>({
    mutationFn: async (userData: UserData) => {
      const response = await axios.post(
        `${BASE_URL}/user/login`,
        userData,
        { withCredentials: true } // Include credentials in the request
      );
      console.log("Login response:", response.data);
      return response.data;
    },
    onSuccess: (data: any) => {
      // Save tokens in AuthContext and localStorage

      console.log("onsuccess data");

      if (data.authToken) {
        console.log("Token received:", data.authToken);
        setAuthToken(data.authToken); // Save the token in AuthContext
        localStorage.setItem("authToken", data.authToken); // Persist in localStorage
      }
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken); // Persist refreshToken
      }

      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Login successful!");
      setTimeout(() => navigate("/feed"), 1000);
    },
    onError: (err) => {
      const errorMessage =
        (err as { response?: { data?: { error?: string } } }).response?.data
          ?.error || "Invalid credentials";
      toast.error(errorMessage);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: { username?: string; password?: string } = {};

    if (!username.trim()) {
      newErrors.username = "Email is required";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    loginMutation.mutate({ email: username, password });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white relative">
      <img
        className="absolute top-6 left-13 h-7"
        src="/public/images/login-logo.svg"
        alt="LinkedIn"
      />

      <motion.div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-gray-900 text-left mb-4">
          Sign in
        </h2>

        <GoogleLogin className="w-full" />

        <div className="relative flex items-center my-4">
          <div className="w-full border-t border-gray-300"></div>
          <span className="px-3 text-sm text-gray-500 bg-white">or</span>
          <div className="w-full border-t border-gray-300"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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

        <p className="mt-4 text-center text-sm text-gray-600">
          New to LinkedIn?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Join now
          </Link>
        </p>
      </motion.div>

      <div className="absolute bottom-0 w-full">
        <Footer />
      </div>
    </div>
  );
};

export default LoginPage;
