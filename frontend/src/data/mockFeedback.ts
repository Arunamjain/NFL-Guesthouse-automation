import type { Feedback } from "@/types";

export const mockFeedback: Feedback[] = [
  { id: "FB-101", bookingId: "BKG-1018", employeeName: "Rahul Sharma", guestHouseName: "Vasundra Guest House", overall: 5, cleanliness: 5, comfort: 4, staff: 5, website: 4, comments: "Excellent stay. Staff was very helpful.", submittedAt: "2026-05-15", sentiment: "Positive" },
  { id: "FB-102", bookingId: "BKG-1009", employeeName: "Amit Verma", guestHouseName: "Dangoti Guest House", overall: 3, cleanliness: 3, comfort: 3, staff: 4, website: 3, comments: "Decent, but room could be cleaner.", submittedAt: "2026-04-22", sentiment: "Neutral" },
  { id: "FB-103", bookingId: "BKG-1011", employeeName: "Sneha Patel", guestHouseName: "Vasundra Guest House", overall: 2, cleanliness: 2, comfort: 3, staff: 2, website: 3, comments: "AC was not working. Reception slow.", submittedAt: "2026-04-30", sentiment: "Negative" },
];
