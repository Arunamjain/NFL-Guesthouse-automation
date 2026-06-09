import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/common/Button";
import { EmptyState } from "@/components/common/EmptyState";
import { useApp } from "@/lib/app-store";
import type { Booking } from "@/types";
import { getMyBookings } from "@/services/bookingService";

export const Route = createFileRoute("/employee/qr-pass")({ component: QRListPage });

function QRListPage() {
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

  const confirmed = bookings.filter((b) => b.bookingStatus === "Confirmed" || b.paymentStatus === "Payment Verified");

  if (loading) {
    return (
      <DashboardLayout requiredRole="employee">
        <PageHeader title="QR Passes" subtitle="View digital passes for your confirmed bookings." />
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading QR passes...</p>
        </div>
      </DashboardLayout>
    );
  }


  return (
    <DashboardLayout requiredRole="employee">
      <PageHeader title="QR Passes" subtitle="View digital passes for your confirmed bookings." />
      {confirmed.length === 0
        ? <EmptyState title="No confirmed bookings yet" description="QR passes appear after Admin verifies your payment." />
        : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {confirmed.map((b) => (
              <div key={b.id} className="rounded-xl border border-border bg-card p-4">
                <div className="font-mono text-xs text-muted-foreground">{b.id}</div>
                <div className="font-semibold">{b.guestHouseName}</div>
                <div className="text-sm text-muted-foreground">{b.roomType} — {b.roomNumber}</div>
                <Link to="/employee/qr-pass/$bookingId" params={{ bookingId: b.id }} className="mt-3 block"><Button fullWidth>View QR Pass</Button></Link>
              </div>
            ))}
          </div>
        )}
    </DashboardLayout>
  );
}
