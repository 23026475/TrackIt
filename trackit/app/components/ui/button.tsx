"use client";

import { ReactNode } from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        "px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition",
        className
      )}
    >
      {children}
    </button>
  );
}
