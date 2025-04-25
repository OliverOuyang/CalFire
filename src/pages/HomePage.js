import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = () => {
  return (
    <div className="home-page">
      {/* 主横幅 */}
      <div className="hero-banner bg-dark text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1>加州火灾预测系统</h1>
              <p className="lead">
                利用先进的机器学习技术和地理空间分析，帮助预测、监控和分析加州野火风险。
              </p>
              <Link to="/map">
                <Button variant="danger" size="lg" className="me-2">查看火灾地图</Button>
              </Link>
              <Link to="/prediction">
                <Button variant="outline-light" size="lg">火灾风险预测</Button>
              </Link>
            </Col>
            <Col md={6} className="text-center">
              <img 
                src="/wildfire-banner.jpg" 
                alt="加州野火" 
                className="img-fluid rounded"
                style={{ maxHeight: '300px' }}
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* 功能卡片部分 */}
      <Container className="py-5">
        <h2 className="text-center mb-4">我们的主要功能</h2>
        <Row>
          <Col md={4} className="mb-4">
            <Card className="h-100">
              <Card.Img variant="top" src="/map-feature.jpg" alt="火灾地图" />
              <Card.Body>
                <Card.Title>交互式火灾地图</Card.Title>
                <Card.Text>
                  浏览加州历史和当前的火灾数据，了解火灾热点区域和生态区域分布。
                </Card.Text>
                <Link to="/map">
                  <Button variant="primary">查看地图</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4} className="mb-4">
            <Card className="h-100">
              <Card.Img variant="top" src="/prediction-feature.jpg" alt="火灾预测" />
              <Card.Body>
                <Card.Title>火灾风险预测</Card.Title>
                <Card.Text>
                  基于天气数据和地理信息，使用机器学习模型预测特定区域的火灾风险。
                </Card.Text>
                <Link to="/prediction">
                  <Button variant="primary">开始预测</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4} className="mb-4">
            <Card className="h-100">
              <Card.Img variant="top" src="/satellite-feature.jpg" alt="卫星分析" />
              <Card.Body>
                <Card.Title>卫星图像分析</Card.Title>
                <Card.Text>
                  上传卫星图像，使用人工智能技术分析潜在的火灾迹象和风险区域。
                </Card.Text>
                <Link to="/satellite">
                  <Button variant="primary">图像分析</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* 项目简介部分 */}
      <div className="bg-light py-5">
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center">
              <h2 className="mb-4">关于本项目</h2>
              <p className="lead">
                加州火灾预测系统是一个结合机器学习、地理空间分析和卫星图像处理的综合平台，
                旨在帮助预测和监控加州的野火风险。该系统利用历史火灾数据、天气信息和地理特征，
                为用户提供实时的火灾风险评估和分析。
              </p>
              <Link to="/about">
                <Button variant="outline-dark">了解更多</Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default HomePage; 