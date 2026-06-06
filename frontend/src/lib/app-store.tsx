import { createContext, useContext, useState, useCallback, type ReactNode, type Dispatch, type SetStateAction } from "react";
import type { Booking, Employee, Feedback, Payment, Role, Room } from "@/types";
import { mockBookings } from "@/data/mockBookings";
import { mockEmployees } from "@/data/mockEmployees";
import { mockFeedback } from "@/data/mockFeedback";
import { mockPayments } from "@/data/mockPayments";
import { mockRooms } from "@/data/mockRooms";

interface AppState {
  currentUser: Employee | null;
  role: Role | null;
  login: (user: Employee) => void;
  logout: () => void;
  bookings: Booking[];
  setBookings: Dispatch<SetStateAction<Booking[]>>;
  addBooking: (b: Booking) => void;
  updateBooking: (id: string, patch: Partial<Booking>) => void;
  rooms: Room[];
  addRoom: (r: Room) => void;
  updateRoom: (id: string, patch: Partial<Room>) => void;
  payments: Payment[];
  setPayments: Dispatch<SetStateAction<Payment[]>>;
  feedback: Feedback[];
  addFeedback: (f: Feedback) => void;
  employees: Employee[];
}

const AppContext = createContext<AppState | null>(null);
const STORAGE_KEY = "nfl-gh-auth";

function readAuth(): Employee | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Employee) : null;
  } catch { return null; }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Employee | null>(() => readAuth());
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [feedback, setFeedback] = useState<Feedback[]>(mockFeedback);

  const login = useCallback((user: Employee) => {
    setCurrentUser(user);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(user)); } catch {}
  }, []);
  const logout = useCallback(() => {
    setCurrentUser(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  const addBooking = useCallback((b: Booking) => setBookings((p) => [b, ...p]), []);
  const updateBooking = useCallback((id: string, patch: Partial<Booking>) =>
    setBookings((p) => p.map((b) => (b.id === id ? { ...b, ...patch } : b))), []);
  const addRoom = useCallback((r: Room) => setRooms((p) => [r, ...p]), []);
  const updateRoom = useCallback((id: string, patch: Partial<Room>) =>
    setRooms((p) => p.map((r) => (r.id === id ? { ...r, ...patch } : r))), []);
  const addFeedback = useCallback((f: Feedback) => setFeedback((p) => [f, ...p]), []);

  return (
    <AppContext.Provider value={{ currentUser, role: currentUser?.role ?? null, login, logout, bookings, setBookings, addBooking, updateBooking, rooms, addRoom, updateRoom, payments, setPayments, feedback, addFeedback, employees: mockEmployees }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
