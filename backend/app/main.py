from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import bookings, payments, qr, admin, feedback


app = FastAPI(title="NFL Guesthouse API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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