import React from 'react';
import useNetworkStore from '../store/networkStore';

const ThreatCard = () => {
  const { threatInfo, loading } = useNetworkStore();

  if (loading) {
    return (
      <div className="bg-cyber-darker border border-cyber-border rounded-lg shadow-lg backdrop-blur-sm p-6">
        <h2 className="text-lg font-semibold text-neon-green mb-4 font-mono">SECURITY_ANALYSIS</h2>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-cyber-light rounded w-1/2"></div>
          <div className="h-4 bg-cyber-light rounded w-3/4"></div>
          <div className="h-4 bg-cyber-light rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (!threatInfo || !threatInfo.success) {
    return null; // Hide component completely when no real data
  }

  const getThreatLevelInfo = () => {
    switch (threatInfo.threatLevel) {
      case 'low':
        return {
          color: 'green',
          text: 'LOW_RISK',
          description: 'NO_SIGNIFICANT_SECURITY_CONCERNS_DETECTED',
          bgClass: 'bg-neon-green/10 text-neon-green border-neon-green/50',
          shadowClass: 'shadow-neon-green/25'
        };
      case 'medium':
        return {
          color: 'yellow',
          text: 'MEDIUM_RISK',
          description: 'SOME_SECURITY_CONCERNS_DETECTED',
          bgClass: 'bg-neon-orange/10 text-neon-orange border-neon-orange/50',
          shadowClass: 'shadow-neon-orange/25'
        };
      case 'high':
        return {
          color: 'red',
          text: 'HIGH_RISK',
          description: 'MULTIPLE_SECURITY_CONCERNS_DETECTED',
          bgClass: 'bg-neon-pink/10 text-neon-pink border-neon-pink/50',
          shadowClass: 'shadow-neon-pink/25'
        };
      default:
        return {
          color: 'gray',
          text: 'UNKNOWN',
          description: 'UNABLE_TO_ASSESS_THREAT_LEVEL',
          bgClass: 'bg-gray-600/10 text-gray-400 border-gray-600/50',
          shadowClass: 'shadow-gray-600/25'
        };
    }
  };

  const threatLevel = getThreatLevelInfo();

  return (
    <div className="bg-cyber-darker border border-cyber-border rounded-lg shadow-lg backdrop-blur-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neon-green font-mono">SECURITY_ANALYSIS</h2>
        <div className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-mono font-bold border shadow-lg ${threatLevel.bgClass} ${threatLevel.shadowClass}`}>
          {threatLevel.text}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-400 mb-3 font-mono">{threatLevel.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-400 font-mono">ORGANIZATION:</dt>
            <dd className="mt-1 text-sm text-gray-300 font-mono">{threatInfo.organization}</dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-gray-400 font-mono">VULNERABILITIES:</dt>
            <dd className="mt-1 text-sm text-gray-300 font-mono">
              {threatInfo.vulnerabilities} DETECTED
            </dd>
          </div>
        </div>

        <div>
          <dt className="text-sm font-medium text-gray-400 mb-2 font-mono">OPEN_PORTS:</dt>
          <dd className="space-y-2">
            {threatInfo.openPorts && threatInfo.openPorts.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {threatInfo.openPorts.map((port, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-mono font-bold bg-neon-blue/10 text-neon-blue border border-neon-blue/50"
                  >
                    {port}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 font-mono">NO_OPEN_PORTS_DETECTED</p>
            )}
          </dd>
        </div>

        <div className="bg-cyber-dark border border-cyber-border rounded-lg p-3">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-neon-blue mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-sm">
              <p className="font-medium text-neon-blue font-mono">SECURITY_TIP:</p>
              <p className="text-gray-400 mt-1 font-mono text-xs">
                {threatInfo.vulnerabilities === 0 && threatInfo.openPorts.length <= 2
                  ? 'HOST_APPEARS_TO_HAVE_GOOD_SECURITY_PRACTICES'
                  : 'CONSIDER_REVIEWING_OPEN_SERVICES_AND_SYSTEM_UPDATES'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatCard;