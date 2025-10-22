import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const BandwidthChart = () => {
  const [bandwidthData, setBandwidthData] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [currentSpeeds, setCurrentSpeeds] = useState({ download: 0, upload: 0 });
  const wsRef = useRef(null);
  const maxDataPoints = 60;

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        wsRef.current = new WebSocket('ws://localhost:3001');
        
        wsRef.current.onopen = () => {
          setConnectionStatus('connected');
        };
        
        wsRef.current.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            
            if (message.type === 'bandwidth') {
              const { data } = message;
              const timestamp = new Date(data.timestamp);
              
              setCurrentSpeeds({
                download: data.downloadSpeed,
                upload: data.uploadSpeed
              });
              
              setBandwidthData(prevData => {
                const newDataPoint = {
                  time: timestamp.toLocaleTimeString(),
                  download: Math.round(data.downloadSpeed / 1024),
                  upload: Math.round(data.uploadSpeed / 1024),
                  timestamp: timestamp.getTime()
                };
                
                let newData = [...prevData, newDataPoint];
                
                // Apply 3-point moving average for smoothing
                if (newData.length >= 3) {
                  const smoothingWindow = 3;
                  const recent = newData.slice(-smoothingWindow);
                  
                  const avgDownload = recent.reduce((sum, point) => sum + point.download, 0) / recent.length;
                  const avgUpload = recent.reduce((sum, point) => sum + point.upload, 0) / recent.length;
                  
                  newData[newData.length - 1] = {
                    ...newDataPoint,
                    download: Math.round(avgDownload),
                    upload: Math.round(avgUpload)
                  };
                }
                
                return newData.slice(-maxDataPoints);
              });
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };
        
        wsRef.current.onclose = () => {
          setConnectionStatus('reconnecting');
          setTimeout(connectWebSocket, 3000);
        };
        
        wsRef.current.onerror = (error) => {
          console.error('WebSocket error:', error);
          setConnectionStatus('error');
        };
        
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
        setConnectionStatus('error');
      }
    };
    
    connectWebSocket();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B/s';
    const k = 1024;
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-cyber-darker border border-cyber-border rounded-lg p-3 backdrop-blur-sm">
          <p className="text-neon-green font-mono text-xs mb-1">{`Time: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="font-mono text-xs" style={{ color: entry.color }}>
              {`${entry.dataKey === 'download' ? '↓ Download' : '↑ Upload'}: ${entry.value} KB/s`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-neon-green';
      case 'connecting': return 'text-neon-blue';
      case 'reconnecting': return 'text-neon-orange';
      case 'error': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'LIVE';
      case 'connecting': return 'CONNECTING';
      case 'reconnecting': return 'RECONNECTING';
      case 'error': return 'Error';
      default: return 'UNKNOWN';
    }
  };

  return (
    <div className="bg-cyber-darker border border-cyber-border rounded-lg shadow-lg backdrop-blur-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-neon-blue font-mono">LIVE_BANDWIDTH</h2>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'status-dot-green' : connectionStatus === 'error' ? 'status-dot-red' : 'status-dot-orange'}`}></div>
          <span className={`font-mono text-sm ${getConnectionStatusColor()}`}>
            {getConnectionStatusText()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-cyber-dark border border-neon-green/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-5 h-5 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            <span className="text-neon-green font-mono text-sm">Download</span>
          </div>
          <div className="text-white font-mono text-2xl">
            {formatBytes(currentSpeeds.download)}
          </div>
        </div>
        
        <div className="bg-cyber-dark border border-neon-purple/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <svg className="w-5 h-5 text-neon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-neon-purple font-mono text-sm">Upload</span>
          </div>
          <div className="text-white font-mono text-2xl">
            {formatBytes(currentSpeeds.upload)}
          </div>
        </div>
      </div>

      <div className="bg-cyber-dark border border-cyber-border rounded-lg p-4 mb-4 relative">
        <div className="absolute top-4 right-4 flex space-x-4 text-xs font-mono z-10">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-1 bg-neon-green rounded"></div>
            <span className="text-neon-green">Download</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-1 bg-neon-purple rounded"></div>
            <span className="text-neon-purple">Upload</span>
          </div>
        </div>
        
        {bandwidthData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart 
              data={bandwidthData} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="downloadGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00ff88" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="uploadGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#6b7280', fontFamily: 'JetBrains Mono' }}
                interval="preserveStartEnd"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#6b7280', fontFamily: 'JetBrains Mono' }}
                label={{ value: 'KB/s', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '10px', fill: '#6b7280' } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="download" 
                stroke="#00ff88" 
                strokeWidth={3}
                dot={false}
                connectNulls={true}
                strokeDasharray="0"
                activeDot={{ r: 5, fill: '#00ff88', stroke: '#ffffff', strokeWidth: 2 }}
                style={{
                  filter: 'drop-shadow(0 0 6px rgba(0, 255, 136, 0.6))'
                }}
                animationDuration={800}
                animationEasing="ease-in-out"
              />
              <Line 
                type="monotone" 
                dataKey="upload" 
                stroke="#a855f7" 
                strokeWidth={3}
                dot={false}
                connectNulls={true}
                strokeDasharray="0"
                activeDot={{ r: 5, fill: '#a855f7', stroke: '#ffffff', strokeWidth: 2 }}
                style={{
                  filter: 'drop-shadow(0 0 6px rgba(168, 85, 247, 0.6))'
                }}
                animationDuration={800}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-72 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-1 bg-neon-blue rounded-full mx-auto overflow-hidden mb-4">
                <div className="h-full bg-neon-blue animate-loading-bar rounded-full"></div>
              </div>
              <p className="text-gray-400 font-mono text-sm">
                {connectionStatus === 'connected' ? 'Waiting for bandwidth data...' : 'Connecting to monitoring service...'}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-cyber-dark border border-cyber-border rounded-lg p-3">
          <div className="text-neon-blue font-mono mb-1">DATA_POINTS</div>
          <div className="text-white font-mono">{bandwidthData.length}/60</div>
        </div>
        <div className="bg-cyber-dark border border-cyber-border rounded-lg p-3">
          <div className="text-neon-green font-mono mb-1">PEAK_DOWNLOAD</div>
          <div className="text-white font-mono">
            {bandwidthData.length > 0 ? `${Math.max(...bandwidthData.map(d => d.download))} KB/s` : '0 KB/s'}
          </div>
        </div>
        <div className="bg-cyber-dark border border-cyber-border rounded-lg p-3">
          <div className="text-neon-purple font-mono mb-1">PEAK_UPLOAD</div>
          <div className="text-white font-mono">
            {bandwidthData.length > 0 ? `${Math.max(...bandwidthData.map(d => d.upload))} KB/s` : '0 KB/s'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BandwidthChart;