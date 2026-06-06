import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function BookingStepper({ currentStep, steps }: { currentStep: number; steps: string[] }) {
  return (
    <ol className="flex flex-wrap items-center gap-2">
      {steps.map((s, i) => {
        const completed = i < currentStep;
        const active = i === currentStep;
        return (
          <li key={s} className="flex items-center gap-2">
            <div className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border",
              completed && "bg-success text-success-foreground border-success",
              active && "bg-primary text-primary-foreground border-primary",
              !completed && !active && "bg-muted text-muted-foreground border-border",
            )}>
              {completed ? <Check className="size-3" /> : <span className="size-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">{i + 1}</span>}
              {s}
            </div>
            {i < steps.length - 1 && <span className="w-4 h-px bg-border hidden sm:block" />}
          </li>
        );
      })}
    </ol>
  );
}
