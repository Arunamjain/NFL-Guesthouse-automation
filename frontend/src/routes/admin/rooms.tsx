import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable, type Column } from "@/components/common/DataTable";
import { Button } from "@/components/common/Button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Modal } from "@/components/common/Modal";
import { FormInput } from "@/components/forms/FormInput";
import { SelectField } from "@/components/forms/SelectField";
import type { Room, RoomStatus, RoomType, GuestHouseId } from "@/types";
import { formatINR } from "@/utils/formatters";
import { getRooms, addRoom, updateRoom } from "@/services/roomService";

export const Route = createFileRoute("/admin/rooms")({ component: RoomsPage });

const empty: Omit<Room, "id"> = { number: "", guestHouseId: "vasundra", roomType: "Standard Room", category: "Non-Executive", capacity: 2, price: 1500, status: "Available" };

function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ gh: "All", type: "All", status: "All", cat: "All" });
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState<Room | null>(null);
  const [form, setForm] = useState({ ...empty });

  const loadRooms = async () => {
    setLoading(true);
    try {
      const data = await getRooms();
      setRooms(data);
    } catch (err) {
      toast.error("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const rows = useMemo(() => rooms.filter((r) =>
    (filters.gh === "All" || r.guestHouseId === filters.gh) &&
    (filters.type === "All" || r.roomType === filters.type) &&
    (filters.status === "All" || r.status === filters.status) &&
    (filters.cat === "All" || r.category === filters.cat)), [rooms, filters]);

  const saveNew = async () => {
    if (!form.number) return toast.error("Room number required");
    try {
      await addRoom(form);
      toast.success("Room added.");
      setAdd(false);
      setForm({ ...empty });
      loadRooms();
    } catch (err) {
      toast.error("Failed to add room");
    }
  };
  const saveEdit = async () => {
    if (!edit) return;
    try {
      await updateRoom(edit.id, form);
      toast.success("Room updated.");
      setEdit(null);
      loadRooms();
    } catch (err) {
      toast.error("Failed to update room");
    }
  };

  const markStatus = async (room: Room, status: RoomStatus) => {
    try {
      await updateRoom(room.id, { status });
      toast.success(`Room marked as ${status.toLowerCase()}.`);
      loadRooms();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };


  const cols: Column<Room>[] = [
    { key: "num", header: "Room", render: (r) => <span className="font-mono text-sm">{r.number}</span> },
    { key: "gh", header: "Guest House", render: (r) => r.guestHouseId === "vasundra" ? "Vasundra" : "Dangoti" },
    { key: "t", header: "Type", render: (r) => r.roomType },
    { key: "c", header: "Category", render: (r) => r.category },
    { key: "cap", header: "Capacity", render: (r) => r.capacity },
    { key: "p", header: "Price", render: (r) => formatINR(r.price) },
    { key: "s", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "act", header: "Actions", render: (r) => (
      <div className="flex flex-wrap gap-1.5">
        <Button size="sm" variant="secondary" onClick={() => { setForm(r); setEdit(r); }}>Edit</Button>
        <Button size="sm" variant="danger" onClick={() => markStatus(r, "Maintenance")}>Maintenance</Button>
        <Button size="sm" variant="success" onClick={() => markStatus(r, "Available")}>Available</Button>
      </div>
    ) },
  ];

  const RoomForm = (
    <div className="grid sm:grid-cols-2 gap-3">
      <SelectField label="Guest House" value={form.guestHouseId} onChange={(e) => setForm({ ...form, guestHouseId: e.target.value as GuestHouseId })}>
        <option value="vasundra">Vasundra Guest House</option>
        <option value="dangoti">Dangoti Guest House</option>
      </SelectField>
      <FormInput label="Room Number" value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} />
      <SelectField label="Room Type" value={form.roomType} onChange={(e) => setForm({ ...form, roomType: e.target.value as RoomType })}>
        {["Executive Suite", "Executive Room", "Standard Room", "Non-Executive Room"].map((t) => <option key={t}>{t}</option>)}
      </SelectField>
      <SelectField label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Room["category"] })}>
        <option>Executive</option><option>Non-Executive</option>
      </SelectField>
      <FormInput label="Capacity" type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} />
      <FormInput label="Price (₹)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
      <SelectField label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as RoomStatus })}>
        <option>Available</option><option>Occupied</option><option>Maintenance</option>
      </SelectField>
    </div>
  );

  if (loading) {
    return (
      <DashboardLayout requiredRole="admin">
        <PageHeader title="Room Management" subtitle="Manage rooms across guest houses." />
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading rooms...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout requiredRole="admin">
      <PageHeader title="Room Management" subtitle="Manage rooms across guest houses." actions={<Button onClick={() => { setForm({ ...empty }); setAdd(true); }} leftIcon={<Plus className="size-4" />}>Add Room</Button>} />
      <div className="grid sm:grid-cols-4 gap-3 mb-4">
        <SelectField value={filters.gh} onChange={(e) => setFilters({ ...filters, gh: e.target.value })}>
          <option value="All">All Guest Houses</option><option value="vasundra">Vasundra</option><option value="dangoti">Dangoti</option>
        </SelectField>
        <SelectField value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
          <option>All</option>{["Executive Suite", "Executive Room", "Standard Room", "Non-Executive Room"].map((t) => <option key={t}>{t}</option>)}
        </SelectField>
        <SelectField value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option>All</option><option>Available</option><option>Occupied</option><option>Maintenance</option>
        </SelectField>
        <SelectField value={filters.cat} onChange={(e) => setFilters({ ...filters, cat: e.target.value })}>
          <option>All</option><option>Executive</option><option>Non-Executive</option>
        </SelectField>
      </div>
      <DataTable columns={cols} rows={rows} />
      <Modal open={add} onClose={() => setAdd(false)} title="Add Room" size="lg"
        footer={<><Button variant="secondary" onClick={() => setAdd(false)}>Cancel</Button><Button onClick={saveNew}>Save Room</Button></>}>
        {RoomForm}
      </Modal>
      <Modal open={!!edit} onClose={() => setEdit(null)} title="Edit Room" size="lg"
        footer={<><Button variant="secondary" onClick={() => setEdit(null)}>Cancel</Button><Button onClick={saveEdit}>Save Changes</Button></>}>
        {RoomForm}
      </Modal>
    </DashboardLayout>
  );
}
