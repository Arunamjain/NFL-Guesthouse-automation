import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ClipboardCheck, CreditCard, KeyRound, LogIn, QrCode, ShieldCheck, UserCheck } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { GuestHouseCard } from "@/components/guesthouse/GuestHouseCard";
import { mockGuestHouses } from "@/data/mockGuestHouses";
import { useApp } from "@/lib/app-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NFL Guest House Management System" },
      { name: "description", content: "Book guest house stays, request HR approval, complete payments, and receive QR-based booking confirmation." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const [loginModal, setLoginModal] = useState(false);

  const scrollToGH = () => {
    document.getElementById("guest-houses")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 to-primary" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28 grid lg:grid-cols-2 gap-10 items-center text-primary-foreground">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-medium">
              <ShieldCheck className="size-3.5" /> Enterprise HR-integrated system
            </span>
            <h1 className="mt-4 text-4xl md:text-5xl font-bold leading-tight">NFL Guest House Management System</h1>
            <p className="mt-4 text-base md:text-lg text-primary-foreground/80 max-w-xl">
              Book guest house stays, request HR approval, complete payments, and receive QR-based booking confirmation through one digital platform.
            </p>
           <div className="mt-7 flex flex-wrap gap-3">
  <Button
    size="lg"
    onClick={() => navigate({ to: "/login" })}
    leftIcon={<LogIn className="size-4" />}
  >
    Login
  </Button>

  <Button
    size="lg"
    variant="ghost"
    className="text-primary-foreground hover:bg-white/10"
    onClick={scrollToGH}
  >
    View Guest Houses
  </Button>
</div>
          </div>
          <div className="hidden lg:block">
            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80" alt="Guest house" className="rounded-2xl shadow-2xl ring-1 ring-white/20" />
          </div>
        </div>
      </section>

      {/* Guest house preview */}
      <section id="guest-houses" className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Our Guest Houses</h2>
          <p className="mt-2 text-muted-foreground">Two flagship guest houses, designed for company employee stays.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {mockGuestHouses.map((gh) => (
            <GuestHouseCard key={gh.id} gh={gh} onView={() => currentUser ? navigate({ to: "/employee/guest-houses/$id", params: { id: gh.id } }) : setLoginModal(true)} />
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="bg-muted/40 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">How it works</h2>
            <p className="mt-2 text-muted-foreground">From booking request to QR-based confirmation in six clear steps.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              { icon: LogIn, t: "Login" },
              { icon: ClipboardCheck, t: "Request Booking" },
              { icon: UserCheck, t: "HR Approval" },
              { icon: KeyRound, t: "Room Allocation" },
              { icon: CreditCard, t: "Payment Verification" },
              { icon: QrCode, t: "QR Confirmation" },
            ].map((s, i) => (
              <div key={s.t} className="rounded-xl border border-border bg-card p-4 text-center shadow-sm">
                <div className="size-10 rounded-lg bg-primary/10 text-primary mx-auto flex items-center justify-center"><s.icon className="size-5" /></div>
                <div className="mt-2 text-xs text-muted-foreground">Step {i + 1}</div>
                <div className="font-medium text-sm">{s.t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role features */}
      <section className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-2 gap-6">
        {[
          { title: "For Employees", points: ["Browse guest houses", "Request booking with category-based eligibility", "Make secure payment & submit UTR", "Get QR pass after payment verification"] },
          { title: "For HR / Admin", points: ["Verify employee category & designation", "Approve / reject requests with remarks", "Manage rooms & verify payments", "Track reports & feedback"] },
        ].map((card) => (
          <div key={card.title} className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-xl font-semibold">{card.title}</h3>
            <ul className="mt-3 space-y-2">
              {card.points.map((p) => (
                <li key={p} className="flex gap-2 text-sm text-foreground/80"><ArrowRight className="size-4 text-primary mt-0.5 shrink-0" /> {p}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground py-14">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold">Ready to manage your guest house booking digitally?</h2>
          <div className="mt-6">
            <Link to="/login"><Button size="lg" variant="secondary">Login to Continue</Button></Link>
          </div>
        </div>
      </section>

      <Modal open={loginModal} onClose={() => setLoginModal(false)} title="Login required"
        footer={<>
          <Button variant="secondary" onClick={() => setLoginModal(false)}>Cancel</Button>
          <Link to="/login"><Button>Login Now</Button></Link>
        </>}>
        <p className="text-sm text-foreground/80">Please login to view full guest house details and request booking.</p>
      </Modal>
    </PublicLayout>
  );
}