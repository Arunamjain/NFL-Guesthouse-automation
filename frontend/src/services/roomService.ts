import { api } from "./api";
import type { Room } from "@/types";
export async function getRooms(): Promise<Room[]> { void api; return []; }
export async function addRoom(d: Partial<Room>) { return d; }
export async function updateRoom(id: string, d: Partial<Room>) { return { id, ...d }; }
export async function updateRoomStatus(id: string, status: Room["status"]) { return { id, status }; }
