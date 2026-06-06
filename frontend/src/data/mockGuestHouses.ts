import type { GuestHouse } from "@/types";

export const mockGuestHouses: GuestHouse[] = [
  {
    id: "vasundra",
    name: "Vasundra Guest House",
    location: "Corporate Colony, Sector 12",
    description: "Premium company guest house for official employee stays and visiting staff.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    facilities: ["Wi-Fi", "Parking", "Security", "Food", "Housekeeping", "Reception"],
    availableRooms: 12,
  },
  {
    id: "dangoti",
    name: "Dangoti Guest House",
    location: "Industrial Township Area",
    description: "Comfortable guest house for employees, business visits, and official accommodation.",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
    facilities: ["Wi-Fi", "Parking", "Security", "Food", "Housekeeping"],
    availableRooms: 8,
  },
];