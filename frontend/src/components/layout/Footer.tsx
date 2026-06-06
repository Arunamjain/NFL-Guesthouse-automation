import { Link } from "@tanstack/react-router";
import { Building2, Mail, Phone, MapPin } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="bg-sidebar-bg text-sidebar-fg mt-16">
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-8 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <Building2 className="size-5" /> NFL Guest House Management
          </div>
          <p className="mt-3 text-sm text-sidebar-muted max-w-sm">
            Digital platform for company guest house booking, HR approval, payment verification, and employee stay management.
          </p>
        </div>
        <FooterCol title="Quick Links" links={[
          { label: "Home", to: "/" }, { label: "Guest Houses", to: "/" },
          { label: "Login", to: "/login" }, { label: "Help", to: "/help" }, { label: "Contact", to: "/contact" },
        ]} />
        <FooterCol title="Employee Services" links={[
          { label: "Room Booking", to: "/login" }, { label: "Payment Status", to: "/login" },
          { label: "QR Pass", to: "/login" }, { label: "Feedback", to: "/login" },
        ]} />
        <div>
          <h4 className="text-sm font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-sm text-sidebar-muted">
            <li className="flex items-start gap-2"><Mail className="size-4 mt-0.5" /> guesthouse-support@nfl.com</li>
            <li className="flex items-start gap-2"><Phone className="size-4 mt-0.5" /> +91-00000-00000</li>
            <li className="flex items-start gap-2"><MapPin className="size-4 mt-0.5" /> NFL Corporate Guest House Desk</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-sidebar-muted">
        © 2026 NFL Guest House Management System. All rights reserved.
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold mb-3">{title}</h4>
      <ul className="space-y-2 text-sm text-sidebar-muted">
        {links.map((l) => (
          <li key={l.label}><Link to={l.to} className="hover:text-sidebar-fg transition-colors">{l.label}</Link></li>
        ))}
      </ul>
    </div>
  );
}

export function DashboardFooter() {
  return (
    <footer className="border-t border-border bg-card py-3 px-6 text-center text-xs text-muted-foreground">
      © 2026 NFL Guest House Management System | Internal Use Only
    </footer>
  );
}
