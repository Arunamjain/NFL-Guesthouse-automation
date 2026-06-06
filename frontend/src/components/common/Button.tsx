import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "success" | "danger" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const base = "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:opacity-60 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
  secondary: "bg-card text-primary border border-primary/30 hover:bg-primary/5",
  success: "bg-success text-success-foreground hover:opacity-90",
  danger: "bg-destructive text-destructive-foreground hover:opacity-90",
  ghost: "bg-transparent text-foreground/70 hover:bg-muted",
  outline: "bg-transparent border border-border text-foreground hover:bg-muted",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", leftIcon, rightIcon, fullWidth, children, ...props }, ref) => (
    <button ref={ref} className={cn(base, variants[variant], sizes[size], fullWidth && "w-full", className)} {...props}>
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  ),
);
Button.displayName = "Button";
