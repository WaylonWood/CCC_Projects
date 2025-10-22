import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

const DeviceDiscovery = () => {
  const [deviceData, setDeviceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    // Live device updates via WebSocket
    const ws = new WebSocket('ws://localhost:3001');
    
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'device_update') {
          console.log('📡 Received device update via WebSocket');
          setDeviceData(message.data);
          setLastUpdate(new Date().toLocaleTimeString());
          setLoading(false);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  const fetchDevices = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3001/api/network/devices');
      if (!response.ok) {
        throw new Error('Failed to fetch device data');
      }
      
      const data = await response.json();
      setDeviceData(data);
      setLastUpdate(new Date().toLocaleTimeString());
      
    } catch (err) {
      setError(err.message);
      console.error('Device discovery error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  if (loading) {
    return (
      <div className="w-full">
        <div className="bg-cyber-darker border border-cyber-border rounded-lg shadow-lg backdrop-blur-sm p-8 text-center min-h-[400px] flex flex-col justify-center w-full">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-neon-purple font-mono mb-2">DISCOVERING_DEVICES</h2>
            <div className="w-48 h-1 bg-cyber-dark rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-neon-purple animate-loading-bar rounded-full"></div>
            </div>
          </div>
          
          <div className="space-y-2 text-sm font-mono text-gray-400">
            <div>Scanning ARP table...</div>
            <div>Testing device connectivity...</div>
            <div>Identifying device vendors...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-cyber-darker border border-red-500/50 rounded-lg shadow-lg backdrop-blur-sm p-8 text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h2 className="text-xl font-bold text-red-500 mb-2 font-mono">Device Scan Failed</h2>
          <p className="text-gray-400 font-mono text-sm mb-4">Error: {error}</p>
          <button 
            onClick={fetchDevices}
            className="bg-neon-purple hover:bg-neon-purple/80 text-black font-mono px-4 py-2 rounded transition-colors"
          >
            RETRY_SCAN
          </button>
        </div>
      </div>
    );
  }

  if (!deviceData) return null;

  const getDeviceIcon = (vendor, hostname, deviceType) => {
    const v = vendor.toLowerCase();
    const h = hostname.toLowerCase();
    const t = deviceType?.toLowerCase() || '';
    
    // Check device type first
    if (t.includes('router') || t.includes('gateway')) {
      return '🌐';
    }
    
    // Check vendor and hostname patterns
    if (v.includes('apple') || h.includes('iphone') || h.includes('ipad') || h.includes('macbook') || h.includes('apple')) {
      if (h.includes('iphone')) return '📱';
      if (h.includes('ipad')) return '📱';
      if (h.includes('macbook') || h.includes('imac')) return '💻';
      return '🍎'; // Generic Apple device
    } else if (v.includes('samsung') || v.includes('lg') || h.includes('android') || h.includes('galaxy')) {
      return '📱'; // Android devices
    } else if (h.includes('router') || h.includes('gateway') || v.includes('cisco') || v.includes('netgear') || v.includes('linksys') || v.includes('tp-link')) {
      return '🌐'; // Network equipment
    } else if (h.includes('tv') || h.includes('roku') || h.includes('chromecast') || h.includes('firestick')) {
      return '📺'; // Smart TVs
    } else if (v.includes('microsoft') || h.includes('xbox') || h.includes('windows') || h.includes('surface')) {
      return '💻'; // Microsoft devices
    } else if (h.includes('printer') || v.includes('hp') || v.includes('canon') || v.includes('epson')) {
      return '🖨️'; // Printers
    } else if (h.includes('alexa') || h.includes('echo') || h.includes('google') || h.includes('nest')) {
      return '🔊'; // Smart speakers
    } else if (h.includes('camera') || h.includes('security') || v.includes('hikvision') || v.includes('dahua')) {
      return '📹'; // Security cameras
    } else {
      return '🖥️'; // Generic device
    }
  };

  const getStatusColor = (status) => {
    return status === 'online' ? 'text-neon-green' : 'text-red-500';
  };

  const getStatusBadge = (status, responseTime) => {
    if (status === 'online') {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
          <span className="text-neon-green font-mono text-sm">ONLINE</span>
          {responseTime && (
            <span className="text-gray-400 font-mono text-xs">({responseTime}ms)</span>
          )}
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span className="text-red-500 font-mono text-sm">OFFLINE</span>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Discovery status */}
      <div className="bg-cyber-darker border border-cyber-border rounded-lg shadow-lg backdrop-blur-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-neon-purple font-mono">DEVICE_DISCOVERY</h2>
          <div className="flex items-center space-x-4">
            {lastUpdate && (
              <div className="text-xs font-mono text-gray-400">
                Updated: {lastUpdate}
              </div>
            )}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${deviceData ? 'status-dot-green' : 'bg-gray-500 animate-pulse'}`}></div>
              <span className={`font-mono text-sm ${deviceData ? 'text-neon-green' : 'text-gray-400'}`}>
                {deviceData ? 'LIVE_SCAN' : 'NO_DATA'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Network overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-cyber-dark border border-neon-blue/30 rounded-lg p-4">
            <div className="text-neon-blue font-mono text-sm mb-1">SUBNET</div>
            <div className="text-white font-mono text-lg">{deviceData.subnet || 'Unknown'}</div>
          </div>
          <div className="bg-cyber-dark border border-neon-green/30 rounded-lg p-4">
            <div className="text-neon-green font-mono text-sm mb-1">ONLINE_DEVICES</div>
            <div className="text-white font-mono text-lg">{deviceData.onlineDevices}</div>
          </div>
          <div className="bg-cyber-dark border border-neon-purple/30 rounded-lg p-4">
            <div className="text-neon-purple font-mono text-sm mb-1">TOTAL_DISCOVERED</div>
            <div className="text-white font-mono text-lg">{deviceData.totalDevices}</div>
          </div>
        </div>

        {/* Scan details */}
        <div className="bg-cyber-dark border border-cyber-border rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="text-neon-blue font-mono text-sm mb-1">LAST_SCAN</div>
              <div className="text-gray-400 font-mono text-xs">
                {new Date(deviceData.scanTime).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-neon-green font-mono text-sm mb-1">DATA_SOURCE</div>
              <div className="text-gray-300 font-mono text-xs">
                {deviceData.dataSource || 'Live Scan'}
              </div>
            </div>
            <div>
              <div className="text-neon-purple font-mono text-sm mb-1">PERFORMANCE</div>
              <div className="text-gray-300 font-mono text-xs">
                {deviceData.dataSource?.includes('Cached') ? 'Instant' : 'Live'}
              </div>
            </div>
            <div>
              <div className="text-neon-orange font-mono text-sm mb-1">STATUS</div>
              <div className="text-gray-300 font-mono text-xs">
                {deviceData.isEnhancing ? 'Enhancing...' : 'Complete'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Found devices */}
      <div className="bg-cyber-darker border border-cyber-border rounded-lg shadow-lg backdrop-blur-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-neon-green font-mono">DISCOVERED_DEVICES</h3>
          <button 
            onClick={fetchDevices}
            disabled={loading}
            className="bg-neon-purple hover:bg-neon-purple/80 disabled:opacity-50 text-black font-mono px-4 py-2 rounded transition-colors text-sm"
          >
            {loading ? 'SCANNING...' : 'REFRESH_SCAN'}
          </button>
        </div>
        
        {deviceData.devices.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 font-mono">NO_DEVICES_DISCOVERED</div>
            <div className="text-gray-500 font-mono text-sm mt-2">
              Try refreshing or check network connectivity
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {deviceData.devices.map((device, index) => (
              <div key={index} className="bg-cyber-dark border border-cyber-border rounded-lg p-4 hover:border-neon-purple/50 transition-colors">
                <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                  {/* Device info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getDeviceIcon(device.vendor, device.hostname, device.deviceType)}</span>
                      <div>
                        <div className="text-white font-mono text-sm font-bold">
                          {device.hostname !== device.ip && device.hostname !== '?' ? device.hostname : device.deviceType || 'Unknown Device'}
                        </div>
                        <div className="text-gray-400 font-mono text-xs">
                          {device.vendor}
                        </div>
                        {device.deviceType && device.deviceType !== 'Unknown' && (
                          <div className="text-neon-blue font-mono text-xs">
                            {device.deviceType}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* IP */}
                  <div>
                    <div className="text-neon-blue font-mono text-xs">IP_ADDRESS</div>
                    <div className="text-white font-mono text-sm">{device.ip}</div>
                  </div>

                  {/* MAC */}
                  <div>
                    <div className="text-neon-orange font-mono text-xs">MAC_ADDRESS</div>
                    <div className="text-white font-mono text-xs">{device.mac}</div>
                  </div>

                  {/* Online status */}
                  <div>
                    <div className="text-gray-400 font-mono text-xs">STATUS</div>
                    <div className="mt-1">
                      {getStatusBadge(device.status, device.responseTime)}
                    </div>
                  </div>

                  {/* Activity */}
                  <div>
                    <div className="text-gray-400 font-mono text-xs">LAST_SEEN</div>
                    <div className="text-gray-300 font-mono text-xs">
                      {new Date(device.lastSeen).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceDiscovery;