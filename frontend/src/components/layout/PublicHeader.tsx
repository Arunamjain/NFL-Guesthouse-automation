import { Link } from "@tanstack/react-router";
import { Building2, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/common/Button";

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const links = [
    { label: "Home", to: "/" },
    { label: "Guest Houses", to: "/", hash: "#guest-houses" },
    { label: "Help", to: "/help" },
    { label: "Contact", to: "/contact" },
  ];
  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
          <span className="size-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center"><Building2 className="size-5" /></span>
          <span className="hidden sm:inline">NFL Guest House</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {links.map((l) => (
            <Link key={l.label} to={l.to} hash={l.hash} className="text-foreground/70 hover:text-primary transition-colors">{l.label}</Link>
          ))}
        </nav>
        <div className="hidden md:block">
          <Link to="/login"><Button>Login</Button></Link>
        </div>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="px-6 py-3 flex flex-col gap-3">
            {links.map((l) => (
              <Link key={l.label} to={l.to} hash={l.hash} onClick={() => setOpen(false)} className="text-sm text-foreground/80">{l.label}</Link>
            ))}
            <Link to="/login" onClick={() => setOpen(false)}><Button fullWidth>Login</Button></Link>
          </div>
        </div>
      )}
    </header>
  );
}
