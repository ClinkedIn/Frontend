import React from "react";
import clsx from "clsx";
type ButtonProps = {
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

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
