import { api } from "./api";
import type { Employee, Role } from "@/types";
export async function login(_c: { identifier: string; password: string; role: Role }) { void api; void _c; return null; }
export async function logout() { return; }
export async function getCurrentUser(): Promise<Employee | null> { return null; }
