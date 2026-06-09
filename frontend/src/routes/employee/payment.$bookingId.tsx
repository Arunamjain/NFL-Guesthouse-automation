import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Banknote, CreditCard, Smartphone, Wallet } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/common/Button";
import { FormInput } from "@/components/forms/FormInput";
import { TextAreaField } from "@/components/forms/TextAreaField";
import { SelectField } from "@/components/forms/SelectField";
import { BookingStepper } from "@/components/dashboard/BookingStepper";
import { PaymentOptionCard } from "@/components/payment/PaymentOptionCard";
import { Modal } from "@/components/common/Modal";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatINR, formatDate } from "@/utils/formatters";
import { getBookings } from "@/services/bookingService";
import { submitPayment } from "@/services/paymentService";

export const Route = createFileRoute("/employee/payment/$bookingId")({ component: PaymentPage });

const STEPS = ["Payment Started", "UTR Submitted", "Verification Pending", "Payment Verified"];

function PaymentPage() {
  const { bookingId } = Route.useParams();
  const navigate = useNavigate();
  const [b, setB] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState<"upi" | "card" | "nb" | "wallet" | any>("upi");
  const [utr, setUtr] = useState("");
  const [remarks, setRemarks] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getBookings()
      .then((list) => {
        const found = list.find((x) => x.id === bookingId);
        setB(found || null);
      })
      .catch((err) => console.error("Failed to load booking", err))
      .finally(() => setLoading(false));
  }, [bookingId]);

  if (loading) {
    return (
      <DashboardLayout requiredRole="employee">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading payment details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!b) return <DashboardLayout requiredRole="employee"><p>Booking not found.</p></DashboardLayout>;

  const step = b.paymentStatus === "Payment Verified" ? 3 : b.paymentStatus === "Payment Verification Pending" ? 2 : utr ? 1 : 0;

  const submit = async () => {
    if (!utr.trim()) return toast.error("Please enter UTR / Transaction ID.");
    try {
      await submitPayment(b.id, {
        amount: b.amount,
        utr,
        mode: method.toUpperCase(),
        remarks
      });
      setSuccess(true);
    } catch (err) {
      toast.error("Failed to submit payment details");
    }
  };

  return (
    <DashboardLayout requiredRole="employee">
      <PageHeader title="Make Payment" subtitle={`Booking ${b.id} — ${b.guestHouseName}`} />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-4">Choose payment method</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <PaymentOptionCard title="UPI" description="Pay via UPI ID or QR" icon={Smartphone} selected={method === "upi"} onSelect={() => setMethod("upi")} />
              <PaymentOptionCard title="Credit / Debit Card" description="Visa, Mastercard, RuPay" icon={CreditCard} selected={method === "card"} onSelect={() => setMethod("card")} />
              <PaymentOptionCard title="Net Banking" description="All major Indian banks" icon={Banknote} selected={method === "nb"} onSelect={() => setMethod("nb")} />
              <PaymentOptionCard title="Wallet / Other" description="Paytm, PhonePe & more" icon={Wallet} selected={method === "wallet"} onSelect={() => setMethod("wallet")} />
            </div>

            <div className="mt-6 rounded-lg border border-border p-4 bg-muted/30">
              {method === "upi" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="size-28 rounded bg-card border grid grid-cols-6 gap-px p-1">{Array.from({ length: 36 }).map((_, i) => <div key={i} className={i % 3 === 0 ? "bg-foreground" : ""} />)}</div>
                    <div><div className="text-xs text-muted-foreground">UPI ID</div><div className="font-mono">nflguesthouse@upi</div></div>
                  </div>
                  <Button variant="secondary" size="sm">I Have Paid</Button>
                </div>
              )}
              {method === "card" && (
                <div className="grid sm:grid-cols-2 gap-3">
                  <FormInput label="Card Number" placeholder="1234 5678 9012 3456" className="sm:col-span-2" />
                  <FormInput label="Name on Card" />
                  <FormInput label="Expiry" placeholder="MM/YY" />
                  <FormInput label="CVV" placeholder="•••" />
                  <Button className="sm:col-span-2" size="sm">Pay Securely</Button>
                </div>
              )}
              {method === "nb" && (
                <div className="grid sm:grid-cols-2 gap-3">
                  <SelectField label="Select Bank"><option>SBI</option><option>HDFC</option><option>ICICI</option><option>Axis</option></SelectField>
                  <div className="self-end"><Button size="sm">Proceed to Net Banking</Button></div>
                </div>
              )}
              {method === "wallet" && (
                <div className="grid sm:grid-cols-2 gap-3">
                  <FormInput label="Transaction reference" />
                  <div className="self-end"><Button size="sm">Submit Reference</Button></div>
                </div>
              )}
            </div>

            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              <FormInput label="UTR / Transaction ID" value={utr} onChange={(e) => setUtr(e.target.value)} placeholder="Enter your UTR" />
              <FormInput label="Payment Screenshot (upload)" type="file" />
              <div className="sm:col-span-2"><TextAreaField label="Payment Remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} /></div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Button onClick={submit}>Submit Payment Details</Button>
              <Link to="/employee/my-bookings"><Button variant="secondary">Back to Bookings</Button></Link>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Final booking confirmation and QR pass will be generated only after payment verification.</p>
          </div>
        </div>
        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold">Booking Summary</h3>
            <dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Guest House</dt><dd>{b.guestHouseName}</dd>
              <dt className="text-muted-foreground">Room Type</dt><dd>{b.roomType ?? "—"}</dd>
              <dt className="text-muted-foreground">Room No.</dt><dd>{b.roomNumber ?? "—"}</dd>
              <dt className="text-muted-foreground">Check-in</dt><dd>{formatDate(b.checkIn)}</dd>
              <dt className="text-muted-foreground">Check-out</dt><dd>{formatDate(b.checkOut)}</dd>
              <dt className="text-muted-foreground">Status</dt><dd><StatusBadge status={b.paymentStatus} /></dd>
            </dl>
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Amount</span>
              <span className="text-xl font-bold">{formatINR(b.amount)}</span>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-3">Payment Progress</h3>
            <BookingStepper steps={STEPS} currentStep={step} />
          </div>
        </aside>
      </div>
      <Modal open={success} onClose={() => setSuccess(false)} title="Payment submitted"
        footer={<Link to="/employee/my-bookings"><Button>Back to My Bookings</Button></Link>}>
        <p className="text-sm">Payment details submitted. HR/Admin will verify the transaction.</p>
      </Modal>
    </DashboardLayout>
  );
}
