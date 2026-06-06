import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchInput } from "@/components/common/SearchInput";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Button } from "@/components/common/Button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { EmptyState } from "@/components/common/EmptyState";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/lib/app-store";
import type { Booking } from "@/types";
import { formatDate } from "@/utils/formatters";
import { BookingDetailModal } from "./dashboard";

export const Route = createFileRoute("/employee/my-bookings")({ component: MyBookings });

function MyBookings() {
  const { bookings, currentUser, updateBooking } = useApp();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [detail, setDetail] = useState<Booking | null>(null);
  const [cancel, setCancel] = useState<Booking | null>(null);

  const rows = useMemo(() => bookings
    .filter((b) => b.employeeId === currentUser?.id)
    .filter((b) => b.id.toLowerCase().includes(q.toLowerCase()))
    .filter((b) => status === "All" || b.bookingStatus === status), [bookings, currentUser, q, status]);

  const columns: Column<Booking>[] = [
    { key: "id", header: "Booking ID", render: (b) => <span className="font-mono text-xs">{b.id}</span> },
    { key: "gh", header: "Guest House", render: (b) => b.guestHouseName },
    { key: "type", header: "Room", render: (b) => <div className="text-xs"><div>{b.roomType ?? "—"}</div><div className="text-muted-foreground">{b.roomNumber ?? "Not assigned"}</div></div> },
    { key: "in", header: "Check-in", render: (b) => formatDate(b.checkIn) },
    { key: "out", header: "Check-out", render: (b) => formatDate(b.checkOut) },
    { key: "hr", header: "HR", render: (b) => <StatusBadge status={b.hrStatus} /> },
    { key: "pay", header: "Payment", render: (b) => <StatusBadge status={b.paymentStatus} /> },
    { key: "book", header: "Status", render: (b) => <StatusBadge status={b.bookingStatus} /> },
    { key: "act", header: "Actions", render: (b) => (
      <div className="flex flex-wrap gap-1.5">
        <Button size="sm" variant="ghost" onClick={() => setDetail(b)}>View</Button>
        <Button size="sm" disabled={b.bookingStatus !== "Payment Pending"}
          title={b.bookingStatus !== "Payment Pending" ? "Available after HR approval" : ""}
          onClick={() => navigate({ to: "/employee/payment/$bookingId", params: { bookingId: b.id } })}>Pay Now</Button>
        <Button size="sm" variant="secondary" disabled={b.bookingStatus !== "Confirmed"}
          title={b.bookingStatus !== "Confirmed" ? "Generated after payment verification" : ""}
          onClick={() => navigate({ to: "/employee/qr-pass/$bookingId", params: { bookingId: b.id } })}>View QR</Button>
        <Button size="sm" variant="danger" disabled={b.bookingStatus !== "Pending Approval"} onClick={() => setCancel(b)}>Cancel</Button>
      </div>
    ) },
  ];

  return (
    <DashboardLayout requiredRole="employee">
      <PageHeader title="My Bookings" subtitle="Track all your guest house booking requests in one place." />
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <SearchInput placeholder="Search booking ID..." value={q} onChange={(e) => setQ(e.target.value)} className="flex-1" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-lg border border-input bg-card px-3 text-sm">
          {["All", "Pending Approval", "Approved", "Payment Pending", "Payment Verification Pending", "Confirmed", "Rejected", "Cancelled"].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <DataTable columns={columns} rows={rows} empty={<EmptyState title="No bookings yet" description="Start by requesting a new guest house booking." />} />
      <BookingDetailModal booking={detail} onClose={() => setDetail(null)} />
      <Modal open={!!cancel} onClose={() => setCancel(null)} title="Cancel booking?"
        footer={<>
          <Button variant="secondary" onClick={() => setCancel(null)}>Keep Booking</Button>
          <Button variant="danger" onClick={() => {
            if (cancel) { updateBooking(cancel.id, { bookingStatus: "Cancelled", hrStatus: "Rejected" }); toast.success("Booking request cancelled."); }
            setCancel(null);
          }}>Confirm Cancel</Button>
        </>}>
        <p className="text-sm">Are you sure you want to cancel booking {cancel?.id}? This action cannot be undone.</p>
      </Modal>
    </DashboardLayout>
  );
}
