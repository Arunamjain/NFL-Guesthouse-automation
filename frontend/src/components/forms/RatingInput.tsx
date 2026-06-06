import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingInput({ value, onChange, label }: { value: number; onChange: (n: number) => void; label?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-foreground">{label}</label>}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => onChange(n)} className="p-1">
            <Star className={cn("size-6 transition-colors", n <= value ? "fill-warning text-warning" : "text-muted-foreground")} />
          </button>
        ))}
      </div>
    </div>
  );
}
