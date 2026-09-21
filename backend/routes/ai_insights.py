"""
AI Health Insights API Route

This route receives the existing Logistic Regression prediction
and SHAP explanation and sends them to the OpenAI health service
for educational interpretation.

IMPORTANT:
- Logistic Regression remains the numerical prediction engine.
- SHAP remains the mathematical explainability engine.
- GPT only interprets the existing results.
- GPT must not calculate or override the ML prediction.
"""

from typing import Dict, List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from services.openai_service import openai_service


router = APIRouter(
    prefix="/ai",
    tags=["AI Health Insights"]
)


# ============================================================
# Request Models
# ============================================================

class FeatureInput(BaseModel):
    Pregnancies: float
    Glucose: float
    BloodPressure: float
    SkinThickness: float
    Insulin: float
    BMI: float
    DiabetesPedigreeFunction: float
    Age: float


class SHAPExplanation(BaseModel):
    feature: str
    value: float
    impact: float
    direction: str


class HealthInsightsRequest(BaseModel):
    features: Dict[str, float]
    prediction: str
    risk_percentage: float
    risk_level: str
    explanation: List[SHAPExplanation]


# ============================================================
# Response Model
# ============================================================

class HealthInsightsResponse(BaseModel):
    status: str
    ai_summary: str
    risk_explanation: str
    key_factors: List[str]
    positive_factors: List[str]
    attention_factors: List[str]
    personalized_action_plan: List[str]
    lifestyle_guidance: List[str]
    questions_for_healthcare_provider: List[str]
    safety_message: str
    disclaimer: str
    ai_available: bool


# ============================================================
# AI Health Insights Endpoint
# ============================================================

@router.post(
    "/health-insights",
    response_model=HealthInsightsResponse
)
async def generate_health_insights(
    request: HealthInsightsRequest
):
    """
    Generate educational AI health insights.

    The ML prediction and SHAP explanation are generated
    independently and are passed to GPT only for interpretation.
    """

    try:
        # Convert SHAP Pydantic objects into dictionaries
        explanation_data = [
            explanation.model_dump()
            for explanation in request.explanation
        ]

        # Generate AI insights
        ai_result = openai_service.generate_health_insights(
            features=request.features,
            prediction=request.prediction,
            risk_percentage=request.risk_percentage,
            risk_level=request.risk_level,
            explanation=explanation_data
        )

        # IMPORTANT:
        # ai_result already contains "status".
        # Therefore we must NOT pass status="success"
        # separately here.
        return HealthInsightsResponse(
            **ai_result
        )

    except Exception as e:
        print(
            f"Error in /ai/health-insights: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate health insights: {str(e)}"
        )