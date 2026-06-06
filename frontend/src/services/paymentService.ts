import { api } from "./api";
export async function submitPayment(bookingId: string, d: { utr: string; mode: string; remarks?: string }) { void api; return { bookingId, ...d }; }
export async function verifyPayment(bookingId: string) { return { bookingId }; }
export async function rejectPayment(bookingId: string, reason: string) { return { bookingId, reason }; }
