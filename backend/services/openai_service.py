"""
OpenAI GPT-5.6 Sol Service for Health Intelligence

This service interprets machine learning predictions and SHAP explanations
into personalized, educational health guidance.

IMPORTANT:
- Logistic Regression remains the numerical prediction engine.
- SHAP remains the mathematical explainability engine.
- GPT only interprets the existing prediction and SHAP results.
- GPT must NOT calculate, change, or override the ML risk percentage.
- This service provides educational/general wellness guidance only.
"""

import os
import json
import re
from typing import Dict, List

from dotenv import load_dotenv
from openai import OpenAI


# Load environment variables from backend/.env
load_dotenv()


class OpenAIHealthService:
    """Service for generating AI health insights using GPT-5.6 Sol."""

    def __init__(self):
        self.client = None

        self.model = os.getenv(
            "OPENAI_MODEL",
            "gpt-5.6-sol"
        )

        self.reasoning_effort = os.getenv(
            "OPENAI_REASONING_EFFORT",
            "low"
        )

        self._initialize_client()

    def _initialize_client(self):
        """Initialize the OpenAI client."""

        api_key = os.getenv("OPENAI_API_KEY")

        if api_key and api_key != "your_openai_api_key_here":
            self.client = OpenAI(api_key=api_key)
            print("OpenAI client initialized successfully!")
        else:
            print(
                "Warning: OPENAI_API_KEY not found. "
                "AI insights will be unavailable."
            )

    def is_available(self):
        """Return True if OpenAI is available."""
        return self.client is not None

    def generate_health_insights(
        self,
        features: Dict,
        prediction: str,
        risk_percentage: float,
        risk_level: str,
        explanation: List[Dict]
    ):
        """
        Generate educational AI health insights.

        GPT receives the existing ML prediction and SHAP explanation.
        GPT does NOT calculate or modify the prediction.
        """

        if not self.is_available():
            return self._get_fallback_response()

        try:
            # Sort SHAP explanations by absolute impact
            sorted_explanations = sorted(
                explanation,
                key=lambda x: abs(x.get("impact", 0)),
                reverse=True
            )

            # Build prompt
            prompt = self._build_prompt(
                features=features,
                prediction=prediction,
                risk_percentage=risk_percentage,
                risk_level=risk_level,
                explanation=sorted_explanations
            )

            # OpenAI Responses API
            response = self.client.responses.create(
                model=self.model,
                input=prompt,
                reasoning={
                    "effort": self.reasoning_effort
                }
            )

            # Extract generated text
            response_text = ""

            if hasattr(response, "output_text"):
                response_text = response.output_text

            else:
                for output_item in getattr(
                    response,
                    "output",
                    []
                ):
                    for content_item in getattr(
                        output_item,
                        "content",
                        []
                    ):
                        if hasattr(content_item, "text"):
                            response_text += content_item.text

            if not response_text:
                print("OpenAI returned an empty response.")
                return self._get_fallback_response()

            return self._parse_response(response_text)

        except Exception as e:
            print(
                f"Error generating AI insights: {e}"
            )
            return self._get_fallback_response()

    def _build_prompt(
        self,
        features: Dict,
        prediction: str,
        risk_percentage: float,
        risk_level: str,
        explanation: List[Dict]
    ):
        """Build the AI health-insight prompt."""

        explanation_text = json.dumps(
            explanation,
            indent=2
        )

        features_text = json.dumps(
            features,
            indent=2
        )

        prompt = f"""
You are an educational health-information assistant
inside a diabetes risk assessment application.

The application uses Logistic Regression for numerical
risk prediction and SHAP for mathematical explainability.

You must NEVER replace, recalculate, modify, or override
the machine-learning prediction.

You must only interpret the information already provided.

PATIENT INPUT FEATURES:
{features_text}

MACHINE LEARNING RESULT:
Prediction: {prediction}
Risk Percentage: {risk_percentage}%
Risk Level: {risk_level}

SHAP EXPLANATION:
{explanation_text}

IMPORTANT SAFETY RULES:

1. Do not diagnose the patient.
2. Do not claim the patient definitely has or does not have diabetes.
3. Do not change the ML risk percentage.
4. Do not calculate a new probability.
5. Do not prescribe medicines.
6. Do not recommend medication doses.
7. Do not claim lifestyle changes guarantee prevention or cure.
8. Do not make unsupported causal claims.
9. Clearly explain that this is an educational risk assessment.
10. Encourage consultation with a qualified healthcare professional
    when appropriate.
11. Keep explanations understandable for a college student.
12. Use SHAP information to explain model contributions.
13. Distinguish model contribution from medical causation.
14. Do not invent patient information.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "ai_summary": "A short educational explanation of the result.",

    "risk_explanation": "Explain the ML result and what the risk level means. Do not diagnose.",

    "key_factors": [
        "Important model factor 1",
        "Important model factor 2",
        "Important model factor 3"
    ],

    "positive_factors": [
        "Factors that contributed less to the predicted risk or appear relatively favorable."
    ],

    "attention_factors": [
        "Factors that contributed more strongly to the predicted risk and may deserve attention."
    ],

    "personalized_action_plan": [
        "Practical general wellness action 1",
        "Practical general wellness action 2",
        "Practical general wellness action 3",
        "Practical general wellness action 4"
    ],

    "lifestyle_guidance": [
        "General healthy lifestyle suggestion 1",
        "General healthy lifestyle suggestion 2",
        "General healthy lifestyle suggestion 3"
    ],

    "questions_for_healthcare_provider": [
        "Useful question to discuss with a healthcare professional 1",
        "Useful question to discuss with a healthcare professional 2",
        "Useful question to discuss with a healthcare professional 3"
    ],

    "safety_message": "A short safety message explaining that the result is not a diagnosis.",

    "disclaimer": "This system provides educational risk assessment and general wellness information only. It does not provide a medical diagnosis or replace professional medical advice."
}}

Make the response specific to the supplied values and SHAP explanations.
"""

        return prompt

    def _parse_response(self, response_text: str):
        """Parse JSON returned by OpenAI safely."""

        try:
            cleaned_text = response_text.strip()

            # Remove markdown code fences
            cleaned_text = re.sub(
                r"^```json\s*",
                "",
                cleaned_text,
                flags=re.IGNORECASE
            )

            cleaned_text = re.sub(
                r"^```\s*",
                "",
                cleaned_text
            )

            cleaned_text = re.sub(
                r"\s*```$",
                "",
                cleaned_text
            )

            # Extract JSON object
            start = cleaned_text.find("{")
            end = cleaned_text.rfind("}")

            if start != -1 and end != -1:
                cleaned_text = cleaned_text[
                    start:end + 1
                ]

            parsed = json.loads(cleaned_text)

            required_fields = [
                "ai_summary",
                "risk_explanation",
                "key_factors",
                "positive_factors",
                "attention_factors",
                "personalized_action_plan",
                "lifestyle_guidance",
                "questions_for_healthcare_provider",
                "safety_message",
                "disclaimer"
            ]

            for field in required_fields:
                if field not in parsed:
                    parsed[field] = []

            parsed["status"] = "success"
            parsed["ai_available"] = True

            return parsed

        except Exception as e:
            print(
                f"Error parsing OpenAI response: {e}"
            )
            return self._get_fallback_response()

    def _get_fallback_response(self):
        """Safe fallback when AI insights are unavailable."""

        return {
            "status": "success",

            "ai_summary":
                "AI health insights are temporarily unavailable.",

            "risk_explanation":
                "The Logistic Regression model and SHAP explanations "
                "are still available.",

            "key_factors": [],

            "positive_factors": [],

            "attention_factors": [],

            "personalized_action_plan": [],

            "lifestyle_guidance": [],

            "questions_for_healthcare_provider": [],

            "safety_message":
                "Your ML prediction and SHAP explanation remain available.",

            "disclaimer":
                "AI interpretation unavailable. ML model predictions "
                "are still functional.",

            "ai_available": self.is_available()
        }


# Create the shared OpenAI health service instance
openai_service = OpenAIHealthService()