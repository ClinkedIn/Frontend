// import React, { useState, useEffect } from 'react';
// import { CheckCircle, XCircle } from 'lucide-react';

// const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-api-url.com';

// // console.log("Base URL:", BASE_URL); // Debugging line to check the base URL
// const SubscriptionPlans = () => {
//   const [currentPlan, setCurrentPlan] = useState('free'); // 'free' or 'premium'
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Fetch the user's current subscription status on component mount
//   useEffect(() => {
//     const fetchSubscriptionStatus = async () => {
//       try {
//         // In a real app, you would fetch the user's subscription status here
//         // const response = await fetch(`${BASE_URL}/api/user/subscription`);
//         // const data = await response.json();
//         // setCurrentPlan(data.subscriptionType);
//       } catch (err) {
//         setError("Failed to fetch subscription status");
//         console.error(err);
//       }
//     };

//     fetchSubscriptionStatus();
//   }, []);

//   const handleSubscribe = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch(`${BASE_URL}/stripe/create-checkout-session`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         credentials: 'include',
//         body: JSON.stringify({
//           paymentMode: 'subscription'
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to create checkout session');
//       }

//       const { url } = await response.json();

//       // Redirect to Stripe checkout
//       window.location.href = url;
//     } catch (err) {
//       setError('Failed to initiate subscription process');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancelSubscription = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch(`${BASE_URL}/api/stripe/cancel-subscription`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming you store auth token in localStorage
//         }
//       });

//       if (!response.ok) {
//         throw new Error('Failed to cancel subscription');
//       }

//       // Update the UI to reflect cancellation
//       setCurrentPlan('free');
//       alert('Your subscription has been canceled successfully.');
//     } catch (err) {
//       setError('Failed to cancel subscription');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderFeature = (text, included) => (
//     <div className="flex items-center mb-2">
//       {included ?
//         <CheckCircle className="mr-2 h-5 w-5 text-green-500" /> :
//         <XCircle className="mr-2 h-5 w-5 text-gray-400" />
//       }
//       <span className={included ? "text-gray-800" : "text-gray-500"}>{text}</span>
//     </div>
//   );

//   return (
//     <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
//       <div className="text-center">
//         <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
//           Choose Your Plan
//         </h2>
//         <p className="mt-4 text-xl text-gray-600">
//           Select the plan that best fits your professional networking needs
//         </p>
//       </div>

//       {error && (
//         <div className="mt-6 bg-red-50 p-4 rounded-md">
//           <div className="flex">
//             <div className="flex-shrink-0">
//               <XCircle className="h-5 w-5 text-red-400" />
//             </div>
//             <div className="ml-3">
//               <p className="text-sm text-red-700">{error}</p>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="mt-12 grid gap-8 lg:grid-cols-2">
//         {/* Free Plan */}
//         <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${currentPlan === 'free' ? 'ring-2 ring-indigo-600' : ''}`}>
//           <div className="px-6 py-8 bg-gray-50 sm:p-10 sm:pb-6">
//             <div className="flex items-center justify-between">
//               <h3 className="text-2xl font-medium text-gray-900">Free (Basic) Plan</h3>
//               {currentPlan === 'free' && (
//                 <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
//                   Current Plan
//                 </span>
//               )}
//             </div>
//             <div className="mt-4 flex items-baseline text-3xl font-extrabold">
//               $0
//               <span className="ml-1 text-xl font-medium text-gray-500">/mo</span>
//             </div>
//             <p className="mt-5 text-lg text-gray-500">
//               Start your professional journey with basic networking capabilities.
//             </p>
//           </div>
//           <div className="px-6 pt-6 pb-8 sm:p-10 sm:pt-6">
//             <ul role="list" className="space-y-4">
//               {renderFeature("Create a professional profile", true)}
//               {renderFeature("Connect with up to 50 people", true)}
//               {renderFeature("Apply to 5 jobs per month", true)}
//               {renderFeature("Send 5 messages per day", true)}
//               {renderFeature("Unlimited job applications", false)}
//               {renderFeature("Connect with 500+ people", false)}
//               {renderFeature("Message unlimited connections", false)}
//             </ul>

