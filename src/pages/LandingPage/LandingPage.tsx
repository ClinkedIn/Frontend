import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { auth, provider, signInWithPopup } from "../../../firebase";
import toast from "react-hot-toast";
import Footer from "../../components/Footer/Footer";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import axios from "axios";
import { getMessaging, getToken } from "firebase/messaging";
import { app } from "../../../firebase";
import { useQueryClient } from "@tanstack/react-query";
import { GrArticle } from "react-icons/gr";
import { IoPeopleOutline, IoBagSharp } from "react-icons/io5";
import { BsFillPuzzleFill } from "react-icons/bs";
import { GoVideo } from "react-icons/go";
import { MdOutlineLaptopMac } from "react-icons/md";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const VAPID_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

const LandingPage = () => {
  const { isAuthenticated, loading, setAuthToken } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/feed", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (isAuthenticated) {
    return null;
  }

  // Google Sign-in Handler
  const handleGoogleLogin = async () => {
    try {
      // 1. Sign in with Google using Firebase
      const result = await signInWithPopup(auth, provider);

      // 2. Try to get FCM token (ignore if blocked)
      let fcmToken: string | null = null;
      try {
        const messaging = getMessaging(app);
        fcmToken = await getToken(messaging, {
          vapidKey: VAPID_KEY,
        });
      } catch {
        // ignore FCM errors
      }

      // 3. Get Google ID token
      const tokenId = await result.user.getIdToken();

      // 4. Send FCM token in body, Google ID token in Authorization header
      const { data } = await axios.post(
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

      setAuthToken(data.token); 
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Signed in with Google!");
      setTimeout(() => navigate("/feed"), 1000);
    } catch (error: any) {
      console.error("Google Sign-in Error:", error);
      toast.error(error?.response?.data?.error || "Google sign-in failed. Try again.");
    }
  };
  
  return (
      <div className="min-h-screen flex flex-col justify-between bg-white">
        {/* Navbar */}
        <nav className="bg-white py-3 px-4 mb-8 md:px-12 flex flex-wrap items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center ml-4 md:ml-12">
            <img src="/Images/lockedin.png" alt="LinkedIn Logo" className="h-6" />
          </Link>
  
          {/* Icons & Buttons */}
          <div className="flex items-center space-x-4 md:space-x-6 ml-auto flex-wrap">
            {/* Navigation Links - Hidden on Mobile */}
            <div className="hidden md:flex flex-wrap items-center space-x-4 md:space-x-6 text-gray-500">
              <div className="text-xs flex flex-col items-center hover:text-black cursor-pointer transition-colors">
                <GrArticle className="h-5 w-5 mb-1" />
                Articles
              </div>
              <div className="text-xs flex flex-col items-center hover:text-black cursor-pointer transition-colors">
                <IoPeopleOutline className="h-5 w-5 mb-1" />
                People
              </div>
              <div className="text-xs flex flex-col items-center hover:text-black cursor-pointer transition-colors">
                <GoVideo className="h-5 w-5 mb-1" />
                Learning
              </div>
              <div className="text-xs flex flex-col items-center hover:text-black cursor-pointer transition-colors">
                <IoBagSharp className="h-5 w-5 mb-1 filter grayscale brightness-75" />
                Jobs
              </div>
              <div className="text-xs flex flex-col items-center hover:text-black cursor-pointer transition-colors">
                <BsFillPuzzleFill className="h-5 w-5 mb-1" />
                Games
              </div>
              <div className="text-xs flex flex-col items-center hover:text-black cursor-pointer transition-colors">
                <MdOutlineLaptopMac className="h-5 w-5 mb-1" />
                Get the app
              </div>
            </div>
  
            {/* Auth Buttons */}
            <div className="flex items-center space-x-3 md:space-x-4">
              <Link to="/signup" className="text-gray-700 text-sm font-semibold hover:underline">
                Join now
              </Link>
              <Link
                to="/login"
                className="text-blue-600 text-sm font-semibold border border-blue-600 px-4 py-2 rounded-full hover:bg-blue-100"
              >
                Sign in
              </Link>
            </div>
          </div>
        </nav>
  
        {/* Main Content */}
        <div className="flex-1 flex flex-col md:flex-row items-center justify-center bg-white px-4 md:px-18 mt-16 md:mt-0 space-y-8 md:space-y-0">
          {/* Left Section */}
          <motion.div
            className="w-full max-w-2xl p-5 bg-white rounded-lg text-left md:text-left mx-auto"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-5xl font-normal text-gray-600 mb-6">
              Welcome to your professional community
            </h1>
  
            {/* Google Sign-in Button */}
            <motion.button
              onClick={handleGoogleLogin}
              className="w-[90%] max-w-[400px] flex items-center justify-center py-2 text-lg border border-blue-600 bg-blue-600 text-white rounded-full hover:bg-blue-700 mb-5 "
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src="/Images/google-white.png" alt="Google" className="h-6 w-6 mr-2" />
              Continue with Google
            </motion.button>
  
            {/* Sign in with Email */}
            <Link to="/login">
              <motion.button
                className="w-[90%] max-w-[400px] mt-3 flex items-center justify-center py-2 text-lg border border-gray-600 rounded-full text-gray-800 hover:bg-gray-100 mb-8 "
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign in with email
              </motion.button>
            </Link>
  
            {/* Agreement Text */}
            <p className="mt-3 text-xs text-center text-gray-500 w-[90%] max-w-[400px] mb-10">
              By clicking Continue to join or sign in, you agree to LinkedIn’s{" "}
              <Link to="/user-agreement" className="text-blue-600 hover:underline">
                User Agreement
              </Link>
              ,{" "}
              <Link to="/privacy-policy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
              , and{" "}
              <Link to="/cookie-policy" className="text-blue-600 hover:underline">
                Cookie Policy
              </Link>
              .
            </p>
  
            <p className="mt-3 text-md text-center text-gray-900 w-[90%] max-w-[400px]">
              New to LinkedIn?{" "}
              <Link to="/signup" className="text-blue-600 hover:underline text-lg">
                Join now
              </Link>
            </p>
          </motion.div>
  
          {/* Right Section (Hero Image) */}
          <motion.img
            src="/Images/hero.svg"
            alt="Hero"
            className="w-[90%] max-w-[600px] md:w-[800px] md:ml-10 mr:0"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
        </div>
  
        {/* Footer */}
          <Footer />
      </div>
      );
  };

export default LandingPage;