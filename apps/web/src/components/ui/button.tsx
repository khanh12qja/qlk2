import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-steel disabled:opacity-50",
        variant === "primary" && "bg-pine text-white hover:bg-[#1c4434]",
        variant === "secondary" && "border border-line bg-panel text-ink hover:bg-[#eef2ed]",
        variant === "ghost" && "text-ink hover:bg-[#eef2ed]",
        className
      )}
      {...props}
    />
  );
}
