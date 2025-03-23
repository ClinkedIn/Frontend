import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { server } from "../../../../mocks/server";
import "@testing-library/jest-dom/vitest";
const renderWithRouter = (ui) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("ForgotPasswordForm", () => {
  test("renders correctly", () => {
    console.log("TEST: Checking if ForgotPasswordForm renders correctly");
    renderWithRouter(<ForgotPasswordForm />);
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email or phone/i)).toBeInTheDocument();
    expect(screen.getByText(/next/i)).toBeInTheDocument();
  });

  test("displays error for empty input", () => {
    console.log("TEST: Verifying error message for empty input field");
    renderWithRouter(<ForgotPasswordForm />);
    const input = screen.getByLabelText(/email or phone/i);
    fireEvent.blur(input);
    expect(
      screen.getByText(/please enter your email or phone number/i)
    ).toBeInTheDocument();
  });

  test("displays error for invalid email format", () => {
    console.log("TEST: Checking validation for invalid email format");
    renderWithRouter(<ForgotPasswordForm />);
    const input = screen.getByTestId("email-input");
    const invalidEmail = "invalid-email";
    fireEvent.change(input, { target: { value: invalidEmail } });
    fireEvent.click(screen.getByText(/next/i));
    expect(
      screen.getByText(/please enter a valid email or phone number/i)
    ).toBeInTheDocument();
    console.log(
      "TEST COMPLETED: Invalid email format test with email:",
      invalidEmail
    );
  });

  test("shows API error message for non-existent user", async () => {
    renderWithRouter(<ForgotPasswordForm />);

    const nonExistentEmail = "nonexistent@example.com";
    const input = screen.getByTestId("email-input");
    fireEvent.change(input, { target: { value: nonExistentEmail } });

    fireEvent.click(screen.getByText(/next/i));

    await waitFor(() => {
      const errorElement = screen.getByTestId("error-message");
      expect(errorElement).toBeInTheDocument();
      expect(errorElement.textContent).toBe("User not found.");
    });

    console.log("TEST COMPLETED: API error test with email:", nonExistentEmail);
  });

  test("successful submission with valid user", async () => {
    renderWithRouter(<ForgotPasswordForm />);

    const validEmail = "mohamedayman@gmail.com";
    const input = screen.getByTestId("email-input");
    fireEvent.change(input, { target: { value: validEmail } });

    fireEvent.click(screen.getByText(/next/i));

    await waitFor(() => {
      const errorElement = screen.queryByTestId("error-message");
      expect(errorElement).not.toBeInTheDocument();
    });

    console.log(
      "TEST COMPLETED: Successful submission test with email:",
      validEmail
    );
  });
});
