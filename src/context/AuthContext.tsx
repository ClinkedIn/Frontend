import React, { createContext, useContext, useEffect, useState } from "react";
import { a } from "vitest/dist/chunks/suite.d.FvehnV49.js";
import axios from "axios";
// Define the shape of the context
/**
 * Represents the authentication context type used to manage authentication state.
 *
 * @property {string | null} authToken - The authentication token for the current user.
 *                                       It is `null` if the user is not authenticated.
 * @property {string | null} userRole - The role of the current user.
 *                                      It is `null` if the user role is not defined.
 * @property {(token: string | null) => void} setAuthToken - A function to update the authentication token.
 *                                                           Pass `null` to clear the token.
 * @property {() => void} logout - A function to log out the user and clear authentication data.
 */
interface AuthContextType {
  authToken: string | null;
  userRole: string | null; // User role
  setAuthToken: (token: string | null) => void;
  logout: () => Promise<void>;
}

// Create the context
/**
 * Creates a React context for authentication.
 *
 * This context is used to provide and consume authentication-related
 * data and functionality throughout the application. The context
 * is initialized with a default value of `undefined`, which means
 * it must be provided a value by a corresponding `AuthContext.Provider`.
 *
 * @type {React.Context<AuthContextType | undefined>}
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Provider component to wrap the app
/**
 * AuthProvider is a React functional component that provides authentication context
 * to its child components. It manages the authentication token and user role,
 * and synchronizes the token with localStorage.
 *
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The child components that will have access
 * to the authentication context.
 *
 * @returns {JSX.Element} A context provider component that wraps its children
 * with authentication-related state and functions.
 *
 * @remarks
 * - The `authToken` state is initialized from localStorage and is updated whenever
 *   it changes.
 * - The `logout` function clears the authentication token and user role from the context.
 * - The context value includes the `authToken`, `userRole`, `setAuthToken`, and `logout` function.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize authToken and userRole from localStorage
  const [authToken, setAuthToken] = useState<string | null>(() =>
    localStorage.getItem("authToken")
  );
  const [userRole, setUserRole] = useState<string | null>(null);

  // Update localStorage whenever the token changes
  useEffect(() => {
    if (authToken) {
      localStorage.setItem("authToken", authToken);
    } else {
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken"); // Optionally remove refreshToken
    }
  }, [authToken]);

  const logout = async () => {
    try {
      const response = await api.post("/user/logout", { authToken });
      console.log("Logout response:", response.data);
    } catch (error) {
      console.error("Logout API call failed:", error);
      localStorage.clear();
      setAuthToken(null);
      setUserRole(null);
    }
  };
  // Context value
  const contextValue: AuthContextType = {
    authToken,
    userRole,
    setAuthToken,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
