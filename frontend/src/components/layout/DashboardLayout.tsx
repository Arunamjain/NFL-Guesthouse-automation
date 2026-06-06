import { type ReactNode, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Sidebar } from "./Sidebar";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardFooter } from "./Footer";
import { useApp } from "@/lib/app-store";
import type { Role } from "@/types";

export function DashboardLayout({ children, requiredRole }: { children: ReactNode; requiredRole: Role }) {
  const { currentUser, role } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) navigate({ to: "/login" });
    else if (role !== requiredRole) navigate({ to: role === "admin" ? "/admin/dashboard" : "/employee/dashboard" });
  }, [currentUser, role, requiredRole, navigate]);

  if (!currentUser || role !== requiredRole) return null;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader onMenu={() => setOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        <DashboardFooter />
      </div>
    </div>
  );
}
