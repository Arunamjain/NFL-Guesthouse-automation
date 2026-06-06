import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Download, Mail } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/common/Button";
import { QRPassCard } from "@/components/payment/QRPassCard";
import { Modal } from "@/components/common/Modal";
import { useApp } from "@/lib/app-store";

export const Route = createFileRoute("/employee/qr-pass/$bookingId")({ component: QRPassPage });

function QRPassPage() {
  const { bookingId } = Route.useParams();
  const { bookings } = useApp();
  const navigate = useNavigate();
  const b = bookings.find((x) => x.id === bookingId);
  const [emailModal, setEmailModal] = useState(false);
  if (!b) return <DashboardLayout requiredRole="employee"><p>Booking not found.</p></DashboardLayout>;
  if (b.bookingStatus !== "Confirmed") return <DashboardLayout requiredRole="employee"><p className="text-sm">QR pass becomes available after payment verification.</p></DashboardLayout>;

  return (
    <DashboardLayout requiredRole="employee">
      <div className="text-center mb-6">
        <div className="size-14 mx-auto rounded-full bg-success/15 text-success flex items-center justify-center"><CheckCircle2 className="size-7" /></div>
        <h1 className="mt-3 text-2xl font-bold">Booking Confirmed</h1>
        <p className="text-sm text-muted-foreground">Your guest house booking has been confirmed. Please show this QR pass during check-in.</p>
      </div>

      <QRPassCard b={b} />

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button leftIcon={<Download className="size-4" />} onClick={() => toast.success("QR pass download started.")}>Download QR Pass</Button>
        <Button variant="secondary" leftIcon={<Mail className="size-4" />} onClick={() => setEmailModal(true)}>Email Confirmation</Button>
        <Button variant="ghost" onClick={() => navigate({ to: "/employee/dashboard" })}>Back to Dashboard</Button>
        <Link to="/employee/feedback"><Button variant="secondary">Submit Feedback</Button></Link>
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-5 max-w-xl mx-auto">
        <h3 className="font-semibold mb-2">Instructions</h3>
        <ul className="list-disc pl-5 text-sm text-foreground/80 space-y-1">
          <li>Carry your employee ID at all times.</li>
          <li>Show this QR pass at the reception during check-in.</li>
          <li>Follow guest house rules and timings.</li>
          <li>For changes, contact the HR desk.</li>
        </ul>
      </div>

      <Modal open={emailModal} onClose={() => setEmailModal(false)} title="Email sent" footer={<Button onClick={() => setEmailModal(false)}>Close</Button>}>
        <p className="text-sm">Booking confirmation email has been sent to your registered email address.</p>
      </Modal>
    </DashboardLayout>
  );
}
