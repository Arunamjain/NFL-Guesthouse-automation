import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/common/Button";
import { SelectField } from "@/components/forms/SelectField";
import { TextAreaField } from "@/components/forms/TextAreaField";
import { RatingInput } from "@/components/forms/RatingInput";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/lib/app-store";
import { getMyBookings } from "@/services/bookingService";
import { submitFeedback } from "@/services/feedbackService";
import type { Booking } from "@/types";

export const Route = createFileRoute("/employee/feedback")({ component: FeedbackPage });

function FeedbackPage() {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ bookingId: "", overall: 0, cleanliness: 0, comfort: 0, staff: 0, website: 0, comments: "", suggestions: "" });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (currentUser?.id) {
      getMyBookings(currentUser.id)
        .then((list) => {
          setBookings(list);
          if (list.length > 0) {
            setForm((f) => ({ ...f, bookingId: list[0].id }));
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [currentUser]);

  const eligible = bookings;

  const reset = () => setForm({ bookingId: eligible[0]?.id ?? "", overall: 0, cleanliness: 0, comfort: 0, staff: 0, website: 0, comments: "", suggestions: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.overall) return toast.error("Please give an overall rating.");
    const b = bookings.find((x) => x.id === form.bookingId);
    try {
      await submitFeedback({
        bookingId: form.bookingId,
        employeeId: currentUser?.id || "",
        guestHouseName: b?.guestHouseName || "—",
        overall: form.overall,
        cleanliness: form.cleanliness,
        comfort: form.comfort,
        staff: form.staff,
        website: form.website,
        comments: form.comments,
        suggestions: form.suggestions,
        sentiment: form.overall >= 4 ? "Positive" : form.overall === 3 ? "Neutral" : "Negative"
      });
      setOpen(true);
    } catch (err) {
      toast.error("Failed to submit feedback");
    }
  };

  if (loading) {
    return (
      <DashboardLayout requiredRole="employee">
        <PageHeader title="Submit Feedback" subtitle="Help us improve the guest house experience." />
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading bookings...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout requiredRole="employee">
      <PageHeader title="Submit Feedback" subtitle="Help us improve the guest house experience." />
      <form className="rounded-xl border border-border bg-card p-6 space-y-6 max-w-3xl" onSubmit={submit}>
        <SelectField label="Select Booking" value={form.bookingId} onChange={(e) => setForm({ ...form, bookingId: e.target.value })}>
          {eligible.map((b) => <option key={b.id} value={b.id}>{b.id} — {b.guestHouseName}</option>)}
        </SelectField>
        <div className="grid sm:grid-cols-2 gap-4">
          <RatingInput label="Overall Stay" value={form.overall} onChange={(n) => setForm({ ...form, overall: n })} />
          <RatingInput label="Cleanliness" value={form.cleanliness} onChange={(n) => setForm({ ...form, cleanliness: n })} />
          <RatingInput label="Room Comfort" value={form.comfort} onChange={(n) => setForm({ ...form, comfort: n })} />
          <RatingInput label="Staff Behavior" value={form.staff} onChange={(n) => setForm({ ...form, staff: n })} />
          <RatingInput label="Website Experience" value={form.website} onChange={(n) => setForm({ ...form, website: n })} />
        </div>
        <TextAreaField label="Comments" placeholder="Tell us about your stay experience..." value={form.comments} onChange={(e) => setForm({ ...form, comments: e.target.value })} />
        <TextAreaField label="Suggestions" placeholder="Suggest improvements for guest house or website experience..." value={form.suggestions} onChange={(e) => setForm({ ...form, suggestions: e.target.value })} />
        <div className="flex gap-2">
          <Button type="submit">Submit Feedback</Button>
          <Button type="button" variant="secondary" onClick={reset}>Reset Form</Button>
        </div>
      </form>
      <Modal open={open} onClose={() => setOpen(false)} title="Thank you!" footer={<Button onClick={() => { setOpen(false); navigate({ to: "/employee/dashboard" }); }}>Go to Dashboard</Button>}>
        <p className="text-sm">Thank you for your feedback. Your response has been submitted successfully.</p>
      </Modal>
    </DashboardLayout>
  );
}
