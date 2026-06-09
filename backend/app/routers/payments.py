from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.database import supabase

router = APIRouter(prefix="/payments", tags=["payments"])

# --- Models ---
class PaymentSubmit(BaseModel):
    booking_id: str
    amount: float
    utr_number: str
    payment_screenshot_url: str | None = None

class PaymentVerify(BaseModel):
    verified_by: str
    rejection_reason: str | None = None

# --- Routes ---

@router.post("/submit")
def submit_payment(payment: PaymentSubmit):
    # Check booking exists
    booking = supabase.table("bookings")\
        .select("*")\
        .eq("id", payment.booking_id)\
        .single()\
        .execute()

    if not booking.data:
        raise HTTPException(status_code=404, detail="Booking not found")

    # Create payment record
    result = supabase.table("payments").insert({
        "booking_id": payment.booking_id,
        "amount": payment.amount,
        "utr_number": payment.utr_number,
        "payment_screenshot_url": payment.payment_screenshot_url,
        "status": "pending",
    }).execute()

    # Update booking status
    supabase.table("bookings").update({
        "status": "payment_submitted"
    }).eq("id", payment.booking_id).execute()

    return result.data[0]


@router.get("/{booking_id}")
def get_payment(booking_id: str):
    result = supabase.table("payments")\
        .select("*")\
        .eq("booking_id", booking_id)\
        .execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Payment not found")

    return result.data[0]


@router.get("/")
def get_all_payments():
    result = supabase.table("payments").select("*").execute()
    return result.data


@router.patch("/{payment_id}/verify")
def verify_payment(payment_id: str, data: PaymentVerify):
    from datetime import datetime, timezone

    # Update payment
    result = supabase.table("payments").update({
        "status": "verified",
        "verified_by": data.verified_by,
        "verified_at": datetime.now(timezone.utc).isoformat(),
    }).eq("id", payment_id).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Payment not found")

    # Update booking status to payment_verified
    booking_id = result.data[0]["booking_id"]
    supabase.table("bookings").update({
        "status": "payment_verified"
    }).eq("id", booking_id).execute()

    return result.data[0]


@router.patch("/{payment_id}/reject")
def reject_payment(payment_id: str, data: PaymentVerify):
    result = supabase.table("payments").update({
        "status": "rejected",
        "verified_by": data.verified_by,
        "rejection_reason": data.rejection_reason,
    }).eq("id", payment_id).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Payment not found")

    # Revert booking status
    booking_id = result.data[0]["booking_id"]
    supabase.table("bookings").update({
        "status": "approved"
    }).eq("id", booking_id).execute()

    return result.data[0]