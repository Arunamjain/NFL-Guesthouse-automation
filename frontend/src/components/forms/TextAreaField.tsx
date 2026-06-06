import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> { label?: string; error?: string }
export function TextAreaField({ label, error, className, ...props }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <textarea className={cn("min-h-[88px] rounded-lg border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring", error && "border-destructive", className)} {...props} />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
