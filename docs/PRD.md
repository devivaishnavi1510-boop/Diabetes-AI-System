# Product Requirements Document (PRD)

# Diabetes Prediction and Personalized Health Risk Assessment System Using Logistic Regression and Explainable AI

---

## 1. Project Overview

### Project Description

The Diabetes Prediction and Personalized Health Risk Assessment System is an AI-powered healthcare web application that predicts diabetes risk using the Logistic Regression algorithm. The application explains each prediction using Explainable AI (SHAP) and provides personalized health recommendations, lifestyle insights, BMI calculation, prediction history, and downloadable health reports to help users make informed healthcare decisions.

### Primary Goal

To develop a secure, intelligent, and user-friendly web application that predicts diabetes risk accurately while providing transparent explanations and personalized preventive healthcare recommendations.

### Project Type

AI-Powered Healthcare Web Application

### Target Platform

- Web Application
- Desktop Browsers
- Mobile Browsers (Responsive Design)

---

## 2. Problem Statement

Diabetes is one of the fastest-growing chronic diseases worldwide. Many existing prediction systems only provide a simple diabetic or non-diabetic result without explaining the reasons behind the prediction or offering guidance for improving health.

Patients often struggle to understand their risk factors, making it difficult to take preventive measures at an early stage. There is a need for an intelligent healthcare system that not only predicts diabetes risk accurately but also explains the prediction using Explainable AI and provides personalized health recommendations based on individual medical and lifestyle data.

This project aims to bridge that gap by developing a transparent, user-friendly, and AI-powered diabetes prediction platform that supports early detection, increases user awareness, and encourages healthier lifestyle decisions.

---

## 3. Objectives

The primary objective of this project is to develop an intelligent, secure, and user-friendly diabetes prediction system that assists users in understanding and managing their health risks.

### Specific Objectives

- Predict diabetes risk using the Logistic Regression machine learning algorithm.
- Explain each prediction using Explainable AI (SHAP) for better transparency.
- Calculate Body Mass Index (BMI) automatically.
- Provide personalized lifestyle and dietary recommendations based on the user's health profile.
- Store prediction history for future reference.
- Generate downloadable PDF health reports.
- Develop a responsive web application accessible from desktop and mobile devices.
- Ensure data privacy and secure user authentication.
- Design the system to support future integration with wearable devices and advanced AI models.

---

## 4. User Roles

The system supports three types of users, each with different responsibilities and access permissions.

### 4.1 Patient

The patient is the primary user of the system.

#### Responsibilities

- Register and log in securely.
- Enter personal and medical details.
- Predict diabetes risk.
- View Explainable AI (SHAP) explanations.
- Receive personalized diet and lifestyle recommendations.
- Download health reports in PDF format.
- View previous prediction history.
- Update personal profile.

---

### 4.2 Doctor

Doctors can monitor and review patient information.

#### Responsibilities

- View patient prediction reports.
- Analyze patient health history.
- Monitor prediction trends.
- Download patient summaries.
- Provide medical recommendations.

---

### 4.3 Administrator

The administrator manages the overall system.

#### Responsibilities

- Manage users.
- Manage doctor accounts.
- Monitor system activity.
- View analytics and reports.
- Manage health recommendation content.
- Ensure system security and maintenance.

---

## 5. Functional Requirements

The system shall provide the following functionalities:

### 5.1 User Authentication

- User Registration
- User Login
- Secure Password Storage
- User Logout

### 5.2 Diabetes Prediction

- Enter health parameters
- Predict diabetes risk using Logistic Regression
- Display prediction result
- Display prediction confidence score

### 5.3 Explainable AI

- Explain prediction using SHAP
- Show feature importance
- Help users understand prediction factors

### 5.4 Health Assessment

- Calculate BMI
- Classify BMI category
- Generate personalized health score

### 5.5 Personalized Recommendations

- Diet recommendations
- Exercise recommendations
- Lifestyle improvement suggestions
- Preventive healthcare tips

### 5.6 Reports

- Download PDF health report
- View previous prediction history

### 5.7 Dashboard

- View health summary
- View prediction history
- View BMI history
- View recommendation history

