import React, { useState, useEffect } from 'react';

const Header = ({ activeTab, setActiveTab }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const navItems = [
    {
      id: 'monitors',
      label: 'MONITORS',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 712-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 'network',
      label: 'NETWORK',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9-9a9 9 0 00-9 9m9 9c0-5 0-9-9-9s-9 4-9 9" />
        </svg>
      )
    },
    {
      id: 'devices',
      label: 'DEVICES',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'topology',
      label: 'TOPOLOGY',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 712 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 712 2v2M7 7h10" />
        </svg>
      )
    }
  ];

  return (
    <header className="bg-cyber-darker border-b border-cyber-border shadow-lg backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section with title and status */}
        <div className="flex justify-between items-center py-4 border-b border-cyber-border/30">
          <div className="flex items-center">
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-2xl font-bold text-neon-green animate-pulse-neon font-mono tracking-wider">
                  NETWORK_MONITOR
                </h1>
                <p className="text-sm text-gray-400 font-mono">
                  {'>'} REAL-TIME_NETWORK_ANALYSIS_TERMINAL
                  <span className="animate-terminal text-neon-blue ml-1">_</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 bg-cyber-dark border border-cyber-border rounded-lg px-3 py-2">
              <div className="w-2 h-2 rounded-full status-dot-green"></div>
              <span className="text-xs text-gray-300 font-mono">SYSTEM_ONLINE</span>
            </div>
            
            <div className="text-xs text-gray-400 font-mono">
              {currentTime.toLocaleTimeString('en-US', { 
                hour12: false,
                timeZone: 'America/Los_Angeles'
              })} PST
            </div>
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="flex space-x-6 overflow-x-auto py-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-mono transition-all duration-200 whitespace-nowrap ${
                activeTab === item.id
                  ? 'bg-neon-green/10 text-neon-green border border-neon-green/50 shadow-lg shadow-neon-green/25'
                  : 'text-gray-400 hover:text-neon-blue hover:bg-cyber-light/50 border border-transparent hover:border-neon-blue/30'
              }`}
            >
              <div className={`${activeTab === item.id ? 'text-neon-green' : 'text-gray-400'}`}>
                {item.icon}
              </div>
              <span>{item.label}</span>
              {activeTab === item.id && (
                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;