import React, { useState } from 'react';

function App() {
  const [emailOrPhone, setEmailOrPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your password reset logic here
    console.log('Email or Phone:', emailOrPhone);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between">
      {/* Header */}
      <header className="w-full py-4 flex justify-between items-center px-6">
        <img
          src="./Images/linkedin.png" // Ensure this path is correct for your project
          alt="LinkedIn Logo"
          className="h-8"
        />
        <div className="flex space-x-4"> {/* Wrap buttons in a div with flex and space-x-4 for spacing */}
          <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700">
            Sign in
          </button>
          <button className="text-blue-600 px-4 py-2 rounded-full hover:bg-gray-100">
            Join now
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-4">Forgot password</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="Email or Phone"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <p className="text-sm text-gray-600">
              We'll send a verification code to this email or phone number if it matches an existing LinkedIn account.
            </p>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700"
            >
              Next
            </button>
            <button
              type="button"
              className="w-full text-blue-600 hover:underline"
              onClick={() => window.history.back()}
            >
              Back
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-gray-500 text-sm">
        <div className="space-x-4">
          <a href="#" className="hover:underline">User Agreement</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Community Guidelines</a>
          <a href="#" className="hover:underline">Cookie Policy</a>
          <a href="#" className="hover:underline">Copyright Policy</a>
          <a href="#" className="hover:underline">Send Feedback</a>
          <select className="border-none bg-transparent">
            <option>Language</option>
          </select>
        </div>
        <p className="mt-2">LockedIn © 2025</p>
      </footer>
    </div>
  );
}

export default App;