import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { auth, provider, signInWithPopup } from "../../../../firebase";
import { axiosInstance } from "../../../services/axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { motion } from "framer-motion";
import Footer from "../../Footer/Footer"; 
import GoogleLogin from "../../GoogleLoginButton";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  interface UserData {
    username: string;
    password: string;
  }

  const loginMutation = useMutation<void, unknown, UserData>({
    mutationFn: async (userData: UserData) => {
      const response = await axiosInstance.post("/auth/login", userData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Login successful!");
      setTimeout(() => navigate("/home"), 1000);
    },
    onError: (err) => {
      toast.error((err as any).response?.data?.message || "Invalid credentials");
    },
  });

  const validateEmailOrPhone = (input: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;
    return emailRegex.test(input) || phoneRegex.test(input);
  };

  const validatePasswordStrength = (password: string) => {
    const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let newErrors: { username?: string; password?: string } = {};

    if (!username.trim()) {
      newErrors.username = "Email or phone number is required";
    } else if (!validateEmailOrPhone(username)) {
      newErrors.username = "Enter a valid email or phone number";
    }

    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!validatePasswordStrength(password)) {
      newErrors.password = "Password must include an uppercase letter, a number, and a special character";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    loginMutation.mutate({ username, password });
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      console.log(idToken);
      navigate("/home");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white relative">
      <img className="absolute top-6 left-13 h-6" src="/public/images/login-logo.svg" alt="LinkedIn" />

      <motion.div
        className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg"
      >
        <h2 className="text-3xl font-semibold text-gray-900 text-left mb-4">Sign in</h2>

          <GoogleLogin className="w-full" type="submit" onClick={handleGoogleSignUp} />

        <div className="relative flex items-center my-4">
          <div className="w-full border-t border-gray-300"></div>
          <span className="px-3 text-sm text-gray-500 bg-white">or</span>
          <div className="w-full border-t border-gray-300"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Email or phone"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full p-3 border rounded-md text-sm ${
                errors.username ? "border-red-500" : "border-gray-500"
              }`}
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
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
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input type="checkbox" id="keep-logged-in" className="mr-2" defaultChecked />
              <label htmlFor="keep-logged-in" className="text-sm text-gray-700">
                Keep me logged in
              </label>
            </div>

            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <motion.button
            type="submit"
            className="w-full py-3 text-white bg-blue-600 rounded-full hover:bg-blue-700 text-sm font-semibold flex items-center justify-center"
            disabled={loginMutation.isPending}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loginMutation.isPending ? <Loader className="size-5 animate-spin" /> : "Sign in"}
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
