# Network Monitor Dashboard

Real-time network monitoring dashboard built with React and Vite. Monitor IP addresses and domains with interactive maps, bandwidth charts, and network topology visualization.

## Features

- Live network topology mapping with spider web visualization
- Real-time bandwidth monitoring via WebSocket
- IP geolocation and information lookup
- Interactive network maps with device discovery
- Ping monitoring and latency tracking
- Security threat analysis
- Responsive cyberpunk-themed interface

## Tech Stack

- React 18 + Vite
- TailwindCSS for styling
- Zustand for state management
- Vis-Network for topology visualization
- Recharts for data visualization
- Leaflet maps for geolocation
- WebSocket for real-time data

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

1. Clone the project:
```bash
git clone <repository-url>
cd network-monitor-dashboard
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
```

4. Set up environment variables:
```bash
cp .env.example .env
# Add your API keys to .env
```

5. Start the backend server:
```bash
cd backend
npm start
```

6. Start the frontend (new terminal):
```bash
npm run dev
```

## API Configuration

Create a `.env` file in the project root:

```env
VITE_IPINFO_TOKEN=your_ipinfo_token
VITE_API_NINJAS_KEY=your_api_ninjas_key  
VITE_SHODAN_KEY=your_shodan_key
```

### API Providers

- **IPinfo** - IP geolocation and details
- **API Ninjas** - Network ping and latency data
- **Shodan** - Security analysis and port scanning

All APIs have generous free tiers for development.

## Project Structure

```
src/
├── components/          # React components
├── store/              # Zustand state management
├── utils/              # API utilities
└── styles/             # Cyberpunk CSS themes
backend/
├── server.js           # Express server with WebSocket
└── package.json        # Backend dependencies
```

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend Scripts
- `npm start` - Start backend server with nodemon
- `node server.js` - Start backend server

## Features in Detail

### Network Topology
- Interactive visualization
- Real device discovery via network scanning
- Gateway and device status monitoring
- Zoom and pan controls

### Bandwidth Monitoring  
- Real-time upload/download speeds
- WebSocket-based live updates
- Historical data with smoothing algorithms
- System-level network interface monitoring

### Security Analysis
- Port scanning and vulnerability detection
- Threat level assessment
- Real security data (no mock data)

## Deployment

Build the project:
```bash
npm run build
```

The `dist` folder contains the production-ready files.

For the backend, ensure your hosting provider supports:
- Node.js applications
- WebSocket connections
- Network interface access for bandwidth monitoring

## License

MIT License - see LICENSE file for details.