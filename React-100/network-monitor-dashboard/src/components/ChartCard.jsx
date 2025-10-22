import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useNetworkStore from '../store/networkStore';
import LoadingSpinner from './LoadingSpinner';

const ChartCard = () => {
  const { latencyData, loading, currentTarget } = useNetworkStore();
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-cyber-darker border border-neon-green/50 p-3 rounded-lg shadow-lg backdrop-blur-sm">
          <p className="text-sm font-medium text-neon-green font-mono">{`TIME: ${label}`}</p>
          <p className="text-sm text-neon-blue font-mono">
            {`LATENCY: ${payload[0].value}ms`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-cyber-darker border border-cyber-border rounded-lg shadow-lg backdrop-blur-sm p-6">
        <h2 className="text-lg font-semibold text-neon-green mb-4 font-mono">LATENCY_ANALYSIS</h2>
        <LoadingSpinner text="ANALYZING_NETWORK_LATENCY..." />
      </div>
    );
  }

  if (!latencyData || latencyData.length === 0) {
    return (
      <div className="bg-cyber-darker border border-cyber-border rounded-lg shadow-lg backdrop-blur-sm p-6">
        <h2 className="text-lg font-semibold text-neon-green mb-4 font-mono">LATENCY_ANALYSIS</h2>
        <div className="flex flex-col items-center justify-center h-64 text-gray-500 bg-cyber-dark border border-cyber-border rounded-lg">
          <svg className="w-12 h-12 mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="font-mono text-sm">NO_LATENCY_DATA_AVAILABLE</p>
          <p className="text-xs text-gray-600 mt-1 font-mono">
            {currentTarget ? 'UNABLE_TO_GENERATE_LATENCY_TREND' : 'SEARCH_FOR_IP_OR_DOMAIN_TO_SEE_LATENCY_DATA'}
          </p>
        </div>
      </div>
    );
  }

  const avgLatency = latencyData.reduce((sum, item) => sum + item.latency, 0) / latencyData.length;
  const minLatency = Math.min(...latencyData.map(item => item.latency));
  const maxLatency = Math.max(...latencyData.map(item => item.latency));

  return (
    <div className="bg-cyber-darker border border-cyber-border rounded-lg shadow-lg backdrop-blur-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neon-green font-mono">LATENCY_ANALYSIS [24H]</h2>
        <div className="flex items-center space-x-4 text-sm text-gray-400 font-mono">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse"></div>
            <span>PING_RESPONSE</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-cyber-dark border border-cyber-border rounded-lg">
        <div className="text-center">
          <div className="text-lg font-bold text-neon-blue font-mono">{Math.round(avgLatency)}ms</div>
          <div className="text-sm text-gray-400 font-mono">AVERAGE</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-neon-green font-mono">{minLatency}ms</div>
          <div className="text-sm text-gray-400 font-mono">BEST</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-neon-pink font-mono">{maxLatency}ms</div>
          <div className="text-sm text-gray-400 font-mono">WORST</div>
        </div>
      </div>

      <div className="h-64 bg-cyber-dark/50 border border-cyber-border rounded-lg p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={latencyData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#404050" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#9CA3AF', fontFamily: 'monospace' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#9CA3AF', fontFamily: 'monospace' }}
              label={{ value: 'LATENCY (ms)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF', fontFamily: 'monospace' } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="latency" 
              stroke="#00ff41" 
              strokeWidth={2}
              dot={{ fill: '#00ff41', strokeWidth: 2, r: 3 }}
              activeDot={{ 
                r: 8, 
                stroke: '#00ff41', 
                strokeWidth: 3, 
                fill: '#0a0a0f',
                className: 'animate-pulse-slow',
                onMouseEnter: (data) => setHoveredPoint(data),
                onMouseLeave: () => setHoveredPoint(null)
              }}
              filter="drop-shadow(0 0 8px #00ff41)"
              className="animate-chart-draw"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-start space-x-2 text-sm text-gray-400 bg-cyber-dark border border-neon-blue/30 p-3 rounded-lg shadow-lg shadow-neon-blue/10">
        <svg className="w-4 h-4 text-neon-blue mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <div>
          <p className="text-neon-blue font-medium font-mono">ANALYSIS_INFO:</p>
          <p className="text-gray-400 font-mono text-xs">
            LATENCY_TREND_OVER_24H_PERIOD. LOWER_VALUES_INDICATE_BETTER_CONNECTIVITY_AND_FASTER_RESPONSE_TIMES.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChartCard;