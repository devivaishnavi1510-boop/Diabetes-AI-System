# Diabetes Prediction and Personalized Health Risk Assessment System

## 📌 Project Overview

The Diabetes Prediction and Personalized Health Risk Assessment System is an AI-based web application designed to predict diabetes risk using Machine Learning and provide an understandable explanation of the prediction.

The system uses Logistic Regression for diabetes risk prediction and SHAP (SHapley Additive exPlanations) for explaining how individual health features contribute to the model's prediction.

The system also includes a What-If Risk Simulator, prediction history, scenario comparison, model transparency, personalized wellness recommendations, user authentication, and an AI-powered health explanation module.

> ⚠️ **Disclaimer:** This project is developed for educational and research purposes only. It is not a medical diagnostic system and should not replace professional medical advice.

---

## 🎯 Objectives

- Predict diabetes risk using Machine Learning.
- Calculate an estimated risk probability.
- Classify the prediction into Low, Moderate, or High Risk.
- Explain model predictions using SHAP Explainable AI.
- Allow users to experiment with health parameters using a What-If Risk Simulator.
- Compare different risk scenarios.
- Maintain prediction history for authenticated users.
- Provide personalized general wellness recommendations.
- Provide an AI-based natural-language explanation of ML results.
- Demonstrate model transparency through a visual system architecture.

---

## 🧠 Technologies Used

### Machine Learning
- Python
- Pandas
- NumPy
- Scikit-learn
- Logistic Regression
- SHAP

### Backend
- FastAPI
- Uvicorn
- SQLAlchemy
- SQLite
- Pydantic
- JWT Authentication

### Frontend
- React
- Vite
- JavaScript
- CSS

### AI
- OpenAI API
- GPT-5.6 Sol

---

## 🏗️ System Architecture

```text
Patient Health Data
        ↓
Input Validation
        ↓
Logistic Regression Model
        ↓
Risk Probability
        ↓
Risk Classification
        ↓
SHAP Explainable AI
        ↓
GPT-5.6 Sol
        ↓
Personalized Educational Guidance
---

## 📊 Input Features

The prediction model uses the following health-related input parameters:

| Feature | Description |
|---|---|
| Pregnancies | Number of pregnancies |
| Glucose | Glucose measurement |
| BloodPressure | Blood pressure measurement |
| SkinThickness | Skin thickness measurement |
| Insulin | Insulin measurement |
| BMI | Body Mass Index |
| DiabetesPedigreeFunction | Diabetes pedigree function value |
| Age | Age of the individual |

---

## 🤖 Machine Learning Model

The system uses **Logistic Regression** to estimate diabetes risk based on the provided health-related input features.

The model produces:

1. Prediction result
2. Estimated risk percentage
3. Risk classification

The application classifies the estimated risk into:

- Low Risk
- Moderate Risk
- High Risk

---

## 🔍 Explainable AI with SHAP

SHAP (SHapley Additive exPlanations) is used to explain the contribution of individual input features to the model prediction.

The system displays feature-level explanations to help users understand which input values contributed positively or negatively to the prediction.

This improves the transparency and interpretability of the Machine Learning model.

---

## 🔄 What-If Risk Simulator

The What-If Risk Simulator allows users to modify health parameters and observe how the estimated model risk changes.

```text
Original Assessment
        ↓
Modify Health Parameter
        ↓
Run Simulation
        ↓
New Risk Probability
        ↓
Compare With Original Risk
---

## 📋 Scenario Comparison

The system allows simulated scenarios to be compared with the current assessment.

Users can view:

- Risk percentage
- Risk level
- Difference from the current assessment

This feature helps demonstrate how changes in input values affect the model's estimated risk.

---

## 🔐 Authentication

The application includes user authentication using:

- User registration
- User login
- JWT access tokens
- Protected user information
- User-specific prediction history

---

## 📜 Prediction History

Authenticated users can view previous predictions stored by the application.

Each history record can contain:

- Prediction result
- Risk percentage
- Risk level
- Date and time of assessment
---

## 🤖 AI Health Explanation

The system integrates the OpenAI API to interpret the Machine Learning prediction and SHAP explanations in natural language.

The AI module is designed to:

- Explain the prediction in understandable language.
- Interpret SHAP feature contributions.
- Provide general educational wellness guidance.
- Keep the original Machine Learning prediction unchanged.

The Machine Learning model remains responsible for the numerical risk prediction.

---

## 💚 Personalized Recommendations

The system provides general wellness recommendations based on the assessment.

Examples include:

- Maintaining a balanced diet
- Staying physically active
- Staying hydrated
- Monitoring health regularly

These recommendations are educational and are not intended to provide medical diagnosis or treatment.

---

## 🔎 Model Transparency

The application includes a model transparency section explaining the major components of the system:

```text
Patient Data
     ↓
Input Validation
     ↓
Logistic Regression
     ↓
Risk Probability
     ↓
Risk Classification
     ↓
SHAP Explainable AI
     ↓
GPT-5.6 Sol
     ↓
Personalized Guidance
---

## 🌟 Key Features

- Machine Learning-based diabetes risk prediction
- Logistic Regression
- SHAP Explainable AI
- Risk probability visualization
- Low/Moderate/High risk classification
- What-If Risk Simulator
- Scenario Comparison
- User authentication
- JWT security
- Prediction History
- Model Transparency
- Personalized wellness recommendations
- AI-powered educational explanation
- React-based interactive dashboard
- FastAPI backend

---

## ⚠️ Medical Disclaimer

This application is intended strictly for educational and research purposes.

The predictions generated by the Machine Learning model are statistical estimates and should not be considered medical diagnoses.

Users should consult qualified healthcare professionals for medical advice, diagnosis, or treatment.
---

## 📁 Project Structure

```text
Diabetes-AI-System/
│
├── .github/
├── assets/
├── backend/
│   ├── app/
│   ├── config/
│   ├── models/
│   ├── routes/
│   │   ├── auth.py
│   │   ├── prediction.py
│   │   └── ai_insights.py
│   ├── services/
│   │   └── openai_service.py
│   ├── utils/
│   └── main.py
│
├── database/
├── docs/
├── frontend/
│   └── src/
│       ├── assets/
│       ├── App.jsx
│       ├── app.css
│       ├── index.css
│       └── main.jsx
│
├── ml/
├── reports/
├── tests/
├── readme.md
├── requirements.txt
└── ...
---

## ⚙️ How to Run the Project

### 1. Start the Backend

Open PowerShell and navigate to the backend folder:

```powershell
cd C:\Diabetes-AI-System\backend
---

## 📌 Example Prediction Results

### Low-Risk Example

```text
Prediction: Not Diabetic
Estimated Risk: 4.33%
Risk Level: Low Risk
### High-Risk Example

```text
Prediction: Diabetic
Estimated Risk: 90.29%
Risk Level: High Risk
These examples demonstrate the functioning of the Machine Learning model with different input scenarios.

---

## 👩‍💻 Project Information

**Project Title:**  
Diabetes Prediction and Personalized Health Risk Assessment System Using Logistic Regression and Explainable AI

**Domain:**  
Artificial Intelligence / Machine Learning / Explainable AI / Healthcare

**Technologies:**  
Python, FastAPI, React, Logistic Regression, SHAP, SQLite, OpenAI API