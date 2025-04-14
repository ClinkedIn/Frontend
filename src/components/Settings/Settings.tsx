import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

enum PrivacyOption {
  PUBLIC = "public",
  PRIVATE = "private",
  CONNECTIONS_ONLY = "connectionsOnly",
}

const privacyOptionDisplayNames = {
  [PrivacyOption.PUBLIC]: "Public",
  [PrivacyOption.PRIVATE]: "Private",
  [PrivacyOption.CONNECTIONS_ONLY]: "Connections Only",
};

interface UpdateEmailResponse {
  token: string;
  message: string;
}

interface UpdatePrivacyResponse {
  message: string;
  profilePrivacySettings: string;
}

interface UserProfile {
  profilePrivacySettings: string;
  email?: string;
}

interface GetMeResponse {
  message: string;
  user: UserProfile;
}

interface ErrorResponse {
  message: string;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  withCredentials: true,
});

const SettingsPage: React.FC = () => {
  const [isUpdateEmailVisible, setIsUpdateEmailVisible] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [selectedPrivacy, setSelectedPrivacy] = useState<PrivacyOption>(
    PrivacyOption.PUBLIC
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingPrivacy, setIsUpdatingPrivacy] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await api.get<GetMeResponse>("/user/me");
        const { profilePrivacySettings, email } = response.data.user;

        if (email) {
          setCurrentEmail(email);
        }

        if (
          Object.values(PrivacyOption).includes(
            profilePrivacySettings as PrivacyOption
          )
        ) {
          setSelectedPrivacy(profilePrivacySettings as PrivacyOption);
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const errorData = error.response.data as ErrorResponse;
          setFeedbackMessage({
            type: "error",
            message: errorData.message || "Failed to load profile settings",
          });
        } else {
          setFeedbackMessage({
            type: "error",
            message: "Failed to load profile settings. Please try again.",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  /**
   * Handles the email update process when the form is submitted.
   *
   * @param {React.FormEvent} e - The form submission event.
   * @returns {Promise<void>} - A promise that resolves when the email update process is complete.
   *
   * @description
   * This function validates the input fields for the new email and password. If either field is empty,
   * it sets an error feedback message and exits early. Otherwise, it sends a PATCH request to the
   * `/user/update-email` endpoint with the new email and password. If the request is successful,
   * it clears the input fields and sets a success feedback message. If an error occurs, it sets an
   * appropriate error feedback message based on the type of error.
   *
   * @throws {Error} - Throws an error if the email update process fails unexpectedly.
   *
   * @example
   * ```tsx
   * <form onSubmit={handleEmailUpdate}>
   *   <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
   *   <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
   *   <button type="submit">Update Email</button>
   * </form>
   * ```
   */
  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !password) {
      setFeedbackMessage({
        type: "error",
        message: "Please fill all required fields",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setFeedbackMessage(null);

      const response = await api.patch<UpdateEmailResponse>(
        "/user/update-email",
        {
          newEmail,
          password,
        }
      );

      setFeedbackMessage({
        type: "success",
        message: response.data.message,
      });

      setNewEmail("");
      setPassword("");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data as ErrorResponse;
        setFeedbackMessage({
          type: "error",
          message: errorData.message || "An error occurred",
        });
      } else {
        setFeedbackMessage({
          type: "error",
          message: "Failed to update email. Please try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrivacyChange = async (value: PrivacyOption) => {
    try {
      setIsUpdatingPrivacy(true);
      setFeedbackMessage(null);

      const response = await api.patch<UpdatePrivacyResponse>(
        "/user/privacy-settings",
        {
          profilePrivacySettings: value,
        }
      );

      setSelectedPrivacy(value);
      setFeedbackMessage({
        type: "success",
        message:
          response.data.message || "Privacy settings updated successfully",
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data as ErrorResponse;
        setFeedbackMessage({
          type: "error",
          message: errorData.message || "An error occurred",
        });
      } else {
        setFeedbackMessage({
          type: "error",
          message: "Failed to update privacy settings. Please try again.",
        });
      }
    } finally {
      setIsUpdatingPrivacy(false);
    }
  };

  const handleDeactivateAccount = async () => {
    try {
      setIsDeactivating(true);
      setFeedbackMessage(null);

      await api.delete("/user");

      setFeedbackMessage({
        type: "success",
        message: "Your account has been successfully deleted.",
      });

      setIsDeactivateDialogOpen(false);

      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data as ErrorResponse;
        setFeedbackMessage({
          type: "error",
          message: errorData.message || "An error occurred",
        });
      } else {
        setFeedbackMessage({
          type: "error",
          message: "Failed to deactivate account. Please try again.",
        });
      }
    } finally {
      setIsDeactivating(false);
    }
  };

  /**
   * Clears the current feedback message by setting it to null.
   * This function is typically used to reset or remove any displayed feedback.
   */
  const clearFeedback = () => {
    setFeedbackMessage(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="bg-white p-3 flex items-center border-b border-gray-200">
        <div className="mx-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8 text-blue-600"
          >
            <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
          </svg>
        </div>
        <div className="flex-grow"></div>
      </header>

      <div className="flex flex-1">
        <div className="w-64 border-r border-gray-200 bg-gray-50">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <h1 className="ml-3 text-2xl font-bold">Settings</h1>
            </div>

            <nav className="space-y-4">
              <div className="p-2 text-green-700 font-medium flex items-center border-l-4 border-green-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 mr-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
                Sign in & security
              </div>
            </nav>
          </div>
        </div>

        <div className="flex-1 p-8 bg-gray-50">
          {feedbackMessage && (
            <div
              className={`max-w-2xl mx-auto mb-4 p-4 rounded flex items-center justify-between ${
                feedbackMessage.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <div className="flex items-center">
                {feedbackMessage.type === "success" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <p>{feedbackMessage.message}</p>
              </div>
              <button
                onClick={clearFeedback}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          )}

          {!isUpdateEmailVisible ? (
            <div className="max-w-2xl mx-auto bg-white rounded p-6">
              <h2 className="text-xl font-medium mb-6">Account access</h2>

              <div className="border-b border-gray-200 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Email addresses</h3>
                    {currentEmail && (
                      <p className="text-gray-600 text-sm mt-1">
                        <span className="font-medium">{currentEmail}</span>
                      </p>
                    )}
                    <p className="text-gray-600 text-sm mt-1">
                      Update your email address
                    </p>
                  </div>
                  <button
                    className="text-gray-600 hover:bg-gray-100 p-2 rounded-full"
                    onClick={() => setIsUpdateEmailVisible(true)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="py-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">
                      Privacy settings for profile visibility
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Control who can see your profile information
                    </p>
                  </div>
                  <div className="relative">
                    <select
                      className={`appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        isUpdatingPrivacy ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      value={selectedPrivacy}
                      onChange={(e) =>
                        handlePrivacyChange(e.target.value as PrivacyOption)
                      }
                      disabled={isUpdatingPrivacy}
                    >
                      {Object.values(PrivacyOption).map((option) => (
                        <option key={option} value={option}>
                          {privacyOptionDisplayNames[option]}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      {isUpdatingPrivacy ? (
                        <svg
                          className="animate-spin h-4 w-4 text-blue-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="py-6">
                <div>
                  <h3 className="font-medium text-red-600">
                    Deactivate your account
                  </h3>
                  <p className="text-gray-600 text-sm mt-1 mb-4">
                    This will mark your account as inactive. Your profile will
                    no longer be visible to others.
                  </p>
                  <button
                    onClick={() => setIsDeactivateDialogOpen(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Deactivate account
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto bg-white rounded p-6">
              <div className="flex items-center mb-6">
                <button
                  className="text-gray-600 hover:bg-gray-100 p-2 rounded-full mr-2"
                  onClick={() => setIsUpdateEmailVisible(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                </button>
                <h2 className="text-xl font-medium">Back</h2>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">
                  Update Email Address
                </h3>
                <p className="text-gray-600 mb-4">
                  Enter your new email and password to confirm the change
                </p>
              </div>

              <form onSubmit={handleEmailUpdate} className="mb-6">
                <div className="mb-4">
                  <label
                    htmlFor="newEmail"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    New email address
                  </label>
                  <input
                    id="newEmail"
                    type="email"
                    placeholder="Enter new email address"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password confirmation
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We need your password to confirm this change
                  </p>
                </div>
                <div className="flex items-center">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
                    disabled={!newEmail || !password || isSubmitting}
                  >
                    {isSubmitting ? "Updating..." : "Update email address"}
                  </button>
                </div>
              </form>

              <div className="text-gray-600 text-sm mt-4">
                <p>
                  After updating your email, you'll receive a confirmation
                  message. You'll need to verify your new email address before
                  the change takes effect.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {isUpdateEmailVisible && (
        <footer className="bg-white py-4 border-t border-gray-200">
          <div className="max-w-6xl mx-auto flex flex-wrap justify-center text-sm text-gray-600">
            <a href="#" className="mx-3 hover:text-blue-600">
              Help Center
            </a>
            <a href="#" className="mx-3 hover:text-blue-600">
              Professional Community Policies
            </a>
            <a href="#" className="mx-3 hover:text-blue-600">
              Privacy Policy
            </a>
            <a href="#" className="mx-3 hover:text-blue-600">
              Accessibility
            </a>
            <a href="#" className="mx-3 hover:text-blue-600">
              Recommendation Transparency
            </a>
            <a href="#" className="mx-3 hover:text-blue-600">
              User Agreement
            </a>
            <a href="#" className="mx-3 hover:text-blue-600">
              End User License Agreement
            </a>
          </div>
          <div className="flex justify-center mt-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 text-blue-600"
            >
              <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
            </svg>
          </div>
        </footer>
      )}

      {isDeactivateDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-red-600">
                Deactivate Account
              </h3>
              <p className="text-gray-600 mt-2">
                Are you sure you want to deactivate your account? This action
                will:
              </p>
              <ul className="mt-3 ml-5 text-gray-600 list-disc">
                <li>Hide your profile from other users</li>
                <li>Remove you from search results</li>
                <li>Maintain your data for potential future reactivation</li>
              </ul>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsDeactivateDialogOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivateAccount}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-red-300"
                disabled={isDeactivating}
              >
                {isDeactivating ? "Deactivating..." : "Yes, deactivate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Settings() {
  return <SettingsPage />;
}
