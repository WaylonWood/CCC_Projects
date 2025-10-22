import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

const NetworkOverview = () => {
  const [networkData, setNetworkData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNetworkOverview = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/network/overview');
      if (!response.ok) {
        throw new Error('Failed to fetch network data');
      }
      const data = await response.json();
      setNetworkData(data);
    } catch (err) {
      setError(err.message);
      console.error('Network overview error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNetworkOverview();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchNetworkOverview, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="w-full">
        <div className="bg-cyber-darker border border-cyber-border rounded-lg shadow-lg backdrop-blur-sm p-8 text-center min-h-[400px] flex flex-col justify-center w-full">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-neon-blue font-mono mb-2">SCANNING_NETWORK</h2>
            <div className="w-48 h-1 bg-cyber-dark rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-neon-blue animate-loading-bar rounded-full"></div>
            </div>
          </div>
          
          <div className="space-y-2 text-sm font-mono text-gray-400">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
              <span>Analyzing network interfaces</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <span>Testing DNS connectivity</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-neon-purple rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              <span>Gathering system information</span>
            </div>
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
          <h2 className="text-xl font-bold text-red-500 mb-2 font-mono">Network Scan Failed</h2>
          <p className="text-gray-400 font-mono text-sm mb-4">Error: {error}</p>
          <button 
            onClick={fetchNetworkOverview}
            className="bg-neon-blue hover:bg-neon-blue/80 text-black font-mono px-4 py-2 rounded transition-colors"
          >
            RETRY SCAN
          </button>
        </div>
      </div>
    );
  }

  if (!networkData) return null;

  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${mins}m`;
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Network status header */}
      <div className="bg-cyber-darker border border-cyber-border rounded-lg shadow-lg backdrop-blur-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-neon-green font-mono">NETWORK_OVERVIEW</h2>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${networkData ? 'status-dot-green' : 'bg-gray-500 animate-pulse'}`}></div>
            <span className={`font-mono text-sm ${networkData ? 'text-neon-green' : 'text-gray-400'}`}>
              {networkData ? 'LIVE_DATA' : 'NO_DATA'}
            </span>
          </div>
        </div>
        
        {/* System details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-cyber-dark border border-neon-blue/30 rounded-lg p-4">
            <div className="text-neon-blue font-mono text-sm mb-1">HOSTNAME</div>
            <div className="text-white font-mono text-lg">{networkData.hostname}</div>
          </div>
          <div className="bg-cyber-dark border border-neon-purple/30 rounded-lg p-4">
            <div className="text-neon-purple font-mono text-sm mb-1">PLATFORM</div>
            <div className="text-white font-mono text-lg">{networkData.platform}</div>
          </div>
          <div className="bg-cyber-dark border border-neon-green/30 rounded-lg p-4">
            <div className="text-neon-green font-mono text-sm mb-1">UPTIME</div>
            <div className="text-white font-mono text-lg">{formatUptime(networkData.uptime)}</div>
          </div>
        </div>

        {/* Default gateway */}
        <div className="bg-cyber-dark border border-cyber-border rounded-lg p-4 mb-6">
          <div className="text-neon-blue font-mono text-sm mb-2">GATEWAY_STATUS</div>
          <div className="text-white font-mono">{networkData.gateway}</div>
        </div>
      </div>

      {/* Active network interfaces */}
      <div className="bg-cyber-darker border border-cyber-border rounded-lg shadow-lg backdrop-blur-sm p-6">
        <h3 className="text-xl font-bold text-neon-blue font-mono mb-4">ACTIVE_INTERFACES</h3>
        <div className="space-y-4">
          {networkData.interfaces.map((iface, index) => (
            <div key={index} className="bg-cyber-dark border border-cyber-border rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-neon-green font-mono text-sm">INTERFACE</div>
                  <div className="text-white font-mono">{iface.name}</div>
                </div>
                <div>
                  <div className="text-neon-blue font-mono text-sm">IP_ADDRESS</div>
                  <div className="text-white font-mono">{iface.address}</div>
                </div>
                <div>
                  <div className="text-neon-purple font-mono text-sm">NETMASK</div>
                  <div className="text-white font-mono">{iface.netmask}</div>
                </div>
                <div>
                  <div className="text-neon-orange font-mono text-sm">MAC_ADDRESS</div>
                  <div className="text-white font-mono text-xs">{iface.mac}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DNS server status */}
      <div className="bg-cyber-darker border border-cyber-border rounded-lg shadow-lg backdrop-blur-sm p-6">
        <h3 className="text-xl font-bold text-neon-purple font-mono mb-4">DNS_STATUS</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {networkData.dnsServers.map((dns, index) => (
            <div key={index} className="bg-cyber-dark border border-cyber-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-neon-purple font-mono text-sm">DNS_SERVER</div>
                  <div className="text-white font-mono">{dns.server}</div>
                </div>
                <div className="text-right">
                  <div className={`font-mono text-sm ${dns.status === 'online' ? 'text-neon-green' : 'text-red-500'}`}>
                    {dns.status === 'online' ? 'ONLINE' : 'ERROR'}
                  </div>
                  {dns.responseTime && (
                    <div className="text-gray-400 font-mono text-xs">{dns.responseTime}ms</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live traffic stats */}
      {networkData.networkStats && networkData.networkStats.length > 0 && (
        <div className="bg-cyber-darker border border-cyber-border rounded-lg shadow-lg backdrop-blur-sm p-6">
          <h3 className="text-xl font-bold text-neon-orange font-mono mb-4">TRAFFIC_STATISTICS</h3>
          <div className="space-y-4">
            {networkData.networkStats.map((stat, index) => (
              <div key={index} className="bg-cyber-dark border border-cyber-border rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <div className="text-neon-orange font-mono text-sm">INTERFACE</div>
                    <div className="text-white font-mono">{stat.interface}</div>
                  </div>
                  <div>
                    <div className="text-neon-green font-mono text-sm">STATUS</div>
                    <div className={`font-mono ${stat.operstate === 'up' ? 'text-neon-green' : 'text-red-500'}`}>
                      {stat.operstate?.toUpperCase() || 'UNKNOWN'}
                    </div>
                  </div>
                  <div>
                    <div className="text-neon-blue font-mono text-sm">RX_TOTAL</div>
                    <div className="text-white font-mono text-xs">{formatBytes(stat.rx_bytes)}</div>
                  </div>
                  <div>
                    <div className="text-neon-purple font-mono text-sm">TX_TOTAL</div>
                    <div className="text-white font-mono text-xs">{formatBytes(stat.tx_bytes)}</div>
                  </div>
                  <div>
                    <div className="text-neon-green font-mono text-sm">SPEED</div>
                    <div className="text-white font-mono text-xs">
                      ↓{formatBytes(stat.rx_sec)}/s ↑{formatBytes(stat.tx_sec)}/s
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual refresh */}
      <div className="text-center">
        <button 
          onClick={fetchNetworkOverview}
          disabled={loading}
          className="bg-neon-blue hover:bg-neon-blue/80 disabled:opacity-50 text-black font-mono px-6 py-2 rounded transition-colors"
        >
          {loading ? 'SCANNING...' : 'REFRESH_DATA'}
        </button>
      </div>
    </div>
  );
};

export default NetworkOverview;