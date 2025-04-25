import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import { getFireGeoJson, getEcoregionGeoJson } from '../services/api';
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// 解决Leaflet图标问题
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapPage = () => {
  const [fireData, setFireData] = useState(null);
  const [ecoregionData, setEcoregionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapLayers, setMapLayers] = useState({
    fires: true,
    ecoregions: false
  });

  // 加载GeoJSON数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fireResult = await getFireGeoJson();
        const ecoregionResult = await getEcoregionGeoJson();
        
        setFireData(fireResult);
        setEcoregionData(ecoregionResult);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching map data:', err);
        setError('加载地图数据失败，请稍后再试。');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 火灾GeoJSON样式
  const fireStyle = (feature) => {
    return {
      fillColor: 'red',
      weight: 1,
      opacity: 1,
      color: 'red',
      fillOpacity: 0.5
    };
  };

  // 生态区域GeoJSON样式
  const ecoregionStyle = (feature) => {
    return {
      fillColor: 'green',
      weight: 1,
      opacity: 1,
      color: 'green',
      fillOpacity: 0.3
    };
  };

  // 切换图层显示
  const toggleLayer = (layer) => {
    setMapLayers(prev => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  };

  // 当点击火灾区域时的弹出信息
  const onEachFireFeature = (feature, layer) => {
    if (feature.properties && feature.properties.name) {
      layer.bindPopup(`
        <strong>${feature.properties.name}</strong><br/>
        日期: ${feature.properties.date || '未知'}<br/>
        面积: ${feature.properties.acres || '未知'} 英亩<br/>
        状态: ${feature.properties.status || '未知'}
      `);
    }
  };

  // 当点击生态区域时的弹出信息
  const onEachEcoregionFeature = (feature, layer) => {
    if (feature.properties && feature.properties.name) {
      layer.bindPopup(`
        <strong>${feature.properties.name}</strong><br/>
        类型: ${feature.properties.type || '未知'}<br/>
        描述: ${feature.properties.description || '未知'}
      `);
    }
  };

  return (
    <Container fluid className="py-4">
      <Row>
        <Col md={9}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="mb-3">加州火灾地图</h2>
              {loading ? (
                <div className="text-center p-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">加载地图数据中...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger">{error}</div>
              ) : (
                <div style={{ height: '600px', width: '100%' }}>
                  <MapContainer 
                    center={[37.8, -122.0]} 
                    zoom={6} 
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    
                    {/* 火灾图层 */}
                    {mapLayers.fires && fireData && (
                      <GeoJSON 
                        data={fireData} 
                        style={fireStyle}
                        onEachFeature={onEachFireFeature}
                      />
                    )}
                    
                    {/* 生态区域图层 */}
                    {mapLayers.ecoregions && ecoregionData && (
                      <GeoJSON 
                        data={ecoregionData} 
                        style={ecoregionStyle}
                        onEachFeature={onEachEcoregionFeature}
                      />
                    )}
                  </MapContainer>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="shadow-sm mb-4">
            <Card.Header>图层控制</Card.Header>
            <Card.Body>
              <Form>
                <Form.Check 
                  type="switch"
                  id="fire-layer-switch"
                  label="火灾数据"
                  checked={mapLayers.fires}
                  onChange={() => toggleLayer('fires')}
                  className="mb-2"
                />
                <Form.Check 
                  type="switch"
                  id="ecoregion-layer-switch"
                  label="生态区域"
                  checked={mapLayers.ecoregions}
                  onChange={() => toggleLayer('ecoregions')}
                />
              </Form>
            </Card.Body>
          </Card>
          
          <Card className="shadow-sm">
            <Card.Header>地图图例</Card.Header>
            <Card.Body>
              <div className="mb-2">
                <span 
                  className="d-inline-block me-2" 
                  style={{ width: '20px', height: '20px', backgroundColor: 'rgba(255, 0, 0, 0.5)', border: '1px solid red' }}
                ></span>
                <span>火灾区域</span>
              </div>
              <div>
                <span 
                  className="d-inline-block me-2" 
                  style={{ width: '20px', height: '20px', backgroundColor: 'rgba(0, 128, 0, 0.3)', border: '1px solid green' }}
                ></span>
                <span>生态区域</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MapPage; 