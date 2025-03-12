import { useState } from "react";
import { IoShieldHalf } from "react-icons/io5";

const VerifyEmail = () => {
  const [code, setCode] = useState("");

  return (
    <div className="flex flex-col items-center justify-center h-screen ">

      {/* Title */}
      <h2 className="text-2xl font-semibold text-center">Confirm your email</h2>
      <p className="text-gray-600 text-center mt-2">
        Type in the code we sent to <strong>youremail@example.com</strong>.{" "}
        <span className="text-blue-500 cursor-pointer">Edit email</span>
      </p>
{/* Code Input */}
<input
  type="text"
  value={code}
  onChange={(e) => setCode(e.target.value)}
  placeholder="------"
  maxLength={6}
  className="mt-4 text-center text-2xl tracking-widest border-2 border-gray-500 rounded-lg p-3 outline-none focus:ring-2 focus:ring-black leading-tight"
/>
   
{/* Privacy Notice */}
<div className="mt-4 p-4 text-sm text-gray-700 rounded-lg w-96 text-left bg-white border border-gray-300 shadow-sm flex items-start gap-3">
  <div className="font-sans w-full">
    <div className="flex items-center gap-2">
      <IoShieldHalf className="text-gray-600 text-lg" />
      <p className="font-semibold">Your privacy is important</p>
    </div>

    {/* Description */}
    <p className="mt-1 leading-relaxed">
      We may send you member updates, recruiter messages, job suggestions, invitations, reminders, and promotional messages from us and our partners.
      You can change your{" "}
      <span className="text-blue-500 cursor-pointer">preferences</span> anytime.
    </p>
  </div>
</div>

      {/* Resend Code */}
      <p className="text-center mt-4 text-gray-700">
        Didn't receive the code?{" "}
        <span className="text-blue-500 cursor-pointer">Send again</span>
      </p>

      {/* Submit Button */}
      <button
        className="mt-4 py-3 px-8 text-gray-400 bg-gray-200 rounded-lg font-semibold cursor-not-allowed"
        disabled
      >
        Agree & Confirm
      </button>
    </div>
  );
};

export default VerifyEmail;
