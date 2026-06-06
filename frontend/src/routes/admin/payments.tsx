import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Button } from "@/components/common/Button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Modal } from "@/components/common/Modal";
import { TextAreaField } from "@/components/forms/TextAreaField";
import { SelectField } from "@/components/forms/SelectField";
import { useApp } from "@/lib/app-store";
import type { Booking } from "@/types";
import { formatINR, formatDate } from "@/utils/formatters";

export const Route = createFileRoute("/admin/payments")({ component: PaymentVerification });

function PaymentVerification() {
  const { bookings, updateBooking } = useApp();
  const [filter, setFilter] = useState("Verification Pending");
  const [view, setView] = useState<Booking | null>(null);
  const [reject, setReject] = useState<Booking | null>(null);
  const [reason, setReason] = useState("");

  const rows = useMemo(() => bookings.filter((b) => {
    if (filter === "All") return ["Payment Verification Pending", "Payment Verified", "Failed"].includes(b.paymentStatus);
    if (filter === "Verification Pending") return b.paymentStatus === "Payment Verification Pending";
    if (filter === "Verified") return b.paymentStatus === "Payment Verified";
    if (filter === "Failed") return b.paymentStatus === "Failed";
    return true;
  }), [bookings, filter]);

  const verify = (b: Booking) => {
    updateBooking(b.id, { paymentStatus: "Payment Verified", bookingStatus: "Confirmed", qrGenerated: true, emailSent: true });
    toast.success("Payment verified. Booking confirmed and email sent to employee.");
    setView(null);
  };
  const doReject = () => {
    if (!reject || !reason.trim()) return toast.error("Reason required");
    updateBooking(reject.id, { paymentStatus: "Failed", hrRemarks: reason });
    toast.success("Payment rejected. Employee must resubmit payment details.");
    setReject(null); setReason("");
  };

  const cols: Column<Booking>[] = [
    { key: "id", header: "Booking ID", render: (b) => <span className="font-mono text-xs">{b.id}</span> },
    { key: "e", header: "Employee", render: (b) => b.employeeName },
    { key: "gh", header: "Guest House", render: (b) => b.guestHouseName },
    { key: "a", header: "Amount", render: (b) => formatINR(b.amount) },
    { key: "m", header: "Mode", render: (b) => b.paymentMode ?? "—" },
    { key: "u", header: "UTR", render: (b) => <span className="font-mono text-xs">{b.utr ?? "—"}</span> },
    { key: "d", header: "Submitted", render: (b) => formatDate(b.createdAt) },
    { key: "s", header: "Status", render: (b) => <StatusBadge status={b.paymentStatus} /> },
    { key: "act", header: "Actions", render: (b) => (
      <div className="flex gap-1.5">
        <Button size="sm" variant="ghost" onClick={() => setView(b)}>View</Button>
        <Button size="sm" variant="success" disabled={b.paymentStatus !== "Payment Verification Pending"} onClick={() => verify(b)}>Verify</Button>
        <Button size="sm" variant="danger" disabled={b.paymentStatus !== "Payment Verification Pending"} onClick={() => setReject(b)}>Reject</Button>
      </div>
    ) },
  ];

  return (
    <DashboardLayout requiredRole="admin">
      <PageHeader title="Payment Verification" subtitle="Verify employee UTRs and confirm bookings." />
      <div className="flex gap-3 mb-4">
        <SelectField value={filter} onChange={(e) => setFilter(e.target.value)} className="max-w-xs">
          <option>Verification Pending</option><option>Verified</option><option>Failed</option><option>All</option>
        </SelectField>
      </div>
      <DataTable columns={cols} rows={rows} />

      <Modal open={!!view} onClose={() => setView(null)} title={view ? `Payment for ${view.id}` : ""} size="lg"
        footer={view && <>
          <Button variant="secondary" onClick={() => setView(null)}>Close</Button>
          <Button variant="danger" disabled={view.paymentStatus !== "Payment Verification Pending"} onClick={() => { setReject(view); setView(null); }}>Reject</Button>
          <Button variant="success" disabled={view.paymentStatus !== "Payment Verification Pending"} onClick={() => verify(view)}>Verify Payment</Button>
        </>}>
        {view && (
          <div className="space-y-4 text-sm">
            <div className="grid sm:grid-cols-2 gap-3">
              <Info k="Employee" v={view.employeeName} />
              <Info k="Guest House" v={view.guestHouseName} />
              <Info k="Amount" v={formatINR(view.amount)} />
              <Info k="Mode" v={view.paymentMode ?? "—"} />
              <Info k="UTR" v={view.utr ?? "—"} />
              <Info k="Status" v={<StatusBadge status={view.paymentStatus} />} />
            </div>
            <div className="rounded-lg border border-dashed border-border h-40 flex items-center justify-center text-sm text-muted-foreground bg-muted/30">Payment screenshot preview</div>
          </div>
        )}
      </Modal>

      <Modal open={!!reject} onClose={() => { setReject(null); setReason(""); }} title="Reject payment"
        footer={<>
          <Button variant="secondary" onClick={() => { setReject(null); setReason(""); }}>Cancel</Button>
          <Button variant="danger" onClick={doReject}>Reject Payment</Button>
        </>}>
        <TextAreaField label="Reason" value={reason} onChange={(e) => setReason(e.target.value)} />
      </Modal>
    </DashboardLayout>
  );
}

function Info({ k, v }: { k: string; v: React.ReactNode }) {
  return (<div className="rounded-lg border border-border p-2.5"><div className="text-xs text-muted-foreground">{k}</div><div className="font-medium">{v}</div></div>);
}
