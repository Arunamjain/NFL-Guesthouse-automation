import type { Payment } from "@/types";

export const mockPayments: Payment[] = [
  { id: "PAY-501", bookingId: "BKG-1018", employeeName: "Rahul Sharma", guestHouseName: "Vasundra Guest House", amount: 7000, mode: "UPI", utr: "UTR82736452", submittedAt: "2026-05-02", status: "Verified" },
  { id: "PAY-502", bookingId: "BKG-1021", employeeName: "Priya Mehta", guestHouseName: "Dangoti Guest House", amount: 2800, mode: "Card", utr: "UTR99182734", submittedAt: "2026-05-26", status: "Verification Pending" },
];
