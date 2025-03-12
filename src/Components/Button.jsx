import React from "react";
import clsx from "clsx";

export default function Button({ className, children, id, onClick, type }) {
  return (
    <button
      type={type}
      id={id}
      onClick={onClick}
      className={clsx(
        "rounded-full bg-blue-700 p-3 m-2 text-white cursor-pointer font-semibold",
        className
      )}
    >
      {children}
    </button>
  );
}
