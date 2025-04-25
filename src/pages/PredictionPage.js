import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { predictFireRisk, getWeatherData } from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

const PredictionPage = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [customWeather, setCustomWeather] = useState({
    max_temp_c: 25,
    min_temp_c: 15, 
    avg_temp_c: 20,
    heating_deg_days_c: 0,
    cooling_deg_days_c: 5,
    precip_mm: 2,
    avg_humidity: 40,
    avg_wind_speed_knots: 8,
    avg_dew_point_f: 60,
    avg_visibility_km: 10,
    avg_sea_level_pressure_mb: 1013
  });
  const [useCurrentWeather, setUseCurrentWeather] = useState(true);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 获取当前天气
  const fetchWeather = async () => {
    if (!location.trim()) {
      setError('请输入有效的位置');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await getWeatherData(location);
      setWeatherData(data);
      setUseCurrentWeather(true);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError('获取天气数据失败，请稍后再试');
      setLoading(false);
    }
  };

  // 预测火灾风险
  const predictRisk = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 使用哪个天气数据进行预测
      const dataToSend = useCurrentWeather && weatherData ? 
        { ...weatherData, location } : 
        { ...customWeather, location };
      
      const result = await predictFireRisk(dataToSend);
      setPrediction(result);
      setLoading(false);
    } catch (err) {
      console.error('Error predicting fire risk:', err);
      setError('预测失败，请稍后再试');
      setLoading(false);
    }
  };

  // 处理自定义天气表单变化
  const handleCustomWeatherChange = (e) => {
    const { name, value } = e.target;
    setCustomWeather(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  // 根据火灾概率获取风险等级
  const getRiskLevel = (probability) => {
    if (probability >= 0.75) return { text: '极高', color: 'danger' };
    if (probability >= 0.5) return { text: '高', color: 'warning' };
    if (probability >= 0.25) return { text: '中等', color: 'primary' };
    return { text: '低', color: 'success' };
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">火灾风险预测</h1>
      
      <Row>
        <Col lg={6} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header>输入预测数据</Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>位置</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="输入城市或地区名称 (如 'San Francisco, CA')" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </Form.Group>
              
              <div className="mb-3">
                <Button 
                  variant="primary" 
                  onClick={fetchWeather}
                  disabled={loading || !location.trim()}
                  className="me-2"
                >
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      <span className="ms-2">加载中...</span>
                    </>
                  ) : '获取当前天气'}
                </Button>
                
                <Form.Check
                  inline
                  type="checkbox"
                  id="use-custom-weather"
                  label="使用自定义天气数据"
                  checked={!useCurrentWeather}
                  onChange={() => setUseCurrentWeather(!useCurrentWeather)}
                />
              </div>
              
              {!useCurrentWeather && (
                <div className="custom-weather-form">
                  <h5 className="mb-3">自定义天气参数</h5>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>最高温度 (°C)</Form.Label>
                        <Form.Control 
                          type="number" 
                          name="max_temp_c"
                          value={customWeather.max_temp_c}
                          onChange={handleCustomWeatherChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>最低温度 (°C)</Form.Label>
                        <Form.Control 
                          type="number" 
                          name="min_temp_c"
                          value={customWeather.min_temp_c}
                          onChange={handleCustomWeatherChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>平均温度 (°C)</Form.Label>
                        <Form.Control 
                          type="number" 
                          name="avg_temp_c"
                          value={customWeather.avg_temp_c}
                          onChange={handleCustomWeatherChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>降水量 (mm)</Form.Label>
                        <Form.Control 
                          type="number" 
                          name="precip_mm"
                          value={customWeather.precip_mm}
                          onChange={handleCustomWeatherChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>平均湿度 (%)</Form.Label>
                        <Form.Control 
                          type="number" 
                          name="avg_humidity"
                          value={customWeather.avg_humidity}
                          onChange={handleCustomWeatherChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>平均风速 (节)</Form.Label>
                        <Form.Control 
                          type="number" 
                          name="avg_wind_speed_knots"
                          value={customWeather.avg_wind_speed_knots}
                          onChange={handleCustomWeatherChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              )}
              
              {weatherData && useCurrentWeather && (
                <div className="current-weather mt-3">
                  <h5>当前天气数据</h5>
                  <Alert variant="info">
                    <p><strong>位置:</strong> {weatherData.location || location}</p>
                    <p><strong>温度:</strong> {weatherData.avg_temp_c}°C (最低: {weatherData.min_temp_c}°C, 最高: {weatherData.max_temp_c}°C)</p>
                    <p><strong>湿度:</strong> {weatherData.avg_humidity}%</p>
                    <p><strong>降水量:</strong> {weatherData.precip_mm}mm</p>
                    <p><strong>风速:</strong> {weatherData.avg_wind_speed_knots} 节</p>
                  </Alert>
                </div>
              )}
              
              <Button 
                variant="success" 
                className="mt-3" 
                onClick={predictRisk}
                disabled={loading || (!useCurrentWeather && !customWeather) || (useCurrentWeather && !weatherData)}
              >
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span className="ms-2">预测中...</span>
                  </>
                ) : '预测火灾风险'}
              </Button>
              
              {error && (
                <Alert variant="danger" className="mt-3">
                  {error}
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={6}>
          {prediction ? (
            <Card className="shadow-sm">
              <Card.Header>预测结果</Card.Header>
              <Card.Body>
                <div className="text-center mb-4">
                  <h2>火灾风险预测</h2>
                  <div className="display-1 my-3">
                    {Math.round(prediction.fire_probability * 100)}%
                  </div>
                  
                  <Alert variant={getRiskLevel(prediction.fire_probability).color}>
                    <h4 className="mb-0">风险等级: {getRiskLevel(prediction.fire_probability).text}</h4>
                  </Alert>
                  
                  <p className="mt-3">
                    <strong>位置:</strong> {prediction.location}
                  </p>
                  <p className="text-muted">
                    预测方法: {prediction.prediction_method === 'model' ? '机器学习模型' : '规则预测'}
                  </p>
                </div>
                
                <div className="risk-factors mt-4">
                  <h5>主要风险因素:</h5>
                  <ul>
                    {customWeather.avg_temp_c > 25 && (
                      <li>高温 ({customWeather.avg_temp_c}°C)</li>
                    )}
                    {customWeather.precip_mm < 5 && (
                      <li>低降水量 ({customWeather.precip_mm}mm)</li>
                    )}
                    {customWeather.avg_humidity < 30 && (
                      <li>低湿度 ({customWeather.avg_humidity}%)</li>
                    )}
                    {customWeather.avg_wind_speed_knots > 10 && (
                      <li>高风速 ({customWeather.avg_wind_speed_knots} 节)</li>
                    )}
                    {(customWeather.max_temp_c - customWeather.min_temp_c) > 15 && (
                      <li>大温差 ({customWeather.max_temp_c - customWeather.min_temp_c}°C)</li>
                    )}
                  </ul>
                </div>
                
                <div className="recommendations mt-4">
                  <h5>预防建议:</h5>
                  {prediction.fire_probability >= 0.5 ? (
                    <ul>
                      <li>避免在户外使用明火</li>
                      <li>保持对火灾警报的高度警惕</li>
                      <li>准备应急撤离计划</li>
                      <li>在住所周围清除易燃材料</li>
                      <li>留意当地消防部门的通知</li>
                    </ul>
                  ) : (
                    <ul>
                      <li>保持警惕，定期检查火灾风险</li>
                      <li>户外活动时注意用火安全</li>
                      <li>了解当地消防安全规定</li>
                    </ul>
                  )}
                </div>
              </Card.Body>
            </Card>
          ) : (
            <Card className="shadow-sm h-100 d-flex align-items-center justify-content-center">
              <Card.Body className="text-center">
                <img 
                  src="/prediction-placeholder.jpg" 
                  alt="Fire Prediction" 
                  className="img-fluid mb-3" 
                  style={{ maxHeight: '200px', opacity: '0.7' }}
                />
                <h3>输入数据并预测火灾风险</h3>
                <p className="text-muted">
                  您的预测结果将在这里显示
                </p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PredictionPage; 