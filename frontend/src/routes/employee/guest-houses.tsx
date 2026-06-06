import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchInput } from "@/components/common/SearchInput";
import { GuestHouseCard } from "@/components/guesthouse/GuestHouseCard";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { mockGuestHouses } from "@/data/mockGuestHouses";
import { useApp } from "@/lib/app-store";
import type { GuestHouse } from "@/types";

export const Route = createFileRoute("/employee/guest-houses")({ component: GHListPage });

function GHListPage() {
  const { rooms } = useApp();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");
  const [availFor, setAvailFor] = useState<GuestHouse | null>(null);

  const items = useMemo(() => mockGuestHouses.filter((g) => g.name.toLowerCase().includes(q.toLowerCase())), [q]);

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
