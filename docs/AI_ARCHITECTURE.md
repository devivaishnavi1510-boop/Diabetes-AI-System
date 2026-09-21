# AI Architecture Documentation

## Hybrid AI Healthcare Intelligence System

This document describes the hybrid AI architecture used in the Diabetes Prediction and Personalized Health Risk Assessment System.

---

## Overview

The system uses a **hybrid AI architecture** that combines three distinct AI technologies:

1. **Logistic Regression** - Machine learning model for numerical risk prediction
2. **SHAP (SHapley Additive exPlanations)** - Explainable AI for model interpretation
3. **GPT-6 Astra** - Generative AI for natural language interpretation and educational guidance

---

## Architecture Diagram

```
Patient Health Inputs
        ↓
Input Validation
        ↓
Logistic Regression Model
        ↓
Diabetes Prediction (0/1)
        ↓
Risk Probability (0-100%)
        ↓
Risk Classification (Low/Moderate/High)
        ↓
SHAP Explainable AI
        ↓
Feature Contribution Analysis
        ↓
GPT-6 Astra Health Intelligence Layer
        ↓
Personalized Explanation
        ↓
Personalized Wellness Action Plan
        ↓
Safe Follow-up Guidance
```

---

## Component Responsibilities

### 1. Logistic Regression (Prediction Engine)

**Purpose**: Provides the authoritative diabetes risk prediction.

**Responsibilities**:
- Trained on the Pima Indians Diabetes dataset
- Outputs binary prediction (Diabetic/Not Diabetic)
- Outputs risk probability (0-100%)
- Classifies risk level (Low/Moderate/High)

**Model Location**: `ml/saved_models/diabetes_model.pkl`

**Training Script**: `ml/train.py`

**Features Used**:
- Pregnancies
- Glucose
- BloodPressure
- SkinThickness
- Insulin
- BMI
- DiabetesPedigreeFunction
- Age

**Important**: Logistic Regression is the ONLY component that makes the diabetes prediction. GPT-6 does NOT override or independently determine the prediction.

---

### 2. SHAP Explainable AI (Model Explanation)

**Purpose**: Mathematically explains which features contributed to the model's prediction.

**Responsibilities**:
- Calculates SHAP values for each input feature
- Shows direction of contribution (increases/decreases risk)
- Provides numerical impact scores
- Maintains mathematical transparency

**Implementation**: `backend/routes/prediction.py`

**SHAP Configuration**:
- Uses `LinearExplainer` for Logistic Regression
- Background data: Complete diabetes dataset
- Output: Feature-wise SHAP values with direction

**Important**: SHAP explains the MACHINE LEARNING MODEL's decision process. It does NOT provide medical causation.

---

### 3. GPT-6 Astra (Health Intelligence Layer)

**Purpose**: Interprets ML prediction and SHAP explanations into understandable, personalized educational guidance.

**Responsibilities**:
- Transforms technical ML results into simple language
- Generates personalized action plans based on SHAP results
- Suggests questions for healthcare professionals
- Provides educational health guidance
- Maintains clear distinction between ML prediction and AI interpretation

**Implementation**: `backend/services/openai_service.py`

**API Endpoint**: `POST /ai/health-insights`

