# Diabetes Prediction and Personalized Health Risk Assessment System

## Explainable Hybrid AI System using Logistic Regression, SHAP, and GPT-6 Astra

A modern hybrid AI healthcare intelligence system that combines machine learning prediction, explainable AI, and generative AI for comprehensive diabetes risk assessment and personalized health education.

---

## 🎯 Project Overview

This system is a B.Tech final-year project that demonstrates a **hybrid AI architecture** for healthcare risk assessment. It is NOT a simple ChatGPT wrapper or a basic prediction application.

**Key Differentiator**: Clear separation of responsibilities between three AI technologies:
- **Logistic Regression**: Authoritative numerical risk prediction
- **SHAP**: Mathematical model explainability
- **GPT-6 Astra**: Natural language interpretation and educational guidance

---

## ✨ Features

### Core Features
- ✅ **Machine Learning Prediction**: Logistic Regression-based diabetes risk assessment
- ✅ **Explainable AI**: SHAP feature contribution analysis
- ✅ **AI Health Explanation**: GPT-6 Astra interprets ML results into simple language
- ✅ **Personalized Action Plan**: AI-generated educational guidance based on actual model results
- ✅ **What-If Risk Simulator**: Model-based scenario exploration using the real ML model
- ✅ **Scenario Comparison**: Compare multiple hypothetical scenarios
- ✅ **Healthcare Discussion Questions**: AI-generated questions for medical professionals
- ✅ **Model Transparency Panel**: Visual architecture pipeline explanation
- ✅ **Prediction History**: Track previous assessments

### Safety & Privacy
- 🔒 Privacy-first health data handling
- ⚠️ Comprehensive medical disclaimers
- 🛡️ Fallback behavior when AI is unavailable
- 🔐 API keys never exposed to frontend
- 📋 Clear separation of ML prediction vs AI interpretation

---

## 🏗️ Architecture

### Hybrid AI Pipeline

```
Patient Health Inputs
        ↓
Input Validation
        ↓
Logistic Regression (ML Prediction)
        ↓
Risk Probability & Classification
        ↓
SHAP Explainable AI (Feature Analysis)
        ↓
GPT-6 Astra (Natural Language Interpretation)
        ↓
Personalized Educational Guidance
```

### Component Responsibilities

| Component | Role | Technology |
|-----------|------|------------|
| **Prediction Engine** | Numerical risk prediction | Logistic Regression (Scikit-learn) |
| **Explainability** | Model interpretation | SHAP (SHapley Additive exPlanations) |
| **Health Intelligence** | Educational guidance | GPT-6 Astra (OpenAI) |

**Important**: GPT-6 does NOT independently determine diabetes prediction. It only interprets existing ML + SHAP results.

---

## 📁 Project Structure

```
Diabetes-AI-System/
├── backend/
│   ├── app/                    # Application modules
│   ├── config/                 # Configuration files
│   │   ├── database.py        # Database configuration
│   │   └── settings.py        # Application settings
│   ├── models/                 # Database models
│   │   ├── schemas.py         # Pydantic schemas
│   │   └── user.py            # User model
│   ├── routes/                 # API routes
│   │   ├── auth.py            # Authentication endpoints
│   │   ├── prediction.py      # Prediction & simulator endpoints
│   │   └── ai_insights.py     # AI health insights endpoint
│   ├── services/               # Business logic
│   │   └── openai_service.py  # GPT-6 Astra integration
│   ├── utils/                  # Utility functions
│   ├── main.py                # FastAPI application entry
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main React component
│   │   ├── App.css            # Application styles
│   │   └── main.jsx           # React entry point
│   ├── package.json           # Node.js dependencies
│   └── vite.config.js         # Vite configuration
├── ml/
│   ├── dataset/
│   │   └── diabetes.csv       # Training dataset
│   ├── saved_models/
│   │   └── diabetes_model.pkl # Trained Logistic Regression model
│   └── train.py               # Model training script
├── docs/
│   ├── AI_ARCHITECTURE.md     # Detailed AI architecture documentation
│   └── PRD.md                 # Product Requirements Document
└── README.md                  # This file
```

---

## 🚀 Installation

### Prerequisites

- Python 3.8+
- Node.js 16+
- OpenAI API key (for GPT-6 Astra features)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
```

3. Activate virtual environment:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Configure environment variables:
```bash
# Edit backend/.env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-6-astra
OPENAI_REASONING_EFFORT=low
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

### ML Model Training

The model is already trained and saved in `ml/saved_models/diabetes_model.pkl`. 

To retrain the model:
```bash
cd ml
python train.py
```

---

## 🎮 How to Run

### Start Backend

```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

Backend will be available at: `http://127.0.0.1:8000`

API Documentation: `http://127.0.0.1:8000/docs`

### Start Frontend

```bash
cd frontend
npm run dev
```

Frontend will be available at: `http://localhost:5173`

---

## 🔌 API Endpoints

### Prediction Endpoints

#### `POST /prediction/predict`
Main diabetes prediction endpoint.

**Parameters** (query params):
- `Pregnancies` (int)
- `Glucose` (float)
- `BloodPressure` (float)
- `SkinThickness` (float)
- `Insulin` (float)
- `BMI` (float)
- `DiabetesPedigreeFunction` (float)
- `Age` (int)

**Response**:
```json
{
  "status": "success",
  "prediction": 1,
  "result": "Diabetic",
  "risk_percentage": 90.29,
  "risk_level": "High Risk",
  "explanation": [...]
}
```

#### `POST /prediction/simulate`
What-If Risk Simulator using the existing Logistic Regression model.

**Parameters**: Same as predict endpoint + `original_risk_percentage` (optional)

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

