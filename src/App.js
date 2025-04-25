import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// 导入组件
import AppNavbar from './components/Navbar';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import PredictionPage from './pages/PredictionPage';

// 导入CSS
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <AppNavbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/prediction" element={<PredictionPage />} />
            <Route path="/satellite" element={<div className="container py-5"><h2>卫星图像分析功能即将上线</h2></div>} />
            <Route path="/about" element={<div className="container py-5"><h2>关于我们</h2><p>加州火灾预测系统是一个研究项目，旨在帮助预测和监控野火风险。</p></div>} />
          </Routes>
        </main>
        <footer className="bg-dark text-white text-center py-3 mt-5">
          <div className="container">
            <p className="mb-0">© 2025 加州火灾预测系统 | 所有权利保留</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App; 