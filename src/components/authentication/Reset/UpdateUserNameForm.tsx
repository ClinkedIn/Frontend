import React, { useState, ChangeEvent, FormEvent } from "react";
import Button from "../../Button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faChevronDown } from "@fortawesome/free-solid-svg-icons";

interface FormData {
  firstName: string;
  lastName: string;
  additionalName: string;
}

export default function UpdateUserNameForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    additionalName: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add API call or other submission logic here
  };

  return (
    <div className=" container lg:w-4xl mx-auto my-10 rounded-lg  shadow-2xl ">
      <div
        className="p-4 border-b border-gray-400 relative top-0 left-0 right-0
                flex justify-between items-center"
      >
        <h1 className="text-3xl">Edit intro</h1>
        <button className="cursor-pointer p-2">
          <FontAwesomeIcon icon={faX} />
        </button>
      </div>

      <div className="p-4">
        <div className="flex flex-col p-4  rounded-lg shadow-sm my-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-amber-100 p-2 rounded-md">
                <div className="bg-amber-400 w-4 h-4 rounded-sm"></div>
              </div>
              <h2 className="text-lg font-medium">
                Enhance your profile with Premium
              </h2>
            </div>
            <button
              className="cursor-pointer p-2 "
              onClick={() => {
                // Add logic to toggle the visibility of the premiumSection
                const premiumSection =
                  document.getElementById("premuimSection");
                if (premiumSection) {
                  premiumSection.classList.toggle("hidden");
                }
                // Add logic to toggle the chevron icon
                const chevron = document.getElementById("chevron");
                if (chevron) {
                  chevron.classList.toggle("rotate-180");
                }
              }}
            >
              <FontAwesomeIcon id="chevron" icon={faChevronDown} />
            </button>
          </div>

          <div id="premuimSection" className="">
            <p className="text-gray-600 mt-2 mb-4">
              Feature profile sections higher, add a custom button, get AI
              writing assistance and much more.
            </p>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-400 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-green-400 border-2 border-white"></div>
                <div className="w-8 h-8 rounded-full bg-purple-400 border-2 border-white"></div>
              </div>
              <p className="text-sm text-gray-600">
                Mohamed and millions of other members use Premium
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button className="bg-amber-100 text-amber-800 py-2 px-4 rounded-full font-medium hover:bg-amber-200 transition-colors">
                Try Premium for EGP0
              </button>
              <p className="text-xs text-gray-500 text-center">
                1-month free with 24/7 support. Cancel anytime. We'll remind you
                7 days before your trial ends.
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="p-4 max-h-[570px]  overflow-y-auto">
          <p className="text-sm text-gray-600 mb-4">
            <span className="text-red-600">*</span> Indicates required
          </p>

          <div className="mb-4">
            <label htmlFor="firstName" className="block mb-1">
              First name<span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full border border-black rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="lastName" className="block mb-1">
              Last name<span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full border border-black rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="additionalName" className="block mb-1">
              Additional name
            </label>
            <input
              type="text"
              id="additionalName"
              name="additionalName"
              value={formData.additionalName}
              onChange={handleChange}
              className="w-full border border-black rounded px-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="text-right  border-t border-gray-400 p-3">
          <Button
            type="submit"
            className="btn-class px-6 py-2"
            id="updateButton"
            onClick={() => {}}
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
