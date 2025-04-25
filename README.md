# 加州火灾预测系统 (React前端)

这是加州火灾预测系统的React前端实现。该系统使用机器学习和地理空间分析技术，帮助预测、监控和分析加州野火风险。

## 功能特点

- **交互式火灾地图**: 展示加州历史火灾数据和生态区域
- **火灾风险预测**: 基于天气数据预测特定区域的火灾风险
- **卫星图像分析**: 上传卫星图像，AI分析火灾迹象和风险区域
- **响应式设计**: 兼容各种设备屏幕尺寸

## 技术栈

- React
- React Router
- Axios
- React-Bootstrap
- Leaflet (地图库)

## 安装与运行

1. 安装依赖:
```
npm install
```

2. 启动开发服务器:
```
npm start
```

3. 构建生产版本:
```
npm run build
```

## 环境变量

在项目根目录下创建 `.env.local` 文件，并设置以下环境变量:
```
REACT_APP_API_URL=http://localhost:8000  # 后端API地址
```

## 项目结构

```
src/
├── assets/         # 静态资源
├── components/     # 可复用组件
├── pages/          # 页面组件
├── services/       # API服务
├── App.js          # 主应用组件
└── index.js        # 入口文件
```

## 后端API

该前端应用需要一个后端API提供数据。请确保配置了正确的`REACT_APP_API_URL`环境变量指向后端服务。

## 许可

© 2025 加州火灾预测系统 | 所有权利保留 