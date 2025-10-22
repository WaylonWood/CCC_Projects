import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import useNetworkStore from '../store/networkStore';

const ActiveMonitors = () => {
  const { 
    ipInfo, 
    pingInfo, 
    threatInfo, 
    currentTarget, 
    loading, 
    searchTarget 
  } = useNetworkStore();
  
  const [monitors, setMonitors] = useState([]);
  const [newMonitor, setNewMonitor] = useState('');

  const addMonitor = async () => {
    if (newMonitor.trim()) {
      const newId = Date.now();
      const monitorTarget = newMonitor.trim();
      
      // Create monitor in checking state
      const newMonitorObj = {
        id: newId,
        target: monitorTarget,
        status: 'checking',
        latency: 0,
        lastCheck: 'Checking...',
        ipInfo: null,
        threatInfo: null
      };
      
      setMonitors(prev => [...prev, newMonitorObj]);
      setNewMonitor('');
      
      // Query target info
      try {
        await searchTarget(monitorTarget);
        
        // Apply live results
        setMonitors(prev => prev.map(m => 
          m.id === newId 
            ? { 
                ...m, 
                status: pingInfo?.status || 'unknown',
                latency: pingInfo?.pingTime || 0,
                lastCheck: new Date().toLocaleTimeString(),
                ipInfo: ipInfo,
                threatInfo: threatInfo
              }
            : m
        ));
      } catch (err) {
        // Mark as failed
        setMonitors(prev => prev.map(m => 
          m.id === newId 
            ? { 
                ...m, 
                status: 'down',
                latency: 0,
                lastCheck: 'Failed'
              }
            : m
        ));
      }
    }
  };

  const removeMonitor = (id) => {
    setMonitors(monitors.filter(m => m.id !== id));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'up': return 'text-neon-green';
      case 'down': return 'text-neon-pink';
      case 'checking': return 'text-neon-blue';
      default: return 'text-gray-400';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'up': return 'status-dot-green';
      case 'down': return 'status-dot-red';
      case 'checking': return 'status-dot-orange';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Monitor Section */}
      <div className="bg-cyber-darker border border-cyber-border rounded-lg shadow-lg backdrop-blur-sm p-6">
        <h2 className="text-lg font-semibold text-neon-green mb-4 font-mono">ADD_NEW_MONITOR</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            value={newMonitor}
            onChange={(e) => setNewMonitor(e.target.value)}
            placeholder="Enter IP address or domain..."
            className="flex-1 bg-cyber-dark border border-cyber-border rounded-lg px-4 py-2 text-neon-blue font-mono placeholder-gray-500 focus:outline-none focus:border-neon-blue focus:shadow-lg focus:shadow-neon-blue/25"
            onKeyPress={(e) => e.key === 'Enter' && addMonitor()}
          />
          <button
            onClick={addMonitor}
            disabled={loading}
            className="bg-neon-green/10 hover:bg-neon-green/20 border border-neon-green/50 px-6 py-2 rounded-lg text-neon-green font-mono transition-all duration-200 hover:shadow-lg hover:shadow-neon-green/25 disabled:opacity-50"
          >
            {loading ? '[ADDING...]' : '[ADD]'}
          </button>
        </div>
      </div>

      {/* Current Active Monitor */}
      {currentTarget && (
        <div className="bg-cyber-darker border border-cyber-border rounded-lg shadow-lg backdrop-blur-sm p-6">
          <h3 className="text-lg font-semibold text-neon-blue mb-4 font-mono">CURRENT_ACTIVE_MONITOR</h3>
          <div className="bg-cyber-dark border border-cyber-border rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-neon-blue font-mono">{currentTarget}</h3>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getStatusDot(pingInfo?.status || 'unknown')}`}></div>
                <span className={`text-sm font-mono font-bold ${getStatusColor(pingInfo?.status || 'unknown')}`}>
                  {(pingInfo?.status || 'unknown').toUpperCase()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <span className="text-sm text-gray-400 font-mono block">LATENCY:</span>
                <span className="text-lg font-mono text-neon-blue">
                  {loading ? (
                    <LoadingSpinner className="scale-50" />
                  ) : (
                    `${pingInfo?.pingTime || 0}ms`
                  )}
                </span>
              </div>

              <div className="text-center">
                <span className="text-sm text-gray-400 font-mono block">LOCATION:</span>
                <span className="text-lg font-mono text-neon-green">
                  {ipInfo?.city || 'Unknown'}, {ipInfo?.country || 'Unknown'}
                </span>
              </div>

              <div className="text-center">
                <span className="text-sm text-gray-400 font-mono block">ISP:</span>
                <span className="text-lg font-mono text-neon-purple">
                  {ipInfo?.org?.split(' ')[0] || 'Unknown'}
                </span>
              </div>

              <div className="text-center">
                <span className="text-sm text-gray-400 font-mono block">THREAT_LEVEL:</span>
                <span className={`text-lg font-mono ${
                  threatInfo?.success && threatInfo.data?.threat_level 
                    ? threatInfo.data.threat_level === 'low' ? 'text-neon-green'
                      : threatInfo.data.threat_level === 'medium' ? 'text-neon-orange'
                      : 'text-neon-pink'
                    : 'text-gray-400'
                }`}>
                  {threatInfo?.success && threatInfo.data?.threat_level 
                    ? threatInfo.data.threat_level.toUpperCase() 
                    : 'UNKNOWN'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Monitors Grid */}
      {monitors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {monitors.map((monitor) => (
            <div key={monitor.id} className="bg-cyber-darker border border-cyber-border rounded-lg shadow-lg backdrop-blur-sm p-6 relative">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-neon-blue font-mono truncate">{monitor.target}</h3>
                <button
                  onClick={() => removeMonitor(monitor.id)}
                  className="text-gray-400 hover:text-neon-pink transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400 font-mono">STATUS:</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusDot(monitor.status)}`}></div>
                    <span className={`text-sm font-mono font-bold ${getStatusColor(monitor.status)}`}>
                      {monitor.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400 font-mono">LATENCY:</span>
                  <span className="text-sm font-mono text-neon-blue">
                    {monitor.status === 'checking' ? (
                      <LoadingSpinner className="scale-50" />
                    ) : (
                      `${monitor.latency}ms`
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400 font-mono">LAST_CHECK:</span>
                  <span className="text-xs font-mono text-gray-300">{monitor.lastCheck}</span>
                </div>
              </div>

              <div className="mt-4 h-1 bg-cyber-dark rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    monitor.status === 'up' ? 'bg-neon-green' : 
                    monitor.status === 'down' ? 'bg-neon-pink' : 
                    'bg-neon-blue animate-pulse'
                  }`}
                  style={{ width: monitor.status === 'up' ? '100%' : monitor.status === 'down' ? '0%' : '50%' }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {monitors.length === 0 && !currentTarget && (
        <div className="bg-cyber-darker border border-cyber-border rounded-lg shadow-lg backdrop-blur-sm p-12 text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-gray-400 font-mono text-lg">NO_ACTIVE_MONITORS</p>
          <p className="text-gray-600 font-mono text-sm mt-2">ADD_TARGETS_TO_BEGIN_MONITORING</p>
        </div>
      )}
    </div>
  );
};

export default ActiveMonitors;