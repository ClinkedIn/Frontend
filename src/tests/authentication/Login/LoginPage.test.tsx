import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../../../components/authentication/Login/LoginPage";
import { useAuth } from "../../../context/AuthContext";
import { QueryClient, QueryClientProvider, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { vi } from "vitest";
import { BrowserRouter } from "react-router-dom";

// Mock Context Hooks
vi.mock("../../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

// Mock Axios
vi.mock("axios");

// Mock Navigation
const navigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

// Create a QueryClient and Wrapper for testing
const queryClient = new QueryClient();

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe("LoginPage Component", () => {
  const mockSetAuthToken = vi.fn();

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Mock the useAuth hook
    (useAuth as jest.Mock).mockReturnValue({
      setAuthToken: mockSetAuthToken,
    });
  });

  it("renders all form fields and buttons", () => {
    render(<LoginPage />, { wrapper: Wrapper });

    // Check if all form fields are rendered
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/new to linkedin/i)).toBeInTheDocument();
  });

  it("validates email input and shows error message for empty email", async () => {
    render(<LoginPage />, { wrapper: Wrapper });

    const submitButton = screen.getByRole("button", { name: /sign in/i });
    fireEvent.click(submitButton);

    // Check if error message is displayed
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
  });

  it("validates password input and shows error message for empty password", async () => {
    render(<LoginPage />, { wrapper: Wrapper });

    const emailInput = screen.getByPlaceholderText(/email/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    // Check if error message is displayed
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

//   it("disables the submit button during API call", async () => {
//     const mockMutate = vi.fn();
//     (useMutation as jest.Mock).mockReturnValue({
//       mutate: mockMutate,
//       isPending: true,
//     });

//     render(<LoginPage />, { wrapper: Wrapper });

//     const submitButton = screen.getByRole("button", { name: /sign in/i });
//     expect(submitButton).toBeDisabled();
//   });

//   it("calls the API and displays success message on successful login", async () => {
//     const mockMutate = vi.fn();
//     (useMutation as jest.Mock).mockReturnValue({
//       mutate: mockMutate,
//       isSuccess: true,
//       isError: false,
//     });

//     render(<LoginPage />, { wrapper: Wrapper });

//     const emailInput = screen.getByPlaceholderText(/email/i);
//     const passwordInput = screen.getByPlaceholderText(/password/i);
//     const submitButton = screen.getByRole("button", { name: /sign in/i });

//     fireEvent.change(emailInput, { target: { value: "test@example.com" } });
//     fireEvent.change(passwordInput, { target: { value: "StrongPass1!" } });
//     fireEvent.click(submitButton);

//     // Wait for the success toast message to appear
//     await waitFor(() => {
//       expect(mockSetAuthToken).toHaveBeenCalledWith(expect.any(String));
//     });

//     // Verify navigation to /feed
//     expect(navigate).toHaveBeenCalledWith("/feed");
//   });

//   it("displays an error message when the API call fails", async () => {
//     const mockMutate = vi.fn();
//     (useMutation as jest.Mock).mockReturnValue({
//       mutate: mockMutate,
//       isSuccess: false,
//       isError: true,
//       error: { response: { status: 404, data: { error: "User not found" } } },
//     });

//     render(<LoginPage />, { wrapper: Wrapper });

//     const emailInput = screen.getByPlaceholderText(/email/i);
//     const passwordInput = screen.getByPlaceholderText(/password/i);
//     const submitButton = screen.getByRole("button", { name: /sign in/i });

//     fireEvent.change(emailInput, { target: { value: "invalid@example.com" } });
//     fireEvent.change(passwordInput, { target: { value: "wrongPassword" } });
//     fireEvent.click(submitButton);

//     // Wait for the error message to appear
//     await waitFor(() => {
//       expect(screen.getByText(/user not found/i)).toBeInTheDocument();
//     });
//   });

//   it("handles Google sign-up failure and displays an error message", async () => {
//     render(<LoginPage />, { wrapper: Wrapper });

//     const googleButton = screen.getByRole("button", { name: /continue with google/i });

//     // Simulate a Google sign-up failure
//     fireEvent.click(googleButton);

//     // Wait for the error message to appear
//     await waitFor(() => {
//       expect(screen.getByText(/google signup failed/i)).toBeInTheDocument();
//     });
//   });
});