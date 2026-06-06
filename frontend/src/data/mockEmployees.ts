import type { Employee } from "@/types";

export const mockEmployees: Employee[] = [
  { id: "EMP1001", name: "Rahul Sharma", email: "rahul.sharma@nfl.com", department: "HR", designation: "Senior Manager", category: "Executive Employee", role: "employee" },
  { id: "EMP1002", name: "Priya Mehta", email: "priya.mehta@nfl.com", department: "Finance", designation: "Assistant Officer", category: "Non-Executive Employee", role: "employee" },
  { id: "EMP1003", name: "Amit Verma", email: "amit.verma@nfl.com", department: "Operations", designation: "General Manager", category: "Executive Employee", role: "employee" },
  { id: "EMP1004", name: "Sneha Patel", email: "sneha.patel@nfl.com", department: "Admin", designation: "Coordinator", category: "Non-Executive Employee", role: "employee" },
  { id: "ADM1001", name: "Neha Kapoor", email: "neha.kapoor@nfl.com", department: "HR", designation: "HR Head", category: "Executive Employee", role: "admin" },
];