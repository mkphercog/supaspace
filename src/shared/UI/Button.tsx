import cn from "classnames";
import { FC, MouseEventHandler, PropsWithChildren } from "react";

type ButtonVariants =
  | "primary"
  | "secondary"
  | "ghost"
  | "destructive"
  | "success"
  | "dark"
  | "outline";

const BUTTON_VARIANT: Record<ButtonVariants, string> = {
  primary: `
    bg-purple-600 hover:bg-purple-700
    border-purple-600 hover:border-purple-700
    disabled:bg-purple-500/20 disabled:text-gray-700 disabled:border-purple-800/10
  `,
  secondary: `
    bg-gray-500 hover:bg-gray-600
    border-gray-500 hover:border-gray-600
    disabled:bg-gray-500/20 disabled:text-gray-600 disabled:border-gray-700/10
  `,
  destructive: `
    bg-red-700 hover:bg-red-800
    border-red-700 hover:border-red-800
    disabled:bg-red-500/20 disabled:text-gray-700 disabled:border-red-800/10
  `,
  ghost: `
    bg-transparent hover:bg-gray-700/30
    border-transparent hover:border-transparent
    disabled:bg-gray-800/20 disabled:text-gray-800 disabled:border-transparent
  `,
  success: `
    bg-green-600 hover:bg-green-800
    border-green-600 hover:border-green-800
    disabled:bg-green-500/20 disabled:text-gray-700 disabled:border-green-800/10
  `,
  dark: `
    bg-purple-950 hover:bg-purple-900
    border-purple-950 hover:border-purple-900
    disabled:bg-purple-500/20 disabled:text-gray-700 disabled:border-purple-800/10
  `,
  outline: `
    bg-transparent hover:bg-purple-400/10
    border-purple-400/50 hover:border-purple-400/30
    disabled:bg-gray-500/20 disabled:text-gray-300/40 disabled:border-gray-800/50
  `,
};

type ButtonProps = {
  variant?: ButtonVariants;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  disabled?: boolean;
  type?: HTMLButtonElement["type"];
  ariaLabel?: string;
};

export const Button: FC<PropsWithChildren<ButtonProps>> = ({
  onClick,
  variant = "primary",
  className,
  children,
  disabled,
  type,
  ariaLabel,
}) => {
  return (
    <button
      aria-label={ariaLabel}
      className={cn(
        "px-2 md:px-3 py-1 cursor-pointer text-gray-200 rounded-md",
        "transition duration-300 border disabled:cursor-not-allowed",
        BUTTON_VARIANT[variant],
        className
      )}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
};
