import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { CheckCircle2, Download, Mail } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/common/Button";
import { QRPassCard } from "@/components/payment/QRPassCard";
import { Modal } from "@/components/common/Modal";
import { getBookings } from "@/services/bookingService";
import { api } from "@/services/api";

export const Route = createFileRoute("/employee/qr-pass/$bookingId")({ component: QRPassPage });

function QRPassPage() {
  const { bookingId } = Route.useParams();
  const navigate = useNavigate();
  const [b, setB] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [emailModal, setEmailModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const bookingsList = await getBookings();
        const found = bookingsList.find((x) => x.id === bookingId);
        if (found) {
          // If payment verified, generate QR pass in database
          if (found.paymentStatus === "Payment Verified") {
            try {
              await api.post(`/qr/${bookingId}/generate`);
            } catch (err) {
              console.log("QR already exists or generation returned status code", err);
            }
          }
          setB(found);
        }
      } catch (err) {
        console.error("Error loading booking details for QR", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [bookingId]);

  if (loading) {
    return (
      <DashboardLayout requiredRole="employee">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading QR pass...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!b) return <DashboardLayout requiredRole="employee"><p>Booking not found.</p></DashboardLayout>;
  if (b.paymentStatus !== "Payment Verified") return <DashboardLayout requiredRole="employee"><p className="text-sm">QR pass becomes available after payment verification.</p></DashboardLayout>;

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
