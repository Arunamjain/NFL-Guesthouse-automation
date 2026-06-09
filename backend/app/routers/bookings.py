from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import date
from app.database import supabase

router = APIRouter(prefix="/bookings", tags=["bookings"])

# --- Models ---
class BookingCreate(BaseModel):
    employee_id: str
    guest_house_id: str
    check_in_date: date
    check_out_date: date
    purpose_of_visit: str
    no_of_guests: int = 1

class BookingUpdate(BaseModel):
    status: str
    hr_remarks: str | None = None
    room_id: str | None = None
    approved_by: str | None = None

# --- Routes ---

@router.get("/")
def get_all_bookings():
    result = supabase.table("bookings").select("*").execute()
    return result.data

@router.get("/my/{employee_id}")
def get_my_bookings(employee_id: str):
    result = supabase.table("bookings").select("*").eq("employee_id", employee_id).execute()
    return result.data

@router.post("/")
def create_booking(booking: BookingCreate):
    # Check for overlapping bookings on same guest house
    existing = supabase.table("bookings")\
        .select("*")\
        .eq("guest_house_id", booking.guest_house_id)\
        .in_("status", ["approved", "checked_in"])\
        .execute()

    for b in existing.data:
        if b["check_in_date"] < str(booking.check_out_date) and \
           b["check_out_date"] > str(booking.check_in_date):
            raise HTTPException(status_code=400, detail="Room not available for selected dates")

    result = supabase.table("bookings").insert({
        "employee_id": booking.employee_id,
        "guest_house_id": booking.guest_house_id,
        "check_in_date": str(booking.check_in_date),
        "check_out_date": str(booking.check_out_date),
        "purpose_of_visit": booking.purpose_of_visit,
        "no_of_guests": booking.no_of_guests,
        "status": "pending"
    }).execute()

    return result.data[0]

@router.patch("/{booking_id}/approve")
def approve_booking(booking_id: str, update: BookingUpdate):
    result = supabase.table("bookings").update({
        "status": "approved",
        "hr_remarks": update.hr_remarks,
        "room_id": update.room_id,
        "approved_by": update.approved_by,
    }).eq("id", booking_id).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Booking not found")

    return result.data[0]

@router.patch("/{booking_id}/reject")
def reject_booking(booking_id: str, update: BookingUpdate):
    result = supabase.table("bookings").update({
        "status": "rejected",
        "hr_remarks": update.hr_remarks,
    }).eq("id", booking_id).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Booking not found")

    return result.data[0]

@router.patch("/{booking_id}/checkin")
def checkin(booking_id: str):
    result = supabase.table("bookings").update({
        "status": "checked_in"
    }).eq("id", booking_id).execute()
    return result.data[0]

@router.patch("/{booking_id}/checkout")
def checkout(booking_id: str):
    result = supabase.table("bookings").update({
        "status": "checked_out"
    }).eq("id", booking_id).execute()
    return result.data[0]