# Technical Context

## Backend Architecture
- **FastAPI Framework**: High-performance, modern web framework for building APIs
- **Python 3.8+**: Core programming language
- **Async Processing**: Used for handling concurrent requests and external API calls

## Data Sources
- **OpenWeatherMap API**: For current and historical weather data
- **Satellite Images**: Analyzed for fire detection and monitoring
- **Historical Fire Data**: Used for model training and validation

## Machine Learning Components
- **Fire Prediction Model**: 
  - Using XGBoost and scikit-learn
  - Features: temperature, humidity, wind speed, precipitation, vegetation dryness
  - Output: Fire probability score (0-100%)
  
- **Satellite Image Analysis**:
  - Computer vision techniques for fire detection
  - Image segmentation for identifying at-risk areas
  - Processing via specialized algorithms in the `Satellite_pic_predict` module

## AI Integration
- **OpenAI API**: Used for generating risk assessments and recommendations
- **Prompt Engineering**: Specialized prompts for contextual analysis
- **Response Processing**: Extracting and formatting insights for user presentation

## Frontend Components
- **Bootstrap 5**: UI framework for responsive design
- **Leaflet.js**: Interactive mapping capabilities
- **JavaScript**: Client-side functionality
- **HTML/CSS**: Core structure and styling

## API Endpoints
- **Main Endpoints**:
  - `/`: Main application interface
  - `/api/predict`: Fire probability prediction
  - `/api/analyze`: AI analysis generation
  - `/api/weather`: Weather data retrieval

## Development Environment
- **Local Development**: Run through batch file or manual startup
- **Deployment**: Vercel compatible with adapter

## Testing Strategy
- Manual testing for UI components
- Automated testing for prediction models
- Validation against historical data

## Security Considerations
- API keys stored in environment variables
- Input validation for user-submitted data
- Rate limiting for external API calls 