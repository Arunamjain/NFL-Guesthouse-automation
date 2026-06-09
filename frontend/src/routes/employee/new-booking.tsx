import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/common/Button";
import { FormInput } from "@/components/forms/FormInput";
import { SelectField } from "@/components/forms/SelectField";
import { TextAreaField } from "@/components/forms/TextAreaField";
import { BookingStepper } from "@/components/dashboard/BookingStepper";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/lib/app-store";
import type { Booking, EmployeeCategory, GuestHouseId } from "@/types";
import { createBooking } from "@/services/bookingService";
import { api } from "@/services/api";

export const Route = createFileRoute("/employee/new-booking")({
  validateSearch: (s: Record<string, unknown>): { gh?: GuestHouseId } => ({
    gh: s.gh === "vasundra" || s.gh === "dangoti" ? s.gh : undefined,
  }),
  component: NewBookingPage,
});

const STEPS = ["Employee Details", "Stay Details", "Review & Submit"];

function NewBookingPage() {
  const { gh: ghParam } = Route.useSearch();
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const [ghList, setGhList] = useState<any[]>([]);
  const [form, setForm] = useState({
    employeeId: currentUser?.id ?? "",
    name: currentUser?.name ?? "",
    email: currentUser?.email ?? "",
    department: currentUser?.department ?? "",
    designation: currentUser?.designation ?? "",
    category: (currentUser?.category ?? "Executive Employee") as EmployeeCategory,
    guestHouseId: (ghParam ?? "vasundra") as GuestHouseId,
    checkIn: "",
    checkOut: "",
    guests: 1,
    purpose: "",
    requirements: "",
  });

  useEffect(() => {
    api.get("/admin/guest-houses")
      .then((res) => setGhList(res.data))
      .catch((err) => console.error("Error fetching guest houses", err));
  }, []);

  const ghName = form.guestHouseId === "vasundra" ? "Vasundra Guest House" : "Dangoti Guest House";
  const eligibility = form.category === "Executive Employee"
    ? "Eligible for Executive Suite/Executive Room, subject to HR approval."
    : "Eligible for Standard/Non-Executive Room, subject to HR approval.";

  const validateStep1 = () => form.employeeId && form.name && form.email && form.department && form.designation;
  const validateStep2 = () => form.checkIn && form.checkOut && form.purpose;

  const next = () => {
    if (step === 0 && !validateStep1()) return toast.error("Please fill all employee details.");
    if (step === 1 && !validateStep2()) return toast.error("Please complete stay details.");
    setStep((s) => s + 1);
  };

  const submit = async () => {
    try {
      const ghItem = ghList.find((g) => g.name.toLowerCase().includes(form.guestHouseId));
      const ghUuid = ghItem ? ghItem.id : form.guestHouseId;

      await createBooking({
        employeeId: form.employeeId,
        guestHouseId: ghUuid,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        purpose: form.purpose,
        guests: form.guests,
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit booking request. Please check room availability for selected dates.");
    }
  };

  return (
    <DashboardLayout requiredRole="employee">
      <PageHeader title="New Booking Request" subtitle="Submit your guest house request — HR will verify and approve." />
      <div className="rounded-xl border border-border bg-card p-6">
        <BookingStepper steps={STEPS} currentStep={step} />
        <div className="mt-6">
          {step === 0 && (
            <div className="grid sm:grid-cols-2 gap-4">
              <FormInput label="Employee ID" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} />
              <FormInput label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <FormInput label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <FormInput label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
              <FormInput label="Designation" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
              <SelectField label="Employee Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as EmployeeCategory })}>
                <option>Executive Employee</option>
                <option>Non-Executive Employee</option>
              </SelectField>
            </div>
          )}
          {step === 1 && (
            <div className="grid sm:grid-cols-2 gap-4">
              <SelectField label="Guest House" value={form.guestHouseId} onChange={(e) => setForm({ ...form, guestHouseId: e.target.value as GuestHouseId })}>
                <option value="vasundra">Vasundra Guest House</option>
                <option value="dangoti">Dangoti Guest House</option>
              </SelectField>
              <FormInput label="Number of Guests" type="number" min={1} max={4} value={form.guests} onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })} />
              <FormInput label="Check-in Date" type="date" value={form.checkIn} onChange={(e) => setForm({ ...form, checkIn: e.target.value })} />
              <FormInput label="Check-out Date" type="date" value={form.checkOut} onChange={(e) => setForm({ ...form, checkOut: e.target.value })} />
              <FormInput label="Purpose of Visit" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} className="sm:col-span-2" />
              <div className="sm:col-span-2"><TextAreaField label="Special Requirements" value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} /></div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <div className="rounded-lg border border-border p-4">
                <h3 className="font-semibold mb-3">Booking Summary</h3>
                <dl className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <Item k="Employee" v={`${form.name} (${form.employeeId})`} />
                  <Item k="Department" v={form.department} />
                  <Item k="Designation" v={form.designation} />
                  <Item k="Category" v={form.category} />
                  <Item k="Guest House" v={ghName} />
                  <Item k="Check-in" v={form.checkIn} />
                  <Item k="Check-out" v={form.checkOut} />
                  <Item k="Guests" v={form.guests} />
                  <Item k="Purpose" v={form.purpose} />
                </dl>
              </div>
              <div className="rounded-lg bg-info/10 border border-info/30 p-4 text-sm">
                <strong className="text-info">Eligibility:</strong> {eligibility}
              </div>
              <p className="text-xs text-muted-foreground">Room or suite allocation is subject to HR approval based on designation and employee category.</p>
            </div>
          )}
        </div>
        <div className="flex flex-wrap justify-between gap-2 mt-6 pt-6 border-t border-border">
          <div className="flex gap-2">
            {step > 0 && <Button variant="secondary" onClick={() => setStep((s) => s - 1)}>Back</Button>}
            <Button variant="ghost" onClick={() => navigate({ to: "/employee/dashboard" })}>Cancel</Button>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => toast.success("Booking draft saved.")}>Save Draft</Button>
            {step < 2 ? <Button onClick={next}>Next</Button> : <Button variant="success" onClick={submit}>Submit Request</Button>}
          </div>
        </div>
      </div>
      <Modal open={success} onClose={() => setSuccess(false)} title="Request submitted"
        footer={<Link to="/employee/my-bookings"><Button>View My Bookings</Button></Link>}>
        <p className="text-sm">Booking request submitted successfully to HR for approval.</p>
      </Modal>
    </DashboardLayout>
  );
}

function Item({ k, v }: { k: string; v: React.ReactNode }) {
  return (<><dt className="text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></>);
}
