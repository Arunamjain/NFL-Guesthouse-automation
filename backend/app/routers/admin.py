from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.database import supabase

router = APIRouter(prefix="/admin", tags=["admin"])

class RoomCreate(BaseModel):
    guest_house_id: str
    room_number: str
    room_type: str
    eligible_category: str
    floor: int = 1

class UserCreate(BaseModel):
    full_name: str
    employee_id: str
    department: str
    designation: str
    category: str
    role: str = "employee"
    phone: str | None = None

# --- Dashboard ---

@router.get("/dashboard")
def get_dashboard():
    bookings = supabase.table("bookings").select("*").execute()
    payments = supabase.table("payments").select("*").execute()
    profiles = supabase.table("profiles").select("*").execute()

    all_bookings = bookings.data
    total = len(all_bookings)
    pending = len([b for b in all_bookings if b["status"] == "pending"])
    approved = len([b for b in all_bookings if b["status"] == "approved"])
    checked_in = len([b for b in all_bookings if b["status"] == "checked_in"])
    verified_payments = len([p for p in payments.data if p["status"] == "verified"])
    total_revenue = sum(p["amount"] for p in payments.data if p["status"] == "verified")

    return {
        "total_bookings": total,
        "pending_approvals": pending,
        "approved_bookings": approved,
        "checked_in": checked_in,
        "verified_payments": verified_payments,
        "total_revenue": total_revenue,
        "total_employees": len(profiles.data),
    }

# --- Bookings Management ---

@router.get("/bookings")
def get_all_bookings():
    result = supabase.table("bookings").select("*").execute()
    return result.data

@router.get("/bookings/pending")
def get_pending_bookings():
    result = supabase.table("bookings")\
        .select("*")\
        .eq("status", "pending")\
        .execute()
    return result.data

# --- Rooms Management ---

@router.get("/rooms")
def get_all_rooms():
    result = supabase.table("rooms").select("*").execute()
    return result.data

@router.post("/rooms")
def create_room(room: RoomCreate):
    result = supabase.table("rooms").insert({
        "guest_house_id": room.guest_house_id,
        "room_number": room.room_number,
        "room_type": room.room_type,
        "eligible_category": room.eligible_category,
        "floor": room.floor,
        "is_active": True,
    }).execute()
    return result.data[0]

@router.patch("/rooms/{room_id}")
def update_room(room_id: str, patch: dict):
    result = supabase.table("rooms")\
        .update(patch)\
        .eq("id", room_id)\
        .execute()
    return result.data[0]

# --- Employees ---

@router.get("/employees")
def get_all_employees():
    result = supabase.table("profiles").select("*").execute()
    return result.data

@router.patch("/employees/{user_id}/role")
def update_employee_role(user_id: str, data: dict):
    result = supabase.table("profiles")\
        .update({"role": data["role"]})\
        .eq("id", user_id)\
        .execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Employee not found")
    return result.data[0]

# --- Guest Houses ---

@router.get("/guest-houses")
def get_guest_houses():
    result = supabase.table("guest_houses").select("*").execute()
    return result.data

# --- Reports ---

@router.get("/reports/bookings")
def booking_report():
    result = supabase.table("bookings").select("*").execute()
    bookings = result.data
    return {
        "total": len(bookings),
        "by_status": {
            "pending": len([b for b in bookings if b["status"] == "pending"]),
            "approved": len([b for b in bookings if b["status"] == "approved"]),
            "payment_verified": len([b for b in bookings if b["status"] == "payment_verified"]),
            "checked_in": len([b for b in bookings if b["status"] == "checked_in"]),
            "checked_out": len([b for b in bookings if b["status"] == "checked_out"]),
            "rejected": len([b for b in bookings if b["status"] == "rejected"]),
            "cancelled": len([b for b in bookings if b["status"] == "cancelled"]),
        }
    }