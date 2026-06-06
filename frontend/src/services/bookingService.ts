import { api } from "./api";
import type { Booking } from "@/types";
export async function getBookings(): Promise<Booking[]> { void api; return []; }
export async function createBooking(data: Partial<Booking>) { return data; }
export async function approveBooking(id: string, p: { roomType: string; roomNumber: string; remarks?: string }) { return { id, ...p }; }
export async function rejectBooking(id: string, reason: string) { return { id, reason }; }
export async function cancelBooking(id: string) { return { id }; }
