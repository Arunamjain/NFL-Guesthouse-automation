import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/common/Button";

export const Route = createFileRoute("/help")({ component: HelpPage, head: () => ({ meta: [{ title: "Help — NFL Guest House" }] }) });

const faqs = [
  { q: "How do I request a guest house booking?", a: "Login as an employee, go to New Booking and submit the multi-step form. HR will review it." },
  { q: "When can I make payment?", a: "Payment becomes available only after HR approves your booking request." },
  { q: "How is my room/suite decided?", a: "Allocation is based on your employee category (Executive / Non-Executive) and HR approval." },
  { q: "When is QR pass generated?", a: "Once your payment is verified by Admin and the booking is marked Confirmed." },
  { q: "What if my payment is not verified?", a: "You'll see a Failed status and can resubmit payment details with the correct UTR." },
  { q: "How do I contact HR?", a: "Use the Contact page or write to guesthouse-support@nfl.com." },
];

function HelpPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <PublicLayout>
      <section className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="text-3xl font-bold">Help Center</h1>
        <p className="mt-2 text-muted-foreground">Common questions about the guest house booking process.</p>
        <div className="mt-8 space-y-3">
          {faqs.map((f, i) => (
            <div key={f.q} className="rounded-xl border border-border bg-card">
              <button className="w-full flex items-center justify-between p-4 text-left" onClick={() => setOpen(open === i ? null : i)}>
                <span className="font-medium">{f.q}</span>
                <ChevronDown className={`size-4 transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && <div className="px-4 pb-4 text-sm text-foreground/80">{f.a}</div>}
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/login"><Button>Login to Book</Button></Link>
          <Link to="/contact"><Button variant="secondary">Contact Support</Button></Link>
        </div>
      </section>
    </PublicLayout>
  );
}
