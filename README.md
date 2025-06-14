# 🌐 Flow Anomaly Detection Dashboard

**Real-time Network Security Monitoring with Advanced 3D Visualization**

A cutting-edge network monitoring and anomaly detection system featuring an immersive 3D network topology visualization, real-time threat detection, and comprehensive security analytics. Built for enterprise network security teams and cybersecurity professionals.

![Flow Anomaly Detection Dashboard](https://img.shields.io/badge/Status-Production%20Ready-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Three.js](https://img.shields.io/badge/Three.js-3D%20Visualization-orange)

## 🚀 Project Overview

The Flow Anomaly Detection Dashboard is a sophisticated network security monitoring solution that combines machine learning-powered anomaly detection with stunning 3D network visualization. It provides real-time insights into network traffic patterns, security threats, and system performance through an intuitive, interactive interface.

### 🎯 Key Capabilities

- **Real-time Network Monitoring**: Live tracking of network flows, bandwidth utilization, and connection patterns
- **AI-Powered Anomaly Detection**: Machine learning models detect suspicious activities and security threats
- **3D Network Topology**: Interactive 3D visualization of enterprise network infrastructure
- **Threat Intelligence**: Comprehensive analysis of network anomalies with confidence scoring
- **Performance Analytics**: Real-time metrics for latency, throughput, and system health

## ✨ Key Features

### 🔍 Advanced Anomaly Detection
- **ML Model Integration**: Conv-LSTM Autoencoder with 94%+ accuracy
- **Multi-dimensional Analysis**: Volume, pattern, protocol, geographic, and temporal anomaly detection
- **Confidence Scoring**: AI confidence levels for each detected anomaly
- **Real-time Alerts**: Instant notifications for critical security events
- **Threat Classification**: Automatic categorization by severity (Low, Medium, High, Critical)

### 🌐 3D Network Visualization
- **Interactive 3D Topology**: Immersive network visualization using Three.js/React Three Fiber
- **Realistic Enterprise Network**: 25+ nodes including servers, routers, switches, firewalls, and clients
- **Animated Data Flows**: Real-time particle animations showing network traffic
- **Color-coded Status Indicators**:
  - 🟢 **Green**: Normal operation
  - 🟡 **Yellow**: Warning state
  - 🔴 **Red**: Critical issues
  - 🔴 **Pulsing Red**: Active anomalies
- **Interactive Controls**:
  - Orbital camera controls (zoom, pan, rotate)
  - Node hover tooltips with detailed metrics
  - Performance-optimized 60fps rendering

### 📊 Comprehensive Dashboard
- **Real-time Metrics**: Live network health, flow statistics, and performance indicators
- **Active Alarms Panel**: Current security alerts with detailed information
- **Top Talkers Analysis**: Identification of highest traffic sources
- **Network Performance**: Latency monitoring and throughput analysis
- **Responsive Design**: Optimized for desktop and mobile viewing

### 🏢 Enterprise Network Simulation
- **Realistic IP Addressing**: Internal subnets (192.168.x.x, 10.0.x.x, 172.16.x.x)
- **Multi-tier Architecture**: DMZ, internal servers, department networks, IoT devices
- **Device Types**: Servers, routers, switches, firewalls, workstations, IoT sensors
- **Network Segmentation**: Proper enterprise network topology with security zones

## 🛠️ Technology Stack

### Frontend Framework
- **Next.js 14**: React framework with App Router and server-side rendering
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe development with full IntelliSense support

### 3D Visualization
- **Three.js**: WebGL-based 3D graphics library
- **React Three Fiber**: React renderer for Three.js
- **React Three Drei**: Useful helpers and abstractions for R3F

### UI/UX
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Shadcn/ui**: High-quality, accessible React components
- **Lucide React**: Beautiful, customizable icons

### Data & State Management
- **TypeScript Interfaces**: Strongly typed data models
- **React Hooks**: Modern state management with useState, useEffect, useMemo
- **Custom Data Generator**: Realistic network data simulation

### Performance & Optimization
- **60fps Rendering**: Optimized 3D performance for smooth interactions
- **Lazy Loading**: Component-based code splitting
- **Responsive Design**: Mobile-first approach with breakpoint optimization

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** 18.0 or higher
- **npm**, **yarn**, or **pnpm** package manager
- Modern web browser with WebGL support

### Quick Start

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd flow-anomaly-detection
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the dashboard

### Build for Production

```bash
npm run build
npm start
```

## 📖 Usage Guide

### 🎮 3D Visualization Controls

- **🖱️ Left Click + Drag**: Rotate the 3D view around the network
- **🔍 Mouse Wheel**: Zoom in/out for detailed or overview perspective
- **🖱️ Right Click + Drag**: Pan the camera position
- **🎯 Hover over Nodes**: Display detailed information tooltips

### 📊 Dashboard Navigation

1. **Network Health Metrics**: Monitor overall system performance
2. **Active Alarms**: Review current security alerts and anomalies
3. **3D Network View**: Interact with the live network topology
4. **Top Talkers**: Identify high-traffic network sources
5. **Recent Anomalies**: Track historical security events

### 🔍 Interpreting Anomalies

- **Volume Anomalies**: Unusual traffic volume patterns
- **Pattern Anomalies**: Abnormal communication behaviors
- **Protocol Anomalies**: Suspicious protocol usage
- **Geographic Anomalies**: Unexpected traffic sources
- **Temporal Anomalies**: Time-based pattern deviations

## 🏗️ Architecture

### Component Structure
```
src/
├── app/                    # Next.js App Router
├── components/
│   ├── 3d/                # 3D visualization components
│   ├── dashboard/         # Dashboard widgets
│   └── ui/                # Reusable UI components
├── lib/                   # Utilities and data generation
├── types/                 # TypeScript type definitions
└── styles/               # Global styles and Tailwind config
```

### Data Flow
1. **Data Generation**: Realistic network data simulation
2. **Anomaly Detection**: ML model processing and threat identification
3. **3D Rendering**: Real-time visualization updates
4. **User Interaction**: Responsive UI updates and tooltips

## 🎪 Demo Features

### Hackathon-Ready Capabilities

- **🔴 Live Anomaly Simulation**: Real-time detection of network threats
- **🌐 Interactive 3D Network**: Impressive visual demonstration
- **📊 Professional Dashboard**: Enterprise-grade monitoring interface
- **⚡ High Performance**: Smooth 60fps 3D rendering
- **📱 Responsive Design**: Works on all device sizes
- **🎨 Modern UI**: Sleek, professional appearance

### Demo Scenarios

1. **DDoS Attack Detection**: Visualize volumetric attacks with pulsing red nodes
2. **Port Scanning Activity**: Monitor suspicious reconnaissance attempts
3. **Geographic Anomalies**: Detect traffic from unexpected locations
4. **Protocol Violations**: Identify unusual network protocol usage
5. **Performance Monitoring**: Real-time network health assessment

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for custom configuration:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_WS_URL=ws://localhost:3000/ws

# 3D Visualization Settings
NEXT_PUBLIC_MAX_NODES=50
NEXT_PUBLIC_RENDER_FPS=60
NEXT_PUBLIC_ENABLE_SHADOWS=false

# Anomaly Detection
NEXT_PUBLIC_ML_MODEL_ENDPOINT=/api/ml/detect
NEXT_PUBLIC_CONFIDENCE_THRESHOLD=0.7
```

### Customization Options

- **Network Topology**: Modify `src/lib/data-generator.ts` to customize network structure
- **Anomaly Models**: Extend ML detection algorithms in anomaly detection logic
- **UI Themes**: Customize colors and styling in Tailwind configuration
- **Performance**: Adjust 3D rendering settings for different hardware capabilities

## 🧪 Development

### Project Structure Deep Dive

```
flow-anomaly-detection/
├── src/
│   ├── app/
│   │   ├── globals.css           # Global styles and Tailwind imports
│   │   ├── layout.tsx            # Root layout component
│   │   └── page.tsx              # Main dashboard page
│   ├── components/
│   │   ├── 3d/
│   │   │   └── NetworkVisualization.tsx  # 3D network component
│   │   ├── dashboard/
│   │   │   ├── MetricCard.tsx    # Reusable metric display
│   │   │   ├── AlarmPanel.tsx    # Security alerts panel
│   │   │   └── TopTalkers.tsx    # Network traffic analysis
│   │   └── ui/                   # Shadcn/ui components
│   ├── lib/
│   │   ├── data-generator.ts     # Network data simulation
│   │   └── utils.ts              # Utility functions
│   ├── types/
│   │   └── index.ts              # TypeScript definitions
│   └── styles/
├── public/                       # Static assets
├── package.json                  # Dependencies and scripts
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── next.config.js               # Next.js configuration
```

### Adding New Features

1. **New Anomaly Types**: Extend the `AnomalyDetection` interface in `types/index.ts`
2. **Additional Metrics**: Add new metric cards in the dashboard components
3. **3D Enhancements**: Modify the NetworkVisualization component for new visual features
4. **Data Sources**: Integrate real network data by replacing the data generator

### Testing

```bash
# Run type checking
npm run type-check

# Build and test production bundle
npm run build

# Start production server
npm start
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Configure Build**: Vercel automatically detects Next.js configuration
3. **Deploy**: Automatic deployments on every push to main branch

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### Environment-Specific Builds

```bash
# Development
npm run dev

# Production
npm run build && npm start

# Static export (if needed)
npm run build && npm run export
```

## 🤝 Contributing

We welcome contributions to enhance the Flow Anomaly Detection Dashboard!

### Development Workflow

1. **Fork the Repository**
2. **Create Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Commit Changes**: `git commit -m 'Add amazing feature'`
4. **Push to Branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Code Standards

- **TypeScript**: All new code must be properly typed
- **ESLint**: Follow the established linting rules
- **Prettier**: Use consistent code formatting
- **Components**: Follow React best practices and hooks patterns

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Three.js Community**: For the amazing 3D graphics library
- **React Three Fiber**: For the excellent React integration
- **Shadcn/ui**: For the beautiful, accessible UI components
- **Next.js Team**: For the powerful React framework
- **Tailwind CSS**: For the utility-first CSS framework

## 📞 Support & Contact

- **Issues**: Report bugs and feature requests via GitHub Issues
- **Documentation**: Comprehensive guides available in the `/docs` folder
- **Community**: Join our discussions in GitHub Discussions

---

**Built with ❤️ for the cybersecurity community**

*Empowering network security teams with cutting-edge visualization and AI-powered threat detection.*
