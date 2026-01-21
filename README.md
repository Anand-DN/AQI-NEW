# 🌏 India AQI Analysis Dashboard  
### Real-Time Air Quality Monitoring, Statistical Analytics & Forecasting (2010-2025)

A Full-Stack Data Science Web Application for environmental analytics.

<p align="center">
<img src="https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white"/>
<img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=white"/>
<img src="https://img.shields.io/badge/Python-Data%20Science-3776AB?style=for-the-badge&logo=python&logoColor=white"/>
<img src="https://img.shields.io/badge/ARIMA-Forecasting-5C2D91?style=for-the-badge"/>
</p>

---

## 🌟 Overview

The **India AQI Analysis Dashboard** is a full-stack analytical platform designed to visualize, explore and forecast Air Quality Index (AQI) across major Indian cities between **2010–2025** with optional real-time API data ingestion.

The system integrates:

✔ Statistical analysis  
✔ Environmental data visualization  
✔ Time-series forecasting  
✔ Health impact interpretation  

Built using a **FastAPI backend** and a **React.js frontend**, it offers a highly interactive and data-driven experience for researchers, students, analysts and policy stakeholders.

---

## 🔗 Live Application

⭐⭐⭐ **Try it here:**  
👉 https://real-time-air-quality-index-aqi-analysis-obgu.onrender.com ⭐⭐⭐

---

## 🚀 Key Features

### 📥 **Data Ingestion**
- Upload CSV (CPCB, OGD, Dataful)
- Real-time government data via Data.gov.in API (optional)
- Automated preprocessing & cleaning

### 📊 **Descriptive Statistics**
- Mean, median, quartiles
- Standard deviation & IQR
- Variability & seasonal trend insights

### 📈 **Visual Analytics**
Includes:
- Box & Violin Plots
- Correlation Heatmaps
- Histograms & Density Curves
- Scatter Plots
- Time-Series Views
- Geographic/Hexbin Visualizations

### 🤖 **Forecasting Engine**
- ARIMA-based AQI forecasts
- Predict N months / full-year horizons
- Confidence intervals included

### 🩺 **Health Insights Panel**
- AQI category classifier
- Health risk assessment
- Safety recommendations aligned with CPCB standards

---

## 🧰 Tech Stack

**Backend:**  
- FastAPI, Pandas, NumPy, Statsmodels, Seaborn, Matplotlib  

**Frontend:**  
- React.js, Axios, Recharts, React-Select

**Infrastructure:**  
- Render / Railway / Google Cloud Runner  
- Optional: Docker support

---

## 🛠️ Installation & Setup

### 📦 1. Clone Repository
```bash
git clone https://github.com/Anand-DN/AQI-New.git
cd YOUR_REPO_NAME


🐍 Backend Setup (FastAPI)
2. Create Environment
conda create -n aqi_project python=3.10
conda activate aqi_project

3. Install Dependencies
cd backend
pip install -r requirements.txt

4. Configure Environment Variables

Create /backend/.env:

DATA_GOV_API_KEY=your_api_key_here
DEBUG=True

5. Add Dataset

Option A → Place CSV in:

/backend/data/aqi_data.csv


Option B → Run:

python data_collector.py

6. Run Backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000

💻 Frontend Setup (React)
7. Install Dependencies
cd ../frontend
npm install

8. Run Frontend
npm start


Frontend → http://localhost:3000

Backend → http://localhost:8000
