from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.routers import bookings, payments, qr, admin, feedback

# Create app first
app = FastAPI(title="NFL Guesthouse API", version="1.0.0")

# Then setup limiter
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Then middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

# Then routers
app.include_router(bookings.router)
app.include_router(payments.router)
app.include_router(qr.router)
app.include_router(admin.router)
app.include_router(feedback.router)

@app.get("/")
def root():
    return {"message": "NFL Guesthouse API is running"}

@app.get("/health")
def health():
    return {"status": "ok"}