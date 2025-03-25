import React, { createContext, useContext, useState } from "react";

// Define the shape of the signup data
interface SignupData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  location?: string;
  jobTitle?: string;
  employmentType?: string;
  company?: string;
  isStudent?: boolean;
  school?: string;
  startYear?: string;
  endYear?: string;
  over16?: boolean;
  dobDay?: string;
  dobMonth?: string;
  dobYear?: string;
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
    location: "",
    jobTitle: "",
    employmentType: "",
    company: "",
    isStudent: false,
    school: "",
    startYear: "",
    endYear: "",
    over16: true,
    dobDay: "",
    dobMonth: "",
    dobYear: "",
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
