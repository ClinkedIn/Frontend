import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { auth, provider, signInWithPopup } from "../../../firebase";
import toast from "react-hot-toast";
import Footer from "../../components/Footer/Footer"; 

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      console.log("Google Auth Token:", idToken);
      toast.success("Signed in with Google!");
      navigate("/home");
    } catch (error) {
      console.error("Google Sign-in Error:", error);
      toast.error("Google sign-in failed. Try again.");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white py-3 px-11 md:px-24 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src="/public/images/login-logo.svg" alt="LinkedIn Logo" className="h-6" />
        </Link>

        {/* Icons & Auth Section */}
        <div className="flex items-center space-x-16 ml-auto">
          <div className="hidden md:flex items-center space-x-10 text-gray-500">
            <Link to="/articles" className="text-xs hover:text-black flex flex-col items-center">
              <img src="/public/Images/article.jpg" alt="Articles" className="h-5 w-5 mb-0 filter grayscale brightness-75" />
              Articles
            </Link>
            <Link to="/people" className="text-xs hover:text-black flex flex-col items-center">
              <img src="/public/Images/people-outline.png" alt="People" className="h-5 w-5 mb-0 filter grayscale brightness-75" />
              People
            </Link>
            <Link to="/learning" className="text-xs hover:text-black flex flex-col items-center">
              <img src="/public/Images/learning-.png" alt="Learning" className="h-5 w-5 mb-0 filter grayscale brightness-75" />
              Learning
            </Link>
            <Link to="/jobs" className="text-xs hover:text-black flex flex-col items-center">
              <img src="/public/Images/job-icon.svg" alt="Jobs" className="h-5 w-5 mb-0 filter grayscale brightness-75" />
              Jobs
            </Link>
            <Link to="/games" className="text-xs hover:text-black flex flex-col items-center">
              <img src="/public/Images/games.png" alt="Games" className="h-5 w-5 mb-0 filter grayscale brightness-75" />
              Games
            </Link>
            <Link to="/app" className="text-xs hover:text-black flex flex-col items-center">
              <img src="/public/Images/app.png" alt="Get the app" className="h-5 w-5 mb-0 filter grayscale brightness-75" />
              Get the app
            </Link>
          </div>

          {/* Join Now & Sign In */}
          <div className="flex items-center space-x-4">
            <Link to="/signup" className="text-gray-700 text-sm font-semibold hover:underline h-full flex items-center">
              Join now
            </Link>
            <Link
              to="/login"
              className="text-blue-600 text-sm font-semibold border border-blue-600 px-4 py-3 rounded-full hover:bg-blue-100"
            >
              Sign in
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center px-2 md:px-18">
        <motion.div
          className="w-full max-w-2xl p-5 bg-white rounded-lg text-left"
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-normal text-gray-600 mb-6">
            Welcome to your professional community
          </h1>

          {/* Google Sign-in Button */}
          <motion.button
            onClick={handleGoogleSignIn}
            className="w-[90%] max-w-[400px] flex items-center justify-center py-2 text-lg border border-blue-600 bg-blue-600 text-white rounded-full hover:bg-blue-700 mb-5"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img src="/public/images/google-white.png" alt="Google" className="h-6 w-6 mr-2" />
            Continue with Google
          </motion.button>

          {/* Sign in with Email */}
          <Link to="/login">
            <motion.button
              className="w-[90%] max-w-[400px] mt-3 flex items-center justify-center py-2 text-lg border border-gray-600 rounded-full text-gray-800 hover:bg-gray-100 mb-8"
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

          {/* Join Now */}
          <p className="mt-3 text-md text-center text-gray-900 w-[90%] max-w-[400px]">
            New to LinkedIn?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline text-lg">
              Join now
            </Link>
          </p>
        </motion.div>

        {/* Right Side: Hero Image */}
        <div className="flex justify-end w-full">
          <motion.img
            src="/public/images/hero.svg"
            alt="Hero"
            className="hidden md:block w-[650px]"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </div>

      {/* ✅ Footer fixed at the bottom of the page */}
      <div className="absolute bottom-0 w-full">
        <Footer />
      </div>
    </div>
  );
};

export default WelcomePage;
