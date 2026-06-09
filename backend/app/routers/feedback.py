from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.database import supabase
from datetime import datetime, timezone

router = APIRouter(prefix="/feedback", tags=["feedback"])

class FeedbackCreate(BaseModel):
    booking_id: str
    employee_id: str
    overall: int
    cleanliness: int = 5
    comfort: int = 5
    staff: int = 5
    website: int = 5
    comments: str | None = None
    suggestions: str | None = None
    sentiment: str | None = None

@router.get("/")
def get_all_feedback():
    result = supabase.table("feedback").select("*").execute()
    # Join with profiles/bookings to get employee and guesthouse names
    feedbacks = []
    for f in result.data:
        # Get employee name
        emp_name = "Employee"
        emp = supabase.table("profiles").select("full_name").eq("id", f["employee_id"]).execute()
        if emp.data:
            emp_name = emp.data[0]["full_name"]
        
        # Get guest house name
        gh_name = "Guest House"
        b = supabase.table("bookings").select("guest_house_id").eq("id", f["booking_id"]).execute()
        if b.data:
            gh_id = b.data[0]["guest_house_id"]
            gh = supabase.table("guest_houses").select("name").eq("id", gh_id).execute()
            if gh.data:
                gh_name = gh.data[0]["name"]
                
        # Parse extra ratings/sentiment from comments if they are serialized
        cleanliness = 5
        comfort = 5
        staff = 5
        website = 5
        suggestions = ""
        sentiment = "Positive"
        comments_text = f["comments"] or ""
        
        if comments_text.startswith("{"):
            try:
                import json
                extra = json.loads(comments_text)
                comments_text = extra.get("comments", "")
                cleanliness = extra.get("cleanliness", 5)
                comfort = extra.get("comfort", 5)
                staff = extra.get("staff", 5)
                website = extra.get("website", 5)
                suggestions = extra.get("suggestions", "")
                sentiment = extra.get("sentiment", "Positive")
            except:
                pass
                
        feedbacks.append({
            "id": f["id"],
            "bookingId": f["booking_id"],
            "employeeName": emp_name,
            "guestHouseName": gh_name,
            "overall": f["rating"] or 5,
            "cleanliness": cleanliness,
            "comfort": comfort,
            "staff": staff,
            "website": website,
            "comments": comments_text,
            "suggestions": suggestions,
            "submittedAt": f.get("created_at", "").split("T")[0],
            "sentiment": sentiment
        })
    return feedbacks

@router.post("/")
def create_feedback(feedback: FeedbackCreate):
    import json
    # Serialize additional ratings into comments text to fit in database rating/comments structure
    extra = {
        "comments": feedback.comments or "",
        "cleanliness": feedback.cleanliness,
        "comfort": feedback.comfort,
        "staff": feedback.staff,
        "website": feedback.website,
        "suggestions": feedback.suggestions or "",
        "sentiment": feedback.sentiment or "Positive"
    }
    
    result = supabase.table("feedback").insert({
        "booking_id": feedback.booking_id,
        "employee_id": feedback.employee_id,
        "rating": feedback.overall,
        "comments": json.dumps(extra)
    }).execute()
    
    if not result.data:
        raise HTTPException(status_code=400, detail="Failed to submit feedback")
    return result.data[0]
