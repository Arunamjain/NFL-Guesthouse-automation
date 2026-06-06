import { api } from "./api";
import type { Feedback } from "@/types";
export async function submitFeedback(d: Partial<Feedback>) { void api; return d; }
export async function getFeedback(): Promise<Feedback[]> { return []; }
