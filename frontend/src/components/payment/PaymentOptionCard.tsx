import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function PaymentOptionCard({ title, description, icon: Icon, selected, onSelect }: { title: string; description: string; icon: LucideIcon; selected?: boolean; onSelect: () => void }) {
  return (
    <button type="button" onClick={onSelect} className={cn(
      "text-left rounded-xl border p-4 transition-all w-full",
      selected ? "border-primary bg-primary/5 ring-2 ring-primary/30" : "border-border bg-card hover:border-primary/40",
    )}>
      <div className="flex items-start gap-3">
        <div className={cn("size-10 rounded-lg flex items-center justify-center", selected ? "bg-primary text-primary-foreground" : "bg-muted text-foreground")}>
          <Icon className="size-5" />
        </div>
        <div>
          <div className="font-medium text-foreground">{title}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{description}</div>
        </div>
      </div>
    </button>
  );
}
