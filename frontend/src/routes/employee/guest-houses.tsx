import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchInput } from "@/components/common/SearchInput";
import { GuestHouseCard } from "@/components/guesthouse/GuestHouseCard";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { api } from "@/services/api";
import { getRooms } from "@/services/roomService";
import type { GuestHouse, Room } from "@/types";

export const Route = createFileRoute("/employee/guest-houses")({ component: GHListPage });


function GHListPage() {
  const [guestHouses, setGuestHouses] = useState<GuestHouse[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");
  const [availFor, setAvailFor] = useState<GuestHouse | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [ghRes, roomsData] = await Promise.all([
          api.get("/admin/guest-houses"),
          getRooms()
        ]);
        
        const mapped = ghRes.data.map((gh: any) => {
          const id = gh.name.toLowerCase().includes("vasundra") ? "vasundra" : "dangoti";
          const ghRooms = roomsData.filter(r => r.guestHouseId === id);
          const availableRoomsCount = ghRooms.filter(r => r.status === "Available").length;
          
          return {
            id,
            name: gh.name,
            location: gh.address || "Corporate Colony",
            description: gh.description || "Premium company guest house.",
            image: gh.name.toLowerCase().includes("vasundra") 
              ? "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
              : "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
            facilities: gh.amenities || ["Wi-Fi", "Parking", "Security", "Food", "Housekeeping", "Reception"],
            availableRooms: availableRoomsCount
          };
        });
        setGuestHouses(mapped);
        setRooms(roomsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const items = useMemo(() => guestHouses.filter((g) => g.name.toLowerCase().includes(q.toLowerCase())), [guestHouses, q]);

  if (loading) {
    return (
      <DashboardLayout requiredRole="employee">
        <PageHeader title="Available Guest Houses" subtitle="Select a guest house and request HR approval for your stay." />
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading guest houses...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout requiredRole="employee">
      <PageHeader title="Available Guest Houses" subtitle="Select a guest house and request HR approval for your stay." />
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <SearchInput placeholder="Search guest houses..." value={q} onChange={(e) => setQ(e.target.value)} className="flex-1" />
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="h-10 rounded-lg border border-input bg-card px-3 text-sm">
          {["All", "Executive Rooms", "Standard Rooms", "Available Today"].map((f) => <option key={f}>{f}</option>)}
        </select>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {items.map((gh) => <GuestHouseCard key={gh.id} gh={gh} onAvailability={() => setAvailFor(gh)} />)}
      </div>
      <Modal open={!!availFor} onClose={() => setAvailFor(null)} title={availFor ? `${availFor.name} — Availability` : ""} footer={<Button onClick={() => setAvailFor(null)}>Close</Button>}>
        {availFor && (
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs text-muted-foreground uppercase"><th className="pb-2">Room Type</th><th>Available</th><th>Occupied</th><th>Maintenance</th></tr></thead>
            <tbody>
              {["Executive Suite", "Executive Room", "Standard Room", "Non-Executive Room"].map((t) => {
                const list = rooms.filter((r) => r.guestHouseId === availFor.id && r.roomType === t);
                return (
                  <tr key={t} className="border-t border-border"><td className="py-2">{t}</td>
                    <td>{list.filter((r) => r.status === "Available").length}</td>
                    <td>{list.filter((r) => r.status === "Occupied").length}</td>
                    <td>{list.filter((r) => r.status === "Maintenance").length}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Modal>
    </DashboardLayout>
  );
}
