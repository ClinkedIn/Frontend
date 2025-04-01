import React, { useState } from "react";
import Button from "../../../Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex =
    /^(\+?\d{1,4})?[ -]?(\(?\d{1,4}\)?[ -]?)?(\d{3,4}[ -]?\d{3,4}|\d{7,15})$/;

  interface ChangeEvent {
    target: { value: string };
  }

  const handleChange = (e: ChangeEvent) => {
    setEmail(e.target.value);
    setErrorMessage("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inputBox = document.getElementById("inputBox") as HTMLInputElement;

    if (!(emailRegex.test(email) || phoneRegex.test(email))) {
      inputBox.classList.add("border-red-600", "border-2");
      setErrorMessage("Please Enter a valid email or phone number.");
      return;
    }
    inputBox.classList.remove("border-red-600", "border-2");
    setErrorMessage("");

    if (email === "nonexistent@example.com") {
      setErrorMessage("User not found.");
      toast.error(errorMessage);
      return;
    }
    toast.success("Verification code sent successfully");
  };

  const handleSignIn = () => {
    navigate("/login");
  };
  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleOnBlur = () => {
    const email = document.getElementById("floating_email") as HTMLInputElement;
    const inputBox = document.getElementById("inputBox") as HTMLInputElement;
    if (email.value === "") {
      inputBox.classList.remove("border-black", "border-1");
      inputBox.classList.add("border-red-600", "border-2");
      setErrorMessage("Please enter your email or phone number.");
    }
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-white">
      <div className="w-full max-w-7xl py-4 flex justify-between items-center pt-1">
        <div
          className="flex items-center text-[32px] font-bold text-gray-800 hover:cursor-pointer ml-5 lg:ml-0"
          onClick={handleLogoClick}
        >
          <span className="text-[#0A66C2]">Locked</span>
          <span className="text-white px-1 rounded-sm text-[40px]">
            <FontAwesomeIcon
              icon={faLinkedin}
              className="text-[#0A66C2] w-8 h-8"
            />
          </span>
        </div>
        <div className="flex items-center space-x-4 mr-7 lg:mr-0">
          <button
            className="text-[#616161] font-semibold text-lg px-3 py-1 hover:cursor-pointer hover:bg-[#F5F5F5] rounded-2xl"
            onClick={handleSignIn}
          >
            Sign in
          </button>
          <button
            className="text-[#0A66C2] hover:text-[#004182] hover:bg-[#F5F5F5] hover:border-3 hover:border-[#004182] hover:cursor-pointer font-semibold border-2 border-[#0A66C2] rounded-full text-lg px-4 py-1"
            onClick={handleSignUp}
          >
            Join now
          </button>
        </div>
      </div>

      <div className="flex justify-center flex-grow px-12 mb-12">
        <div className="bg-white lg:rounded-lg lg:shadow-[5px_10px_20px_rgba(0,0,0,0.2)] p-6 w-[450px] h-[400px] mt-12">
          <h1 className="text-[35px] text-gray-800 mb-6 pt-1 font-semibold">
            Forgot password
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <div
                id="inputBox"
                className="relative z-0 w-full mb-5 group p-2 border-1 border-black focus-within:border-[#0A66C2] focus-within:border-2 rounded-md"
              >
                <input
                  type="text"
                  name="floating_email"
                  id="floating_email"
                  className="block py-3 pt-5 px-3 pl-2 w-full text-black bg-transparent appearance-none focus:outline-none focus:ring-0 peer peer-focus:-translate-x-4"
                  placeholder=" "
                  onBlur={handleOnBlur}
                  onChange={handleChange}
                  data-testid="email-input"
                />
                <label
                  htmlFor="floating_email"
                  className="text-xl font-light absolute text-black duration-300 transform -translate-y-4 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 pt-1 pl-1 peer-focus:translate-x-2"
                >
                  Email or phone
                </label>
              </div>
              {errorMessage && (
                <p
                  className="text-red-600 text-md mb-[-28px] mt-[-15px] ml-[10px]"
                  data-testid="error-message"
                >
                  {errorMessage}
                </p>
              )}
            </div>

            <p className="text-md text-gray-700 pt-2 mb-3 mt-6">
              We'll send a verification code to this email or phone number if it
              matches an existing LinkedIn account.
            </p>

            <div className="flex flex-col space-y-2 items-center pt-3 pb-5">
              <Button
                className="w-full text-white py-5 rounded-full hover:bg-[#004182] font-lg"
                type="submit"
                id="nextButton"
              >
                Next
              </Button>
              <button
                type="button"
                className="px-3 py-1 text-gray-600 font-medium hover:cursor-pointer hover:underline hover:bg-[#F5F5F5] rounded-3xl focus:outline-none pt-3 pb-3"
              >
                Back
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="w-full bg-white py-1 hidden lg:block">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center gap-6 m-auto mt-[-65px] mb-1">
            <div className="flex items-center gap-2">
              <img
                src="../../../public/Images/black-lockedIn-login-logo.png"
                className="text-black w-20 hover:cursor-pointer"
                onClick={handleLogoClick}
              />
              <span className="text-gray-500">© 2025</span>
            </div>
            <div className="font-medium flex gap-3 text-[13px]">
              <a href="#" className="hover:underline">
                User Agreement
              </a>
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>
              <a href="#" className="hover:underline">
                Community Guidelines
              </a>
              <a href="#" className="hover:underline">
                Cookie Policy
              </a>
              <a href="#" className="hover:underline">
                Copyright Policy
              </a>
              <a href="#" className="hover:underline">
                Send Feedback
              </a>
              <a href="#" className="hover:underline">
                Language
              </a>
            </div>
            <div className="flex items-center"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
