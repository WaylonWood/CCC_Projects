import React from 'react';
import useNetworkStore from '../store/networkStore';

const IPInfoCard = () => {
  const { ipInfo, loading } = useNetworkStore();

  if (loading) {
    return (
      <div className="bg-cyber-darker border border-cyber-border rounded-lg shadow-lg backdrop-blur-sm p-6">
        <h2 className="text-lg font-semibold text-neon-green mb-4 font-mono">GEOLOCATION_DATA</h2>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-cyber-light rounded w-3/4"></div>
          <div className="h-4 bg-cyber-light rounded w-1/2"></div>
          <div className="h-4 bg-cyber-light rounded w-2/3"></div>
          <div className="h-4 bg-cyber-light rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (!ipInfo) {
    return (
      <div className="bg-cyber-darker border border-cyber-border rounded-lg shadow-lg backdrop-blur-sm p-6">
        <h2 className="text-lg font-semibold text-neon-green mb-4 font-mono">GEOLOCATION_DATA</h2>
        <div className="text-center py-8 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="font-mono text-sm">NO_GEOLOCATION_DATA_AVAILABLE</p>
        </div>
      </div>
    );
  }

  const formatCoordinates = (coords) => {
    if (!coords || coords.lat === 0 || coords.lng === 0) return 'UNKNOWN';
    return `${coords.lat.toFixed(4)}°N, ${coords.lng.toFixed(4)}°E`;
  };

  return (
    <div className="bg-cyber-darker border border-cyber-border rounded-lg shadow-lg backdrop-blur-sm p-6">
        <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neon-green font-mono">GEOLOCATION_DATA</h2>
        <div className="flex items-center space-x-1 text-xs text-neon-green bg-cyber-dark border border-neon-green/30 px-2 py-1 rounded-lg font-mono">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>ACTIVE</span>
        </div>
      </div>      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-400 font-mono">IP_ADDRESS:</dt>
            <dd className="mt-1 text-sm text-neon-blue font-mono bg-cyber-dark border border-cyber-border px-3 py-2 rounded">
              {ipInfo.ip}
            </dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-gray-400 font-mono">ORGANIZATION:</dt>
            <dd className="mt-1 text-sm text-gray-300 truncate font-mono" title={ipInfo.org}>
              {ipInfo.org}
            </dd>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-400 font-mono">LOCATION:</dt>
            <dd className="mt-1 text-sm text-gray-300 font-mono">
              {ipInfo.city}, {ipInfo.region}
            </dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-gray-400 font-mono">COUNTRY:</dt>
            <dd className="mt-1 text-sm text-gray-300 font-mono">
              {ipInfo.country}
            </dd>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-400 font-mono">POSTAL_CODE:</dt>
            <dd className="mt-1 text-sm text-gray-300 font-mono">
              {ipInfo.postal}
            </dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-gray-400 font-mono">TIMEZONE:</dt>
            <dd className="mt-1 text-sm text-gray-300 font-mono">
              {ipInfo.timezone}
            </dd>
          </div>
        </div>

        <div>
          <dt className="text-sm font-medium text-gray-400 font-mono">COORDINATES:</dt>
          <dd className="mt-1 text-sm text-neon-purple font-mono bg-cyber-dark border border-cyber-border px-3 py-2 rounded">
            {formatCoordinates(ipInfo.coordinates)}
          </dd>
        </div>

        {ipInfo.note && (
          <div className="bg-cyber-dark border border-neon-orange/50 rounded-lg p-3 shadow-lg shadow-neon-orange/10">
            <div className="flex">
              <svg className="w-5 h-5 text-neon-orange mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-neon-orange">
                <p className="font-medium font-mono">WARNING:</p>
                <p className="font-mono text-xs text-gray-300">API_TOKEN_REQUIRED_FOR_ENHANCED_DATA</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IPInfoCard;