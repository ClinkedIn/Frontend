// import { useState, ChangeEvent, FormEvent } from "react";
// import Button from "../../Button";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faX, faChevronDown } from "@fortawesome/free-solid-svg-icons";

// /**
//  * Represents the structure of the form data used in the UpdateUserNameForm component.
//  *
//  * @property firstName - The first name of the user.
//  * @property lastName - The last name of the user.
//  * @property additionalName - An additional name or middle name of the user.
//  */
// interface FormData {
//   firstName: string;
//   lastName: string;
//   additionalName: string;
// }

// export default function UpdateUserNameForm() {
//   /**
//    * State hook to manage the form data for updating the user's name.
//    *
//    * @typedef {Object} FormData
//    * @property {string} firstName - The first name of the user.
//    * @property {string} lastName - The last name of the user.
//    * @property {string} additionalName - An additional name or middle name of the user.
//    *
//    * @constant
//    * @type {[FormData, React.Dispatch<React.SetStateAction<FormData>>]}
//    * @description Initializes the form data with empty strings for `firstName`, `lastName`, and `additionalName`.
//    */
//   const [formData, setFormData] = useState<FormData>({
//     firstName: "",
//     lastName: "",
//     additionalName: "",
//   });

//   // Handle input changes
//   /**
//    * Handles the change event for input fields in the form.
//    * Updates the form data state with the new value for the input field that triggered the event.
//    *
//    * @param {ChangeEvent<HTMLInputElement>} e - The change event triggered by an input field.
//    */
//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   // Handle form submission
//   /**
//    * Handles the form submission event for updating the username.
//    *
//    * @param e - The form submission event of type `FormEvent<HTMLFormElement>`.
//    * Prevents the default form submission behavior and logs the form data.
//    * Additional logic, such as an API call, can be added here.
//    */
//   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log("Form submitted:", formData);
//     // Add API call or other submission logic here
//   };

//   return (
//     <div className="container lg:w-4xl mx-auto my-10 rounded-lg shadow-2xl">
//       {/* Header */}
//       <div className="p-4 border-b border-gray-400 relative flex justify-between items-center">
//         <h1 className="text-3xl">Edit intro</h1>
//         <button className="cursor-pointer p-2">
//           <FontAwesomeIcon icon={faX} />
//         </button>
//       </div>

//       {/* Premium Section */}
//       <div className="p-4">
//         <div className="flex flex-col p-4 rounded-lg shadow-sm my-5">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center gap-2">
//               <div className="bg-amber-100 p-2 rounded-md">
//                 <div className="bg-amber-400 w-4 h-4 rounded-sm"></div>
//               </div>
//               <h2 className="text-lg font-medium">
//                 Enhance your profile with Premium
//               </h2>
//             </div>
//             <button
//               className="cursor-pointer p-2"
//               onClick={() => {
//                 const premiumSection = document.getElementById("premuimSection");
//                 if (premiumSection) {
//                   premiumSection.classList.toggle("hidden");
//                 }
//                 const chevron = document.getElementById("chevron");
//                 if (chevron) {
//                   chevron.classList.toggle("rotate-180");
//                 }
//               }}
//             >
//               <FontAwesomeIcon id="chevron" icon={faChevronDown} />
//             </button>
//           </div>

//           <div id="premuimSection" className="">
//             <p className="text-gray-600 mt-2 mb-4">
//               Feature profile sections higher, add a custom button, get AI
//               writing assistance and much more.
//             </p>

//             <div className="flex items-center gap-2 mb-4">
//               <div className="flex -space-x-2">
//                 <div className="w-8 h-8 rounded-full bg-blue-400 border-2 border-white"></div>
//                 <div className="w-8 h-8 rounded-full bg-green-400 border-2 border-white"></div>
//                 <div className="w-8 h-8 rounded-full bg-purple-400 border-2 border-white"></div>
//               </div>
//               <p className="text-sm text-gray-600">
//                 Mohamed and millions of other members use Premium
//               </p>
//             </div>

//             <div className="flex flex-col gap-2">
//               <button className="bg-amber-100 text-amber-800 py-2 px-4 rounded-full font-medium hover:bg-amber-200 transition-colors">
//                 Try Premium for EGP0
//               </button>
//               <p className="text-xs text-gray-500 text-center">
//                 1-month free with 24/7 support. Cancel anytime. We'll remind you
//                 7 days before your trial ends.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Form */}
//       <form onSubmit={handleSubmit}>
//         <div className="p-4 max-h-[570px] overflow-y-auto">
//           <p className="text-sm text-gray-600 mb-4">
//             <span className="text-red-600">*</span> Indicates required
//           </p>

