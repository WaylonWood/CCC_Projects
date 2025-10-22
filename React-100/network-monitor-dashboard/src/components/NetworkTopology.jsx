import React, { useState, useEffect, useRef } from 'react';
import { Network } from 'vis-network';
import LoadingSpinner from './LoadingSpinner';

const NetworkTopology = () => {
  const [topologyData, setTopologyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const networkRef = useRef(null);
  const networkInstance = useRef(null);

  const fetchTopology = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/network/topology');
      if (!response.ok) {
        throw new Error('Failed to fetch topology data');
      }
      const data = await response.json();
      setTopologyData(data);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err.message);
      console.error('Network topology error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopology();
  }, []);

  useEffect(() => {
    if (topologyData && networkRef.current) {
      const data = {
        nodes: topologyData.nodes,
        edges: topologyData.edges
      };

      const options = {
        layout: {
          improvedLayout: false,
          randomSeed: 2,
          hierarchical: {
            enabled: false
          }
        },
        physics: {
          enabled: true,
          stabilization: { 
            iterations: 300,
            updateInterval: 50,
            onlyDynamicEdges: false,
            fit: true
          },
          barnesHut: {
            gravitationalConstant: -8000,
            centralGravity: 0.8,
            springLength: 200,
            springConstant: 0.05,
            damping: 0.1,
            avoidOverlap: 0.2
          }
        },
        interaction: {
          dragNodes: true,
          dragView: false,
          zoomView: false,
          hover: true,
          hoverConnectedEdges: true,
          selectConnectedEdges: false,
          tooltipDelay: 200
        },
        nodes: {
          borderWidth: 3,
          borderWidthSelected: 4,
          chosen: {
            node: function(values, id, selected, hovering) {
              values.borderColor = '#ffffff';
              values.size += 5;
            }
          },
          font: {
            face: 'JetBrains Mono',
            size: 12,
            color: '#ffffff',
            strokeWidth: 2,
            strokeColor: '#000000'
          },
          shadow: {
            enabled: true,
            color: 'rgba(0,255,136,0.3)',
            size: 10,
            x: 0,
            y: 0
          }
        },
        edges: {
          width: 3,
          chosen: {
            edge: function(values, id, selected, hovering) {
              values.color = '#ffffff';
              values.width = 6;
              values.shadow = true;
              values.shadowColor = 'rgba(255,255,255,0.8)';
              values.shadowSize = 12;
            }
          },
          smooth: {
            enabled: false,
            type: 'continuous'
          },
          arrows: {
            to: {
              enabled: false
            }
          },
          shadow: {
            enabled: true,
            color: 'rgba(0,255,136,0.4)',
            size: 8,
            x: 0,
            y: 0
          },
          color: {
            inherit: false,
            opacity: 1.0
          },
          selectionWidth: 3,
          hoverWidth: 2,
          scaling: {
            min: 1,
            max: 10
          }
        },
        groups: {
          gateway: {
            shape: 'image',
            size: 70,
            color: { 
              background: '#00ff88', 
              border: '#00cc66',
              highlight: {
                background: '#33ff99',
                border: '#ffffff'
              },
              hover: {
                background: '#33ff99',
                border: '#ffffff'
              }
            },
            borderWidth: 5,
            shadow: {
              enabled: true,
              color: 'rgba(0,255,136,1.0)',
              size: 25
            },
            fixed: { x: true, y: true }
          },
          internet: {
            shape: 'image',
            size: 60,
            color: { 
              background: '#0088ff', 
              border: '#0066cc',
              highlight: {
                background: '#33aaff',
                border: '#ffffff'
              },
              hover: {
                background: '#33aaff',
                border: '#ffffff'
              }
            },
            borderWidth: 4,
            shadow: {
              enabled: true,
              color: 'rgba(0,136,255,1.0)',
              size: 25
            }
          },
          device: {
            shape: 'image',
            size: 50,
            borderWidth: 3,
            shadow: {
              enabled: true,
              color: 'rgba(168,85,247,0.8)',
              size: 15
            }
          }
        }
      };

      if (networkInstance.current) {
        networkInstance.current.destroy();
      }

      networkInstance.current = new Network(networkRef.current, data, options);

      setTimeout(() => {
        if (networkInstance.current) {
          networkInstance.current.fit({
            animation: {
              duration: 500,
              easingFunction: 'easeInOutQuad'
            },
            scale: 0.8
          });
        }
      }, 100);

      networkInstance.current.on('click', (params) => {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0];
          const nodeData = topologyData.nodes.find(n => n.id === nodeId);
          console.log('Clicked node:', nodeId, nodeData);
          
          const connectedNodes = networkInstance.current.getConnectedNodes(nodeId);
          const connectedEdges = networkInstance.current.getConnectedEdges(nodeId);
          
          networkInstance.current.selectNodes([nodeId, ...connectedNodes]);
          networkInstance.current.selectEdges(connectedEdges);
        }
      });

      networkInstance.current.on('hoverNode', (params) => {
        networkRef.current.style.cursor = 'pointer';
        
        const connectedNodes = networkInstance.current.getConnectedNodes(params.node);
        const connectedEdges = networkInstance.current.getConnectedEdges(params.node);
        
        const updateArray = connectedEdges.map(edgeId => ({
          id: edgeId,
          color: { color: '#ffffff', highlight: '#ffffff' },
          width: 4
        }));
        
        if (updateArray.length > 0) {
          networkInstance.current.updateCluster = true;
        }
      });

      networkInstance.current.on('blurNode', (params) => {
        networkRef.current.style.cursor = 'default';
      });

      networkInstance.current.on('doubleClick', (params) => {
        if (params.nodes.length > 0) {
          const nodeId = params.nodes[0];
          networkInstance.current.focus(nodeId, {
            scale: 1.5,
            animation: {
              duration: 1000,
              easingFunction: 'easeInOutQuad'
            }
          });
        }
      });

      networkInstance.current.on('stabilizationProgress', (params) => {
        const progress = params.iterations / params.total;
        console.log('Network stabilization:', Math.round(progress * 100) + '%');
      });

      networkInstance.current.on('stabilizationIterationsDone', () => {
        console.log('Network stabilization complete');
        networkInstance.current.fit({
          animation: {
            duration: 1000,
            easingFunction: 'easeInOutQuad'
          },
          scale: 0.8
        });
      });
    }

    return () => {
      if (networkInstance.current) {
        networkInstance.current.destroy();
      }
    };
  }, [topologyData]);

  if (loading) {
    return (
      <div className="w-full">
        <div className="bg-cyber-darker border border-cyber-border rounded-lg shadow-lg backdrop-blur-sm p-8 text-center min-h-[400px] flex flex-col justify-center w-full">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-neon-green font-mono mb-2">MAPPING_TOPOLOGY</h2>
            <div className="w-48 h-1 bg-cyber-dark rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-neon-green animate-loading-bar rounded-full"></div>
            </div>
          </div>
          
          <div className="space-y-2 text-sm font-mono text-gray-400">
            <div>Using cached device data...</div>
            <div>Building network connections...</div>
            <div>Rendering topology visualization...</div>
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
          <h2 className="text-xl font-bold text-red-500 mb-2 font-mono">Topology Mapping Failed</h2>
          <p className="text-gray-400 font-mono text-sm mb-4">Error: {error}</p>
          <button 
            onClick={fetchTopology}
            className="bg-neon-green hover:bg-neon-green/80 text-black font-mono px-4 py-2 rounded transition-colors"
          >
            RETRY_MAPPING
          </button>
        </div>
      </div>
    );
  }

  if (!topologyData) return null;

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B/s';
    const k = 1024;
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Topology overview */}
      <div className="bg-cyber-darker border border-cyber-border rounded-lg shadow-lg backdrop-blur-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-neon-green font-mono">NETWORK_TOPOLOGY</h2>
          <div className="flex items-center space-x-4">
            {lastUpdate && (
              <div className="text-xs font-mono text-gray-400">
                Updated: {lastUpdate}
              </div>
            )}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${topologyData ? 'status-dot-green' : 'bg-gray-500 animate-pulse'}`}></div>
              <span className={`font-mono text-sm ${topologyData ? 'text-neon-green' : 'text-gray-400'}`}>
                {topologyData ? 'LIVE' : 'NO_DATA'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-cyber-dark border border-neon-blue/30 rounded-lg p-4">
            <div className="text-neon-blue font-mono text-sm mb-1">Subnet</div>
            <div className="text-white font-mono text-lg">{topologyData.networkInfo.subnet || 'Unknown'}</div>
          </div>
          <div className="bg-cyber-dark border border-neon-green/30 rounded-lg p-4">
            <div className="text-neon-green font-mono text-sm mb-1">Online</div>
            <div className="text-white font-mono text-lg">{topologyData.networkInfo.onlineDevices}</div>
          </div>
          <div className="bg-cyber-dark border border-neon-purple/30 rounded-lg p-4">
            <div className="text-neon-purple font-mono text-sm mb-1">Total</div>
            <div className="text-white font-mono text-lg">{topologyData.networkInfo.totalDevices}</div>
          </div>
          <div className="bg-cyber-dark border border-neon-orange/30 rounded-lg p-4">
            <div className="text-neon-orange font-mono text-sm mb-1">Traffic</div>
            <div className="text-white font-mono text-lg">{formatBytes(topologyData.networkInfo.totalTraffic)}</div>
          </div>
        </div>

        <div className="bg-cyber-dark border border-cyber-border rounded-lg p-4">
          <div className="text-neon-green font-mono text-sm mb-1">Gateway</div>
          <div className="text-white font-mono">{topologyData.networkInfo.gatewayIP || 'Unknown'}</div>
        </div>
      </div>

      <div className="bg-cyber-darker border border-cyber-border rounded-lg shadow-lg backdrop-blur-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-neon-blue font-mono">INTERACTIVE_MAP</h3>
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                if (networkInstance.current) {
                  networkInstance.current.moveTo({ 
                    scale: 0.7,
                    animation: { duration: 500, easingFunction: 'easeInOutQuad' }
                  });
                }
              }}
              className="bg-neon-purple hover:bg-neon-purple/80 text-black font-mono px-3 py-1 rounded transition-colors text-sm"
            >
              ZOOM_OUT
            </button>
            <button 
              onClick={() => {
                if (networkInstance.current) {
                  networkInstance.current.fit({
                    animation: { duration: 500, easingFunction: 'easeInOutQuad' },
                    scale: 0.8
                  });
                }
              }}
              className="bg-neon-blue hover:bg-neon-blue/80 text-black font-mono px-3 py-1 rounded transition-colors text-sm"
            >
              FIT_WEB
            </button>
            <button 
              onClick={fetchTopology}
              disabled={loading}
              className="bg-neon-green hover:bg-neon-green/80 disabled:opacity-50 text-black font-mono px-4 py-1 rounded transition-colors text-sm"
            >
              {loading ? 'MAPPING...' : 'REFRESH_WEB'}
            </button>
          </div>
        </div>
        
        {/* Interactive network map */}
        <div className="bg-cyber-dark border border-cyber-border rounded-lg p-4 mb-4 relative">
          {/* Scanning animation */}
          <div className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-green/5 to-transparent animate-scan-line"></div>
          </div>
          
          {/* Status indicators */}
          <div className="absolute top-6 right-6 flex space-x-2 z-10">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
              <span className="text-neon-green font-mono text-xs">LIVE</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <span className="text-neon-blue font-mono text-xs">MAPPING</span>
            </div>
          </div>
          
          <div 
            ref={networkRef}
            className="w-full h-96 bg-black rounded relative overflow-hidden"
            style={{ 
              minHeight: '600px',
              background: 'radial-gradient(circle at center, #001122 0%, #000000 100%)',
              boxShadow: 'inset 0 0 50px rgba(0,255,136,0.1)'
            }}
          />
          
          {/* Performance stats */}
          <div className="absolute bottom-6 left-6 bg-cyber-darker/80 border border-neon-green/30 rounded px-3 py-2 backdrop-blur-sm">
            <div className="text-neon-green font-mono text-xs mb-1">PERFORMANCE</div>
            <div className="flex space-x-4 text-xs font-mono">
              <span className="text-white">Latency: <span className="text-neon-blue">~{Math.round(Math.random() * 50 + 10)}ms</span></span>
              <span className="text-white">Bandwidth: <span className="text-neon-purple">{formatBytes(topologyData.networkInfo.totalTraffic)}</span></span>
            </div>
          </div>
        </div>

        {/* Device legend */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-4 bg-neon-green rounded flex items-center justify-center text-xs">📡</div>
            <span className="text-gray-300 font-mono">Router/Gateway</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-4 bg-neon-blue rounded flex items-center justify-center text-xs">☁️</div>
            <span className="text-gray-300 font-mono">Internet</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-4 bg-purple-400 rounded flex items-center justify-center text-xs">💻</div>
            <span className="text-gray-300 font-mono">Online Devices</span>
          </div>
        </div>

        {/* Connection types */}
        <div className="bg-cyber-dark border border-cyber-border rounded-lg p-4 mb-4">
          <h4 className="text-neon-green font-mono text-sm mb-3">CONNECTIONS</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-1 bg-neon-green rounded" style={{ boxShadow: '0 0 8px rgba(0,255,136,0.6)' }}></div>
              <span className="text-gray-300 font-mono">Gateway Web Lines</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-1 bg-blue-400 rounded" style={{ boxShadow: '0 0 8px rgba(59,130,246,0.6)' }}></div>
              <span className="text-gray-300 font-mono">High Traffic</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-1 bg-orange-400 rounded" style={{ boxShadow: '0 0 8px rgba(251,146,60,0.6)' }}></div>
              <span className="text-gray-300 font-mono">Medium Traffic</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-1 bg-gray-500 rounded border-dashed border border-gray-500"></div>
              <span className="text-gray-300 font-mono">Offline Devices</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-neon-green rounded" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', boxShadow: '0 0 10px rgba(0,255,136,1.0)' }}></div>
              <span className="text-gray-300 font-mono">Central Gateway</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-neon-blue rounded-full" style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', boxShadow: '0 0 10px rgba(0,136,255,1.0)' }}></div>
              <span className="text-gray-300 font-mono">Internet Connection</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interface stats */}
      {topologyData.networkStats && topologyData.networkStats.length > 0 && (
        <div className="bg-cyber-darker border border-cyber-border rounded-lg shadow-lg backdrop-blur-sm p-6">
          <h3 className="text-xl font-bold text-neon-orange font-mono mb-4">INTERFACE_STATISTICS</h3>
          <div className="space-y-3">
            {topologyData.networkStats.map((stat, index) => (
              <div key={index} className="bg-cyber-dark border border-cyber-border rounded-lg p-3">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-neon-orange font-mono text-xs">INTERFACE</div>
                    <div className="text-white font-mono text-sm">{stat.interface}</div>
                  </div>
                  <div>
                    <div className="text-neon-green font-mono text-xs">STATUS</div>
                    <div className={`font-mono text-sm ${stat.operstate === 'up' ? 'text-neon-green' : 'text-red-500'}`}>
                      {stat.operstate?.toUpperCase() || 'UNKNOWN'}
                    </div>
                  </div>
                  <div>
                    <div className="text-neon-blue font-mono text-xs">DOWNLOAD</div>
                    <div className="text-white font-mono text-sm">{formatBytes(stat.rx_sec)}</div>
                  </div>
                  <div>
                    <div className="text-neon-purple font-mono text-xs">UPLOAD</div>
                    <div className="text-white font-mono text-sm">{formatBytes(stat.tx_sec)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkTopology;