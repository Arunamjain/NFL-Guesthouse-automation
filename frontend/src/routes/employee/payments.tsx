import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/common/Button";
import { DataTable, type Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { useApp } from "@/lib/app-store";
import type { Booking } from "@/types";
import { formatINR } from "@/utils/formatters";

export const Route = createFileRoute("/employee/payments")({ component: PaymentsList });

function PaymentsList() {
  const { bookings, currentUser } = useApp();
  const rows = bookings.filter((b) => b.employeeId === currentUser?.id && ["Payment Pending", "Payment Verification Pending", "Payment Verified"].includes(b.paymentStatus));

  const cols: Column<Booking>[] = [
    { key: "id", header: "Booking ID", render: (b) => <span className="font-mono text-xs">{b.id}</span> },
    { key: "gh", header: "Guest House", render: (b) => b.guestHouseName },
    { key: "amt", header: "Amount", render: (b) => formatINR(b.amount) },
    { key: "stat", header: "Status", render: (b) => <StatusBadge status={b.paymentStatus} /> },
    { key: "act", header: "Action", render: (b) => (
      b.paymentStatus === "Payment Pending"
        ? <Link to="/employee/payment/$bookingId" params={{ bookingId: b.id }}><Button size="sm">Pay Now</Button></Link>
        : <Button size="sm" variant="secondary" disabled>Submitted</Button>
    ) },
  ];

  return (
    <DashboardLayout requiredRole="employee">
      <PageHeader title="Payments" subtitle="Complete and track payments for approved bookings." />
      <DataTable columns={cols} rows={rows} empty={<EmptyState title="No payments due" description="Pending payments will appear here once HR approves your booking." />} />
    </DashboardLayout>
  );
}
