import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/common/Button";
import { DataTable, type Column } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { useApp } from "@/lib/app-store";
import type { Booking } from "@/types";
import { formatINR } from "@/utils/formatters";
import { getMyBookings } from "@/services/bookingService";

export const Route = createFileRoute("/employee/payments")({ component: PaymentsList });

function PaymentsList() {
  const { currentUser } = useApp();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.id) {
      getMyBookings(currentUser.id)
        .then(setBookings)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [currentUser]);

  const rows = bookings.filter((b) => ["Payment Pending", "Payment Verification Pending", "Payment Verified"].includes(b.paymentStatus));

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

  if (loading) {
    return (
      <DashboardLayout requiredRole="employee">
        <PageHeader title="Payments" subtitle="Complete and track payments for approved bookings." />
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading payments...</p>
        </div>
      </DashboardLayout>
    );
  }


  return (
    <DashboardLayout requiredRole="employee">
      <PageHeader title="Payments" subtitle="Complete and track payments for approved bookings." />
      <DataTable columns={cols} rows={rows} empty={<EmptyState title="No payments due" description="Pending payments will appear here once HR approves your booking." />} />
    </DashboardLayout>
  );
}