**OpenAI API Usage**:
- Uses the Responses API (recommended for GPT-5.4 and newer models)
- Model: `gpt-5.6-sol` (OpenAI's flagship frontier model)
- Parameter: `reasoning_effort` with values: `none`, `low`, `medium`, `high`, `xhigh`, `max`
- Current setting: `low` (efficient reasoning for speed and cost optimization)

**System Role**:
```
"An AI health education and risk-explanation assistant that interprets an 
existing machine-learning diabetes risk assessment and its SHAP explanations."
```

**Constraints**:
- Does NOT claim to be a doctor
- Does NOT diagnose diabetes
- Does NOT override Logistic Regression prediction
- Does NOT invent medical measurements
- Does NOT fabricate clinical guidelines
- Clearly distinguishes between ML prediction, SHAP explanation, and AI guidance

**Important**: GPT-6 is for EDUCATIONAL purposes only. It does NOT provide medical advice or make clinical decisions.

---

## API Flow

### 1. Prediction Endpoint

**Endpoint**: `POST /prediction/predict`

**Request**: Health parameters as query parameters

**Response**:
```json
{
  "status": "success",
  "prediction": 1,
  "result": "Diabetic",
  "risk_percentage": 90.29,
  "risk_level": "High Risk",
  "explanation": [
    {
      "feature": "Glucose",
      "value": 180,
      "impact": 2.1829,
      "direction": "increases risk"
    },
    ...
  ]
}
```

---

### 2. AI Health Insights Endpoint

**Endpoint**: `POST /ai/health-insights`

**Request**:
```json
{
  "features": {
    "Pregnancies": 8,
    "Glucose": 180,
    ...
  },
  "prediction": "Diabetic",
  "risk_percentage": 90.29,
  "risk_level": "High Risk",
  "explanation": [...]
}
```

**Response**:
```json
{
  "status": "success",
  "ai_summary": "...",
  "risk_explanation": "...",
  "key_factors": [...],
  "positive_factors": [...],
  "attention_factors": [...],
  "personalized_action_plan": [...],
  "lifestyle_guidance": [...],
  "questions_for_healthcare_provider": [...],
  "safety_message": "...",
  "disclaimer": "...",
  "ai_available": true
}
```

---

### 3. What-If Risk Simulator Endpoint

**Endpoint**: `POST /prediction/simulate`

**Request**: Modified health parameters as query parameters

**Response**:
```json
{
  "status": "success",
  "prediction": 0,
  "result": "Not Diabetic",
  "risk_percentage": 25.50,
  "risk_level": "Low Risk",
  "risk_difference": -64.79,
  "is_simulation": true
}
```

**Important**: This uses the SAME Logistic Regression model. It is a model simulation, not a medical prediction of future health.

---

## Privacy Design

### Data Handling

1. **Health Data**: Treated as sensitive information
2. **Logging**: Complete patient profiles are NOT logged unnecessarily
3. **API Keys**: Never sent to OpenAI from the frontend
4. **Environment Variables**: `OPENAI_API_KEY` stored in backend `.env` only
5. **GPT Prompts**: Minimized personally identifiable information
6. **Storage**: AI-generated assessments minimize PII when stored

### Security Measures

- OpenAI API calls happen ONLY from FastAPI backend
- `OPENAI_API_KEY` never exposed to React frontend
- No authentication credentials sent to OpenAI
- Appropriate comments explain privacy design

---

## Safety Design

### Medical Disclaimer

Every AI-generated response includes:

```
"This system is for educational purposes only. It does not provide medical 
diagnoses or replace professional healthcare advice. Always consult a qualified 
healthcare professional for medical decisions."
```

### Avoided Claims

The system avoids:
- Diagnosis claims
- Treatment prescriptions
- Medication dosage recommendations
- Guaranteed outcomes
- Fabricated medical facts
- Fabricated test results
- Claims that changing one variable will prevent diabetes

### Emergency Guidance

For urgent symptoms, the system provides general advice to seek professional medical care rather than attempting diagnosis.

---

## Fallback Behavior

### When OpenAI is Unavailable

If GPT-6 is unavailable (missing API key, rate limits, network errors):

1. **ML Prediction**: Still works normally
2. **SHAP Explanation**: Still works normally
3. **AI Insights**: Shows fallback message:
   ```
   "AI insights are temporarily unavailable. Your ML prediction and SHAP 
   explanation are still available."
   ```

### Error Handling

The system handles:
- Missing `OPENAI_API_KEY`
- Invalid API key
- Rate limits
- Timeout
- Network errors
- Malformed GPT response
- Structured output validation failure

**Important**: The frontend never crashes because GPT-6 is unavailable.

---

## What-If Risk Simulator

### Purpose

Allows users to explore how the Logistic Regression model's prediction would change under hypothetical input values.

### Implementation

- Uses the EXISTING Logistic Regression model
- Does NOT ask GPT-6 to calculate predictions
- Runs the real model with modified inputs
- Shows current vs simulated risk
- Calculates risk difference

### Wording

The simulator uses wording such as:
- "Model Simulation"
- "The model's estimated probability changes under these hypothetical input values"
- NOT "Your risk will become..."

### Important

This is a MODEL SIMULATION, not a medical prediction of future health outcomes.

---

## Scenario Comparison

### Purpose

Compare multiple what-if scenarios side by side.

### Features

- Current assessment
- Scenario 1: Modified inputs
- Scenario 2: Different modified inputs
- Visual comparison chart

### Important

These are model simulations for educational understanding, not medical predictions.

---

## Limitations

### Model Limitations

1. **Dataset**: Trained on Pima Indians Diabetes dataset (specific population)
2. **Features**: Limited to 8 health parameters
3. **Generalization**: May not generalize to all populations
4. **Temporal**: Does not account for time-based health changes

### AI Limitations

1. **GPT-6**: Educational interpretation only, not medical advice
2. **SHAP**: Explains model, not medical causation
3. **Simulator**: Model simulation, not future prediction
4. **Real-time**: Not real-time health monitoring

### System Limitations

1. **Scope**: Educational/research project, not clinical device
2. **Regulatory**: Not FDA-approved or medically certified
3. **Liability**: No medical liability assumed
4. **Emergency**: Not suitable for emergency medical situations

---

## Configuration

### Environment Variables

Backend `.env` file:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-6-astra
OPENAI_REASONING_EFFORT=low
```

### Important

- Never commit actual API key to version control
- Add `.env` to `.gitignore`
- Do not expose environment secrets to Vite/frontend variables

---

## Technical Differentiation

### Not a ChatGPT Wrapper

This system is technically different from a basic diabetes prediction application because:

1. **Hybrid Architecture**: Combines three distinct AI technologies with clear separation of responsibilities
2. **ML Authority**: Logistic Regression remains the authoritative prediction engine
3. **Mathematical Explainability**: SHAP provides mathematical model transparency
4. **Educational AI**: GPT-6 provides interpretation, not prediction
5. **Model Simulation**: What-If simulator uses the real ML model, not AI estimation
6. **Clear Boundaries**: Each component has well-defined responsibilities and limitations
7. **Fallback Design**: System works even when GPT-6 is unavailable
8. **Privacy-First**: Health data handled with appropriate security measures
9. **Safety-First**: Multiple disclaimers and safety mechanisms
10. **Transparency**: Full architecture pipeline visible to users

### Academic Identity

The project identity is:

**"An Explainable Hybrid AI System for Diabetes Risk Assessment using Logistic Regression, SHAP, and GPT-6 Astra."**

NOT: "ChatGPT predicts diabetes."

---

## References

- Logistic Regression: Scikit-learn implementation
- SHAP: Lundberg & Lee, 2017
- GPT-6 Astra: OpenAI Responses API
- Dataset: Pima Indians Diabetes Dataset (UCI Machine Learning Repository)

---

## Version

- Architecture Version: 2.0
- Last Updated: September 2026
