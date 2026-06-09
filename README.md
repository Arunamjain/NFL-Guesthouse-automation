# NFL-Guesthouse-automation
Creating an webapp which helps NFL Guesthouse booking fast and efficient by making it online and removing the offline form filling part

### Backend (FastAPI)
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
cp .env.example .env         # fill in your values
uvicorn app.main:app --reload
```

### Frontend (React)
```bash
cd frontend
npm install
cp .env.example .env.local   # fill in your values
npm run dev
```