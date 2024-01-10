import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

type ButtonProps = {
  className?: string;
  grey?: boolean;
  small?: boolean;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;
export const Button = ({
  small = false,
  grey = false,
  className = "",
  ...props
}: ButtonProps) => {
  const sizeClass = small ? "text-sm px-2 py-1" : "px-4 py-2 font-bold";
  const colorClass = grey
    ? "bg-grey-400 hover:bg-grey-300 focus-visible:bg-grey-300"
    : "bg-twitter hover:bg-twitter-hover focus-visible:bg-twitter-hover";

  return (
    <button
      className={` rounded-full transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${sizeClass} ${colorClass} ${className}`}
      {...props}
    ></button>
  );
};
