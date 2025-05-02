import React from "react";
import clsx from "clsx";

type ButtonProps = {
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

/**
 * A reusable button component for Google login functionality.
 *
 * @param {ButtonProps} props - The properties for the GoogleLogin component.
 * @param {string} [props.className] - Additional CSS classes to apply to the button.
 * @param {string} [props.type="button"] - The type attribute for the button element.
 * @param {() => void} [props.onClick] - The click event handler for the button.
 *
 * @returns {JSX.Element} A styled button element with Google branding.
 *
 * @remarks
 * - The button includes an accessible name for screen readers via the `aria-label` attribute.
 * - The Google logo is displayed alongside the button text.
 * - The `clsx` utility is used to conditionally apply CSS classes.
 */
export default function GoogleLogin({
  className,
  type = "button",
  onClick,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      type={type}
      aria-label="Sign up with Google" // Add an accessible name
      className={clsx(
        "google-signup-button rounded-full flex items-center justify-center border border-gray-400 py-2 px-4 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        className
      )}
    >
      <img
        src="/Images/google.svg"
        alt="Google Logo"
        className="google-logo mr-2" // Add margin for spacing
      />
      Continue with Google
    </button>
  );
}