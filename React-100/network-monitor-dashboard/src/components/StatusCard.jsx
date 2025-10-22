import React from 'react';
import useNetworkStore from '../store/networkStore';

const StatusCard = () => {
  const { pingInfo, ipInfo, currentTarget, autoRefresh, toggleAutoRefresh, refreshData } = useNetworkStore();

  const getStatusInfo = () => {
    if (!pingInfo) return { status: 'unknown', text: 'UNKNOWN', color: 'gray' };
    
    if (pingInfo.status === 'up') {
      return { status: 'up', text: '● ACTIVE', color: 'green' };
    } else {
      return { status: 'down', text: '● OFFLINE', color: 'red' };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="bg-cyber-darker border border-cyber-border rounded-lg shadow-lg backdrop-blur-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neon-green font-mono">STATUS_OVERVIEW</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={refreshData}
            className="p-2 text-gray-400 hover:text-neon-blue hover:bg-cyber-light rounded-lg transition-all duration-200 border border-transparent hover:border-neon-blue/50"
            title="Refresh Data"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={toggleAutoRefresh}
            className={`p-2 rounded-lg transition-all duration-200 border ${
              autoRefresh 
                ? 'text-neon-green bg-cyber-light border-neon-green/50 shadow-lg shadow-neon-green/25' 
                : 'text-gray-400 hover:text-neon-blue border-transparent hover:border-neon-blue/50 hover:bg-cyber-light'
            }`}
            title={autoRefresh ? 'Disable Auto Refresh' : 'Enable Auto Refresh'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>

      {currentTarget ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400 font-mono">TARGET:</span>
            <span className="font-mono text-sm bg-cyber-dark border border-cyber-border px-3 py-1 rounded text-neon-blue">{currentTarget}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <div className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-mono font-bold border relative ${
                statusInfo.status === 'up' ? 'bg-neon-green/10 text-neon-green border-neon-green/50 shadow-lg shadow-neon-green/25' :
                statusInfo.status === 'down' ? 'bg-neon-pink/10 text-neon-pink border-neon-pink/50 shadow-lg shadow-neon-pink/25' :
                'bg-gray-600/10 text-gray-400 border-gray-600/50'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  statusInfo.status === 'up' ? 'status-dot-green' :
                  statusInfo.status === 'down' ? 'status-dot-red' :
                  'bg-gray-400'
                }`}></div>
                {statusInfo.status === 'up' ? 'ACTIVE' : statusInfo.status === 'down' ? 'OFFLINE' : 'UNKNOWN'}
              </div>
              <p className="text-xs text-gray-500 mt-2 font-mono">CONNECTION_STATUS</p>
            </div>

            <div className="text-center">
              <div className="text-lg font-bold text-neon-blue font-mono">
                {pingInfo ? `${pingInfo.pingTime}ms` : '--'}
              </div>
              <p className="text-xs text-gray-500 font-mono">PING_TIME</p>
            </div>

            <div className="text-center">
              <div className="text-lg font-bold text-neon-purple font-mono truncate">
                {ipInfo ? ipInfo.org?.split(' ')[0] || 'UNKNOWN' : '--'}
              </div>
              <p className="text-xs text-gray-500 font-mono">ISP/ORG</p>
            </div>
          </div>

          {autoRefresh && (
            <div className="flex items-center justify-center text-xs text-neon-green bg-cyber-dark border border-neon-green/30 py-2 rounded-lg font-mono">
              <svg className="w-3 h-3 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
              </svg>
              AUTO-REFRESH_ACTIVE [60s_INTERVAL]
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="font-mono text-sm">AWAITING_TARGET_INPUT...</p>
          <p className="font-mono text-xs text-gray-600 mt-1">{'>'} ENTER IP_ADDRESS OR DOMAIN_NAME TO BEGIN SCAN</p>
        </div>
      )}
    </div>
  );
};

export default StatusCard;