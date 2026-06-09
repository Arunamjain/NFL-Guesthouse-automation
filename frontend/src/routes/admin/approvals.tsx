import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Button } from "@/components/common/Button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Modal } from "@/components/common/Modal";
import { SelectField } from "@/components/forms/SelectField";
import { TextAreaField } from "@/components/forms/TextAreaField";
import { useApp } from "@/lib/app-store";
import { cn } from "@/lib/utils";
import type { Booking, RoomType } from "@/types";
import { formatDate } from "@/utils/formatters";
import { getBookings, approveBooking, rejectBooking } from "@/services/bookingService";
import { api } from "@/services/api";

export const Route = createFileRoute("/admin/approvals")({ component: ApprovalsPage });

const TABS = ["All", "Pending", "Approved", "Rejected"] as const;

function ApprovalsPage() {
  const { currentUser } = useApp();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<typeof TABS[number]>("Pending");
  const [view, setView] = useState<Booking | null>(null);
  const [approve, setApprove] = useState<Booking | null>(null);
  const [reject, setReject] = useState<Booking | null>(null);
  const [reason, setReason] = useState("");
  const [appr, setAppr] = useState({ roomType: "" as RoomType | "", roomNumber: "", remarks: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsData, roomsData] = await Promise.all([
          getBookings(),
          api.get("/admin/rooms"),
        ]);
        setBookings(bookingsData);
        setRooms(roomsData.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const rows = useMemo(() => bookings.filter((b) => {
    if (tab === "All") return true;
    if (tab === "Pending") return b.hrStatus === "Pending Approval";
    return b.hrStatus === tab;
  }), [bookings, tab]);

  const suggestedTypes = (b: Booking | null): RoomType[] => b?.category === "Executive Employee"
    ? ["Executive Suite", "Executive Room"] : ["Standard Room", "Non-Executive Room"];

  const openApprove = (b: Booking) => {
    const sug = suggestedTypes(b);
    setAppr({ roomType: sug[0], roomNumber: "", remarks: "" });
    setApprove(b);
  };

  const doApprove = async () => {
    if (!approve || !appr.roomType || !appr.roomNumber) return toast.error("Select room type and number");
    try {
      await approveBooking(approve.id, {
        roomType: appr.roomType,
        roomNumber: appr.roomNumber,
        remarks: appr.remarks,
      }, currentUser?.id || "");
      setBookings((prev) => prev.map((b) => b.id === approve.id ? {
        ...b,
        hrStatus: "Approved",
        bookingStatus: "Payment Pending",
        paymentStatus: "Payment Pending",
        roomType: appr.roomType as RoomType,
        roomNumber: appr.roomNumber,
        hrRemarks: appr.remarks,
      } : b));
      toast.success("Booking approved. Employee can now complete payment.");
      setApprove(null);
    } catch (err) {
      toast.error("Failed to approve booking");
    }
  };

  const doReject = async () => {
    if (!reject || !reason.trim()) return toast.error("Reason required");
    try {
      await rejectBooking(reject.id, reason, currentUser?.id || "");
      setBookings((prev) => prev.map((b) => b.id === reject.id ? {
        ...b,
        hrStatus: "Rejected",
        bookingStatus: "Rejected",
        hrRemarks: reason,
      } : b));
      toast.success("Booking request rejected with HR remarks.");
      setReject(null);
      setReason("");
    } catch (err) {
      toast.error("Failed to reject booking");
    }
  };

  const cols: Column<Booking>[] = [
    { key: "id", header: "Booking ID", render: (b) => <span className="font-mono text-xs">{b.id}</span> },
    { key: "emp", header: "Employee", render: (b) => <div><div className="font-medium">{b.employeeName}</div><div className="text-xs text-muted-foreground">{b.employeeId} · {b.department}</div></div> },
    { key: "desg", header: "Designation", render: (b) => b.designation },
    { key: "cat", header: "Category", render: (b) => <span className="text-xs">{b.category}</span> },
    { key: "gh", header: "Guest House", render: (b) => b.guestHouseName },
    { key: "date", header: "Stay", render: (b) => <div className="text-xs">{formatDate(b.checkIn)} → {formatDate(b.checkOut)}</div> },
    { key: "sug", header: "Suggested", render: (b) => <span className="text-xs">{suggestedTypes(b).join(" / ")}</span> },
    { key: "stat", header: "Status", render: (b) => <StatusBadge status={b.hrStatus} /> },
    { key: "act", header: "Actions", render: (b) => (
      <div className="flex gap-1.5">
        <Button size="sm" variant="ghost" onClick={() => setView(b)}>View</Button>
        <Button size="sm" variant="success" disabled={b.hrStatus !== "Pending Approval"} onClick={() => openApprove(b)}>Approve</Button>
        <Button size="sm" variant="danger" disabled={b.hrStatus !== "Pending Approval"} onClick={() => setReject(b)}>Reject</Button>
      </div>
    )},
  ];

  if (loading) return (
    <DashboardLayout requiredRole="admin">
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading approvals...</p>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout requiredRole="admin">
      <PageHeader title="Approval Requests" subtitle="Verify employee designation and approve or reject booking requests." />
      <div className="inline-flex bg-muted p-1 rounded-lg mb-4">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={cn("px-4 py-1.5 text-sm rounded-md", tab === t ? "bg-card shadow" : "text-muted-foreground")}>{t}</button>
        ))}
      </div>
      <DataTable columns={cols} rows={rows} />

      {/* View */}
      <Modal open={!!view} onClose={() => setView(null)} title={view?.id ?? ""} size="lg" footer={<Button onClick={() => setView(null)}>Close</Button>}>
        {view && (
          <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <Row k="Employee" v={`${view.employeeName} (${view.employeeId})`} />
            <Row k="Email" v={view.employeeEmail} />
            <Row k="Department" v={view.department} />
            <Row k="Designation" v={view.designation} />
            <Row k="Category" v={view.category} />
            <Row k="Guest House" v={view.guestHouseName} />
            <Row k="Check-in" v={formatDate(view.checkIn)} />
            <Row k="Check-out" v={formatDate(view.checkOut)} />
            <Row k="Purpose" v={view.purpose} />
            <Row k="HR Status" v={<StatusBadge status={view.hrStatus} />} />
            {view.hrRemarks && <div className="sm:col-span-2"><dt className="text-muted-foreground text-xs">Remarks</dt><dd>{view.hrRemarks}</dd></div>}
          </dl>
        )}
      </Modal>

      {/* Approve */}
      <Modal open={!!approve} onClose={() => setApprove(null)} title="Approve booking" size="lg"
        footer={<>
          <Button variant="secondary" onClick={() => setApprove(null)}>Cancel</Button>
          <Button variant="success" onClick={doApprove}>Approve Booking</Button>
        </>}>
        {approve && (
          <div className="space-y-4 text-sm">
            <div className="grid sm:grid-cols-2 gap-3">
              <Info k="Employee" v={`${approve.employeeName} (${approve.employeeId})`} />
              <Info k="Category" v={approve.category} />
              <Info k="Designation" v={approve.designation} />
              <Info k="Guest House" v={approve.guestHouseName} />
              <Info k="Stay" v={`${formatDate(approve.checkIn)} → ${formatDate(approve.checkOut)}`} />
              <Info k="Suggested" v={suggestedTypes(approve).join(" / ")} />
            </div>
            <SelectField label="Final Room Type" value={appr.roomType} onChange={(e) => setAppr({ ...appr, roomType: e.target.value as RoomType })}>
              <option value="">Select…</option>
              {suggestedTypes(approve).map((t) => <option key={t}>{t}</option>)}
            </SelectField>
            <SelectField label="Room Number" value={appr.roomNumber} onChange={(e) => setAppr({ ...appr, roomNumber: e.target.value })}>
              <option value="">Select…</option>
              {rooms.filter((r) => r.guest_house_id === approve.guestHouseId && r.is_active).map((r) => (
                <option key={r.id} value={r.room_number}>{r.room_number}</option>
              ))}
            </SelectField>
            <TextAreaField label="HR Remarks" value={appr.remarks} onChange={(e) => setAppr({ ...appr, remarks: e.target.value })} />
          </div>
        )}
      </Modal>

      {/* Reject */}
      <Modal open={!!reject} onClose={() => { setReject(null); setReason(""); }} title="Reject booking"
        footer={<>
          <Button variant="secondary" onClick={() => { setReject(null); setReason(""); }}>Cancel</Button>
          <Button variant="danger" onClick={doReject}>Reject Booking</Button>
        </>}>
        <TextAreaField label="Rejection reason" value={reason} onChange={(e) => setReason(e.target.value)} />
      </Modal>
    </DashboardLayout>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) { return (<><dt className="text-muted-foreground text-xs">{k}</dt><dd>{v}</dd></>); }
function Info({ k, v }: { k: string; v: React.ReactNode }) {
  return (<div className="rounded-lg border border-border p-2.5"><div className="text-xs text-muted-foreground">{k}</div><div className="font-medium">{v}</div></div>);
}