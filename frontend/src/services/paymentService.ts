import { api } from "./api";

export async function submitPayment(bookingId: string, d: { amount: number; utr: string; mode: string; remarks?: string }) {
  const res = await api.post("/payments/submit", {
    booking_id: bookingId,
    amount: d.amount,
    utr_number: d.utr,
    payment_screenshot_url: d.remarks || null // using remarks as placeholder for screenshot url or similar
  });
  return res.data;
}

export async function getPayments() {
  const res = await api.get("/payments/");
  return res.data;
}

export async function getPaymentByBooking(bookingId: string) {
  try {
    const res = await api.get(`/payments/${bookingId}`);
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function verifyPayment(paymentId: string, verifiedBy: string) {
  const res = await api.patch(`/payments/${paymentId}/verify`, {
    verified_by: verifiedBy
  });
  return res.data;
}

export async function rejectPayment(paymentId: string, reason: string, verifiedBy: string) {
  const res = await api.patch(`/payments/${paymentId}/reject`, {
    verified_by: verifiedBy,
    rejection_reason: reason
  });
  return res.data;
}

