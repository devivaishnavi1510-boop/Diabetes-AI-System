from fastapi import APIRouter, HTTPException
import os
import joblib
import pandas as pd
import shap

router = APIRouter(
    prefix="/prediction",
    tags=["Prediction"]
)

# ============================================================
# PATHS
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

# Try multiple paths for model and dataset
MODEL_PATHS = [
    os.path.join(BASE_DIR, "diabetes_model.pkl"),
    os.path.join(BASE_DIR, "..", "ml", "saved_models", "diabetes_model.pkl"),
    os.path.join(BASE_DIR, "..", "..", "ml", "saved_models", "diabetes_model.pkl"),
]

DATA_PATHS = [
    os.path.join(BASE_DIR, "..", "ml", "dataset", "diabetes.csv"),
    os.path.join(BASE_DIR, "..", "..", "ml", "dataset", "diabetes.csv"),
]


# ============================================================
# LOAD MODEL
# ============================================================

model = None
MODEL_PATH = None

for path in MODEL_PATHS:
    if os.path.exists(path):
        MODEL_PATH = path
        break

if MODEL_PATH:
    try:
        model = joblib.load(MODEL_PATH)
        print(f"Diabetes model loaded successfully from {MODEL_PATH}!")
    except Exception as e:
        model = None
        print("Error loading diabetes model:", e)
else:
    print("Error: Diabetes model file not found in any expected location")


# ============================================================
# LOAD BACKGROUND DATA FOR SHAP
# ============================================================

explainer = None
DATA_PATH = None

for path in DATA_PATHS:
    if os.path.exists(path):
        DATA_PATH = path
        break

if DATA_PATH:
    try:
        background_df = pd.read_csv(DATA_PATH)

        background_data = background_df.drop(
            "Outcome",
            axis=1
        )

        # Use the complete dataset as SHAP background
        masker = shap.maskers.Independent(
            background_data,
            max_samples=len(background_data)
        )

        explainer = shap.LinearExplainer(
            model,
            masker
        )

        print(f"SHAP LinearExplainer initialized successfully from {DATA_PATH}!")

    except Exception as e:
        print("Error initializing SHAP:", e)
else:
    print("Error: Diabetes dataset file not found in any expected location")


# ============================================================
# TEST ROUTE
# ============================================================

@router.get("/test")
def prediction_test():
    return {
        "status": "success",
        "message": "Prediction route is working 🚀"
    }


# ============================================================
# DIABETES PREDICTION
# ============================================================

@router.post("/predict")
def predict_diabetes(
    Pregnancies: int,
    Glucose: float,
    BloodPressure: float,
    SkinThickness: float,
    Insulin: float,
    BMI: float,
    DiabetesPedigreeFunction: float,
    Age: int
):

    # --------------------------------------------------------
    # Check model
    # --------------------------------------------------------

    if model is None:
        raise HTTPException(
            status_code=500,
            detail="Diabetes model could not be loaded"
        )

    # --------------------------------------------------------
    # Create input DataFrame
    # --------------------------------------------------------

    input_data = pd.DataFrame([{
        "Pregnancies": Pregnancies,
        "Glucose": Glucose,
        "BloodPressure": BloodPressure,
        "SkinThickness": SkinThickness,
        "Insulin": Insulin,
        "BMI": BMI,
        "DiabetesPedigreeFunction": DiabetesPedigreeFunction,
        "Age": Age
    }])

    # --------------------------------------------------------
    # Prediction
    # --------------------------------------------------------

    prediction = model.predict(input_data)[0]

    # --------------------------------------------------------
    # Diabetes probability
    # --------------------------------------------------------

    probability = model.predict_proba(input_data)[0][1]

    risk_percentage = round(
        probability * 100,
        2
    )

    # --------------------------------------------------------
    # Risk level
    # --------------------------------------------------------

    if risk_percentage < 30:
        risk_level = "Low Risk"

    elif risk_percentage < 70:
        risk_level = "Moderate Risk"

    else:
        risk_level = "High Risk"

    # --------------------------------------------------------
    # Prediction result
    # --------------------------------------------------------

    if prediction == 1:
        result = "Diabetic"
    else:
        result = "Not Diabetic"

    # ========================================================
    # SHAP EXPLANATION
    # ========================================================

    explanation = []

    if explainer is not None:

        try:

            shap_values = explainer.shap_values(
                input_data
            )

            # Convert SHAP output to a normal numpy array
            shap_values = shap_values[0]

            feature_names = list(
                input_data.columns
            )

            feature_values = input_data.iloc[0].values

            for feature, value, impact in zip(
                feature_names,
                feature_values,
                shap_values
            ):

                impact_value = float(impact)

                # Determine direction
                if impact_value > 0:
                    direction = "increases risk"
                elif impact_value < 0:
                    direction = "decreases risk"
                else:
                    direction = "no significant impact"

                explanation.append({
                    "feature": feature,
                    "value": float(value),
                    "impact": round(
                        impact_value,
                        4
                    ),
                    "direction": direction
                })

        except Exception as e:

            print(
                "Error calculating SHAP values:",
                e
            )

    # ========================================================
    # FINAL RESPONSE
    # ========================================================

    return {
        "status": "success",
        "prediction": int(prediction),
        "result": result,
        "risk_percentage": risk_percentage,
        "risk_level": risk_level,
        "explanation": explanation
    }