### AI Health Insights Endpoint

#### `POST /ai/health-insights`
Generate AI health insights using GPT-6 Astra.

**Request Body**:
```json
{
  "features": {...},
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

### Authentication Endpoints

#### `POST /register`
User registration

#### `POST /login`
User login (returns JWT token)

#### `GET /me`
Get current user (requires authentication)

---

## 🔧 Configuration

### Environment Variables

Backend `.env` file:

```env
# Project Configuration
PROJECT_NAME=Diabetes Prediction and Personalized Health Risk Assessment System
API_VERSION=1.0.0
SECRET_KEY=your_super_secret_key_2026
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-5.6-sol
OPENAI_REASONING_EFFORT=low
```

**Important**:
- Never commit actual API keys to version control
- Add `.env` to `.gitignore`
- Do not expose environment secrets to frontend

---

## 🧪 Testing

### Test Examples

#### Low-Risk Example
```
Pregnancies: 1
Glucose: 100
BloodPressure: 65
SkinThickness: 18
Insulin: 70
BMI: 23
DiabetesPedigreeFunction: 0.25
Age: 22
```

Expected: Low Risk (<30%)

#### High-Risk Example
```
Pregnancies: 8
Glucose: 180
BloodPressure: 90
SkinThickness: 35
Insulin: 200
BMI: 35
DiabetesPedigreeFunction: 0.8
Age: 50
```

Expected: High Risk (>70%)

### Verification Checklist

- [ ] Prediction works correctly
- [ ] Risk percentage displays accurately
- [ ] Risk level classification is correct
- [ ] SHAP explanations show feature contributions
- [ ] AI insights generate successfully (with API key)
- [ ] Fallback works when AI is unavailable
- [ ] What-If simulator uses real ML model
- [ ] Scenario comparison displays correctly
- [ ] Frontend does not crash on errors
- [ ] Medical disclaimers are visible

---

## 📚 Documentation

- **AI Architecture**: See `docs/AI_ARCHITECTURE.md` for detailed hybrid AI architecture documentation
- **Product Requirements**: See `docs/PRD.md` for project requirements
- **API Documentation**: Available at `http://127.0.0.1:8000/docs` when backend is running

---

## ⚠️ Important Disclaimers

### Medical Disclaimer

**This system is for educational and research purposes only.**

- It does NOT provide medical diagnoses
- It does NOT replace professional healthcare advice
- It does NOT make treatment recommendations
- Always consult a qualified healthcare professional for medical decisions

### System Limitations

- Trained on Pima Indians Diabetes dataset (specific population)
- Limited to 8 health parameters
- Not FDA-approved or medically certified
- Not suitable for emergency medical situations
- Model simulations are not predictions of future health outcomes

### AI Limitations

- GPT-6 provides educational interpretation, not medical advice
- SHAP explains the ML model, not medical causation
- What-If simulator shows model behavior, not guaranteed health outcomes

---

## 🔒 Privacy & Security

### Data Handling

- Health information treated as sensitive
- Complete patient profiles not logged unnecessarily
- No authentication credentials sent to OpenAI
- API keys stored in backend environment only
- Minimized PII in AI-generated assessments

### Security Measures

- OpenAI API calls happen ONLY from FastAPI backend
- `OPENAI_API_KEY` never exposed to React frontend
- No user credentials sent to external AI services
- Appropriate error handling for API failures

---

## 🎓 Academic Context

This is a B.Tech final-year project demonstrating:

- Hybrid AI architecture in healthcare
- Explainable AI (XAI) integration
- Responsible AI design principles
- Privacy-first health application development
- Safe generative AI implementation

### Project Identity

**"An Explainable Hybrid AI System for Diabetes Risk Assessment using Logistic Regression, SHAP, and GPT-6 Astra."**

NOT: "ChatGPT predicts diabetes."

---

## 🛠️ Technologies Used

### Backend
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: SQL toolkit and ORM
- **Pydantic**: Data validation using Python type annotations
- **Scikit-learn**: Machine learning library
- **SHAP**: Explainable AI library
- **OpenAI**: GPT-6 Astra API
- **Joblib**: Model serialization

### Frontend
- **React**: UI library
- **Vite**: Build tool and dev server
- **CSS**: Custom styling

### ML
- **Logistic Regression**: Prediction algorithm
- **Pandas**: Data manipulation
- **NumPy**: Numerical computing

---

## 📈 Future Enhancements

Potential improvements for future versions:

- [ ] Additional ML models (Random Forest, XGBoost)
- [ ] User authentication and prediction history persistence
- [ ] Multi-language support
- [ ] Mobile-responsive design improvements
- [ ] Additional health parameters
- [ ] Integration with wearable devices
- [ ] Longitudinal health tracking
- [ ] Healthcare provider dashboard

---

## 🤝 Contributing

This is an academic project. Contributions should follow:

1. Maintain the hybrid AI architecture
2. Preserve safety and privacy principles
3. Update documentation for any changes
4. Test thoroughly before committing

---

## 📄 License

This project is for educational purposes. Please ensure compliance with:
- OpenAI API terms of service
- Healthcare data regulations in your jurisdiction
- Academic integrity guidelines

---

## 📞 Support

For questions or issues:
- Review the AI Architecture documentation
- Check API documentation at `/docs`
- Verify environment configuration
- Ensure all dependencies are installed

---

## 🙏 Acknowledgments

- Pima Indians Diabetes Dataset (UCI Machine Learning Repository)
- SHAP library developers
- OpenAI for GPT-6 Astra
- Scikit-learn community

---

**Version**: 2.0 (Hybrid AI Architecture)  
**Last Updated**: September 2026  
**Academic Project**: B.Tech Final Year
