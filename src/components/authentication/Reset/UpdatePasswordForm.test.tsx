import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UpdatePasswordForm from "./UpdatePasswordForm";
import "@testing-library/jest-dom";

vi.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: vi.fn(() => <div data-testid="mock-icon" />),
}));

vi.mock("../../Button", () => ({
  default: vi.fn(({ children, onClick, type, className, id }) => (
    <button
      type={type}
      className={className}
      id={id}
      onClick={onClick}
      data-testid="mock-button"
    >
      {children}
    </button>
  )),
}));

describe("UpdatePasswordForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    console.log = vi.fn();
  });

  it("renders the form with all expected elements", () => {
    render(<UpdatePasswordForm />);

    // Check header elements
    expect(screen.getByText("Change Password")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Create a new password that is at least 8 characters long."
      )
    ).toBeInTheDocument();

    // Check form fields
    expect(
      screen.getByLabelText(/Type your current password/)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Type your new password/)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Retype your new password/)
    ).toBeInTheDocument();

    // Check for the save button
    expect(screen.getByTestId("mock-button")).toBeInTheDocument();
    expect(screen.getByText("Save Password")).toBeInTheDocument();

    // Check for back button
    expect(screen.getByText("Back")).toBeInTheDocument();
  });

  it("updates form data when inputs change", async () => {
    const user = userEvent.setup();
    render(<UpdatePasswordForm />);

    // Get form inputs
    const currentPasswordInput = screen.getByLabelText(
      /Type your current password/
    );
    const newPasswordInput = screen.getByLabelText(/Type your new password/);
    const confirmPasswordInput = screen.getByLabelText(
      /Retype your new password/
    );

    // Fill in the form
    await user.type(currentPasswordInput, "CurrentPassword123");
    await user.type(newPasswordInput, "NewPassword123");
    await user.type(confirmPasswordInput, "NewPassword123");

    // Check if inputs have the correct values
    expect(currentPasswordInput).toHaveValue("CurrentPassword123");
    expect(newPasswordInput).toHaveValue("NewPassword123");
    expect(confirmPasswordInput).toHaveValue("NewPassword123");
  });

  it("shows validation errors for short passwords", async () => {
    const user = userEvent.setup();
    render(<UpdatePasswordForm />);

    // Get form inputs
    const newPasswordInput = screen.getByLabelText(/Type your new password/);
    const confirmPasswordInput = screen.getByLabelText(
      /Retype your new password/
    );

    // Enter short passwords
    await user.type(newPasswordInput, "short");
    await user.click(document.body); // trigger blur event

    // Check for error message
    expect(
      screen.getByText(
        "Your password is too short. It should be at least 8 characters long"
      )
    ).toBeInTheDocument();

    // Test confirm password field
    await user.type(confirmPasswordInput, "short");
    await user.click(document.body); // trigger blur event

    // Check for error message on confirm password
    const errorMessages = screen.getAllByText(
      "Your password is too short. It should be at least 8 characters long"
    );
    expect(errorMessages.length).toBe(2);
  });

  it("shows validation error when passwords don't match", async () => {
    const user = userEvent.setup();
    render(<UpdatePasswordForm />);

    // Get form inputs
    const newPasswordInput = screen.getByLabelText(/Type your new password/);
    const confirmPasswordInput = screen.getByLabelText(
      /Retype your new password/
    );

    // Enter different passwords
    await user.type(newPasswordInput, "Password123");
    await user.type(confirmPasswordInput, "DifferentPassword123");
    await user.click(document.body); // trigger blur event

    // Check for error message
    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
  });

  it("toggles password visibility when Show button is clicked", async () => {
    const user = userEvent.setup();
    render(<UpdatePasswordForm />);

    // Get current password input and its show button
    const currentPasswordInput = screen.getByLabelText(
      /Type your current password/
    ) as HTMLInputElement;
    const showButtons = screen.getAllByText("Show");

    // Initial type should be password
    expect(currentPasswordInput.type).toBe("password");

    await user.click(showButtons[0]);

    expect(currentPasswordInput.type).toBe("text");

    await user.click(showButtons[0]);

    expect(currentPasswordInput.type).toBe("password");
  });

  it("submits the form with valid data", async () => {
    const user = userEvent.setup();
    render(<UpdatePasswordForm />);

    const currentPasswordInput = screen.getByLabelText(
      /Type your current password/
    );
    const newPasswordInput = screen.getByLabelText(/Type your new password/);
    const confirmPasswordInput = screen.getByLabelText(
      /Retype your new password/
    );

    await user.type(currentPasswordInput, "CurrentPassword123");
    await user.type(newPasswordInput, "NewPassword123");
    await user.type(confirmPasswordInput, "NewPassword123");

    const saveButton = screen.getByText("Save Password");
    await user.click(saveButton);

    expect(console.log).toHaveBeenCalledWith("Form submitted successfully", {
      currentPassword: "CurrentPassword123",
      newPassword: "NewPassword123",
      confirmPassword: "NewPassword123",
    });
  });

  it("prevents form submission when passwords are invalid", async () => {
    const user = userEvent.setup();
    render(<UpdatePasswordForm />);

    // Get form inputs and fill with invalid data (short password)
    const currentPasswordInput = screen.getByLabelText(
      /Type your current password/
    );
    const newPasswordInput = screen.getByLabelText(/Type your new password/);
    const confirmPasswordInput = screen.getByLabelText(
      /Retype your new password/
    );

    await user.type(currentPasswordInput, "Current");
    await user.type(newPasswordInput, "short");
    await user.type(confirmPasswordInput, "short");

    const saveButton = screen.getByText("Save Password");
    await user.click(saveButton);

    expect(console.log).not.toHaveBeenCalled();

    expect(
      screen.getAllByText(
        "Your password is too short. It should be at least 8 characters long"
      ).length
    ).toBeGreaterThan(0);
  });
});
