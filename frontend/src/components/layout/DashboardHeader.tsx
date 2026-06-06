import { Bell, Menu, Search, ChevronDown, LogOut } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useApp } from "@/lib/app-store";

export function DashboardHeader({ onMenu }: { onMenu: () => void }) {
  const { currentUser, role, logout, bookings } = useApp();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = role === "admin";
  const pendingCount = isAdmin ? bookings.filter((b) => b.hrStatus === "Pending Approval").length : bookings.filter((b) => b.employeeId === currentUser?.id && b.bookingStatus !== "Confirmed").length;

  const profileItems = isAdmin
    ? [
        { label: "Admin Profile", to: "/profile" as const },
        { label: "Pending Approvals", to: "/admin/approvals" as const },
        { label: "Reports", to: "/admin/reports" as const },
      ]
    : [
        { label: "My Profile", to: "/profile" as const },
        { label: "My Bookings", to: "/employee/my-bookings" as const },
        { label: "Settings", to: "/profile" as const },
      ];

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <header className="sticky top-0 z-20 bg-card/95 backdrop-blur border-b border-border h-16 px-4 sm:px-6 flex items-center gap-4">
      <button onClick={onMenu} className="lg:hidden p-2"><Menu className="size-5" /></button>
      <div className="hidden md:flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            placeholder={isAdmin ? "Search employee, booking ID, room..." : "Search bookings, guest houses..."}
            className="w-full h-10 rounded-lg border border-input bg-muted/40 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>
      <div className="flex-1 md:flex-none md:ml-auto" />
      <button className="md:hidden p-2 text-muted-foreground"><Search className="size-5" /></button>
      <button className="relative p-2 rounded-md text-muted-foreground hover:bg-muted">
        <Bell className="size-5" />
        {pendingCount > 0 && (
          <span className="absolute top-1 right-1 size-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">{pendingCount}</span>
        )}
      </button>
      <div className="relative">
        <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 p-1.5 rounded-md hover:bg-muted">
          <div className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
            {currentUser?.name.charAt(0) ?? "?"}
          </div>
          <span className="hidden sm:inline text-sm font-medium">{currentUser?.name}</span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-card shadow-lg z-20 py-1">
              <div className="px-3 py-2 border-b border-border">
                <div className="text-sm font-medium">{currentUser?.name}</div>
                <div className="text-xs text-muted-foreground">{currentUser?.email}</div>
              </div>
              {profileItems.map((item) => (
                <Link key={item.label} to={item.to} onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-sm hover:bg-muted">{item.label}</Link>
              ))}
              <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted">
                <LogOut className="size-4" /> Logout
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
