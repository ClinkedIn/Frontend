import React, { createContext, useContext, useEffect, useState } from "react";

// Define the shape of the context
interface AuthContextType {
  authToken: string | null;
  userRole: string | null; // Add this line for the user's role
  setAuthToken: (token: string | null) => void;
  logout: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Provider component to wrap the app
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize authToken and userRole from localStorage
  const [authToken, setToken] = useState<string | null>(() => {
    return localStorage.getItem("authToken") || null;
  });

  const [userRole, setUserRole] = useState<string | null>(null);



  // Update localStorage whenever the token changes
  useEffect(() => {
    if (authToken) {
      localStorage.setItem("authToken", authToken);
    } else {
      localStorage.removeItem("authToken");
    }
  }, [authToken]);

  // Function to log out the user
  const logout = () => {
    setToken(null); // Clear the token in context
    setUserRole(null); // Clear the role
    localStorage.removeItem("authToken"); // Remove the token from localStorage
    localStorage.removeItem("refreshToken"); // Optionally remove refreshToken
  };

  const value: AuthContextType = {
    authToken,
    userRole, // Include the userRole in the context
    setAuthToken: setToken,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};