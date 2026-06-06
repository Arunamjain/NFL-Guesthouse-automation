import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/common/Button";
import { SelectField } from "@/components/forms/SelectField";
import { TextAreaField } from "@/components/forms/TextAreaField";
import { RatingInput } from "@/components/forms/RatingInput";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/lib/app-store";

export const Route = createFileRoute("/employee/feedback")({ component: FeedbackPage });

function FeedbackPage() {
  const { bookings, currentUser, addFeedback } = useApp();
  const navigate = useNavigate();
  const eligible = bookings.filter((b) => b.employeeId === currentUser?.id);
  const [form, setForm] = useState({ bookingId: eligible[0]?.id ?? "", overall: 0, cleanliness: 0, comfort: 0, staff: 0, website: 0, comments: "", suggestions: "" });
  const [open, setOpen] = useState(false);

  const reset = () => setForm({ bookingId: eligible[0]?.id ?? "", overall: 0, cleanliness: 0, comfort: 0, staff: 0, website: 0, comments: "", suggestions: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.overall) return toast.error("Please give an overall rating.");
    const b = bookings.find((x) => x.id === form.bookingId);
    addFeedback({
      id: `FB-${Math.floor(100 + Math.random() * 900)}`,
      bookingId: form.bookingId, employeeName: currentUser?.name ?? "—",
      guestHouseName: b?.guestHouseName ?? "—",
      overall: form.overall, cleanliness: form.cleanliness, comfort: form.comfort, staff: form.staff, website: form.website,
      comments: form.comments, suggestions: form.suggestions,
      submittedAt: new Date().toISOString().slice(0, 10),
      sentiment: form.overall >= 4 ? "Positive" : form.overall === 3 ? "Neutral" : "Negative",
    });
    setOpen(true);
  };

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
