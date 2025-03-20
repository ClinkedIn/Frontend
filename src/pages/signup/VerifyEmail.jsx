import { useState, useEffect } from "react";
import axios from "axios";
import { IoShieldHalf } from "react-icons/io5";

const VerifyEmail = () => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [user, setUser] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [canRequestOTP, setCanRequestOTP] = useState(true);
  const [timer, setTimer] = useState(0); 
  let countdown;

  const requestOTP = async () => {
    if (!canRequestOTP) return;
    setMessage("Requesting OTP...");
    setCanRequestOTP(false);
    setTimer(30);
  
    countdown = setInterval(() => {
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

  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:5173/user");
      setUser(response.data);
      setNewEmail(response.data.email);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

 // Fetch OTP and user on component load
 useEffect(() => {
  requestOTP(); 
  fetchUser();
}, []);

  const verifyOTP = async () => {
    setIsLoading(true);
    setMessage("Verifying OTP...");
    try {
      const response = await axios.post("/verify-otp", { otp: code });
      if (response.data.success) {
        setIsVerified(true);
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "❌ Network error. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-semibold text-center">Confirm your email</h2>
      <p className="text-gray-600 text-center mt-2">
        Type in the code we sent to <strong>{isEditing ? "" : newEmail || "your email"}</strong>.
        {isEditing ? (
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="border border-gray-400 rounded px-2 py-1 ml-2"
          />
        ) : (
          <button className="text-blue-500 cursor-pointer ml-2" onClick={() => setIsEditing(true)}>
            Edit email
          </button>
        )}
        {isEditing && (
          <button className="ml-2 text-green-500" onClick={() => setIsEditing(false)}>
            Save
          </button>
        )}
      </p>

      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="------"
        maxLength={6}
        className="mt-4 text-center text-2xl tracking-widest border-2 border-gray-500 rounded-lg p-3 outline-none focus:ring-2 focus:ring-black leading-tight"
      />

      {message && <p className="mt-2 text-lg">{message}</p>}

      <div className="mt-4 p-4 text-sm text-gray-700 rounded-lg w-full md:max-w-sm text-left bg-white border border-gray-300 shadow-sm flex items-start gap-3">
        <div className="font-sans w-full">
          <div className="flex items-center gap-2">
            <IoShieldHalf className="text-gray-600 text-lg" />
            <p className="font-semibold">Your privacy is important</p>
          </div>
          <p className="mt-1 leading-relaxed">
            We may send you member updates, recruiter messages, job suggestions, invitations, reminders, and promotional messages from us and our partners. You can change your <span className="text-blue-500 cursor-pointer">preferences</span> anytime.
          </p>
        </div>
      </div>

      <p className="text-center mt-4 text-gray-700">
        Didn't receive the code?{" "}
        <span
          className={`cursor-pointer ${
            canRequestOTP ? "text-blue-500" : "text-gray-400 cursor-not-allowed"
          }`}
          onClick={canRequestOTP ? requestOTP : null}
        >
          {canRequestOTP ? "Send again" : `Wait ${timer}s`}
        </span>
      </p>

      <button
        className={`mt-4 py-3 px-8 rounded-lg font-semibold ${
          isVerified ? "bg-green-600 text-white cursor-pointer" : "bg-blue-600 text-white cursor-pointer"
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
