import { h } from "preact";
import { ComponentChildren } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

export interface ButtonProps {
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  className?: string;
  children?: ComponentChildren;
  onClick?: (e: MouseEvent) => void;
}

const variantStyles = {
  primary: "bg-blue-500 hover:bg-blue-600 text-white",
  secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
  danger: "bg-red-500 hover:bg-red-600 text-white",
};

const sizeStyles = {
  small: "px-2 py-1 text-sm",
  medium: "px-4 py-2",
  large: "px-6 py-3 text-lg",
};

export function Button({
  variant = "primary",
  size = "medium",
  disabled = false,
  className = "",
  children,
  onClick,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={!IS_BROWSER || disabled}
      class={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        rounded
        font-medium
        transition-colors
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        focus:ring-blue-500
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `.trim().replace(/\s+/g, " ")}
    >
      {children}
    </button>
  );
}
