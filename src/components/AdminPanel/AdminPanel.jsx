import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

export default function AdminPanel() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  // Function to handle nav item click and update active state
  const handleNavClick = (page) => {
    setActivePage(page);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Top navigation bar */}
      <nav className="bg-white shadow px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-blue-700">Admin Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              ></path>
            </svg>
          </button>
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            A
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Collapsible Sidebar navigation */}
        <div
          className={`bg-white shadow-md h-screen pt-6 transition-all duration-300 ease-in-out ${
            sidebarExpanded ? "w-64" : "w-16"
          }`}
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
        >
          <ul className="space-y-2">
            <li>
              <Link
                to=""
                className={`flex items-center py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 ${
                  activePage === "dashboard"
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : ""
                } ${sidebarExpanded ? "px-4" : "justify-center px-2"}`}
                onClick={() => handleNavClick("dashboard")}
              >
                <svg
                  className={`w-5 h-5 ${sidebarExpanded ? "mr-3" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  ></path>
                </svg>
                {sidebarExpanded && <span>Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link
                to="reported-posts"
                className={`flex items-center py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 ${
                  activePage === "reported-posts"
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : ""
                } ${sidebarExpanded ? "px-4" : "justify-center px-2"}`}
                onClick={() => handleNavClick("reported-posts")}
              >
                <svg
                  className={`w-5 h-5 ${sidebarExpanded ? "mr-3" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  ></path>
                </svg>
                {sidebarExpanded && <span>Reported Posts</span>}
              </Link>
            </li>
            <li>
              <Link
                to="job-listing"
                className={`flex items-center py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 ${
                  activePage === "job-listing"
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : ""
                } ${sidebarExpanded ? "px-4" : "justify-center px-2"}`}
                onClick={() => handleNavClick("job-listing")}
              >
                <svg
                  className={`w-5 h-5 ${sidebarExpanded ? "mr-3" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
                {sidebarExpanded && <span>Job Listings</span>}
              </Link>
            </li>
            <li>
              <Link
                to="analytics"
                className={`flex items-center py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 ${
                  activePage === "analytics"
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : ""
                } ${sidebarExpanded ? "px-4" : "justify-center px-2"}`}
                onClick={() => handleNavClick("analytics")}
              >
                <svg
                  className={`w-5 h-5 ${sidebarExpanded ? "mr-3" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  ></path>
                </svg>
                {sidebarExpanded && <span>Analytics</span>}
              </Link>
            </li>
          </ul>
        </div>

        {/* Main content area */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