//             <div className="mt-8">
//               <button
//                 disabled={currentPlan === 'free'}
//                 className={`w-full bg-gray-200 text-gray-600 py-3 px-4 rounded-md font-medium ${currentPlan !== 'free' ? 'hover:bg-gray-300' : ''}`}
//               >
//                 {currentPlan === 'free' ? 'Current Plan' : 'Downgrade to Free'}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Premium Plan */}
//         <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${currentPlan === 'premium' ? 'ring-2 ring-indigo-600' : ''}`}>
//           <div className="px-6 py-8 bg-indigo-50 sm:p-10 sm:pb-6">
//             <div className="flex items-center justify-between">
//               <h3 className="text-2xl font-medium text-indigo-900">Premium Plan</h3>
//               {currentPlan === 'premium' && (
//                 <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
//                   Current Plan
//                 </span>
//               )}
//             </div>
//             <div className="mt-4 flex items-baseline text-3xl font-extrabold text-indigo-900">
//               $9.99
//               <span className="ml-1 text-xl font-medium text-indigo-500">/mo</span>
//             </div>
//             <p className="mt-5 text-lg text-indigo-700">
//               Unlock your full professional potential with premium features.
//             </p>
//           </div>
//           <div className="px-6 pt-6 pb-8 sm:p-10 sm:pt-6">
//             <ul role="list" className="space-y-4">
//               {renderFeature("Create a professional profile", true)}
//               {renderFeature("Connect with up to 500+ people", true)}
//               {renderFeature("Unlimited job applications", true)}
//               {renderFeature("Message unlimited connections", true)}
//               {renderFeature("Featured profile in searches", true)}
//               {renderFeature("Priority application status", true)}
//               {renderFeature("Advanced analytics dashboard", true)}
//             </ul>

//             <div className="mt-8">
//               {currentPlan === 'premium' ? (
//                 <button
//                   onClick={handleCancelSubscription}
//                   disabled={loading}
//                   className="w-full bg-red-600 text-white py-3 px-4 rounded-md font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                 >
//                   {loading ? 'Processing...' : 'Cancel Subscription'}
//                 </button>
//               ) : (
//                 <button
//                   onClick={handleSubscribe}
//                   disabled={loading}
//                   className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                 >
//                   {loading ? 'Processing...' : 'Upgrade to Premium'}
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="mt-10 text-center">
//         <p className="text-gray-600">
//           All plans include access to our community forums and customer support.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SubscriptionPlans;

import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://your-api-url.com";

const SubscriptionPlans = () => {
  const [currentPlan, setCurrentPlan] = useState("free"); // 'free' or 'premium'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);

  // Fetch the user's current subscription status on component mount
  // useEffect(() => {
  //   const fetchSubscriptionStatus = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await fetch(`${BASE_URL}/api/user/subscription`, {
  //         credentials: 'include',
  //         headers: {
  //           'Authorization': `Bearer ${localStorage.getItem('token')}`
  //         }
  //       });

  //       if (!response.ok) {
  //         throw new Error('Failed to fetch subscription status');
  //       }

  //       const data = await response.json();
  //       setCurrentPlan(data.subscriptionType || 'free');
  //       if (data.subscriptionType === 'premium') {
  //         setSubscriptionInfo({
  //           expiryDate: data.expiryDate,
  //           planType: data.planType
  //         });
  //       }
  //     } catch (err) {
  //       setError("Failed to fetch subscription status");
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchSubscriptionStatus();
  // }, []);

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
        // Successful checkout session creation
        window.location.href = data.url;
      } else if (response.status === 400) {
        // User already has an active subscription
        setCurrentPlan(data.subscription.planType);
        setSubscriptionInfo({
          expiryDate: data.subscription.expiryDate,
          planType: data.subscription.planType,
        });
        setError(data.message);
      } else {
        // Handle 500 or other errors
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (err) {
      setError(err.message || "Failed to initiate subscription process");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

      const data = await response.json();

      // Update the UI to reflect cancellation
      setCurrentPlan("free");
      setSubscriptionInfo(null);
      alert("Your subscription has been canceled successfully.");
    } catch (err) {
      setError(err.message || "Failed to cancel subscription");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Choose Your Plan
        </h2>
        <p className="mt-4 text-xl text-gray-600">
          Select the plan that best fits your professional networking needs
        </p>
      </div>

      {loading && (
        <div className="mt-6 bg-blue-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Loading subscription information...
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 bg-red-50 p-4 rounded-md">
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

      {currentPlan === "premium" && subscriptionInfo && (
        <div className="mt-6 bg-green-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                You are currently subscribed to the {subscriptionInfo.planType}{" "}
                plan.
                {subscriptionInfo.expiryDate && (
                  <span>
                    {" "}
                    Your subscription is valid until{" "}
                    {formatDate(subscriptionInfo.expiryDate)}.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {/* Free Plan */}
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
                  currentPlan !== "free" && !loading ? "hover:bg-gray-300" : ""
                }`}
              >
                {currentPlan === "free" ? "Current Plan" : "Downgrade to Free"}
              </button>
            </div>
          </div>
        </div>

        {/* Premium Plan */}
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
              $9.99
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
          All plans include access to our community forums and customer support.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
