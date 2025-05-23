import React, { useState, useEffect } from "react";
import { Clock, AlertCircle, CheckCircle, XCircle } from "lucide-react";

/**
 * SubscriptionPlans component for displaying and managing subscription plans
 *
 * @component
 * @example
 * // Usage in a React application
 * import SubscriptionPlans from './components/SubscriptionBasedPayment/subscriptionPlans';
 *
 * function App() {
 *   return (
 *     <div className="app">
 *       <SubscriptionPlans />
 *     </div>
 *   );
 * }
 *
 * @returns {JSX.Element} Rendered component with subscription management UI
 */
const SubscriptionPlans = () => {
  /**
   * @typedef {Object} SubscriptionData
   * @property {string} type - The subscription type ('free' or 'premium')
   * @property {string} status - Subscription status ('active', 'canceled', 'past_due', etc.)
   * @property {Date} currentPeriodEnd - Date when the current billing period ends
   * @property {string} renewalAmount - Formatted renewal amount (e.g., "$20.00")
   * @property {string[]} features - List of premium features
   * @property {Date} expiryDate - Date when the subscription expires
   */

  /** @type {[boolean, function]} State for premium status */
  const [isPremium, setIsPremium] = useState(false);

  /** @type {[boolean, function]} State for loading indicator */
  const [loading, setLoading] = useState(true);

  /** @type {[string|null, function]} State for error messages */
  const [error, setError] = useState(null);

  /** @type {[string, function]} State for current plan type */
  const [currentPlan, setCurrentPlan] = useState("free");

  /** @type {[SubscriptionData|null, function]} State for subscription details */
  const [subscriptionData, setSubscriptionData] = useState(null);

  /** @type {[string, function]} State for active tab selection */
  const [activeTab, setActiveTab] = useState("status"); // 'status' or 'plans'

  /** Base URL for API calls from environment variables */
  const BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "https://your-api-url.com";

  /**
   * Fetch subscription details from server on component mount
   */
  useEffect(() => {
    fetchSubscriptionDetails();
  }, []);

  /**
   * Fetches user subscription details from API
   *
   * @async
   * @function fetchSubscriptionDetails
   * @returns {Promise<void>}
   * @throws {Error} When API call fails
   */
  const fetchSubscriptionDetails = async () => {
    setLoading(true);
    try {
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

      setIsPremium(data.user.isPremium);
      setCurrentPlan(data.user.isPremium ? "premium" : "free");

      const subData = {
        type: data.user.isPremium ? "premium" : "free",
        status: data.user.subscription?.status || "active",
        currentPeriodEnd:
          data.user.subscription?.currentPeriodEnd ||
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        renewalAmount: "$20.00",
        features: [
          "Unlimited job applications",
          "Connect with 500+ people",
          "Message unlimited connections",
        ],
        expiryDate:
          data.user.subscription?.expiryDate ||
          data.user.subscription?.currentPeriodEnd,
      };

      setSubscriptionData(subData);
    } catch (err) {
      setError("Could not load subscription details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initiates subscription process by creating a Stripe checkout session
   *
   * @async
   * @function handleSubscribe
   * @returns {Promise<void>}
   * @throws {Error} When checkout session creation fails
   */
  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${BASE_URL}/stripe/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          credentials: "include",
          body: JSON.stringify({
            paymentMode: "subscription",
          }),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        window.location.href = data.url;
      } else if (response.status === 400) {
        setCurrentPlan(data.subscription.planType);
        setSubscriptionData({
          ...subscriptionData,
          expiryDate: data.subscription.expiryDate,
          type: data.subscription.planType,
        });
        setError(data.message);
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (err) {
      setError(err.message || "Failed to initiate subscription process");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cancels user's current subscription
   *
   * @async
   * @function handleCancelSubscription
   * @returns {Promise<void>}
   * @throws {Error} When subscription cancellation fails
   */
  const handleCancelSubscription = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/stripe/cancel-subscription`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to cancel subscription");
      }

      await response.json();

      setCurrentPlan("free");
      setIsPremium(false);
      setSubscriptionData({
        ...subscriptionData,
        type: "free",
        status: "canceled",
      });

      fetchSubscriptionDetails();
      alert("Your subscription has been canceled successfully.");
    } catch (err) {
      setError(err.message || "Failed to cancel subscription");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Formats a date string to a localized date format
   *
   * @function formatDate
   * @param {string|Date} date - Date to format
   * @returns {string} Formatted date string
   */
  const formatDate = (date) => {
    if (!date) return "";
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
   * @param {string} status - Subscription status
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

  /**
   * Renders a feature item with checkmark or x icon
   *
   * @function renderFeature
   * @param {string} text - Feature description text
   * @param {boolean} included - Whether the feature is included in the plan
   * @returns {JSX.Element} Rendered feature item
   */
  const renderFeature = (text, included) => (
    <div className="flex items-center mb-2">
      {included ? (
        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
      ) : (
        <XCircle className="mr-2 h-5 w-5 text-gray-400" />
      )}
      <span className={included ? "text-gray-800" : "text-gray-500"}>
        {text}
      </span>
    </div>
  );

  if (loading && !subscriptionData) {
    return (
      <div className="bg-white shadow rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
    );
  }

  if (error && !subscriptionData) {
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

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("status")}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "status"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Subscription Status
          </button>
          <button
            onClick={() => setActiveTab("plans")}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "plans"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Available Plans
          </button>
        </nav>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "status" && subscriptionData && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
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
                  {subscriptionData.type} Plan
                </span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  subscriptionData.status
                )}`}
              >
                {subscriptionData.status.replace("_", " ").toUpperCase()}
              </span>
            </div>

            {subscriptionData.type === "premium" && (
              <>
                <div className="flex items-center mt-6 text-sm">
                  <Clock className="h-4 w-4 text-gray-400 mr-2" />
                  <span>
                    {subscriptionData.status === "canceled"
                      ? `Access until ${formatDate(
                          subscriptionData.currentPeriodEnd
                        )}`
                      : `Renews on ${formatDate(
                          subscriptionData.currentPeriodEnd
                        )}`}
                  </span>
                </div>

                {subscriptionData.status === "active" && (
                  <div className="mt-1 text-sm text-gray-500">
                    You will be charged {subscriptionData.renewalAmount} on
                    renewal
                  </div>
                )}

                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Your Premium Features
                  </h4>
                  <ul className="space-y-1">
                    {subscriptionData.features.map((feature, index) => (
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

            {subscriptionData.type === "free" && (
              <div className="mt-4 bg-gray-50 rounded-md p-4">
                <p className="text-sm text-gray-600">
                  Upgrade to Premium to unlock all features including unlimited
                  job applications, 500+ connections, and unlimited messaging.
                </p>
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-6 py-4">
            <button
              onClick={() => setActiveTab("plans")}
              className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
            >
              {subscriptionData.type === "premium" &&
              subscriptionData.status === "active"
                ? "Manage subscription"
                : "View subscription plans"}
            </button>
          </div>
        </div>
      )}

      {activeTab === "plans" && (
        <>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Choose Your Plan
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Select the plan that best fits your professional networking needs
            </p>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div
              className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                currentPlan === "free" ? "ring-2 ring-indigo-600" : ""
              }`}
            >
              <div className="px-6 py-8 bg-gray-50 sm:p-10 sm:pb-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-medium text-gray-900">
                    Free (Basic) Plan
                  </h3>
                  {currentPlan === "free" && (
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      Current Plan
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-baseline text-3xl font-extrabold">
                  $0
                  <span className="ml-1 text-xl font-medium text-gray-500">
                    /mo
                  </span>
                </div>
                <p className="mt-5 text-lg text-gray-500">
                  Start your professional journey with basic networking
                  capabilities.
                </p>
              </div>
              <div className="px-6 pt-6 pb-8 sm:p-10 sm:pt-6">
                <ul role="list" className="space-y-4">
                  {renderFeature("Create a professional profile", true)}
                  {renderFeature("Connect with up to 50 people", true)}
                  {renderFeature("Apply to 5 jobs per month", true)}
                  {renderFeature("Send 5 messages per day", true)}
                  {renderFeature("Unlimited job applications", false)}
                  {renderFeature("Connect with 500+ people", false)}
                  {renderFeature("Message unlimited connections", false)}
                </ul>

                <div className="mt-8">
                  <button
                    disabled={currentPlan === "free" || loading}
                    onClick={handleCancelSubscription}
                    className={`w-full bg-gray-200 text-gray-600 py-3 px-4 rounded-md font-medium ${
                      currentPlan !== "free" && !loading
                        ? "hover:bg-gray-300"
                        : "cursor-not-allowed"
                    }`}
                  >
                    {currentPlan === "free"
                      ? "Current Plan"
                      : loading
                      ? "Processing..."
                      : "Downgrade to Free"}
                  </button>
                </div>
              </div>
            </div>

            <div
              className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                currentPlan === "premium" ? "ring-2 ring-indigo-600" : ""
              }`}
            >
              <div className="px-6 py-8 bg-indigo-50 sm:p-10 sm:pb-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-medium text-indigo-900">
                    Premium Plan
                  </h3>
                  {currentPlan === "premium" && (
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      Current Plan
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-baseline text-3xl font-extrabold text-indigo-900">
                  $20.00
                  <span className="ml-1 text-xl font-medium text-indigo-500">
                    /mo
                  </span>
                </div>
                <p className="mt-5 text-lg text-indigo-700">
                  Unlock your full professional potential with premium features.
                </p>
              </div>
              <div className="px-6 pt-6 pb-8 sm:p-10 sm:pt-6">
                <ul role="list" className="space-y-4">
                  {renderFeature("Create a professional profile", true)}
                  {renderFeature("Connect with up to 500+ people", true)}
                  {renderFeature("Unlimited job applications", true)}
                  {renderFeature("Message unlimited connections", true)}
                  {renderFeature("Featured profile in searches", true)}
                  {renderFeature("Priority application status", true)}
                  {renderFeature("Advanced analytics dashboard", true)}
                </ul>

                <div className="mt-8">
                  {currentPlan === "premium" ? (
                    <button
                      onClick={handleCancelSubscription}
                      disabled={loading}
                      className="w-full bg-red-600 text-white py-3 px-4 rounded-md font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300"
                    >
                      {loading ? "Processing..." : "Cancel Subscription"}
                    </button>
                  ) : (
                    <button
                      onClick={handleSubscribe}
                      disabled={loading}
                      className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
                    >
                      {loading ? "Processing..." : "Upgrade to Premium"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-gray-600">
              All plans include access to our community forums and customer
              support.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default SubscriptionPlans;
