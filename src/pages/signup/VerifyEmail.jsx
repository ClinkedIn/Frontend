import { useState, useEffect } from "react";
import axios from "axios";
import { IoShieldHalf } from "react-icons/io5";
import { BASE_URL } from "../../constants";

const VerifyEmail = () => {
  const [code, setCode] = useState(""); // OTP input
  const [message, setMessage] = useState(""); // Feedback message
  const [isLoading, setIsLoading] = useState(false); // Loading state for verification
  const [isVerified, setIsVerified] = useState(false); // Verification status
  const [user, setUser] = useState(null); // User data
  const [newEmail, setNewEmail] = useState(""); // New email for editing
  const [canRequestOTP, setCanRequestOTP] = useState(true); // Cooldown for OTP requests
  const [timer, setTimer] = useState(0); // Timer for cooldown

  // Request OTP API call
  /**
   * Sends a request to obtain a One-Time Password (OTP) and manages the countdown timer for re-requesting.
   * 
   * This function performs the following:
   * - Prevents multiple OTP requests within a short time frame.
   * - Displays a countdown timer to indicate when the user can request another OTP.
   * - Sends an HTTP GET request to the `/request-otp` endpoint to request an OTP.
   * - Handles success and error responses from the server.
   * - Updates the UI with appropriate messages based on the request status.
   * 
   * @async
   * @function requestOTP
   * @returns {Promise<void>} Resolves when the OTP request process is complete.
   * 
   * @throws {Error} If there is a network error or the server response indicates failure.
   */
  const requestOTP = async () => {
    if (!canRequestOTP) return;
    setMessage("Requesting OTP...");
    setCanRequestOTP(false);
    setTimer(30);

    // Start countdown timer
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(countdown);
          setCanRequestOTP(true);
        }
        return prev - 1;
      });
    }, 1000);

    try {
      const response = await axios.get("/request-otp");
      if (response.data.success) {
        setMessage("✅ OTP sent! Check console.");
        console.log("Mock OTP:", response.data.otp);
      } else {
        setMessage("❌ Failed to request OTP. Try again.");
        setCanRequestOTP(true);
        clearInterval(countdown);
      }
    } catch (error) {
      setMessage("❌ Network error. Please try again.");
      setCanRequestOTP(true);
      clearInterval(countdown);
    }
  };

  // Fetch user data on component load
  useEffect(() => {
    /**
     * Fetches the user data from the server and updates the state with the retrieved information.
     * 
     * @async
     * @function fetchUser
     * @returns {Promise<void>} A promise that resolves when the user data is successfully fetched and state is updated.
     * @throws Will log an error to the console if the request fails.
     */
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user`);
        setUser(response.data);
        setNewEmail(response.data.email);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    // Initial calls
    requestOTP();
    fetchUser();
  }, []);

  // Verify OTP API call
  /**
   * Verifies the OTP (One-Time Password) entered by the user.
   * Sends a POST request to the "/verify-otp" endpoint with the provided OTP code.
   * Updates the UI state based on the verification result.
   *
   * @async
   * @function verifyOTP
   * @returns {Promise<void>} No return value.
   * @throws Will set an error message if the network request fails or the OTP is invalid.
   */
  const verifyOTP = async () => {
    setIsLoading(true);
    setMessage("Verifying OTP...");
    try {
      const response = await axios.post("/verify-otp", { otp: code });
      if (response.data.success) {
        setIsVerified(true);
        setMessage(response.data.message);
      } else {
        setMessage(response.data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Network error. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center h-screen">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-center">Confirm your email</h2>
      <p className="text-gray-600 text-center mt-2">
        Type in the code we sent to{" "}
        <strong>{newEmail || "your email"}</strong>.
        {!isEditing ? (
          <button
            className="text-blue-500 cursor-pointer ml-2"
            onClick={() => setIsEditing(true)}
          >
            Edit email
          </button>
        ) : (
          <>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="border border-gray-400 rounded px-2 py-1 ml-2"
            />
            <button
              className="ml-2 text-green-500"
              onClick={() => setIsEditing(false)}
            >
              Save
            </button>
          </>
        )}
      </p>

      {/* OTP Input */}
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="------"
        maxLength={6}
        className="mt-4 text-center text-2xl tracking-widest border-2 border-gray-500 rounded-lg p-3 outline-none focus:ring-2 focus:ring-black leading-tight"
      />

      {/* Feedback Message */}
      {message && <p className="mt-2 text-lg">{message}</p>}

      {/* Privacy Notice */}
      <div className="mt-4 p-4 text-sm text-gray-700 rounded-lg w-full md:max-w-sm text-left bg-white border border-gray-300 shadow-sm flex items-start gap-3">
        <IoShieldHalf className="text-gray-600 text-lg" />
        <div className="font-sans w-full">
          <p className="font-semibold">Your privacy is important</p>
          <p className="mt-1 leading-relaxed">
            We may send you member updates, recruiter messages, job suggestions,
            invitations, reminders, and promotional messages from us and our partners.
            You can change your{" "}
            <span className="text-blue-500 cursor-pointer">preferences</span> anytime.
          </p>
        </div>
      </div>

      {/* Resend OTP Button */}
      <p className="text-center mt-4 text-gray-700">
        Didn't receive the code?{" "}
        <button
          className={`cursor-pointer ${
            canRequestOTP ? "text-blue-500" : "text-gray-400 cursor-not-allowed"
          }`}
          onClick={canRequestOTP ? requestOTP : undefined}
          disabled={!canRequestOTP}
        >
          {canRequestOTP ? "Send again" : `Wait ${timer}s`}
        </button>
      </p>

      {/* Verify Button */}
      <button
        className={`mt-4 py-3 px-8 rounded-lg font-semibold ${
          isVerified
            ? "bg-green-600 text-white cursor-pointer"
            : "bg-blue-600 text-white cursor-pointer"
        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={verifyOTP}
        disabled={isLoading || isVerified}
      >
        {isVerified ? "✅ Confirmed" : isLoading ? "Verifying..." : "Agree & Confirm"}
      </button>
    </div>
  );
};

export default VerifyEmail;