# California Fire Prediction System - Project Brief

## Overview
The California Fire Prediction System is a comprehensive web application that predicts and analyzes wildfire risks in California. It combines weather data, machine learning-based fire prediction, and AI-powered analysis to provide users with detailed insights on fire risks.

## Key Features
- **Fire Prediction Model**: Predicts fire probability based on weather parameters
- **Interactive Map**: Visualizes current, historical, and risk areas for fires across California
- **Satellite Image Analysis**: Analyzes satellite imagery for fire detection
- **AI-powered Analysis**: Provides comprehensive risk assessments and recommendations
- **Weather Data Integration**: Retrieves current and historical weather data

## Technical Stack
- **Backend**: FastAPI
- **Frontend**: HTML, CSS, JavaScript, Bootstrap 5
- **Mapping**: Leaflet.js
- **ML Models**: Scikit-learn and XGBoost
- **External APIs**: OpenAI, OpenWeatherMap

## Project Structure
- `/static`: Static assets (CSS, JavaScript)
- `/templates`: HTML templates
- `/Prediction Model`: Fire prediction machine learning model
- `/Satellite_pic_predict`: Satellite image analysis
- `app.py`: Main FastAPI application
- `weather_service.py`: Module for fetching weather data
- `satellite_service.py`: Module for satellite image processing

## Dependencies
- Python 3.8+
- OpenAI API key
- OpenWeatherMap API key

## Deployment
The application can be deployed on Vercel or run locally through the provided batch file or manual startup. 