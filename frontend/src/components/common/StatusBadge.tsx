import { cn } from "@/lib/utils";

const toneMap: Record<string, string> = {
  amber: "bg-warning/15 text-warning-foreground border-warning/30",
  blue: "bg-info/15 text-info border-info/30",
  red: "bg-destructive/10 text-destructive border-destructive/30",
  orange: "bg-orange-100 text-orange-700 border-orange-200",
  purple: "bg-purple-100 text-purple-700 border-purple-200",
  green: "bg-success/15 text-success border-success/30",
  emerald: "bg-emerald-100 text-emerald-700 border-emerald-300",
  gray: "bg-muted text-muted-foreground border-border",
};

const statusToTone: Record<string, keyof typeof toneMap> = {
  "Pending Approval": "amber",
  "Approved": "blue",
  "Rejected": "red",
  "Payment Pending": "orange",
  "Payment Verification Pending": "purple",
  "Payment Verified": "green",
  "Confirmed": "emerald",
  "Cancelled": "gray",
  "Available": "green",
  "Occupied": "red",
  "Maintenance": "amber",
  "Not Started": "gray",
  "Verification Pending": "purple",
  "Verified": "green",
  "Failed": "red",
  "Sent": "green",
  "Generated": "emerald",
  "Positive": "green",
  "Neutral": "amber",
  "Negative": "red",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const tone = statusToTone[status] ?? "gray";
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap", toneMap[tone], className)}>
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}
