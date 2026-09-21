import { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    Pregnancies: "",
    Glucose: "",
    BloodPressure: "",
    SkinThickness: "",
    Insulin: "",
    BMI: "",
    DiabetesPedigreeFunction: "",
    Age: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [aiInsights, setAiInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiSection, setShowAiSection] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [simulatorData, setSimulatorData] = useState(null);
  const [simulatorLoading, setSimulatorLoading] = useState(false);
  const [scenarios, setScenarios] = useState([]);
  const [showTransparency, setShowTransparency] = useState(false);

  // =========================
  // HANDLE INPUT CHANGES
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // INPUT VALIDATION
  // =========================

  const validateForm = () => {
    if (
      Object.values(formData).some(
        (value) => value === "" || value === null
      )
    ) {
      return "Please fill in all fields.";
    }

    const values = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        Number(value),
      ])
    );

    if (values.Pregnancies < 0) {
      return "Pregnancies cannot be negative.";
    }

    if (values.Glucose <= 0) {
      return "Please enter a valid glucose value.";
    }

    if (values.BloodPressure <= 0) {
      return "Please enter a valid blood pressure value.";
    }

    if (values.SkinThickness < 0) {
      return "Skin thickness cannot be negative.";
    }

    if (values.Insulin < 0) {
      return "Insulin cannot be negative.";
    }

    if (values.BMI <= 0) {
      return "Please enter a valid BMI.";
    }

    if (values.DiabetesPedigreeFunction < 0) {
      return "Diabetes Pedigree Function cannot be negative.";
    }

    if (values.Age <= 0) {
      return "Please enter a valid age.";
    }

    return null;
  };

  // =========================
  // FORM SUBMISSION
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setResult({
        error: validationError,
      });

      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const params = new URLSearchParams();

      Object.entries(formData).forEach(([key, value]) => {
        params.append(key, value);
      });

      const response = await fetch(
        `http://127.0.0.1:8000/prediction/predict?${params.toString()}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Prediction failed");
      }

      setResult(data);

      // =========================
      // SAVE PREDICTION HISTORY
      // =========================

      setPredictionHistory((previousHistory) => [
        {
          result: data.result,
          risk_percentage: data.risk_percentage,
          risk_level: data.risk_level,
          date: new Date().toLocaleString(),
        },
        ...previousHistory,
      ]);

      // =========================
      // RESET AI STATE
      // =========================

      setAiInsights(null);
      setShowAiSection(false);
      setSimulatorData(null);
      setScenarios([]);
    } catch (error) {
      console.error("Prediction error:", error);

      setResult({
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FETCH AI INSIGHTS
  // =========================

  const fetchAiInsights = async () => {
    if (!result) return;

    setAiLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/ai/health-insights",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            features: formData,
            prediction: result.result,
            risk_percentage: result.risk_percentage,
            risk_level: result.risk_level,
            explanation: result.explanation,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch AI insights");
      }

      setAiInsights(data);
      setShowAiSection(true);
    } catch (error) {
      console.error("AI insights error:", error);
      setAiInsights({
        status: "error",
        ai_summary: "AI insights are currently unavailable.",
        risk_explanation: "Your ML prediction and SHAP explanation are still available.",
        key_factors: [],
        positive_factors: [],
        attention_factors: [],
        personalized_action_plan: [],
        lifestyle_guidance: [],
        questions_for_healthcare_provider: [],
        safety_message: "Consult a healthcare professional for medical advice.",
        disclaimer: "AI interpretation unavailable.",
        ai_available: false,
      });
      setShowAiSection(true);
    } finally {
      setAiLoading(false);
    }
  };

  // =========================
  // WHAT-IF SIMULATOR
  // =========================

  const [simulatorForm, setSimulatorForm] = useState({
    Pregnancies: "",
    Glucose: "",
    BloodPressure: "",
    SkinThickness: "",
    Insulin: "",
    BMI: "",
    DiabetesPedigreeFunction: "",
    Age: "",
  });

  const handleSimulatorChange = (e) => {
    setSimulatorForm({
      ...simulatorForm,
      [e.target.name]: e.target.value,
    });
  };

  const runSimulation = async () => {
    if (!result) return;

    setSimulatorLoading(true);

    try {
      const params = new URLSearchParams();

      Object.entries(simulatorForm).forEach(([key, value]) => {
        if (value !== "") {
          params.append(key, value);
        } else {
          params.append(key, formData[key]);
        }
      });

      params.append("original_risk_percentage", result.risk_percentage);

      const response = await fetch(
        `http://127.0.0.1:8000/prediction/simulate?${params.toString()}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Simulation failed");
      }

      setSimulatorData(data);

      // Add to scenarios
      setScenarios((prev) => [
        {
          name: `Scenario ${prev.length + 1}`,
          risk_percentage: data.risk_percentage,
          risk_level: data.risk_level,
          risk_difference: data.risk_difference,
        },
        ...prev,
      ]);
    } catch (error) {
      console.error("Simulation error:", error);
      alert("Simulation failed. Please try again.");
    } finally {
      setSimulatorLoading(false);
    }
  };

  const resetSimulator = () => {
    setSimulatorForm({
      Pregnancies: "",
      Glucose: "",
      BloodPressure: "",
      SkinThickness: "",
      Insulin: "",
      BMI: "",
      DiabetesPedigreeFunction: "",
      Age: "",
    });
    setSimulatorData(null);
  };

  return (
    <div className="app">

      {/* =========================
          HEADER
      ========================= */}

      <header className="header">
        <div className="medical-icon">🩺</div>

        <h1>Diabetes Risk Assessment</h1>

        <p>
          Diabetes Prediction and Personalized Health Risk Assessment
        </p>
      </header>

      {/* =========================
          MAIN CONTAINER
      ========================= */}

      <main className="container">

        {/* =========================
            INPUT CARD
        ========================= */}

        <section className="card">

          <div className="section-heading">
            <h2>📝 Health Information</h2>

            <p>
              Enter the following health parameters to assess the
              estimated diabetes risk.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              {/* Pregnancies */}

              <div className="form-group">
                <label htmlFor="Pregnancies">
                  Pregnancies
                </label>

                <input
                  id="Pregnancies"
                  type="number"
                  name="Pregnancies"
                  value={formData.Pregnancies}
                  onChange={handleChange}
                  placeholder="Enter pregnancies"
                  required
                />
              </div>

              {/* Glucose */}

              <div className="form-group">
                <label htmlFor="Glucose">
                  Glucose
                </label>

                <input
                  id="Glucose"
                  type="number"
                  name="Glucose"
                  value={formData.Glucose}
                  onChange={handleChange}
                  placeholder="Enter glucose level"
                  min="0"
                  required
                />
              </div>

              {/* Blood Pressure */}

              <div className="form-group">
                <label htmlFor="BloodPressure">
                  Blood Pressure
                </label>

                <input
                  id="BloodPressure"
                  type="number"
                  name="BloodPressure"
                  value={formData.BloodPressure}
                  onChange={handleChange}
                  placeholder="Enter blood pressure"
                  min="0"
                  required
                />
              </div>

              {/* Skin Thickness */}

              <div className="form-group">
                <label htmlFor="SkinThickness">
                  Skin Thickness
                </label>

                <input
                  id="SkinThickness"
                  type="number"
                  name="SkinThickness"
                  value={formData.SkinThickness}
                  onChange={handleChange}
                  placeholder="Enter skin thickness"
                  min="0"
                  required
                />
              </div>

              {/* Insulin */}

              <div className="form-group">
                <label htmlFor="Insulin">
                  Insulin
                </label>

                <input
                  id="Insulin"
                  type="number"
                  name="Insulin"
                  value={formData.Insulin}
                  onChange={handleChange}
                  placeholder="Enter insulin level"
                  min="0"
                  required
                />
              </div>

              {/* BMI */}

              <div className="form-group">
                <label htmlFor="BMI">
                  BMI
                </label>

                <input
                  id="BMI"
                  type="number"
                  step="0.1"
                  name="BMI"
                  value={formData.BMI}
                  onChange={handleChange}
                  placeholder="Enter BMI"
                  min="0"
                  required
                />
              </div>

              {/* Diabetes Pedigree Function */}

              <div className="form-group">
                <label htmlFor="DiabetesPedigreeFunction">
                  Diabetes Pedigree Function
                </label>

                <input
                  id="DiabetesPedigreeFunction"
                  type="number"
                  step="0.01"
                  name="DiabetesPedigreeFunction"
                  value={formData.DiabetesPedigreeFunction}
                  onChange={handleChange}
                  placeholder="Enter pedigree value"
                  min="0"
                  required
                />
              </div>

              {/* Age */}

              <div className="form-group">
                <label htmlFor="Age">
                  Age
                </label>

                <input
                  id="Age"
                  type="number"
                  name="Age"
                  value={formData.Age}
                  onChange={handleChange}
                  placeholder="Enter age"
                  min="0"
                  required
                />
              </div>

            </div>

            {/* Predict Button */}

            <button
              className="predict-button"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="loading">
                  Analyzing...
                </span>
              ) : (
                <>
                  🔍 Predict Diabetes
                </>
              )}
            </button>

          </form>
        </section>

        {/* =========================
            RESULT SECTION
        ========================= */}

        {result && (

          <section className="card result-card">

            {/* Validation Error */}

            {result.error ? (

              <div className="validation-error">

                <div className="validation-error-icon">
                  ⚠️
                </div>

                <div className="validation-error-content">
                  <h3>Invalid Input</h3>

                  <p>{result.error}</p>
                </div>

              </div>

            ) : (

              <>

                {/* =========================
                    PREDICTION SUMMARY
                ========================= */}

                <div className="result-header">

                  <span className="result-icon">
                    🩺
                  </span>

                  <div>
                    <h2>Prediction Result</h2>

                    <p>
                      AI-powered diabetes risk assessment
                    </p>
                  </div>

                </div>

                <div className="prediction-summary">

                  <div className="summary-item">
                    <span>Result</span>

                    <strong
                      className={
                        String(result.result)
                          .toLowerCase()
                          .includes("diabetic")
                          ? "summary-danger"
                          : "summary-success"
                      }
                    >
                      {result.result}
                    </strong>
                  </div>

                  <div className="summary-item">
                    <span>Risk Percentage</span>

                    <strong>
                      {result.risk_percentage}%
                    </strong>
                  </div>

                  <div className="summary-item">
                    <span>Risk Level</span>

                    <strong
                      className={
                        String(result.risk_level)
                          .toLowerCase()
                          .includes("high")
                          ? "summary-danger"
                          : "summary-success"
                      }
                    >
                      {result.risk_level}
                    </strong>
                  </div>

                </div>

                {/* =========================
                    RISK VISUALIZATION
                ========================= */}

                <div className="risk-visual">

                  <div className="risk-visual-header">

                    <div>
                      <span className="risk-title">
                        Risk Score
                      </span>

                      <p className="risk-description">
                        Overall estimated diabetes risk
                      </p>
                    </div>

                    <strong className="risk-percentage">
                      {result.risk_percentage}%
                    </strong>

                  </div>

                  <div className="risk-bar-container">

                    <div
                      className={
                        String(result.risk_level)
                          .toLowerCase()
                          .includes("high")
                          ? "risk-bar-fill risk-fill-high"
                          : "risk-bar-fill risk-fill-low"
                      }
                      style={{
                        width: `${Math.min(
                          Number(result.risk_percentage),
                          100
                        )}%`,
                      }}
                    />

                  </div>

                  <div className="risk-scale">

                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>

                  </div>

                  <div
                    className={
                      String(result.risk_level)
                        .toLowerCase()
                        .includes("high")
                        ? "risk-status risk-status-high"
                        : "risk-status risk-status-low"
                    }
                  >

                    <div className="risk-status-dot"></div>

                    <div>
                      <strong>
                        {result.risk_level}
                      </strong>

                      <p>
                        Your current assessment indicates a{" "}
                        {String(result.risk_level).toLowerCase()}.
                      </p>
                    </div>

                  </div>

                </div>

                {/* =========================
                    SHAP EXPLANATION
                ========================= */}

                {result.explanation &&
                  result.explanation.length > 0 && (

                  <div className="explanation">

                    <div className="section-heading">
                      <h2>
                        🧠 Why This Prediction?
                      </h2>

                      <p className="explanation-intro">
                        Explainable AI shows how each health
                        factor influenced this model prediction.
                      </p>
                    </div>

                    <div className="explanation-grid">

                      {result.explanation.map(
                        (item, index) => {

                          const impact =
                            Number(item.impact);

                          const isPositive =
                            impact > 0;

                          const isNegative =
                            impact < 0;

                          return (

                            <div
                              className={
                                isPositive
                                  ? "explanation-card explanation-card-positive"
                                  : isNegative
                                  ? "explanation-card explanation-card-negative"
                                  : "explanation-card"
                              }
                              key={`${item.feature}-${index}`}
                            >

                              <div className="explanation-card-header">

                                <h3>

                                  <span
                                    className={
                                      isPositive
                                        ? "impact-dot positive-dot"
                                        : isNegative
                                        ? "impact-dot negative-dot"
                                        : "impact-dot neutral-dot"
                                    }
                                  />

                                  {item.feature}

                                </h3>

                                <span
                                  className={
                                    isPositive
                                      ? "impact-badge positive-badge"
                                      : isNegative
                                      ? "impact-badge negative-badge"
                                      : "impact-badge neutral-badge"
                                  }
                                >
                                  {isPositive
                                    ? "Higher Risk"
                                    : isNegative
                                    ? "Lower Risk"
                                    : "Neutral"}
                                </span>

                              </div>

                              <div className="shap-value-box">

                                <span>
                                  Input Value
                                </span>

                                <strong>
                                  {item.value}
                                </strong>

                              </div>

                              <p
                                className={
                                  isPositive
                                    ? "explanation-positive"
                                    : isNegative
                                    ? "explanation-negative"
                                    : "explanation-neutral"
                                }
                              >
                                {isPositive
                                  ? "↑ Increases risk"
                                  : isNegative
                                  ? "↓ Decreases risk"
                                  : "→ Neutral"}
                              </p>

                              <div className="model-impact">

                                <span>
                                  Model Impact
                                </span>

                                <strong>
                                  {impact > 0 ? "+" : ""}
                                  {impact.toFixed(4)}
                                </strong>

                              </div>

                              <div className="impact-bar">

                                <div
                                  className={
                                    isPositive
                                      ? "impact-bar-fill positive-impact"
                                      : isNegative
                                      ? "impact-bar-fill negative-impact"
                                      : "impact-bar-fill neutral-impact"
                                  }
                                  style={{
                                    width: `${Math.min(
                                      Math.abs(impact) * 25,
                                      100
                                    )}%`,
                                  }}
                                />

                              </div>

                            </div>
                          );
                        }
                      )}

                    </div>

                    <div className="explainable-ai-note">

                      <strong>
                        💡 How to interpret this:
                      </strong>

                      <p>
                        Positive SHAP values indicate that a
                        feature contributed toward higher model
                        risk, while negative values contributed
                        toward lower model risk.
                      </p>

                    </div>

                    <div className="explainable-ai-disclaimer">

                      <strong>
                        ⚠️ Important:
                      </strong>

                      <p>
                        SHAP values explain the machine learning
                        model's prediction. They are not medical
                        diagnoses or individual clinical risk
                        percentages.
                      </p>

                    </div>

                  </div>
                )}

                {/* =========================
                    AI HEALTH INSIGHTS BUTTON
                ========================= */}

                <div className="ai-insights-trigger">
                  <button
                    className="ai-insights-button"
                    onClick={fetchAiInsights}
                    disabled={aiLoading || showAiSection}
                  >
                    {aiLoading ? (
                      <span className="loading">Generating AI Insights...</span>
                    ) : showAiSection ? (
                      "🤖 AI Insights Loaded"
                    ) : (
                      "🤖 Generate AI Health Explanation"
                    )}
                  </button>
                </div>

                {/* =========================
                    AI HEALTH EXPLANATION
                ========================= */}

                {showAiSection && aiInsights && (
                  <div className="ai-insights-section">

                    <div className="section-heading">
                      <h2>
                        🤖 AI Health Explanation
                      </h2>

                      <p>
                        GPT-5.6 Sol interprets your ML prediction and SHAP explanations
                        into personalized educational guidance.
                      </p>
                    </div>

                    {!aiInsights.ai_available && (
                      <div className="ai-unavailable-notice">
                        <strong>⚠️ AI Service Unavailable</strong>
                        <p>
                          AI insights are temporarily unavailable. Your ML prediction
                          and SHAP explanations are still fully functional.
                        </p>
                      </div>
                    )}


                    {/* AI Summary */}
                    <div className="ai-summary-card">
                      <h3>📋 Summary</h3>
                      <p>{aiInsights.ai_summary}</p>
                    </div>

                    {/* Risk Explanation */}
                    <div className="ai-risk-explanation">
                      <h3>📊 Risk Explanation</h3>
                      <p>{aiInsights.risk_explanation}</p>
                    </div>

                    {/* Key Factors */}
                    {aiInsights.key_factors && aiInsights.key_factors.length > 0 && (
                      <div className="ai-key-factors">
                        <h3>🔑 Key Factors</h3>
                        <ul>
                          {aiInsights.key_factors.map((factor, index) => (
                            <li key={index}>{factor}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Attention Factors */}
                    {aiInsights.attention_factors && aiInsights.attention_factors.length > 0 && (
                      <div className="ai-attention-factors">
                        <h3>⚠️ Factors Requiring Attention</h3>
                        <ul>
                          {aiInsights.attention_factors.map((factor, index) => (
                            <li key={index}>{factor}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Positive Factors */}
                    {aiInsights.positive_factors && aiInsights.positive_factors.length > 0 && (
                      <div className="ai-positive-factors">
                        <h3>✅ Positive Factors</h3>
                        <ul>
                          {aiInsights.positive_factors.map((factor, index) => (
                            <li key={index}>{factor}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Personalized Action Plan */}
                    {aiInsights.personalized_action_plan && aiInsights.personalized_action_plan.length > 0 && (
                      <div className="ai-action-plan">
                        <div className="section-heading">
                          <h2>
                            🎯 Personalized Action Plan
                          </h2>

                          <p>
                            Educational guidance based on your specific model results
                          </p>
                        </div>

                        <div className="action-plan-grid">
                          {aiInsights.personalized_action_plan.map((action, index) => (
                            <div className="action-plan-item" key={index}>
                              <span className="action-number">{index + 1}</span>
                              <p>{action}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Lifestyle Guidance */}
                    {aiInsights.lifestyle_guidance && aiInsights.lifestyle_guidance.length > 0 && (
                      <div className="ai-lifestyle-guidance">
                        <h3>💚 Lifestyle Guidance</h3>
                        <ul>
                          {aiInsights.lifestyle_guidance.map((guidance, index) => (
                            <li key={index}>{guidance}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Questions for Healthcare Provider */}
                    {aiInsights.questions_for_healthcare_provider && aiInsights.questions_for_healthcare_provider.length > 0 && (
                      <div className="ai-healthcare-questions">
                        <div className="section-heading">
                          <h2>
                            🩺 Questions for Healthcare Professional
                          </h2>

                          <p>
                            Consider discussing these topics with your healthcare provider
                          </p>
                        </div>

                        <div className="questions-list">
                          {aiInsights.questions_for_healthcare_provider.map((question, index) => (
                            <div className="question-item" key={index}>
                              <span className="question-bullet">•</span>
                              <p>{question}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Safety Message */}
                    <div className="ai-safety-message">
                      <strong>⚠️ Safety Message</strong>
                      <p>{aiInsights.safety_message}</p>
                    </div>

                    {/* Disclaimer */}
                    <div className="ai-disclaimer">
                      <strong>Disclaimer</strong>
                      <p>{aiInsights.disclaimer}</p>
                    </div>

                  </div>
                )}

                {/* =========================
                    WHAT-IF RISK SIMULATOR
                ========================= */}

                <div className="simulator-section">

                  <div className="section-heading">
                    <h2>
                      🧪 What-If Risk Simulator
                    </h2>

                    <p>
                      Explore how the model's prediction changes with different input values
                    </p>
                  </div>

                  <button
                    className="toggle-simulator-button"
                    onClick={() => setShowSimulator(!showSimulator)}
                  >
                    {showSimulator ? "Hide Simulator" : "Show Simulator"}
                  </button>

                  {showSimulator && (
                    <div className="simulator-content">

                      <div className="simulator-form-grid">

                        {Object.keys(simulatorForm).map((key) => (
                          <div className="form-group" key={key}>
                            <label htmlFor={`sim-${key}`}>
                              {key} {formData[key] !== "" && `(current: ${formData[key]})`}
                            </label>

                            <input
                              id={`sim-${key}`}
                              type="number"
                              name={key}
                              value={simulatorForm[key]}
                              onChange={handleSimulatorChange}
                              placeholder="Leave blank to keep current"
                              step={key === "BMI" || key === "DiabetesPedigreeFunction" ? "0.1" : "1"}
                            />
                          </div>
                        ))}

                      </div>

                      <div className="simulator-actions">
                        <button
                          className="simulate-button"
                          onClick={runSimulation}
                          disabled={simulatorLoading}
                        >
                          {simulatorLoading ? (
                            <span className="loading">Running Simulation...</span>
                          ) : (
                            "🔬 Run Simulation"
                          )}
                        </button>

                        <button
                          className="reset-simulator-button"
                          onClick={resetSimulator}
                        >
                          Reset
                        </button>
                      </div>

                      {simulatorData && (
                        <div className="simulation-result">

                          <div className="simulation-comparison">

                            <div className="comparison-item original">
                              <h4>Current Assessment</h4>
                              <strong>{result.risk_percentage}%</strong>
                              <span>{result.risk_level}</span>
                            </div>

                            <div className="comparison-arrow">→</div>

                            <div className="comparison-item simulated">
                              <h4>Simulated Assessment</h4>
                              <strong>{simulatorData.risk_percentage}%</strong>
                              <span>{simulatorData.risk_level}</span>
                            </div>

                          </div>

                          {simulatorData.risk_difference !== null && (
                            <div className="risk-difference">
                              <strong>
                                {simulatorData.risk_difference > 0 ? "+" : ""}
                                {simulatorData.risk_difference}%
                              </strong>
                              <span>
                                {simulatorData.risk_difference > 0
                                  ? "increase in estimated risk"
                                  : simulatorData.risk_difference < 0
                                  ? "decrease in estimated risk"
                                  : "no change in estimated risk"}
                              </span>
                            </div>
                          )}

                          <div className="simulation-disclaimer">
                            <strong>⚠️ Model Simulation</strong>
                            <p>
                              This shows how the Logistic Regression model's estimated
                              probability would change under these hypothetical input values.
                              This is not a medical prediction of future health outcomes.
                            </p>
                          </div>

                        </div>
                      )}

                    </div>
                  )}

                </div>

                {/* =========================
                    SCENARIO COMPARISON
                ========================= */}

                {scenarios.length > 0 && (
                  <div className="scenario-comparison-section">

                    <div className="section-heading">
                      <h2>
                        📊 Scenario Comparison
                      </h2>

                      <p>
                        Compare different what-if scenarios
                      </p>
                    </div>

                    <div className="scenario-list">

                      <div className="scenario-card current">
                        <h4>Current Assessment</h4>
                        <strong>{result.risk_percentage}%</strong>
                        <span>{result.risk_level}</span>
                      </div>

                      {scenarios.map((scenario, index) => (
                        <div className="scenario-card" key={index}>
                          <h4>{scenario.name}</h4>
                          <strong>{scenario.risk_percentage}%</strong>
                          <span>{scenario.risk_level}</span>
                          {scenario.risk_difference !== null && (
                            <small>
                              {scenario.risk_difference > 0 ? "+" : ""}
                              {scenario.risk_difference}% vs current
                            </small>
                          )}
                        </div>
                      ))}

                    </div>

                  </div>
                )}

                {/* =========================
                    MODEL TRANSPARENCY PANEL
                ========================= */}

                <div className="transparency-section">

                  <div className="section-heading">
                    <h2>
                      🔬 How This System Works
                    </h2>

                    <p>
                      Understanding the hybrid AI architecture
                    </p>
                  </div>

                  <button
                    className="toggle-transparency-button"
                    onClick={() => setShowTransparency(!showTransparency)}
                  >
                    {showTransparency ? "Hide Architecture" : "Show Architecture"}
                  </button>

                  {showTransparency && (
                    <div className="transparency-content">

                      <div className="architecture-pipeline">

                        <div className="pipeline-step">
                          <div className="step-icon">📋</div>
                          <h4>Patient Data</h4>
                          <p>Health input parameters</p>
                        </div>

                        <div className="pipeline-arrow">↓</div>

                        <div className="pipeline-step">
                          <div className="step-icon">✅</div>
                          <h4>Input Validation</h4>
                          <p>Data quality checks</p>
                        </div>

                        <div className="pipeline-arrow">↓</div>

                        <div className="pipeline-step">
                          <div className="step-icon">🧠</div>
                          <h4>Logistic Regression</h4>
                          <p>ML risk prediction</p>
                        </div>

                        <div className="pipeline-arrow">↓</div>

                        <div className="pipeline-step">
                          <div className="step-icon">📊</div>
                          <h4>Risk Probability</h4>
                          <p>Numerical risk score</p>
                        </div>

                        <div className="pipeline-arrow">↓</div>

                        <div className="pipeline-step">
                          <div className="step-icon">🎯</div>
                          <h4>Risk Classification</h4>
                          <p>Low/Moderate/High</p>
                        </div>

                        <div className="pipeline-arrow">↓</div>

                        <div className="pipeline-step">
                          <div className="step-icon">🔍</div>
                          <h4>SHAP Explainable AI</h4>
                          <p>Feature contribution analysis</p>
                        </div>

                        <div className="pipeline-arrow">↓</div>

                        <div className="pipeline-step">
                          <div className="step-icon">🤖</div>
                          <h4>GPT-5.6 Sol</h4>
                          <p>Natural language interpretation</p>
                        </div>

                        <div className="pipeline-arrow">↓</div>

                        <div className="pipeline-step">
                          <div className="step-icon">💡</div>
                          <h4>Personalized Guidance</h4>
                          <p>Educational health insights</p>
                        </div>

                      </div>

                      <div className="transparency-notes">

                        <div className="transparency-note">
                          <strong>🧠 Logistic Regression</strong>
                          <p>
                            Provides the numerical diabetes risk prediction based on
                            trained patterns in the dataset.
                          </p>
                        </div>

                        <div className="transparency-note">
                          <strong>🔍 SHAP Explainable AI</strong>
                          <p>
                            Mathematically explains which features contributed most to
                            the model's prediction for this specific input.
                          </p>
                        </div>

                        <div className="transparency-note">
                          <strong>🤖 GPT-5.6 Sol</strong>
                          <p>
                            Interprets the ML prediction and SHAP explanations into
                            understandable, personalized educational guidance.
                          </p>
                        </div>

                        <div className="transparency-disclaimer">
                          <strong>⚠️ Important</strong>
                          <p>
                            This system is for educational purposes only. It does not
                            provide medical diagnoses or replace professional healthcare
                            advice. Always consult a qualified healthcare professional
                            for medical decisions.
                          </p>
                        </div>

                      </div>

                    </div>
                  )}

                </div>

                {/* =========================
                    RECOMMENDATIONS
                ========================= */}

                <div className="recommendations">

                  <div className="section-heading">
                    <h2>
                      💚 Personalized Health Recommendations
                    </h2>

                    <p>
                      General wellness suggestions based on
                      maintaining a healthy lifestyle.
                    </p>
                  </div>

                  <div className="recommendation-grid">

                    <div className="recommendation-card">

                      <div className="recommendation-icon">
                        🥗
                      </div>

                      <div>
                        <h3>
                          Maintain a Balanced Diet
                        </h3>

                        <p>
                          Include vegetables, fruits, whole
                          grains, and balanced portions in
                          your daily meals.
                        </p>
                      </div>

                    </div>

                    <div className="recommendation-card">

                      <div className="recommendation-icon">
                        🏃
                      </div>

                      <div>
                        <h3>
                          Stay Physically Active
                        </h3>

                        <p>
                          Regular physical activity can support
                          overall health and healthy blood
                          glucose management.
                        </p>
                      </div>

                    </div>

                    <div className="recommendation-card">

                      <div className="recommendation-icon">
                        💧
                      </div>

                      <div>
                        <h3>
                          Stay Hydrated
                        </h3>

                        <p>
                          Drink adequate water throughout the
                          day and maintain healthy hydration
                          habits.
                        </p>
                      </div>

                    </div>

                    <div className="recommendation-card">

                      <div className="recommendation-icon">
                        🩺
                      </div>

                      <div>
                        <h3>
                          Monitor Your Health
                        </h3>

                        <p>
                          Continue routine health monitoring
                          and consult a qualified healthcare
                          professional when appropriate.
                        </p>
                      </div>

                    </div>

                  </div>

                  <div className="recommendation-note">

                    <strong>
                      Note:
                    </strong>{" "}
                    These recommendations are general wellness
                    suggestions and do not replace professional
                    medical advice.

                  </div>

                </div>

              </>
            )}

          </section>
        )}

        {/* =========================
            PREDICTION HISTORY
        ========================= */}

        {predictionHistory.length > 0 && (

          <section className="card prediction-history">

            <div className="section-heading">

              <h2>
                📊 Prediction History
              </h2>

              <p className="history-intro">
                Previous diabetes risk assessments from this
                session.
              </p>

            </div>

            <div className="history-list">

              {predictionHistory.map(
                (item, index) => (

                  <div
                    className="history-card"
                    key={`${item.date}-${index}`}
                  >

                    <div className="history-number">
                      #{predictionHistory.length - index}
                    </div>

                    <div className="history-info">

                      <h3>
                        {item.result}
                      </h3>

                      <p>
                        {item.date}
                      </p>

                    </div>

                    <div className="history-risk">

                      <strong>
                        {item.risk_percentage}%
                      </strong>

                      <span
                        className={
                          String(item.risk_level)
                            .toLowerCase()
                            .includes("high")
                            ? "history-high"
                            : "history-low"
                        }
                      >
                        {item.risk_level}
                      </span>

                    </div>

                  </div>
                )
              )}

            </div>

          </section>
        )}

        {/* =========================
            FOOTER
        ========================= */}

        <footer className="footer">

          <p>
            🩺 Diabetes Risk Assessment System
          </p>

          <span>
            Powered by Machine Learning & Explainable AI
          </span>

        </footer>

      </main>

    </div>
  );
}

export default App;