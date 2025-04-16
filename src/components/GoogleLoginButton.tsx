import React from "react";
import clsx from "clsx";


type ButtonProps = {
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

/**
 * A React functional component that renders a Google login button.
 *
 * @param {ButtonProps} props - The props for the GoogleLogin component.
 * @param {string} [props.className] - Additional CSS classes to apply to the button.
 * @param {string} [props.type] - The type attribute for the button element (e.g., "button", "submit").
 * @param {() => void} [props.onClick] - The click event handler for the button.
 *
 * @returns {JSX.Element} A styled button element with a Google logo and text.
 */
export default function GoogleLogin({
 className,
  type,
  onClick
}: ButtonProps) {
  return (
    <button onClick={onClick} type ={type} className={clsx("google-signup-button   rounded-full   flex items-center  justify-center  border border-gray-400 rounded py-2 px-4 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",className)} >
    <img
    src="/Images/google.svg"
    alt="Google Logo"
    className="google-logo"
    />Continue with Google
</button>
  );
}
