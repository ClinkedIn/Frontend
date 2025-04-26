import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-api-url.com';

  useEffect(() => {
    const verifyPayment = async () => {
      // Get session_id from URL query params
      const queryParams = new URLSearchParams(location.search);
      const sessionId = queryParams.get('session_id');
      
      if (!sessionId) {
        setStatus('failed');
        setError('Invalid payment session');
        return;
      }
      
      try {
        // Verify the payment with your backend
        const response = await fetch(`${BASE_URL}/api/stripe/verify-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ sessionId })
        });
        
        if (!response.ok) {
          throw new Error('Payment verification failed');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setStatus('success');
        } else {
          setStatus('failed');
          setError(data.message || 'Payment could not be verified');
        }
      } catch (err) {
        console.error(err);
        setStatus('failed');
        setError('Failed to verify payment. Please contact support.');
      }
    };
    
    verifyPayment();
  }, [location.search, BASE_URL]);

  const redirectToDashboard = () => {
    navigate('/dashboard');
  };

  const redirectToSupport = () => {
    navigate('/support');
  };

  if (status === 'processing') {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <h2 className="mt-4 text-xl font-semibold text-gray-800">Processing Payment</h2>
          <p className="mt-2 text-gray-600">Please wait while we verify your payment...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-800">Payment Successful!</h2>
          <p className="mt-2 text-gray-600">
            Thank you for subscribing to the Premium Plan. Your account has been upgraded.
          </p>
          <div className="mt-6">
            <button
              onClick={redirectToDashboard}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <XCircle className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-gray-800">Payment Failed</h2>
        <p className="mt-2 text-gray-600">
          {error || 'There was an issue with your payment. Please try again.'}
        </p>
        <div className="mt-6 space-y-3">
          <button
            onClick={() => navigate('/subscription-plans')}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Try Again
          </button>
          <button
            onClick={redirectToSupport}
            className="w-full bg-white text-indigo-600 py-2 px-4 rounded-md font-medium border border-indigo-200 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;