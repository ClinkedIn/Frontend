import React from "react";
import clsx from "clsx";

type ButtonProps = {
  className?: string;
  children: React.ReactNode;
  id?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
};

export default function Button({
  className,
  children,
  id,
  onClick,
  type,
}: ButtonProps) {
  return (
    <button
      type={type}
      id={id}
      onClick={onClick}
      className={clsx(
        "rounded-full bg-[#0073b1] p-3 m-2 text-white cursor-pointer hover:border-[#004182] font-semibold",
        className
      )}
    >
      {children}
    </button>
  );
}
