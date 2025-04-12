import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignupPage from "./SignUpPage";
import { Toaster } from "react-hot-toast";
import { MemoryRouter } from "react-router-dom";
import { SignupProvider } from "../../../context/SignUpContext";
import "@testing-library/jest-dom";

// Mocking necessary components and modules
vi.mock("../../../../firebase", () => ({
  auth: {},
  provider: {},
  signInWithPopup: vi.fn(),
}));

vi.mock("react-hot-toast", async () => {
  const actual = await vi.importActual("react-hot-toast");
  return {
    ...actual,
    toast: {
      error: vi.fn(),
      success: vi.fn(),
      // add others if needed
    },
    Toaster: () => <div data-testid="toaster" />,
  };
});

// Track reCAPTCHA completion state
let recaptchaCompleted = false;

vi.mock("react-google-recaptcha", () => ({
  __esModule: true,
  default: (props: any) => {
    return (
      <div
        data-testid="recaptcha"
        onClick={() => {
          recaptchaCompleted = true;
          props.onChange?.("dummy-token");
        }}
      />
    );
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  recaptchaCompleted = false;

  global.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    addListener: vi.fn(),
    removeListener: vi.fn(),
  }));

  vi.spyOn(console, "log").mockImplementation(() => {});
});

describe("SignupPage", () => {
  const setup = () => {
    return render(
      <SignupProvider>
        <MemoryRouter>
          <SignupPage />
          <Toaster />
        </MemoryRouter>
      </SignupProvider>
    );
  };

  it("renders the signup form with all elements", () => {
    setup();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /agree & join/i })).toBeInTheDocument();
    expect(screen.getByTestId("recaptcha")).toBeInTheDocument();
  });

  it("validates email format", async () => {
    setup();
    const user = userEvent.setup();
    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, "invalidemail");
    await user.tab();
    expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
  });

  it("validates password strength", async () => {
    setup();
    const user = userEvent.setup();
    const passwordInput = screen.getByLabelText(/password/i);
    await user.type(passwordInput, "weakpass");
    await user.tab();
    expect(screen.getByText(/password must be at least 8 characters long/i)).toBeInTheDocument();
  });

//   it("displays error when reCAPTCHA is not completed", async () => {
//     setup();
//     const user = userEvent.setup();
//     await user.click(screen.getByRole("button", { name: /agree & join/i }));
//     expect(await screen.findByText(/please complete the reCAPTCHA/i)).toBeInTheDocument();
//   });

//   it("displays error when fields are empty after reCAPTCHA is completed", async () => {
//     setup();
//     const user = userEvent.setup();
//     const recaptcha = screen.getByTestId("recaptcha");
//     await user.click(recaptcha); 
//     await user.click(screen.getByRole("button", { name: /agree & join/i }));
//     expect(await screen.findByText(/please fill in all fields/i)).toBeInTheDocument();
//   });

//   it("submits the form with valid data", async () => {
//     setup();
//     const user = userEvent.setup();

//     const emailInput = screen.getByLabelText(/email/i);
//     const passwordInput = screen.getByLabelText(/password/i);
//     const recaptcha = screen.getByTestId("recaptcha");
//     const submitButton = screen.getByRole("button", { name: /agree & join/i });

//     await user.type(emailInput, "test@example.com");
//     await user.type(passwordInput, "StrongPassword123");
//     await user.click(recaptcha); // simulate reCAPTCHA success
//     await user.click(submitButton);

//     expect(console.log).toHaveBeenCalled();
//   });
});
