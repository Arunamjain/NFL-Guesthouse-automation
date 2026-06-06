import { Link } from "@tanstack/react-router";
import { MapPin, Wifi, Car, ShieldCheck, Utensils, Sparkles, BellRing } from "lucide-react";
import type { GuestHouse } from "@/types";
import { Button } from "@/components/common/Button";

const facilityIcons: Record<string, React.ElementType> = {
  "Wi-Fi": Wifi, "Parking": Car, "Security": ShieldCheck, "Food": Utensils, "Housekeeping": Sparkles, "Reception": BellRing,
};

export function GuestHouseCard({ gh, onView, onAvailability }: { gh: GuestHouse; onView?: () => void; onAvailability?: () => void }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="aspect-[16/9] overflow-hidden bg-muted">
        <img src={gh.image} alt={gh.name} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="p-5 space-y-3">
        <div>
          <h3 className="text-lg font-semibold">{gh.name}</h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="size-3" /> {gh.location}</p>
        </div>
        <p className="text-sm text-foreground/80">{gh.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {gh.facilities.map((f) => {
            const Icon = facilityIcons[f];
            return (
              <span key={f} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-xs text-foreground/70">
                {Icon && <Icon className="size-3" />} {f}
              </span>
            );
          })}
        </div>
        <div className="text-sm text-muted-foreground">Available rooms: <span className="font-semibold text-foreground">{gh.availableRooms}</span></div>
        <div className="flex flex-wrap gap-2 pt-2">
          {onView ? <Button variant="secondary" size="sm" onClick={onView}>View Details</Button>
            : <Link to="/employee/guest-houses/$id" params={{ id: gh.id }}><Button variant="secondary" size="sm">View Details</Button></Link>}
          <Link to="/employee/new-booking" search={{ gh: gh.id }}><Button size="sm">Request Booking</Button></Link>
          {onAvailability && <Button variant="ghost" size="sm" onClick={onAvailability}>View Availability</Button>}
        </div>
      </div>
    </div>
  );
}
