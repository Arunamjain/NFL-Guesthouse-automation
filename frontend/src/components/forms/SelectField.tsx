import { type SelectHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
}

export function SelectField({ label, error, className, children, ...props }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <select className={cn("h-10 rounded-lg border border-input bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring", error && "border-destructive", className)} {...props}>{children}</select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
