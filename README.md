# Student Dropout Prediction & Early Warning System

An intelligent platform designed to predict and prevent student dropouts using machine learning risk modeling, early intervention tracking, and interactive dashboards.

## Project Structure

```
sih/
├── backend/    # FastAPI / Python ML backend, XGBoost models, and prediction APIs
├── frontend/   # Vite + React dashboard, visualization, and triage interface
└── data/       # Dataset CSVs and historical snapshots
```

## Getting Started

### Backend
1. Navigate to `backend/`
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend
1. Navigate to `frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
