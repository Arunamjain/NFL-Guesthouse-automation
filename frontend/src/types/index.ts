export type Role = "employee" | "admin";
export type EmployeeCategory = "Executive Employee" | "Non-Executive Employee";
export type GuestHouseId = "vasundra" | "dangoti";
export type RoomType =
  | "Executive Suite"
  | "Executive Room"
  | "Standard Room"
  | "Non-Executive Room";
export type RoomStatus = "Available" | "Occupied" | "Maintenance";
export type HRStatus = "Pending Approval" | "Approved" | "Rejected";
export type PaymentStatus =
  | "Not Started"
  | "Payment Pending"
  | "Payment Verification Pending"
  | "Payment Verified"
  | "Failed";
export type BookingStatus =
  | "Pending Approval"
  | "Approved"
  | "Payment Pending"
  | "Payment Verification Pending"
  | "Confirmed"
  | "Rejected"
  | "Cancelled";

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  category: EmployeeCategory;
  role: Role;
}

export interface GuestHouse {
  id: GuestHouseId;
  name: string;
  location: string;
  description: string;
  image: string;
  facilities: string[];
  availableRooms: number;
}

export interface Room {
  id: string;
  number: string;
  guestHouseId: GuestHouseId;
  roomType: RoomType;
  category: "Executive" | "Non-Executive";
  capacity: number;
  price: number;
  status: RoomStatus;
}

export interface Booking {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  department: string;
  designation: string;
  category: EmployeeCategory;
  guestHouseId: GuestHouseId;
  guestHouseName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  purpose: string;
  requirements?: string;
  hrStatus: HRStatus;
  hrRemarks?: string;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  roomType?: RoomType;
  roomNumber?: string;
  amount: number;
  utr?: string;
  paymentMode?: string;
  emailSent: boolean;
  qrGenerated: boolean;
  createdAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  employeeName: string;
  guestHouseName: string;
  amount: number;
  mode: string;
  utr: string;
  submittedAt: string;
  status: "Verification Pending" | "Verified" | "Failed";
}

export interface Feedback {
  id: string;
  bookingId: string;
  employeeName: string;
  guestHouseName: string;
  overall: number;
  cleanliness: number;
  comfort: number;
  staff: number;
  website: number;
  comments: string;
  suggestions?: string;
  submittedAt: string;
  sentiment: "Positive" | "Neutral" | "Negative";
}