//           {/* First Name Field */}
//           <div className="mb-4">
//             <label htmlFor="firstName" className="block mb-1">
//               First name<span className="text-red-600">*</span>
//             </label>
//             <input
//               type="text"
//               id="firstName"
//               name="firstName"
//               value={formData.firstName}
//               onChange={handleChange}
//               required
//               className="w-full border border-black rounded px-3 py-2 focus:outline-none focus:border-blue-500"
//             />
//           </div>

//           {/* Last Name Field */}
//           <div className="mb-4">
//             <label htmlFor="lastName" className="block mb-1">
//               Last name<span className="text-red-600">*</span>
//             </label>
//             <input
//               type="text"
//               id="lastName"
//               name="lastName"
//               value={formData.lastName}
//               onChange={handleChange}
//               required
//               className="w-full border border-black rounded px-3 py-2 focus:outline-none focus:border-blue-500"
//             />
//           </div>

//           {/* Additional Name Field */}
//           <div className="mb-4">
//             <label htmlFor="additionalName" className="block mb-1">
//               Additional name
//             </label>
//             <input
//               type="text"
//               id="additionalName"
//               name="additionalName"
//               value={formData.additionalName}
//               onChange={handleChange}
//               className="w-full border border-black rounded px-3 py-2 focus:outline-none focus:border-blue-500"
//             />
//           </div>
//         </div>

//         {/* Save Button */}
//         <div className="text-right border-t border-gray-400 p-3">
//           <Button
//             type="submit"
//             className="btn-class px-6 py-2"
//             id="updateButton"
//             onClick={() => {}}
//           >
//             Save
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }

import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faChevronDown } from "@fortawesome/free-solid-svg-icons";

/**
 * Represents the structure of the form data used in the UpdateUserNameForm component.
 *
 * @property firstName - The first name of the user.
 * @property lastName - The last name of the user.
 * @property additionalName - An additional name or middle name of the user.
 */
interface FormData {
  firstName: string;
  lastName: string;
  additionalName: string;
}

/**
 * Environment variables for API configuration.
 * Replace with your actual environment variable or configuration system.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export default function UpdateUserNameForm() {
  const navigate = useNavigate();
  /**
   * State hook to manage the form data for updating the user's name.
   */
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
  });

  /**
   * State to track loading status during API request
   */
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * State to track success or error messages
   */
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({
    type: null,
    message: "",
  });

  /**
   * Handles the change event for input fields in the form.
   * Updates the form data state with the new value for the input field that triggered the event.
   *
   * @param {ChangeEvent<HTMLInputElement>} e - The change event triggered by an input field.
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  /**
   * Handles the form submission event for updating the username.
   * Makes an API call to update the user's name in the backend.
   *
   * @param e - The form submission event of type `FormEvent<HTMLFormElement>`.
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage({ type: null, message: "" });

    try {
      // Prepare the request payload
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
      };

      // Make the API call
      const response = await fetch(`${BASE_URL}/user/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include", // Include cookies for authentication if needed
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log("API response:", data);

      // Show success message
      setStatusMessage({
        type: "success",
        message: "Your name has been updated successfully!",
      });
    } catch (error) {
      console.error("Failed to update user name:", error);
      setStatusMessage({
        type: "error",
        message: "Failed to update your name. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container lg:w-4xl mx-auto my-10 rounded-lg shadow-2xl bg-white overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-300 relative flex justify-between items-center bg-gray-50">
        <h1 className="text-3xl font-semibold text-gray-800">Edit intro</h1>
        <button className="cursor-pointer p-2 hover:bg-gray-200 rounded-full transition-colors">
          <FontAwesomeIcon icon={faX} />
        </button>
      </div>

      {/* Premium Section */}
      <div className="p-5">
        <div className="flex flex-col p-5 rounded-lg shadow-md my-5 border border-gray-100 bg-gradient-to-r from-amber-50 to-white">
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
              className="cursor-pointer p-2"
              onClick={() => {
                const premiumSection =
                  document.getElementById("premuimSection");
                if (premiumSection) {
                  premiumSection.classList.toggle("hidden");
                }
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
              <button
                onClick={() => navigate("/Subscription-Plans")}
                className="bg-amber-500 text-white py-2 px-6 rounded-full font-medium hover:bg-amber-600 transition-colors shadow-md"
              >
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

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="p-4 max-h-[570px] overflow-y-auto">
          {/* Status Message */}
          {statusMessage.type && (
            <div
              className={`mb-4 p-3 rounded ${
                statusMessage.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {statusMessage.message}
            </div>
          )}

          <p className="text-sm text-gray-600 mb-4">
            <span className="text-red-600">*</span> Indicates required
          </p>

          {/* First Name Field */}
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

          {/* Last Name Field */}
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
        </div>

        {/* Save Button */}
        <div className="text-right border-t border-gray-400 p-3">
          <Button
            type="submit"
            className={`btn-class px-6 py-2 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            id="updateButton"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}
