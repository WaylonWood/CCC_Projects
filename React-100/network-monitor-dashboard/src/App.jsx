import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import StatusCard from './components/StatusCard';
import IPInfoCard from './components/IPInfoCard';
import ThreatCard from './components/ThreatCard';
import MapCard from './components/MapCard';
import ChartCard from './components/ChartCard';
import BandwidthChart from './components/BandwidthChart';
import ActiveMonitors from './components/ActiveMonitors';
import NetworkOverview from './components/NetworkOverview';
import DeviceDiscovery from './components/DeviceDiscovery';
import NetworkTopology from './components/NetworkTopology';
import Footer from './components/Footer';
import useNetworkStore from './store/networkStore';

function App() {
  const { error, setError, threatInfo } = useNetworkStore();
  const [activeTab, setActiveTab] = useState('monitors');

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  useEffect(() => {
    const matrixContainer = document.createElement('div');
    matrixContainer.style.position = 'fixed';
    matrixContainer.style.top = '0';
    matrixContainer.style.left = '0';
    matrixContainer.style.width = '100%';
    matrixContainer.style.height = '100%';
    matrixContainer.style.zIndex = '1';
    matrixContainer.style.opacity = '0.3';
    matrixContainer.style.pointerEvents = 'none';
    matrixContainer.style.overflow = 'hidden';
    
    const chars = '01010011010110100101001110101001101011010010100111010100110101101001010011101010';
    
    for (let i = 0; i < 50; i++) {
      const column = document.createElement('div');
      column.style.position = 'absolute';
      column.style.left = `${Math.random() * 100}%`;
      column.style.color = '#00ff41';
      column.style.fontFamily = 'JetBrains Mono, monospace';
      column.style.fontSize = '14px';
      column.style.whiteSpace = 'pre';
      column.style.lineHeight = '20px';
      column.style.animation = `matrix-fall ${5 + Math.random() * 5}s linear infinite`;
      column.style.animationDelay = `${Math.random() * 5}s`;
      
      let columnText = '';
      for (let j = 0; j < 30; j++) {
        columnText += chars[Math.floor(Math.random() * chars.length)] + '\n';
      }
      column.textContent = columnText;
      
      matrixContainer.appendChild(column);
    }
    
    document.body.appendChild(matrixContainer);

    return () => {
      if (document.body.contains(matrixContainer)) {
        document.body.removeChild(matrixContainer);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-black via-cyber-dark to-cyber-darker font-mono relative overflow-hidden flex flex-col">
      <div className="fixed inset-0 opacity-10 pointer-events-none cyber-grid"></div>
      
      <div className="relative z-20 flex flex-col min-h-screen">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
          <div className="max-w-7xl mx-auto w-full">
          {error && (
            <div className="mb-6 bg-cyber-darker border border-neon-pink rounded-lg p-4 shadow-lg backdrop-blur-sm">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-neon-pink mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-neon-pink animate-pulse-neon">ERROR</h3>
                  <p className="text-sm text-gray-300 mt-1 font-mono">{error}</p>
                </div>
                <button
                  onClick={() => setError(null)}
                  className="ml-auto text-neon-pink hover:text-white transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'monitors' && (
            <>
              <SearchBar />

              <div className="mb-6">
                <StatusCard />
              </div>

              <div className={`grid gap-6 mb-6 ${threatInfo && threatInfo.success ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                <IPInfoCard />
                {threatInfo && threatInfo.success && <ThreatCard />}
              </div>

              <div className="mb-6">
                <MapCard />
              </div>

              <div className="mb-6">
                <ChartCard />
              </div>

              <div className="mb-6">
                <BandwidthChart />
              </div>

              <div className="mb-6">
                <ActiveMonitors />
              </div>
            </>
          )}

          {activeTab === 'network' && <NetworkOverview />}
          {activeTab === 'devices' && <DeviceDiscovery />}
          {activeTab === 'topology' && <NetworkTopology />}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;