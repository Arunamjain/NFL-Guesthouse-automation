from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from app.database import supabase
from datetime import datetime, timezone
import qrcode
import json
import io

router = APIRouter(prefix="/qr", tags=["qr"])

@router.post("/{booking_id}/generate")
def generate_qr(booking_id: str):
    # Check booking exists and payment is verified
    booking = supabase.table("bookings")\
        .select("*")\
        .eq("id", booking_id)\
        .single()\
        .execute()

    if not booking.data:
        raise HTTPException(status_code=404, detail="Booking not found")

    if booking.data["status"] != "payment_verified":
        raise HTTPException(status_code=400, detail="Payment must be verified before generating QR pass")

    # Check if QR already exists
    existing = supabase.table("qr_passes")\
        .select("*")\
        .eq("booking_id", booking_id)\
        .execute()

    if existing.data:
        return existing.data[0]

    # Create QR data
    qr_data = json.dumps({
        "booking_id": booking_id,
        "employee_id": booking.data["employee_id"],
        "guest_house_id": booking.data["guest_house_id"],
        "check_in": booking.data["check_in_date"],
        "check_out": booking.data["check_out_date"],
    })

    # Save QR pass to database
    result = supabase.table("qr_passes").insert({
        "booking_id": booking_id,
        "qr_code_data": qr_data,
        "expires_at": booking.data["check_out_date"] + "T23:59:59+00:00",
        "is_used": False,
    }).execute()

    # Update booking status to confirmed
    supabase.table("bookings").update({
        "status": "checked_in"
    }).eq("id", booking_id).execute()

    return result.data[0]


@router.get("/{booking_id}/image")
def get_qr_image(booking_id: str):
    # Get QR pass
    result = supabase.table("qr_passes")\
        .select("*")\
        .eq("booking_id", booking_id)\
        .single()\
        .execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="QR pass not found")

    # Generate QR image
    qr = qrcode.make(result.data["qr_code_data"])
    buf = io.BytesIO()
    qr.save(buf, format="PNG")
    buf.seek(0)

    return StreamingResponse(buf, media_type="image/png")


@router.patch("/{booking_id}/scan")
def scan_qr(booking_id: str):
    result = supabase.table("qr_passes")\
        .select("*")\
        .eq("booking_id", booking_id)\
        .single()\
        .execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="QR pass not found")

    if result.data["is_used"]:
        raise HTTPException(status_code=400, detail="QR pass already used")

    # Mark as used
    supabase.table("qr_passes").update({
        "is_used": True,
        "scanned_at": datetime.now(timezone.utc).isoformat()
    }).eq("booking_id", booking_id).execute()

    return {"message": "QR pass scanned successfully", "booking_id": booking_id}