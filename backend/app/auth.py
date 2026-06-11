from fastapi import HTTPException, Header
from supabase import create_client
import os
from dotenv import load_dotenv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env", override=True)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

def get_current_user(authorization: str = Header(...)):
    """Verify JWT token from request header"""
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    token = authorization.replace("Bearer ", "")
    
    try:
        # Verify token with Supabase
        client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        user = client.auth.get_user(token)
        if not user or not user.user:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        return user.user
    except Exception:
        raise HTTPException(status_code=401, detail="Could not validate token")

def require_admin(authorization: str = Header(...)):
    """Only allow admin/hr users"""
    user = get_current_user(authorization)
    
    from app.database import supabase
    profile = supabase.table("profiles")\
        .select("role")\
        .eq("id", user.id)\
        .single()\
        .execute()
    
    if not profile.data or profile.data["role"] not in ["admin", "hr"]:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    return user