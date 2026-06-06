import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/common/Button";
import { RoomTypeCard } from "@/components/guesthouse/RoomTypeCard";
import { mockGuestHouses } from "@/data/mockGuestHouses";

export const Route = createFileRoute("/employee/guest-houses/$id")({ component: GHDetail });

function GHDetail() {
  const { id } = Route.useParams();
  const gh = mockGuestHouses.find((g) => g.id === id);
  const navigate = useNavigate();
  if (!gh) return <DashboardLayout requiredRole="employee"><p>Guest house not found.</p></DashboardLayout>;

  const scrollRules = () => document.getElementById("rules")?.scrollIntoView({ behavior: "smooth" });

  return (
    <DashboardLayout requiredRole="employee">
      <div className="aspect-[21/9] rounded-xl overflow-hidden bg-muted mb-6"><img src={gh.image} alt={gh.name} className="w-full h-full object-cover" /></div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-2xl font-bold">{gh.name}</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="size-4" /> {gh.location}</p>
            <p className="mt-3 text-foreground/80">{gh.description}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {gh.facilities.map((f) => <span key={f} className="px-2 py-0.5 rounded-full bg-muted text-xs">{f}</span>)}
            </div>
          </div>
          <section>
            <h2 className="text-lg font-semibold mb-3">Room Categories</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <RoomTypeCard name="Executive Suite" image="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80" description="For executive employees and senior officials. Includes premium room facilities." eligibility="Executive only" />
              <RoomTypeCard name="Executive Room" description="For executive employees based on HR approval and availability." eligibility="Executive only" />
              <RoomTypeCard name="Standard Room" image="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80" description="For non-executive employees and standard official stays." eligibility="Non-Executive" />
              <RoomTypeCard name="Non-Executive Room" description="For non-executive employees based on HR approval and availability." eligibility="Non-Executive" />
            </div>
          </section>
          <section id="rules" className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-2">Rules & Guidelines</h2>
            <ul className="list-disc pl-5 text-sm text-foreground/80 space-y-1">
              <li>Valid employee ID required at check-in.</li>
              <li>Room allocation subject to HR approval.</li>
              <li>Payment verification required before confirmation.</li>
              <li>QR pass required during check-in.</li>
              <li>Check-in/check-out timing decided by guest house desk.</li>
              <li>Damage or misuse may be reported to HR.</li>
            </ul>
          </section>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-6 sticky top-24">
            <h3 className="font-semibold">Want to stay at this guest house?</h3>
            <p className="text-sm text-muted-foreground mt-1">Submit a booking request and HR will verify your designation before assigning a room or suite.</p>
            <div className="mt-4 grid gap-2">
              <Button fullWidth onClick={() => navigate({ to: "/employee/new-booking", search: { gh: gh.id } })}>Request Booking</Button>
              <Link to="/employee/guest-houses"><Button fullWidth variant="secondary">Back to Guest Houses</Button></Link>
              <Button fullWidth variant="ghost" onClick={scrollRules}>View Rules</Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
