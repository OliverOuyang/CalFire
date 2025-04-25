import axios from 'axios';

// 后端API基本URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// 创建axios实例
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 预测火灾风险
export const predictFireRisk = async (weatherData) => {
  try {
    const response = await api.post('/api/predict', weatherData);
    return response.data;
  } catch (error) {
    console.error('Error predicting fire risk:', error);
    throw error;
  }
};

// 获取天气数据
export const getWeatherData = async (location) => {
  try {
    const response = await api.get(`/api/weather?location=${location}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

// 获取火灾GeoJSON数据
export const getFireGeoJson = async () => {
  try {
    const response = await api.get('/api/geojson/fire');
    return response.data;
  } catch (error) {
    console.error('Error fetching fire GeoJSON:', error);
    throw error;
  }
};

// 获取生态区域GeoJSON数据
export const getEcoregionGeoJson = async () => {
  try {
    const response = await api.get('/api/geojson/ecoregion');
    return response.data;
  } catch (error) {
    console.error('Error fetching ecoregion GeoJSON:', error);
    throw error;
  }
};

// 上传卫星图像
export const uploadSatelliteImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/api/satellite/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading satellite image:', error);
    throw error;
  }
};

// 分析卫星图像
export const analyzeSatelliteImage = async (fileId) => {
  try {
    const formData = new FormData();
    formData.append('file_id', fileId);
    
    const response = await api.post('/api/satellite/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error analyzing satellite image:', error);
    throw error;
  }
};

export default api; 