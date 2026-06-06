import type { Room } from "@/types";

export const mockRooms: Room[] = [
  { id: "r1", number: "VAS-101", guestHouseId: "vasundra", roomType: "Executive Suite", category: "Executive", capacity: 2, price: 3500, status: "Available" },
  { id: "r2", number: "VAS-102", guestHouseId: "vasundra", roomType: "Executive Room", category: "Executive", capacity: 2, price: 2800, status: "Occupied" },
  { id: "r3", number: "VAS-201", guestHouseId: "vasundra", roomType: "Standard Room", category: "Non-Executive", capacity: 2, price: 1500, status: "Available" },
  { id: "r4", number: "DAN-101", guestHouseId: "dangoti", roomType: "Executive Room", category: "Executive", capacity: 2, price: 2600, status: "Available" },
  { id: "r5", number: "DAN-201", guestHouseId: "dangoti", roomType: "Non-Executive Room", category: "Non-Executive", capacity: 2, price: 1300, status: "Maintenance" },
  { id: "r6", number: "DAN-202", guestHouseId: "dangoti", roomType: "Standard Room", category: "Non-Executive", capacity: 2, price: 1400, status: "Available" },
];
