import { api } from "./api";
import type { Feedback } from "@/types";

export async function submitFeedback(d: Partial<Feedback> & { employeeId: string }) {
  const res = await api.post("/feedback/", {
    booking_id: d.bookingId,
    employee_id: d.employeeId,
    overall: d.overall || 5,
    cleanliness: d.cleanliness || 5,
    comfort: d.comfort || 5,
    staff: d.staff || 5,
    website: d.website || 5,
    comments: d.comments || "",
    suggestions: d.suggestions || "",
    sentiment: d.sentiment || "Positive"
  });
  return res.data;
}

export async function getFeedback(): Promise<Feedback[]> {
  const res = await api.get("/feedback/");
  return res.data;
}