# ============================================================
# WHAT-IF RISK SIMULATOR
# ============================================================

@router.post("/simulate")
def simulate_risk(
    Pregnancies: int,
    Glucose: float,
    BloodPressure: float,
    SkinThickness: float,
    Insulin: float,
    BMI: float,
    DiabetesPedigreeFunction: float,
    Age: int,
    original_risk_percentage: float = None
):
    """
    What-If Risk Simulator using the existing Logistic Regression model.

    This allows users to see how the model's prediction would change
    under hypothetical input values.

    IMPORTANT: This is a model simulation, not a medical prediction.
    """
    # --------------------------------------------------------
    # Check model
    # --------------------------------------------------------

    if model is None:
        raise HTTPException(
            status_code=500,
            detail="Diabetes model could not be loaded"
        )

    # --------------------------------------------------------
    # Create input DataFrame
    # --------------------------------------------------------

    input_data = pd.DataFrame([{
        "Pregnancies": Pregnancies,
        "Glucose": Glucose,
        "BloodPressure": BloodPressure,
        "SkinThickness": SkinThickness,
        "Insulin": Insulin,
        "BMI": BMI,
        "DiabetesPedigreeFunction": DiabetesPedigreeFunction,
        "Age": Age
    }])

    # --------------------------------------------------------
    # Prediction
    # --------------------------------------------------------

    prediction = model.predict(input_data)[0]

    # --------------------------------------------------------
    # Diabetes probability
    # --------------------------------------------------------

    probability = model.predict_proba(input_data)[0][1]

    risk_percentage = round(
        probability * 100,
        2
    )

    # --------------------------------------------------------
    # Risk level
    # --------------------------------------------------------

    if risk_percentage < 30:
        risk_level = "Low Risk"

    elif risk_percentage < 70:
        risk_level = "Moderate Risk"

    else:
        risk_level = "High Risk"

    # --------------------------------------------------------
    # Prediction result
    # --------------------------------------------------------

    if prediction == 1:
        result = "Diabetic"
    else:
        result = "Not Diabetic"

    # --------------------------------------------------------
    # Calculate difference if original provided
    # --------------------------------------------------------

    risk_difference = None
    if original_risk_percentage is not None:
        risk_difference = round(risk_percentage - original_risk_percentage, 2)

    # ========================================================
    # FINAL RESPONSE
    # ========================================================

    return {
        "status": "success",
        "prediction": int(prediction),
        "result": result,
        "risk_percentage": risk_percentage,
        "risk_level": risk_level,
        "risk_difference": risk_difference,
        "is_simulation": True
    }