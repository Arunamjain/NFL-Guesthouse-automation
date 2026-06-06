import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const FormInput = forwardRef<HTMLInputElement, Props>(({ label, error, hint, className, ...props }, ref) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-sm font-medium text-foreground">{label}</label>}
    <input ref={ref} className={cn("h-10 rounded-lg border border-input bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring", error && "border-destructive", className)} {...props} />
    {error && <p className="text-xs text-destructive">{error}</p>}
    {!error && hint && <p className="text-xs text-muted-foreground">{hint}</p>}
  </div>
));
FormInput.displayName = "FormInput";
