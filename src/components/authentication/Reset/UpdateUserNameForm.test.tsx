import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UpdateUserNameForm from "./UpdateUserNameForm";
import "@testing-library/jest-dom"; // Add this import to get the matchers

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

describe("UpdateUserNameForm", () => {
  let toggleSpy: vi.SpyInstance;
  beforeEach(() => {
    vi.clearAllMocks();

    toggleSpy = vi.fn();

    document.getElementById = vi.fn((id) => {
      if (id === "premuimSection" || id === "chevron") {
        return {
          classList: {
            toggle: toggleSpy,
          },
        } as unknown as HTMLElement;
      }
      return null;
    });

    console.log = vi.fn();
  });

  it("renders the form with all expected elements", () => {
    render(<UpdateUserNameForm />);

    expect(screen.getByText("Edit intro")).toBeInTheDocument();

    expect(
      screen.getByText("Enhance your profile with Premium")
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Feature profile sections higher/)
    ).toBeInTheDocument();
    expect(screen.getByText("Try Premium for EGP0")).toBeInTheDocument();

    expect(screen.getByLabelText(/First name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Additional name/)).toBeInTheDocument();

    expect(screen.getByTestId("mock-button")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("updates form data when inputs change", async () => {
    const user = userEvent.setup();
    render(<UpdateUserNameForm />);

    const firstNameInput = screen.getByLabelText(/First name/);
    const lastNameInput = screen.getByLabelText(/Last name/);
    const additionalNameInput = screen.getByLabelText(/Additional name/);

    await user.type(firstNameInput, "John");
    await user.type(lastNameInput, "Doe");
    await user.type(additionalNameInput, "Junior");

    expect(firstNameInput).toHaveValue("John");
    expect(lastNameInput).toHaveValue("Doe");
    expect(additionalNameInput).toHaveValue("Junior");
  });

  it("submits the form with the correct data", async () => {
    const user = userEvent.setup();
    render(<UpdateUserNameForm />);

    const firstNameInput = screen.getByLabelText(/First name/);
    const lastNameInput = screen.getByLabelText(/Last name/);
    const additionalNameInput = screen.getByLabelText(/Additional name/);

    await user.type(firstNameInput, "John");
    await user.type(lastNameInput, "Doe");
    await user.type(additionalNameInput, "Junior");

    const saveButton = screen.getByText("Save");
    await user.click(saveButton);

    expect(console.log).toHaveBeenCalledWith("Form submitted:", {
      firstName: "John",
      lastName: "Doe",
      additionalName: "Junior",
    });
  });

  it("toggles premium section visibility when chevron is clicked", async () => {
    const user = userEvent.setup();
    render(<UpdateUserNameForm />);

    const chevronButtons = screen.getAllByTestId("mock-icon");
    const chevronContainerButton = chevronButtons[1].closest("button");

    await user.click(chevronContainerButton);

    expect(document.getElementById).toHaveBeenCalledWith("premuimSection");
    expect(document.getElementById).toHaveBeenCalledWith("chevron");

    expect(toggleSpy).toHaveBeenCalledWith("hidden");
    expect(toggleSpy).toHaveBeenCalledWith("rotate-180");
  });

  it("validates required fields before submission", async () => {
    const user = userEvent.setup();
    render(<UpdateUserNameForm />);

    const saveButton = screen.getByText("Save");
    await user.click(saveButton);

    expect(console.log).not.toHaveBeenCalled();

    const firstNameInput = screen.getByLabelText(/First name/);
    const lastNameInput = screen.getByLabelText(/Last name/);

    await user.type(firstNameInput, "John");
    await user.type(lastNameInput, "Doe");

    await user.click(saveButton);

    expect(console.log).toHaveBeenCalledWith("Form submitted:", {
      firstName: "John",
      lastName: "Doe",
      additionalName: "",
    });
  });
});
