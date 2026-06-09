import { api } from "./api";
import type { Booking } from "@/types";

// Map backend status to frontend BookingStatus type
function mapStatus(backendStatus: string): string {
  const statusMap: Record<string, string> = {
    pending: "Pending Approval",
    approved: "Approved",
    rejected: "Rejected",
    payment_pending: "Payment Pending",
    payment_submitted: "Payment Verification Pending",
    payment_verified: "Confirmed",
    checked_in: "Confirmed",
    checked_out: "Confirmed",
    cancelled: "Cancelled",
  };
  return statusMap[backendStatus] || backendStatus;
}

export async function getBookings(): Promise<Booking[]> {
  const res = await api.get("/bookings/");
  return res.data.map((b: any) => ({
    id: b.id,
    employeeId: b.employee_id,
    employeeName: b.employee_name || "Employee",
    employeeEmail: b.employee_email || "",
    department: b.department || "",
    designation: b.designation || "",
    category: b.category || "Non-Executive Employee",
    guestHouseId: b.guest_house_id,
    guestHouseName: b.guest_house_name || "",
    checkIn: b.check_in_date,
    checkOut: b.check_out_date,
    guests: b.no_of_guests,
    purpose: b.purpose_of_visit,
    hrStatus: b.status === "rejected" ? "Rejected" : b.status === "approved" ? "Approved" : "Pending Approval",
    paymentStatus: b.status === "payment_verified" ? "Payment Verified" : b.status === "payment_submitted" ? "Payment Verification Pending" : "Not Started",
    bookingStatus: mapStatus(b.status) as any,
    amount: b.amount || 0,
    emailSent: false,
    qrGenerated: b.qr_generated || false,
    createdAt: b.created_at,
    roomType: b.room_type,
    roomNumber: b.room_number,
    hrRemarks: b.hr_remarks,
  }));
}

export async function getMyBookings(employeeId: string): Promise<Booking[]> {
  const res = await api.get(`/bookings/my/${employeeId}`);
  return res.data.map((b: any) => ({
    id: b.id,
    employeeId: b.employee_id,
    employeeName: b.employee_name || "Employee",
    employeeEmail: b.employee_email || "",
    department: b.department || "",
    designation: b.designation || "",
    category: b.category || "Non-Executive Employee",
    guestHouseId: b.guest_house_id,
    guestHouseName: b.guest_house_name || "",
    checkIn: b.check_in_date,
    checkOut: b.check_out_date,
    guests: b.no_of_guests,
    purpose: b.purpose_of_visit,
    hrStatus: b.status === "rejected" ? "Rejected" : b.status === "approved" ? "Approved" : "Pending Approval",
    paymentStatus: b.status === "payment_verified" ? "Payment Verified" : b.status === "payment_submitted" ? "Payment Verification Pending" : "Not Started",
    bookingStatus: mapStatus(b.status) as any,
    amount: b.amount || 0,
    emailSent: false,
    qrGenerated: false,
    createdAt: b.created_at,
    roomType: b.room_type,
    roomNumber: b.room_number,
    hrRemarks: b.hr_remarks,
  }));
}

export async function createBooking(data: Partial<Booking>) {
  const res = await api.post("/bookings/", {
    employee_id: data.employeeId,
    guest_house_id: data.guestHouseId,
    check_in_date: data.checkIn,
    check_out_date: data.checkOut,
    purpose_of_visit: data.purpose,
    no_of_guests: data.guests || 1,
  });
  return res.data;
}

export async function approveBooking(
  id: string,
  p: { roomType: string; roomNumber: string; remarks?: string },
  approvedBy: string
) {
  const res = await api.patch(`/bookings/${id}/approve`, {
    status: "approved",
    hr_remarks: p.remarks,
    approved_by: approvedBy,
  });
  return res.data;
}

export async function rejectBooking(id: string, reason: string, rejectedBy: string) {
  const res = await api.patch(`/bookings/${id}/reject`, {
    status: "rejected",
    hr_remarks: reason,
    approved_by: rejectedBy,
  });
  return res.data;
}

export async function cancelBooking(id: string) {
  const res = await api.patch(`/bookings/${id}/reject`, {
    status: "cancelled",
  });
  return res.data;
}

export async function checkinBooking(id: string) {
  const res = await api.patch(`/bookings/${id}/checkin`);
  return res.data;
}

export async function checkoutBooking(id: string) {
  const res = await api.patch(`/bookings/${id}/checkout`);
  return res.data;
}