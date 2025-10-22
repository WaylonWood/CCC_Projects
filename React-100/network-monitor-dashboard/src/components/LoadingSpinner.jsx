import React from 'react';

const LoadingSpinner = ({ 
  text = '', 
  className = '' 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      {/* Animated Progress Bar */}
      <div className="w-24 h-1 bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-neon-blue via-neon-green to-neon-purple rounded-full animate-loading-bar"></div>
      </div>
      
      {/* Loading Text */}
      <div className="font-mono text-sm text-gray-400 tracking-wider">
        {text || 'LOADING...'}
      </div>
    </div>
  );
};

export default LoadingSpinner;