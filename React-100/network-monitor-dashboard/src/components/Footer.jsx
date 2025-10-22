import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-cyber-darker border-t border-cyber-border mt-12 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-400 font-mono">
              © 2025 NETWORK_MONITOR_DASHBOARD.
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4 text-sm text-gray-400 font-mono">
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>POWERED_BY_FREE_APIS</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <a
                href="https://ipinfo.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-neon-green transition-colors duration-200 font-mono"
              >
                IPINFO
              </a>
              <a
                href="https://api.api-ninjas.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-neon-blue transition-colors duration-200 font-mono"
              >
                API_NINJAS
              </a>
              <a
                href="https://www.shodan.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-neon-purple transition-colors duration-200 font-mono"
              >
                SHODAN
              </a>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-cyber-border">
          <div className="text-xs text-gray-500 text-center font-mono">
            <p className="mb-1">
              FEATURES: IP_GEOLOCATION • PING_MONITORING • SECURITY_ANALYSIS • INTERACTIVE_MAPS • LATENCY_CHARTS
            </p>
            <p>
              TECH_STACK: REACT • VITE • TAILWINDCSS • RECHARTS • LEAFLET • ZUSTAND • AXIOS
            </p>
          </div>
        </div>

        {/* Terminal cursor effect */}
        <div className="mt-4 flex justify-center">
          <div className="flex items-center space-x-1 text-neon-green text-xs font-mono">
            <span>SYSTEM_STATUS:</span>
            <span className="text-neon-green">ONLINE</span>
            <span className="animate-terminal text-neon-green">|</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;