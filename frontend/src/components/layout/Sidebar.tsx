import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Building2, LayoutDashboard, Hotel, FilePlus, CalendarDays, CreditCard, QrCode, MessageSquare, User, LogOut, ClipboardCheck, BedDouble, BarChart3, Users, X } from "lucide-react";
import { useApp } from "@/lib/app-store";
import { cn } from "@/lib/utils";

const employeeLinks = [
  { label: "Dashboard", to: "/employee/dashboard", icon: LayoutDashboard },
  { label: "Guest Houses", to: "/employee/guest-houses", icon: Hotel },
  { label: "New Booking", to: "/employee/new-booking", icon: FilePlus },
  { label: "My Bookings", to: "/employee/my-bookings", icon: CalendarDays },
  { label: "Payment", to: "/employee/payments", icon: CreditCard },
  { label: "QR Pass", to: "/employee/qr-pass", icon: QrCode },
  { label: "Feedback", to: "/employee/feedback", icon: MessageSquare },
  { label: "Profile", to: "/profile", icon: User },
];

const adminLinks = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Approval Requests", to: "/admin/approvals", icon: ClipboardCheck },
  { label: "Room Management", to: "/admin/rooms", icon: BedDouble },
  { label: "Payment Verification", to: "/admin/payments", icon: CreditCard },
  { label: "Reports & Analytics", to: "/admin/reports", icon: BarChart3 },
  { label: "Feedback Review", to: "/admin/feedback", icon: MessageSquare },
  { label: "Employee Records", to: "/admin/employees", icon: Users },
  { label: "Profile", to: "/profile", icon: User },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { role, currentUser, logout } = useApp();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const links = role === "admin" ? adminLinks : employeeLinks;

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} />}
      <aside className={cn(
        "fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-sidebar-bg text-sidebar-fg flex flex-col transition-transform lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      )}>
        <div className="h-16 px-5 flex items-center justify-between border-b border-white/10">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Building2 className="size-5 text-accent" />
            <span>NFL Guest House</span>
          </Link>
          <button onClick={onClose} className="lg:hidden p-1"><X className="size-5" /></button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {links.map((l) => {
            const Icon = l.icon;
            const active = pathname === l.to || pathname.startsWith(l.to + "/");
            return (
              <Link key={l.to} to={l.to} onClick={onClose} className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                active ? "bg-sidebar-active text-white shadow-sm" : "text-sidebar-muted hover:bg-white/5 hover:text-sidebar-fg",
              )}>
                <Icon className="size-4" />
                <span>{l.label}</span>
              </Link>
            );
          })}
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-muted hover:bg-white/5 hover:text-sidebar-fg transition-colors">
            <LogOut className="size-4" /> Logout
          </button>
        </nav>
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full bg-sidebar-active flex items-center justify-center text-sm font-semibold">
              {currentUser?.name.charAt(0) ?? "?"}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{currentUser?.name}</div>
              <div className="text-xs text-sidebar-muted capitalize">{role === "admin" ? "Admin / HR" : "Employee"}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
