import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bell, CalendarCheck, ClipboardList, CreditCard, FilePlus, Hotel, MessageSquare, QrCode } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { BookingStepper } from "@/components/dashboard/BookingStepper";
import { Button } from "@/components/common/Button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Modal } from "@/components/common/Modal";
import { EmptyState } from "@/components/common/EmptyState";
import { useApp } from "@/lib/app-store";
import { formatDate, formatINR } from "@/utils/formatters";
import type { Booking } from "@/types";

export const Route = createFileRoute("/employee/dashboard")({ component: EmployeeDashboard });

const STEPS = ["Request", "HR Approval", "Room Assigned", "Payment", "Confirmed"];

function progressFor(b: Booking): number {
  if (b.bookingStatus === "Pending Approval") return 0;
  if (b.bookingStatus === "Rejected" || b.bookingStatus === "Cancelled") return 1;
  if (b.bookingStatus === "Approved") return 2;
  if (b.bookingStatus === "Payment Pending") return 3;
  if (b.bookingStatus === "Payment Verification Pending") return 3;
  if (b.bookingStatus === "Confirmed") return 5;
  return 0;
}

function EmployeeDashboard() {
  const { bookings, currentUser } = useApp();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<Booking | null>(null);
  const [notif, setNotif] = useState<string | null>(null);

  const my = useMemo(() => bookings.filter((b) => b.employeeId === currentUser?.id), [bookings, currentUser]);
  const active = my.find((b) => b.bookingStatus !== "Confirmed" && b.bookingStatus !== "Rejected" && b.bookingStatus !== "Cancelled") ?? my[0];

  const stats = {
    total: my.length,
    pending: my.filter((b) => b.bookingStatus === "Pending Approval").length,
    approved: my.filter((b) => b.hrStatus === "Approved").length,
    paymentPending: my.filter((b) => b.bookingStatus === "Payment Pending").length,
    confirmed: my.filter((b) => b.bookingStatus === "Confirmed").length,
  };

  const notifications = [
    "Your booking request BKG-1024 is pending HR approval.",
    "Payment verification required for BKG-1021.",
    "QR pass generated for BKG-1018.",
  ];

  return (
    <DashboardLayout requiredRole="employee">
      <PageHeader title={`Welcome, ${currentUser?.name.split(" ")[0]}`} subtitle="Overview of your guest house booking activity." />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard label="Total Bookings" value={stats.total} icon={ClipboardList} tone="primary" trend="All-time bookings" />
        <StatCard label="Pending Requests" value={stats.pending} icon={Bell} tone="warning" trend="Awaiting HR" />
        <StatCard label="Approved" value={stats.approved} icon={CalendarCheck} tone="info" />
        <StatCard label="Payment Pending" value={stats.paymentPending} icon={CreditCard} tone="warning" />
        <StatCard label="Confirmed" value={stats.confirmed} icon={QrCode} tone="success" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {active ? (
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">Current Booking</div>
                  <div className="font-semibold">{active.id} — {active.guestHouseName}</div>
                  <div className="text-sm text-muted-foreground">{formatDate(active.checkIn)} → {formatDate(active.checkOut)}</div>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <StatusBadge status={active.bookingStatus} />
                  <span className="text-xs text-muted-foreground">{formatINR(active.amount)}</span>
                </div>
              </div>
              <div className="mt-5">
                <BookingStepper steps={STEPS} currentStep={progressFor(active)} />
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => setDetail(active)}>View Details</Button>
                <Button
                  disabled={active.bookingStatus !== "Payment Pending"}
                  title={active.bookingStatus !== "Payment Pending" ? "Payment is available only after HR approval" : ""}
                  onClick={() => navigate({ to: "/employee/payment/$bookingId", params: { bookingId: active.id } })}
                >Pay Now</Button>
                <Button
                  variant="secondary"
                  disabled={active.bookingStatus !== "Confirmed"}
                  title={active.bookingStatus !== "Confirmed" ? "QR pass is generated after payment verification" : ""}
                  onClick={() => navigate({ to: "/employee/qr-pass/$bookingId", params: { bookingId: active.id } })}
                >View QR Pass</Button>
              </div>
            </div>
          ) : (
            <EmptyState title="No active booking" description="Start a new booking to reserve a guest house stay." action={<Link to="/employee/new-booking"><Button>Request Booking</Button></Link>} />
          )}

          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link to="/employee/new-booking"><Button fullWidth leftIcon={<FilePlus className="size-4" />}>Book Guest House</Button></Link>
              <Link to="/employee/guest-houses"><Button fullWidth variant="secondary" leftIcon={<Hotel className="size-4" />}>View Guest Houses</Button></Link>
              <Link to="/employee/my-bookings"><Button fullWidth variant="secondary" leftIcon={<ClipboardList className="size-4" />}>My Bookings</Button></Link>
              <Link to="/employee/feedback"><Button fullWidth variant="secondary" leftIcon={<MessageSquare className="size-4" />}>Submit Feedback</Button></Link>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold mb-3">Recent Notifications</h3>
          <ul className="space-y-3">
            {notifications.map((n) => (
              <li key={n}>
                <button onClick={() => setNotif(n)} className="text-left w-full rounded-lg border border-border p-3 hover:bg-muted/40 text-sm">
                  <Bell className="inline size-3.5 mr-2 text-primary" />{n}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <BookingDetailModal booking={detail} onClose={() => setDetail(null)} />
      <Modal open={!!notif} onClose={() => setNotif(null)} title="Notification" footer={<Button onClick={() => setNotif(null)}>Close</Button>}>
        <p className="text-sm">{notif}</p>
      </Modal>
    </DashboardLayout>
  );
}

export function BookingDetailModal({ booking, onClose }: { booking: Booking | null; onClose: () => void }) {
  return (
    <Modal open={!!booking} onClose={onClose} title={booking ? `Booking ${booking.id}` : ""} size="lg" footer={<Button onClick={onClose}>Close</Button>}>
      {booking && (
        <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <Row k="Employee" v={`${booking.employeeName} (${booking.employeeId})`} />
          <Row k="Department" v={booking.department} />
          <Row k="Designation" v={booking.designation} />
          <Row k="Category" v={booking.category} />
          <Row k="Guest House" v={booking.guestHouseName} />
          <Row k="Check-in" v={formatDate(booking.checkIn)} />
          <Row k="Check-out" v={formatDate(booking.checkOut)} />
          <Row k="Purpose" v={booking.purpose} />
          <Row k="Room Type" v={booking.roomType ?? "Pending allocation"} />
          <Row k="Room Number" v={booking.roomNumber ?? "—"} />
          <Row k="HR Status" v={<StatusBadge status={booking.hrStatus} />} />
          <Row k="Payment Status" v={<StatusBadge status={booking.paymentStatus} />} />
          <Row k="Booking Status" v={<StatusBadge status={booking.bookingStatus} />} />
          <Row k="QR Pass" v={booking.qrGenerated ? <StatusBadge status="Generated" /> : "Pending"} />
          <Row k="Email Status" v={booking.emailSent ? <StatusBadge status="Sent" /> : "Pending"} />
          <Row k="Amount" v={formatINR(booking.amount)} />
          {booking.utr && <Row k="UTR" v={booking.utr} />}
          {booking.hrRemarks && <div className="sm:col-span-2"><dt className="text-muted-foreground text-xs">HR Remarks</dt><dd>{booking.hrRemarks}</dd></div>}
        </dl>
      )}
    </Modal>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (<><dt className="text-muted-foreground text-xs">{k}</dt><dd className="font-medium">{v}</dd></>);
}
