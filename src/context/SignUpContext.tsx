import React, { createContext, useContext, useState } from "react";

// Define the shape of the signup data
interface SignupData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  location?: string;
}

interface SignupContextProps {
  signupData: SignupData;
  setSignupData: React.Dispatch<React.SetStateAction<SignupData>>;
}

// Create Context with default values
const SignupContext = createContext<SignupContextProps | undefined>(undefined);

export const SignupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [signupData, setSignupData] = useState<SignupData>({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  return (
    <SignupContext.Provider value={{ signupData, setSignupData }}>
      {children}
    </SignupContext.Provider>
  );
};

export const useSignup = () => {
  const context = useContext(SignupContext);
  if (!context) {
    throw new Error("useSignup must be used within a SignupProvider");
  }
  return context;
};
