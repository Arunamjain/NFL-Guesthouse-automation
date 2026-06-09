import { api } from "./api";
import type { Room } from "@/types";

// Helper to resolve guest house UUID to frontend ID
let guestHouseMap: Record<string, string> = {};

async function initGuestHouseMap() {
  if (Object.keys(guestHouseMap).length > 0) return;
  try {
    const res = await api.get("/admin/guest-houses");
    res.data.forEach((gh: any) => {
      const nameLower = gh.name.toLowerCase();
      if (nameLower.includes("vasundra")) {
        guestHouseMap[gh.id] = "vasundra";
      } else if (nameLower.includes("dangoti")) {
        guestHouseMap[gh.id] = "dangoti";
      } else {
        guestHouseMap[gh.id] = nameLower;
      }
    });
  } catch (err) {
    console.error("Failed to map guest houses", err);
  }
}

export async function getRooms(): Promise<Room[]> {
  await initGuestHouseMap();
  const res = await api.get("/admin/rooms");
  return res.data.map((r: any) => {
    let price = 1500;
    if (r.room_type === "Executive Suite") price = 3500;
    else if (r.room_type === "Executive Room") price = 2800;
    else if (r.room_type === "Standard Room") price = 1500;
    else if (r.room_type === "Non-Executive Room") price = 1000;

    const ghId = guestHouseMap[r.guest_house_id] || r.guest_house_id;

    return {
      id: r.id,
      number: r.room_number,
      guestHouseId: ghId as any,
      roomType: r.room_type,
      category: r.eligible_category === "Executive" ? "Executive" : "Non-Executive",
      capacity: 2,
      price: price,
      status: r.is_active ? "Available" : "Maintenance",
    };
  });
}

export async function addRoom(d: Partial<Room>) {
  await initGuestHouseMap();
  // Find backend UUID for guestHouseId
  let guest_house_id: string | undefined = d.guestHouseId;
  for (const [uuid, name] of Object.entries(guestHouseMap)) {
    if (name === d.guestHouseId) {
      guest_house_id = uuid;
      break;
    }
  }

  const res = await api.post("/admin/rooms", {
    guest_house_id: guest_house_id,
    room_number: d.number,
    room_type: d.roomType,
    eligible_category: d.category,
    floor: 1
  });
  return res.data;
}

export async function updateRoom(id: string, d: Partial<Room>) {
  await initGuestHouseMap();
  let patch: any = {};
  if (d.number !== undefined) patch.room_number = d.number;
  if (d.roomType !== undefined) patch.room_type = d.roomType;
  if (d.category !== undefined) patch.eligible_category = d.category;
  if (d.status !== undefined) patch.is_active = d.status === "Available";
  
  if (d.guestHouseId !== undefined) {
    let guest_house_id: string = d.guestHouseId;
    for (const [uuid, name] of Object.entries(guestHouseMap)) {
      if (name === d.guestHouseId) {
        guest_house_id = uuid;
        break;
      }
    }
    patch.guest_house_id = guest_house_id;
  }

  const res = await api.patch(`/admin/rooms/${id}`, patch);
  return res.data;
}

export async function updateRoomStatus(id: string, status: Room["status"]) {
  return updateRoom(id, { status });
}

