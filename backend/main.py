from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.auth import router as auth_router
from routes.prediction import router as prediction_router
from routes.ai_insights import router as ai_insights_router


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="Diabetes Prediction and Personalized Health Risk Assessment",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for production deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# ROUTERS
# ============================================================

app.include_router(auth_router)

app.include_router(prediction_router)

app.include_router(ai_insights_router)


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():
    return {
        "status": "success",
        "message": "Welcome to Diabetes Prediction API 🚀"
    }