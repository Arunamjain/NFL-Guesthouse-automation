import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/lib/app-store";
import { mockEmployees } from "@/data/mockEmployees";
import type { Employee } from "@/types";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDate } from "@/utils/formatters";

export const Route = createFileRoute("/admin/employees")({ component: EmployeesPage });

function EmployeesPage() {
  const { bookings } = useApp();
  const [profile, setProfile] = useState<Employee | null>(null);
  const [history, setHistory] = useState<Employee | null>(null);

  const bookingsFor = (e: Employee) => bookings.filter((b) => b.employeeId === e.id);

  const cols: Column<Employee>[] = [
    { key: "id", header: "Emp ID", render: (e) => <span className="font-mono text-xs">{e.id}</span> },
    { key: "n", header: "Name", render: (e) => e.name },
    { key: "em", header: "Email", render: (e) => <span className="text-xs">{e.email}</span> },
    { key: "d", header: "Department", render: (e) => e.department },
    { key: "des", header: "Designation", render: (e) => e.designation },
    { key: "cat", header: "Category", render: (e) => <span className="text-xs">{e.category}</span> },
    { key: "r", header: "Role", render: (e) => <span className="capitalize text-xs">{e.role === "admin" ? "Admin / HR" : "Employee"}</span> },
    { key: "tb", header: "Bookings", render: (e) => bookingsFor(e).length },
    { key: "s", header: "Status", render: () => <StatusBadge status="Approved" /> },
    { key: "act", header: "Actions", render: (e) => (
      <div className="flex gap-1.5">
        <Button size="sm" variant="ghost" onClick={() => setProfile(e)}>View Profile</Button>
        <Button size="sm" variant="secondary" onClick={() => setHistory(e)}>Booking History</Button>
      </div>
    ) },
  ];

  return (
    <DashboardLayout requiredRole="admin">
      <PageHeader title="Employee Records" subtitle="Verify designation and booking eligibility (mock data until backend is connected)." />
      <DataTable columns={cols} rows={mockEmployees} />

      <Modal open={!!profile} onClose={() => setProfile(null)} title={profile?.name ?? ""} footer={<Button onClick={() => setProfile(null)}>Close</Button>}>
        {profile && (
          <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <Row k="Employee ID" v={profile.id} /><Row k="Email" v={profile.email} />
            <Row k="Department" v={profile.department} /><Row k="Designation" v={profile.designation} />
            <Row k="Category" v={profile.category} /><Row k="Role" v={profile.role === "admin" ? "Admin / HR" : "Employee"} />
          </dl>
        )}
      </Modal>

      <Modal open={!!history} onClose={() => setHistory(null)} title={history ? `Bookings — ${history.name}` : ""} size="lg" footer={<Button onClick={() => setHistory(null)}>Close</Button>}>
        {history && (
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground uppercase">
              <tr><th className="text-left pb-2">ID</th><th>Guest House</th><th>Check-in</th><th>Status</th></tr>
            </thead>
            <tbody>
              {bookingsFor(history).map((b) => (
                <tr key={b.id} className="border-t border-border"><td className="py-2 font-mono text-xs">{b.id}</td>
                  <td>{b.guestHouseName}</td><td>{formatDate(b.checkIn)}</td><td><StatusBadge status={b.bookingStatus} /></td>
                </tr>
              ))}
              {bookingsFor(history).length === 0 && <tr><td colSpan={4} className="py-4 text-center text-muted-foreground">No bookings</td></tr>}
            </tbody>
          </table>
        )}
      </Modal>
    </DashboardLayout>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) { return (<><dt className="text-muted-foreground text-xs">{k}</dt><dd className="font-medium">{v}</dd></>); }
