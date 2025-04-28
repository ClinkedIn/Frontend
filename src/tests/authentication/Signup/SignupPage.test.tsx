import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignupPage from "../../../components/authentication/SignUp/SignUpPage";
import { useSignup } from "../../../context/SignUpContext";
import { useAuth } from "../../../context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
// import { signInWithPopup } from "../../../../firebase";
// import { toast } from "react-hot-toast";

// Mock the context hooks
vi.mock("../../../context/SignUpContext", () => ({
  useSignup: vi.fn(),
}));

vi.mock("../../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

// Mock Firebase functions
vi.mock("../../../../firebase", () => {
  const signInWithPopup = vi.fn();
  return {
    auth: {},
    provider: {},
    signInWithPopup,
  };
});

vi.mock("react-hot-toast", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-hot-toast")>();
  return {
    ...actual,
    toast: {
      error: vi.fn((message) => {
        console.log(`Toast error: ${message}`); // Log the message for debugging
      }),
      success: vi.fn(),
    },
    Toaster: ({ children }: { children?: React.ReactNode }) => (
      <div data-testid="toaster">{children}</div>
    ),
  };
});

describe("SignupPage Component", () => {
  const mockSetSignupData = vi.fn();
  const mockSetAuthToken = vi.fn();

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Mock the useSignup hook
    (useSignup as jest.Mock).mockReturnValue({
      signupData: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      },
      setSignupData: mockSetSignupData,
    });

    // Mock the useAuth hook
    (useAuth as jest.Mock).mockReturnValue({
      setAuthToken: mockSetAuthToken,
    });
  });

  it("renders all form fields and buttons", () => {
    render(
      <BrowserRouter>
        <SignupPage />
      </BrowserRouter>
    );

    // Check if all form fields are rendered
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /agree & join/i })).toBeInTheDocument();
    expect(screen.getByText(/already on linkedin/i)).toBeInTheDocument();
  });

  it("validates email input and shows error message for invalid email", async () => {
    render(
      <BrowserRouter>
        <SignupPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });

    // Trigger validation by blurring the input
    fireEvent.blur(emailInput);

    // Check if error message is displayed
    expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
  });

  it("validates password input and shows error message for weak password", async () => {
    render(
      <BrowserRouter>
        <SignupPage />
      </BrowserRouter>
    );

    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(passwordInput, { target: { value: "weak" } });

    // Trigger validation by blurring the input
    fireEvent.blur(passwordInput);

    // Check if error message is displayed
    expect(
      await screen.findByText(
        /password must be at least 8 characters long, include an uppercase letter, a number, and a special character/i
      )
    ).toBeInTheDocument();
  });

  it("disables the submit button when there are validation errors", async () => {
    render(
      <BrowserRouter>
        <SignupPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /agree & join/i });

    // Enter invalid email and weak password
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.change(passwordInput, { target: { value: "weak" } });

    // Trigger validation
    fireEvent.blur(emailInput);
    fireEvent.blur(passwordInput);

    // Check if the submit button is disabled
    expect(submitButton).toBeDisabled();
  });

  // it("calls the API and displays success message on successful signup", async () => {
  //   // Mock the fetch API response
  //   global.fetch = vi.fn(() =>
  //     Promise.resolve({
  //       ok: true,
  //       json: () =>
  //         Promise.resolve({
  //           authToken: "mock-token",
  //           confirmationLink: "http://example.com/confirm",
  //         }),
  //     })
  //   ) as any;
  
  //   render(
  //     <BrowserRouter>
  //       <SignupPage />
  //     </BrowserRouter>
  //   );
  
  //   // Fill out the form fields
  //   const firstNameInput = screen.getByLabelText(/first name/i);
  //   const lastNameInput = screen.getByLabelText(/last name/i);
  //   const emailInput = screen.getByLabelText(/email/i);
  //   const passwordInput = screen.getByLabelText(/password/i);
  
  //   fireEvent.change(firstNameInput, { target: { value: "John" } });
  //   fireEvent.change(lastNameInput, { target: { value: "Doe" } });
  //   fireEvent.change(emailInput, { target: { value: "john.doe@example.com" } });
  //   fireEvent.change(passwordInput, { target: { value: "StrongPass1!" } });
  
  //   // Complete ReCAPTCHA (mocking the ref)
  //   const recaptchaRefMock = { current: { getValue: vi.fn().mockReturnValue("mock-recaptcha-token") } };
  //   vi.spyOn(React, "useRef").mockReturnValue(recaptchaRefMock as any);
  
  //   // Submit the form
  //   const submitButton = screen.getByRole("button", { name: /agree & join/i });
  //   fireEvent.click(submitButton);
  
  //   // Wait for the success toast message to appear
  //   await waitFor(() => {
  //     expect(toast.success).toHaveBeenCalledWith(
  //       "Signup successful! Check your email for confirmation."
  //     );
  //   });
  
  //   // Verify that the token was saved in context
  //   expect(mockSetAuthToken).toHaveBeenCalledWith("mock-token");
  
  //   // Verify navigation to /feed
  //   expect(navigator).toHaveBeenCalledWith("/feed");
  // });

  // it("displays an error message when the API call fails", async () => {
  //   // Mock the fetch API response to simulate an error
  //   global.fetch = vi.fn(() =>
  //     Promise.resolve({
  //       ok: false,
  //       status: 400,
  //       text: () => Promise.resolve("Invalid credentials"),
  //     })
  //   ) as any;

  //   render(
  //     <BrowserRouter>
  //       <SignupPage />
  //     </BrowserRouter>
  //   );

  //   const firstNameInput = screen.getByLabelText(/first name/i);
  //   const lastNameInput = screen.getByLabelText(/last name/i);
  //   const emailInput = screen.getByLabelText(/email/i);
  //   const passwordInput = screen.getByLabelText(/password/i);
  //   const submitButton = screen.getByRole("button", { name: /agree & join/i });

  //   // Fill out the form with valid data
  //   fireEvent.change(firstNameInput, { target: { value: "John" } });
  //   fireEvent.change(lastNameInput, { target: { value: "Doe" } });
  //   fireEvent.change(emailInput, { target: { value: "john.doe@example.com" } });
  //   fireEvent.change(passwordInput, { target: { value: "StrongPass1!" } });

  //   // Submit the form
  //   fireEvent.click(submitButton);

  //   // Wait for the error message to appear
  //   await waitFor(() => {
  //     expect(screen.getByText(/signup failed/i)).toBeInTheDocument();
  //   });
  // });

  // it("handles Google sign-up failure and displays an error message", async () => {
  //   // Mock the signInWithPopup function to throw an error
  //   const mockSignInWithPopup = vi.fn().mockRejectedValue(new Error("Google signup failed"));
  //   vi.mocked(signInWithPopup).mockImplementation(mockSignInWithPopup);

  //   render(
  //     <BrowserRouter>
  //       <SignupPage />
  //     </BrowserRouter>
  //   );

  //   const googleButton = screen.getByRole("button", { name: /sign up with google/i });

  //   // Click the Google sign-up button
  //   fireEvent.click(googleButton);

  //   // Wait for the error message to appear
  //   await waitFor(() => {
  //     expect(screen.getByText(/google signup failed/i)).toBeInTheDocument();
  //   });
  // });
});