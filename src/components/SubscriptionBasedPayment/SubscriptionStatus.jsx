import React, { useState, useEffect } from "react";
import { Clock, AlertCircle } from "lucide-react";

/**
 * @typedef {Object} SubscriptionDetails
 * @property {string} type - The subscription type ('free' or 'premium')
 * @property {string} status - Subscription status ('active', 'canceled', 'past_due', 'inactive')
 * @property {Date} currentPeriodEnd - Date when the current billing period ends
 * @property {string} renewalAmount - Formatted renewal amount (e.g., "$20.00")
 * @property {string[]} features - List of premium features included in the subscription
 */

/**
 * SubscriptionStatus component for displaying the user's current subscription details
 * 
 * This component fetches and displays a user's subscription information, including:
 * - Current plan type (free or premium)
 * - Subscription status
 * - Renewal date (for premium plans)
 * - Premium features (for premium plans)
 * - Renewal amount (for active premium plans)
 * 
 * It handles loading and error states, and provides appropriate UI for each subscription type.
 * 
 * @component
 * @example
 * // Usage in a React application
 * import SubscriptionStatus from './components/SubscriptionBasedPayment/SubscriptionStatus';
 * 
 * function ProfilePage() {
 *   return (
 *     <div>
 *       <h1>My Profile</h1>
 *       <SubscriptionStatus />
 *     </div>
 *   );
 * }
 * 
 * @returns {JSX.Element} Rendered component showing subscription status and details
 */
const SubscriptionStatus = () => {
  /** @type {[SubscriptionDetails|null, React.Dispatch<React.SetStateAction<SubscriptionDetails|null>>]} State for subscription data */
  const [subscription, setSubscription] = useState(null);
  
  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} State for premium subscription status */
  const [isPremium, setIsPremium] = useState(false);
  
  /** @type {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} State for loading indicator */
  const [loading, setLoading] = useState(true);
  
  /** @type {[string|null, React.Dispatch<React.SetStateAction<string|null>>]} State for error messages */
  const [error, setError] = useState(null);
  
  /** Base URL for API calls from environment variables */
  const BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "https://your-api-url.com";

  /**
   * Fetches user's subscription details on component mount
   * 
   * @function useEffect
   */
  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`${BASE_URL}/user/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch subscription details");
        }

        const data = await response.json();
        console.log("data:", data.user.isPremium);
        setIsPremium(data.user.isPremium);
      } catch (err) {
        setError("Could not load subscription details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionDetails();
  }, [BASE_URL]);

  /**
   * Formats a date to a human-readable string
   * 
   * @function formatDate
   * @param {Date|string} date - The date to format
   * @returns {string} Formatted date string (e.g., "May 8, 2025")
   */
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  /**
   * Returns CSS class based on subscription status
   * 
   * @function getStatusColor
   * @param {string} status - Subscription status ('active', 'canceled', 'past_due', etc.)
   * @returns {string} CSS class string for the status badge
   */
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "canceled":
        return "bg-yellow-100 text-yellow-800";
      case "past_due":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-red-50 shadow rounded-lg p-6">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
          <h3 className="text-lg font-medium text-red-800">
            Error loading subscription
          </h3>
        </div>
        <p className="mt-2 text-sm text-red-700">{error}</p>
      </div>
    );
  }

  // Mock subscription data for display purposes
  const mockSubscription = {
    // type: "premium", if isPremium is true, else "free"
    type: isPremium ? "premium" : "free",
    status: "active", // or 'inactive', 'canceled', 'past_due'
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    renewalAmount: "$20.00",
    features: [
      "Unlimited job applications",
      "Connect with 500+ people",
      "Message unlimited connections",
    ],
  };

  // Use actual subscription data in production
  const subData = subscription || mockSubscription;

  return (
    <div className="bg-white m-4 shadow rounded-lg overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-5">
        <h3 className="text-lg font-medium text-gray-900">
          Subscription Details
        </h3>
      </div>

      <div className="px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Current Plan</span>
            <span className="text-lg font-semibold capitalize">
              {subData.type} Plan
            </span>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
              subData.status
            )}`}
          >
            {subData.status.replace("_", " ").toUpperCase()}
          </span>
        </div>

        {subData.type === "premium" && (
          <>
            <div className="flex items-center mt-6 text-sm">
              <Clock className="h-4 w-4 text-gray-400 mr-2" />
              <span>
                {subData.status === "canceled"
                  ? `Access until ${formatDate(subData.currentPeriodEnd)}`
                  : `Renews on ${formatDate(subData.currentPeriodEnd)}`}
              </span>
            </div>

            {subData.status === "active" && (
              <div className="mt-1 text-sm text-gray-500">
                You will be charged {subData.renewalAmount} on renewal
              </div>
            )}

            <div className="mt-6">
              <h4 className="font-medium text-gray-900 mb-2">
                Your Premium Features
              </h4>
              <ul className="space-y-1">
                {subData.features.map((feature, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-600 flex items-center"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {subData.type === "free" && (
          <div className="mt-4 bg-gray-50 rounded-md p-4">
            <p className="text-sm text-gray-600">
              Upgrade to Premium to unlock all features including unlimited job
              applications, 500+ connections, and unlimited messaging.
            </p>
          </div>
        )}
      </div>

      <div className="bg-gray-50 px-6 py-4">
        {subData.type === "premium" && subData.status === "active" ? (
          <a
            href="/subscription-plans"
            className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Manage subscription
          </a>
        ) : (
          <a
            href="/subscription-plans"
            className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
          >
            View subscription plans
          </a>
        )}
      </div>
    </div>
  );
};

export default SubscriptionStatus;
